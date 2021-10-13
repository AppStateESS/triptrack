<?php

function triptrack_uninstall(&$content)
{
    $db = \phpws2\Database::getDB();
    $db->buildTable('trip_membertotrip')->drop(true);
    $db->buildTable('trip_membertoorg')->drop(true);
    $db->buildTable('trip_organization')->drop(true);
    $db->buildTable('trip_member')->drop(true);
    $db->buildTable('trip_document')->drop(true);
    $db->buildTable('trip_trip')->drop(true);
    $db->buildTable('trip_engageorg')->drop(true);

    // From previous version
    return true;
}
