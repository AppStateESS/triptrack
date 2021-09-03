<?php

/**
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 * @license https://opensource.org/licenses/MIT
 */

namespace triptrack\Factory;

class CSV
{

    static $headers = [];

    private static function createCSVContent(array $members)
    {
        $csvBuild[] = self::csvPlugRow(static::$headers);
        foreach ($members as $row) {
            $csvBuild[] = self::csvPlugRow($row);
        }
        return implode("\n", $csvBuild);
    }

    public static function makeCSV(array $members, string $filename)
    {
        self::$headers = self::csvHeader($members, ['id']);
        $csvString = self::createCSVContent($members);
        self::pushFile($filename, $csvString);
    }

    private static function csvHeader(array $members, $ignore = [])
    {
        $headerNames = array_keys($members[0]);
        foreach ($headerNames as $name) {
            if (in_array($name, $ignore)) {
                continue;
            }
            $headers[$name] = $name;
        }
        return $headers;
    }

    private static function csvPlugRow($row)
    {
        foreach (self::$headers as $name) {
            $col[] = $row[$name];
        }
        return '"' . implode('", "', $col) . '"';
    }

    private static function pushFile(string $downloadName, string $content)
    {
        $filename = '/tmp/triptrackreport' . time() . '.csv';
        file_put_contents($filename, $content);
        self::download($filename, $downloadName);
    }

    private static function download($filename, $downloadName)
    {
        header("Content-Disposition: attachment; filename=\"$downloadName\"");
        header('Pragma: public');
        header('Cache-Control: must-revalidate, post-check = 0, pre-check = 0');
        readfile($filename);
        exit();
    }

}
