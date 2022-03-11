<?php

    /**
     * @param string $langKey Default language is "fr"
     * @return object JSON object with the language text
     */
    function GetMailLangText($langKey) {
        $lang_content = file_get_contents("mail/lang.json");
        $lang_json = json_decode($lang_content);

        $selected_lang = 'fr';
        if ($lang_json->$langKey) $selected_lang = $langKey;
        return $lang_json->$selected_lang;
    }

    /**
     * @param string $subject Subject of the email
     * @return array Headers of the email
     */
    function GetMailHeader($subject) {
        $headers = array(
            'MIME-Version' => '1.0',
            'Content-type' => 'text/html; charset=UTF-8',
            'From' => 'GameLife',
            'Subject' => $subject,
            'Reply-To' => 'contact@oxyfoo.com',
            'X-Mailer' => 'PHP/'.phpversion()
        );
        return $headers;
    }

    function GetMailContent($title, $text, $textButton, $textLink, $deviceName, $actionButton, $actionView) {
        global $URL; // In config.php

        $link_button = "$URL?data=$actionButton";
        $link_view = "$URL?data=$actionView&action=$actionButton";

        $content = $actionView !== null ? str_replace("%link%", $link_view, $textLink) : '';
        $content .= file_get_contents("mail/mail-check.html");
        $content = str_replace("%title%", $title, $content);
        $content = str_replace("%text%", $text, $content);
        $content = str_replace("%button%", $textButton, $content);
        $content = str_replace("%buttonLink%", $link_button, $content);
        $content = str_replace("%device%", $deviceName, $content);

        return $content;
    }

    function SendSigninMail($email, $deviceName, $actionButton, $actionView, $langKey) {
        $lang = GetMailLangText($langKey);
        $subject = $lang->{'signin-subject'};
        $title = $lang->{'signin-title'};
        $text = $lang->{'signin-text'};
        $textButton = $lang->{'signin-button'};
        $textLink = $lang->link;

        $content = GetMailContent($title, $text, $textButton, $textLink, $deviceName, $actionButton, $actionView);
        $headers = GetMailHeader($subject);
        return mail($email, $subject, $content, $headers);
    }

    function SendDeleteAccountMail($email, $deviceName, $actionButton, $actionView, $langKey) {
        $lang = GetMailLangText($langKey);
        $subject = $lang->{'delete-subject'};
        $title = $lang->{'delete-title'};
        $text = $lang->{'delete-text'};
        $textButton = $lang->{'delete-button'};
        $textLink = $lang->link;

        $content = GetMailContent($title, $text, $textButton, $textLink, $deviceName, $actionButton, $actionView);
        $headers = GetMailHeader($subject);
        return mail($email, $subject, $content, $headers);
    }

?>