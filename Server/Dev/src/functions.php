<?php

    function GetIP() {
        $ip = "";
        if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
            $ip = $_SERVER['HTTP_CLIENT_IP'];
        } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
            $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
        } else {
            $ip = $_SERVER['REMOTE_ADDR'];
        }
        return $ip;
    }

    function GetCountryCode() {
        $output = 'en';
        $ip = GetIP();
        if (filter_var($ip, FILTER_VALIDATE_IP)) {
			$ipdat = @json_decode(file_get_contents("http://www.geoplugin.net/json.gp?ip=" . $ip));
			$code = strtolower($ipdat->geoplugin_countryCode);
            if ($code) {
                $output = $code;
            }
        }
        return $output;
    }

    function RandomString($length = 32) {
        $characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+-*/[]{}_#!;:?%()|';
        $charactersLength = strlen($characters);
        $randomString = '';
        for ($i = 0; $i < $length; $i++) {
            $rnd = rand(0, $charactersLength - 1);
            $randomString .= $characters[$rnd];
        }
        return $randomString;
    }

    function ExitWithStatus($message) {
        $output = array('status' => 'error', 'error' => $message);
        echo(json_encode($output));
        exit();
    }

    function areSet($vars) {
        $areSet = true;
        for ($v = 0; $v < count($vars); $v++) {
            $var = $vars[$v];
            if (!isset($var) || empty($var)) {
                $areSet = false;
                break;
            }
        }
        return $areSet;
    }

    function isJson($str) {
        json_decode($str);
        return json_last_error() === 0;
    }

?>