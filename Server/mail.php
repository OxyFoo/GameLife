<?php

    function SendSigninMail($email, $deviceName, $accept, $reject) {
        $subject = 'GameLife : Nouvel appareil';
        $btn_accept = "<a href='https://oxyfoo.com/App/GameLife/auth.php?data=$accept'>Accepter</a>";
        $btn_reject = "<a href='https://oxyfoo.com/App/GameLife/auth.php?data=$reject'>Refuser</a>";
        $message = "Connexion de l'appareil : $deviceName<br />$btn_accept<br />$btn_reject";
        $headers = array(
            'MIME-Version' => '1.0',
            'Content-type' => 'text/html; charset=UTF-8',
            'From' => 'signin@gamelife.com',
            'Subject' => $subject,
            'Reply-To' => 'contact@geremy.eu',
            'X-Mailer' => 'PHP/'.phpversion()
        );

        mail($email, $subject, $message, $headers);
    }

?>