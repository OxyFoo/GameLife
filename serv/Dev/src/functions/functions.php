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
        http_response_code(500);
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

    function isSorted($arr) {
        $arr_check = $arr;
        sort($arr_check);
        return $arr == $arr_check;
    }

    function SortDictBy($dict, $cell) {
        $sorted = array();

        $i = 0;
        while (count($dict) > 0) {
            $added = 0;
            for ($s = 0; $s < count($sorted); $s++) {
                if (!isset($dict[$i]["Name"], $sorted[$s]["Name"])) {
                    continue;
                }
                $Name = $dict[$i]["Name"];
                $NameRef = $sorted[$s]["Name"];
                $arr = array($NameRef, $Name);
                if (!isSorted($arr)) {
                    array_splice($sorted, $s, 0, array($dict[$i]));
                    array_splice($dict, $i, 1);
                    $added = 1;
                    break;
                }
            }
            if (!$added) {
                array_push($sorted, $dict[$i]);
                array_splice($dict, $i, 1);
            }
        }

        return $sorted;
    }

    function MinutesFromDate($date) {
        $date_delta = (time() - strtotime($date)) / 60;
        return round($date_delta, 2);
    }

    function UsernameIsCorrect($username) {
        $isOkLength = iconv_strlen($username) >= 4 && iconv_strlen($username) <= 24;
        // TODO - Check username validity (blacklist words, ...)
        return $isOkLength;
    }

?>