<?php

/**
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 * @license https://opensource.org/licenses/MIT
 */

namespace triptrack\Controller\Admin;

use triptrack\Controller\SubController;
use Canopy\Request;
use triptrack\Factory\MemberFactory;

class Member extends SubController
{

    protected $view;

    public function __construct(\triptrack\Role\Base $role)
    {
        parent::__construct($role);
        $this->view = new \triptrack\View\MemberView();
    }

    protected function addPatch(Request $request)
    {
        $orgId = $request->pullPatchInteger('orgId');
        $tripId = $request->pullPatchInteger('tripId', true);
        if (!$orgId) {
            throw new \Exception('Missing organization id');
        }
        MemberFactory::addToOrganization($this->id, $orgId);
        if ($tripId) {
            MemberFactory::addToTrip($this->id, $tripId);
        }
        return ['success' => true];
    }

    protected function delete(Request $request)
    {
        MemberFactory::delete($this->id);
        return ['success' => true];
    }

    protected function dropFromTripPatch(Request $request)
    {
        MemberFactory::dropFromTrip($this->id, $request->pullPatchInteger('tripId'));
        return ['success' => true];
    }

    protected function dropFromOrganizationPatch(Request $request)
    {
        MemberFactory::dropFromOrganization($this->id, $request->pullPatchInteger('orgId'));
        return ['success' => true];
    }

    protected function getByBannerIdJson(Request $request)
    {
        $bannerId = $request->pullGetInteger('studentBannerId');
        $member = MemberFactory::pullByBannerId($bannerId);
        if (empty($member)) {
            $bannerMember = \triptrack\BannerAPI::getStudent($bannerId);
            if (empty($bannerMember)) {
                return ['success' => false];
            } else {
                $member = MemberFactory::buildMemberFromBannerData($bannerMember);
                return ['success' => true, 'member' => $member->getStringVars(), 'status' => 'banner'];
            }
        } else {
            return ['success' => true, 'member' => $member, 'status' => 'system'];
        }
    }

    protected function getByUsernameJson(Request $request)
    {
        $username = $request->pullGetString('username');
        $member = MemberFactory::pullByUsername($username);
        if (empty($member)) {
            $bannerMember = \triptrack\BannerAPI::getStudent($username);
            if (empty($bannerMember)) {
                return ['success' => false];
            } else {
                $member = MemberFactory::buildMemberFromBannerData($bannerMember);
                return ['success' => true, 'member' => $member->getStringVars(), 'status' => 'banner'];
            }
        } else {
            return ['success' => true, 'member' => $member, 'status' => 'system'];
        }
        return ['success' => true];
    }

    protected function importHtml()
    {
        return $this->view->importForm();
    }

    protected function listHtml()
    {
        return $this->view->listHtml();
    }

    protected function listJson(Request $request)
    {
        $options = [];
        $options['isAdmin'] = true;
        $options['orgId'] = $request->pullGetString('orgId', true);
        $options['tripId'] = $request->pullGetString('tripId', true);
        $options['search'] = $request->pullGetString('search', true);
        $options['orderBy'] = $request->pullGetString('orderBy', true);
        $options['dir'] = $request->pullGetString('dir', true);
        $options['emailOnly'] = (bool) $request->pullGetBoolean('emailOnly', true);
        return MemberFactory::list($options);
    }

    protected function post(Request $request)
    {
        $member = MemberFactory::post($request);
        return ['success' => true, 'memberId' => $member->id];
    }

    protected function put(Request $request)
    {
        $member = MemberFactory::put($this->id, $request);
        return ['success' => true, 'memberId' => $member->id];
    }

    protected function viewJson(Request $request)
    {
        $member = new \triptrack\Resource\Member;
        MemberFactory::load($member, $this->id);
        return $member->getStringVars();
    }

    protected function uploadPost(Request $request)
    {
        // forces a json response
        $_SERVER['HTTP_X_REQUESTED_WITH'] = 'XMLHttpRequest';
        if (!isset($_FILES['file'])) {
            return ['success' => false, 'error' => 'no upload file received.'];
        }

        $fileType = $_FILES['file']['type'];
        if ($fileType !== 'text/csv') {
            return ['success' => false, 'error' => "incorrect file type [$fileType]"];
        }

        $file = $_FILES['file'];
        $tsFilename = MemberFactory::storeFile($file);
        $savedPath = MemberFactory::createPath($tsFilename);
        if (MemberFactory::testFile($savedPath)) {
            return ['success' => true, 'file' => $tsFilename];
        } else {
            unlink($savedPath);
            return ['success' => false, 'error' => 'file was not correctly formatted.'];
        }
    }

    protected function importFilePost(Request $request)
    {
        $fileName = $request->pullPostString('fileName');
        $orgId = $request->pullPostInteger('orgId', true) ?? 0;
        $tripId = $request->pullPostInteger('tripId', true) ?? 0;
        $stats = MemberFactory::importFile($fileName, $orgId, $tripId);
        return ['success' => true, 'stats' => $stats];
    }

}
