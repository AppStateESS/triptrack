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
        $options['orgId'] = $request->pullGetString('orgId', true);
        $options['tripId'] = $request->pullGetString('tripId', true);
        $options['search'] = $request->pullGetString('search', true);
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

}
