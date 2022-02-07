<?php

    $URL = "https://oxyfoo.com/App/GameLife/Dev/auth.php";

    function GetMailContent($deviceName, $actionAccept, $actionView, $lang) {
        global $URL;

        $link_accept = "$URL?data=$actionAccept";
        $link_view = "$URL?data=$actionView&accept=$actionAccept";
        
        $lang_content = file_get_contents("mail/lang.json");
        $lang_json = json_decode($lang_content);

        $selected_lang = 'fr';
        if ($lang_json->$lang) {
            $selected_lang = $lang;
        }

        $subject = $lang_json->$selected_lang->subject;
        $title = $lang_json->$selected_lang->title;
        $text = $lang_json->$selected_lang->text;
        $bt_accept = $lang_json->$selected_lang->bt_accept;
        $link = $lang_json->$selected_lang->link;

        $message = $actionView !== NULL ? str_replace("%link%", $link_view, $link) : '';
        $message .= file_get_contents("mail/mail-check.html");
        $message = str_replace("%title%", $title, $message);
        $message = str_replace("%text%", $text, $message);
        $message = str_replace("%bt_accept%", $bt_accept, $message);
        $message = str_replace("%link_accept%", $link_accept, $message);
        $message = str_replace("%device%", $deviceName, $message);

        return array('subject' => $subject, 'message' => $message);
    }

    function SendSigninMail($email, $deviceName, $actionAccept, $actionView, $lang = 'fr') {
        $mailContent = GetMailContent($deviceName, $actionAccept, $actionView, $lang);
        $message = $mailContent['message'];
        $subject = $mailContent['subject'];

        $headers = array(
            'MIME-Version' => '1.0',
            'Content-type' => 'text/html; charset=UTF-8',
            'From' => 'signin@oxyfoo.com',
            'Subject' => $subject,
            'Reply-To' => 'contact@geremy.eu',
            'X-Mailer' => 'PHP/'.phpversion()
        );

        mail($email, $subject, $message, $headers);
    }

?>