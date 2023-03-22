<?php

    function StartsWith($haystack, $needle) {
        return $needle === '' || strpos($haystack, $needle) === 0;
    }

    /**
     * @param int $length Length of the random string
     * @return string Random string
     */
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

    /**
     * Return IP address of the client or "UNKNOWN" if failed
     * @link https://stackoverflow.com/questions/3003145/how-to-get-the-client-ip-address-in-php
     * @return string
     */
    function GetClientIP() {
        $keys = array('REMOTE_ADDR', 'HTTP_FORWARDED', 'HTTP_CLIENT_IP', 'HTTP_FORWARDED_FOR', 'HTTP_X_FORWARDED_FOR', 'HTTP_X_FORWARDED');
        foreach ($keys as $k) {
            if (!empty($_SERVER[$k])) {
                return $_SERVER[$k];
            }
        }
        return 'UNKNOWN';
    }

    /**
     * Set status to "error" and exit with an error message
     * @param string $message Message to return
     */
    function ExitWithStatus($message) {
        $output = array('status' => 'error', 'error' => $message);
        echo(json_encode($output));
        //http_response_code(500);
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
                if (!isset($dict[$i][$cell], $sorted[$s][$cell])) {
                    continue;
                }
                $Name = $dict[$i][$cell];
                $NameRef = $sorted[$s][$cell];
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

    /**
     * @param DataBase $db
     * @param string $username
     * @return bool True if password is correct
     */
    function UsernameIsCorrect($db, $username) {
        $isOkLength = iconv_strlen($username) >= 4 && iconv_strlen($username) <= 24;
        if (!$isOkLength) return false;

        $result = $db->QueryPrepare('Blacklist', 'SELECT `Pseudo` FROM TABLE');
        if ($result === false) return false;

        $blacklist = array_map(fn($raw) => $raw['Pseudo'], $result);
        foreach ($blacklist as $blackUsername) {
            $delta = levenshtein(strtolower($username), strtolower($blackUsername));
            if ($delta <= 3) return false;
        }

        return true;
    }

?>