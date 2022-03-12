<?php

    class Account
    {
        /** @var int $ID */
        public $ID;

        /** @var string $Username */
        public $Username;

        /** @var string $Email */
        public $Email;

        /** @var string $Lang 'fr' or 'en' */
        public $Lang;

        /** @var int|null $Birthtime */
        public $Birthtime;

        /** @var int $Title */
        public $Title;

        /** @var bool $Banned */
        public $Banned;

        /** @var int[] $Devices */
        public $Devices;

        /** @var int[] $DevicesWait */
        public $DevicesWait;

        /** @var object $Friends */
        public $Friends;

        /** @var int $Ox */
        public $Ox;

        /** @var int $XP */
        public $XP;

        /** @var int $AdRemaining */
        public $AdRemaining;

        /** @var int[] $Achievements */
        public $Achievements;

        /** @var string $DataToken */
        public $DataToken;

        /** @var int|null $LastSendMail */
        public $LastSendMail;

        /** @var int|null $LastChangeUsername */
        public $LastChangeUsername;

        /** @var int|null $LastChangeBirth */
        public $LastChangeBirth;

        /** @var int|null $FirstConnDate */
        public $FirstConnDate;

        /** @var int|null $LastConnDate */
        public $LastConnDate;

        public function __construct($account) {
            $this->ID = intval($account['ID']);
            $this->Username = $account['Username'];
            $this->Email = $account['Email'];
            $this->Lang = $account['Lang'];
            $this->Birthtime = $account['Birthtime'] === null ? null : intval($account['Birthtime']);
            $this->Title = intval($account['Title']);
            $this->Banned = $account['Banned'] != '0';
            $this->Devices = json_decode($account['Devices'], true);
            $this->DevicesWait = json_decode($account['DevicesWait'], true);
            $this->Friends = json_decode($account['Friends'], true);
            $this->Ox = intval($account['Ox']);
            $this->XP = intval($account['XP']);
            $this->AdRemaining = intval($account['AdRemaining']);
            $this->Achievements = json_decode($account['Achievements'], true);
            $this->DataToken = $account['DataToken'];
            $this->LastSendMail = $account['LastSendMail'] === null ? null : strtotime($account['LastSendMail']);
            $this->LastChangeUsername = $account['LastChangeUsername'] === null ? null : strtotime($account['LastChangeUsername']);
            $this->LastChangeBirth = $account['LastChangeBirth'] === null ? null : strtotime($account['LastChangeBirth']);
            $this->FirstConnDate = $account['FirstConnDate'] === null ? null : strtotime($account['FirstConnDate']);
            $this->LastConnDate = $account['LastConnDate'] === null ? null : strtotime($account['LastConnDate']);
        }
    }

?>