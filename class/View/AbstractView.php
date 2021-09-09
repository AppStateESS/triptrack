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

use Canopy\Request;
use phpws2\Template;
use triptrack\Factory\OrganizationFactory;

abstract class AbstractView
{

    const directory = PHPWS_SOURCE_DIR . 'mod/triptrack/';
    const http = PHPWS_SOURCE_HTTP . 'mod/triptrack/';

    protected function getDirectory()
    {
        return self::directory;
    }

    protected function getHttp()
    {
        return self::http;
    }

    private function addScriptVars($vars)
    {
        if (empty($vars)) {
            return null;
        }
        foreach ($vars as $key => $value) {
            $varList[] = "const $key = " . json_encode($value, JSON_NUMERIC_CHECK) . ';';
        }
        return '<script type="text/javascript">' . implode('', $varList) . '</script>';
    }

    protected function getScript($scriptName)
    {
        $jsDirectory = $this->getHttp() . 'javascript/';
        if (TRIPTRACK_SYSTEM_SETTINGS['productionMode']) {
            $path = $jsDirectory . 'build/' . $this->getAssetPath($scriptName);
        } else {
            $path = "{$jsDirectory}dev/$scriptName.js";
        }
        $script = "<script type='text/javascript' src='$path'></script>";
        return $script;
    }

    protected function getAssetPath($scriptName)
    {
        if (!is_file($this->getDirectory() . 'assets.json')) {
            exit('Missing assets.json file. Run "npm run build" in the triptrack directory.');
        }
        $jsonRaw = file_get_contents($this->getDirectory() . 'assets.json');
        $json = json_decode($jsonRaw, true);
        if (!isset($json[$scriptName]['js'])) {
            throw new \Exception('Script file not found among assets.');
        }
        return $json[$scriptName]['js'];
    }

    /**
     *
     * @staticvar boolean $vendor_included
     * @param string $view_name
     * @param boolean $add_anchor
     * @param array $vars
     * @return string
     */
    public function scriptView($view_name, $vars = null)
    {
        static $vendor_included = false;
        if (!$vendor_included) {
            $script[] = $this->getScript('vendor');
            $vendor_included = true;
        }
        if (!empty($vars)) {
            $script[] = $this->addScriptVars($vars);
        }
        $script[] = $this->getScript($view_name);
        $react = implode("\n", $script);
        \Layout::addJSHeader($react);
        $content = <<<EOF
<div id="$view_name"><p>Loading. Please wait.</p></div>
EOF;
        return $content;
    }

    private function menuVars(string $active)
    {
        $vars = [];
        $vars['tripActive'] = null;
        $vars['orgActive'] = null;
        $vars['memberActive'] = null;
        $vars['settingActive'] = null;
        $vars['reportActive'] = null;
        $vars['dashboard'] = null;
        $orgExists = OrganizationFactory::exists();
        $vars['alert'] = false;
        $vars['organizationLabel'] = \triptrack\Factory\SettingFactory::getOrganizationLabel();
        $vars['hostLabel'] = \triptrack\Factory\SettingFactory::getHostLabel();

        switch ($active) {
            case 'trip':
                $vars['tripActive'] = ' active';
                $vars['alert'] = !$orgExists;
                break;
            case 'member':
                $vars['memberActive'] = ' active';
                $vars['alert'] = !$orgExists;
                break;
            case 'setting':
                $vars['settingActive'] = ' active';
                break;
            case 'org':
                $vars['orgActive'] = ' active';
                break;
            case 'report':
                $vars['reportActive'] = ' active';
                break;
        }
        return $vars;
    }

    protected function dashboardHTML(string $active, string $content)
    {
        $vars = $this->menuVars($active);
        $vars['dashboard'] = $content;
        return $this->dashboardTemplate($vars);
    }

    protected function dashboardScript(string $active, string $script = null, array $scriptVars = [])
    {
        $scriptVars['organizationLabel'] = \triptrack\Factory\SettingFactory::getOrganizationLabel();
        $scriptVars['hostLabel'] = \triptrack\Factory\SettingFactory::getHostLabel();
        $vars = $this->menuVars($active);
        $vars['dashboard'] = $this->scriptView($script, $scriptVars);
        return $this->dashboardTemplate($vars);
    }

    private function dashboardTemplate(array $vars)
    {
        $template = new \phpws2\Template($vars);
        $template->setModuleTemplate('triptrack', 'Admin/Dashboard.html');
        return $template->get();
    }

}
