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
function triptrack_update(&$content, $currentVersion)
{
    switch ($currentVersion) {
        case version_compare($currentVersion, '1.1.0', '<'):
            $content[] = 'Added organizationId to trip list properties.';
            $content[] = 'Added link to member listing by organization in admin view.';
            $content[] = 'Created front page interaction';
            $content[] = 'Added check all button for member selection';
        case version_compare($currentVersion, '1.2.0', '<'):
            tt_update_1_2_0($content);
            $content[] = 'Added setting for Engage organizations only.';
            $content[] = 'Organization form changed to only allow organizations in Engage is setting is set.';
        case version_compare($currentVersion, '1.2.1', '<'):
            $content[] = 'Added error check on allowing approval on incomplete trip.';
            $content[] = 'Corrupt members from organization pull are now ignored.';
            $content[] = 'Member listing now shows total members and bad member count.';
        case version_compare($currentVersion, '1.2.2', '<'):
            $content[] = 'Fixed bug with saving attended screen.';
            $content[] = 'Fixed bug #45 with new trips inheriting attended.';
            $content[] = 'Resolved #43 - Error check on attended saving.';
        case version_compare($currentVersion, '1.3.0', '<'):
            $content[] = 'Adds new member assignment.';
            $content[] = 'Layout fixes.';
            $content[] = 'Bug fixes with event and organization changes.';
            $content[] = 'Adds signout link for members.';
            $content[] = 'List admin options in drop down.';
            $content[] = 'Member trip list shows participating.';
            $content[] = 'Trip saved before confirmation';
            $content[] = 'Trip form scrolls to top after save error.';
            $content[] = 'Trip dates now perform error checks.';
            $content[] = 'Trip save only available if form changes were made.';
            $content[] = 'Added confirm badge on trip view.';
            $content[] = 'Member view now has link back to list.';
            $content[] = 'Can now search Banner to add participants.';
            $content[] = 'Event list now sorted in drop down.';
        case version_compare($currentVersion, '1.3.1', '<'):
            $content[] = 'Fixes organization edit button';
            $content[] = 'Fixes listing of non-Engage organizations.';
        case version_compare($currentVersion, '1.3.2', '<'):
            tt_update_1_3_2($content);
            $content[] = '<pre>';
            $content[] = '+ All states changed to abbreviations.';
            $content[] = '+ Adds US territories to selection.';
            $content[] = '+ Hides event form if organization is not in Engage.';
            $content[] = '+ Uses searchable event drop down';

            $content[] = '</pre>';
        case version_compare($currentVersion, '1.3.3', '<'):
            $content[] = '<pre>';
            $content[] = '+ Fixed member selection bug.';
            $content[] = '</pre>';
        case version_compare($currentVersion, '1.3.4', '<'):
            $content[] = '<pre>';
            $content[] = '+ Updates wording.';
            $content[] = '+ Adds international notes setting.';
            $content[] = '+ Adds search to member selection.';
            $content[] = '+ Adds warning page to non-member logins.';
            $content[] = '</pre>';
        case version_compare($currentVersion, '1.3.5', '<'):
            $content[] = '<pre>';
            $content[] = '+ Fixes default state not using abbreviation.';
            $content[] = '+ Adds error message on server problem..';
            $content[] = '+ Adds error check on Engage data.';
            $content[] = '+ Trip dates broken into two fields.';
            $content[] = '</pre>';
    }
    return true;
}

function tt_update_1_3_2(&$content)
{
    include PHPWS_SOURCE_DIR . 'mod/triptrack/boost/stateList.php';
    $db = phpws2\Database::getDB();
    $tbl = $db->addTable('trip_trip');
    $tbl->addField('id');
    $tbl->addField('destinationState');
    $result = $db->select();
    if (empty($result)) {
        $content[] = 'No trips require state updates';
        return;
    }
    foreach ($result as $state) {
        $db->clearTables();
        $db->clearConditional();
        $tbl = $db->addTable('trip_trip');

        if (isset($fullToAbbr[$state['destinationState']])) {
            $tbl->addValue('destinationState', $fullToAbbr[$state['destinationState']]);
            $tbl->addFieldConditional('id', $state['id']);
            $db->update();
        }
    }
}

function tt_update_1_2_0(&$content)
{
    $db = \phpws2\Database::getDB();
    $tbl = $db->addTable('trip_trip');
    $travelMethod = $tbl->addDataType('travelMethod', 'smallint');
    $travelMethod->setDefault(0);
    $travelMethod->add();
    $content[] = 'Added travelMethod column to trip_trip table.';
}
