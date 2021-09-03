<?php

/**
 * MIT License
 * Copyright (c) 2021 Electronic Student Services @ Appalachian State University
 *
 * See LICENSE file in root directory for copyright and distribution permissions.
 *
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 * @license https://opensource.org/licenses/MIT
 */

namespace triptrack\View;

use triptrack\Factory\MemberFactory;
use triptrack\Factory\CSV;
use triptrack\Factory\TripFactory;
use triptrack\Factory\OrganizationFactory;

class ReportView extends AbstractView
{

    public function list()
    {
        return $this->dashboardScript('report', 'Reports');
    }

    public function trip(int $tripId, bool $isAdmin = false)
    {
        $memberList = MemberFactory::list(['tripId' => $tripId, 'isAdmin' => $isAdmin]);
        if (empty($memberList)) {
            return 'No members in this trip';
        }
        $trip = TripFactory::build($tripId);
        $host = preg_replace('/\W/', '-', $trip->host);
        CSV::makeCSV($memberList, $host . '-' . strftime('%Y%m%d', $trip->timeEventStarts) . '.csv');
    }

    public function organization(int $orgId, bool $isAdmin = false)
    {
        $memberList = MemberFactory::list(['orgId' => $orgId, 'isAdmin' => $isAdmin]);
        if (empty($memberList)) {
            return 'No members in this ' . \triptrack\Factory\SettingFactory::getOrganizationLabel();
        }
        $org = OrganizationFactory::build($orgId);
        $name = preg_replace('/\W/', '-', $org->name);
        CSV::makeCSV($memberList, $name . '-' . strftime('%Y%m%d', time()) . '.csv');
    }

}
