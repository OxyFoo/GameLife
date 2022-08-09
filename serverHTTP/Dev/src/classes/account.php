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

        /** @var int $Ox */
        public $Ox;

        /** @var int $XP */
        public $XP;

        /** @var int[] $Achievements */
        public $Achievements;

        /** @var int|null $AchievementQueue */
        public $AchievementQueue;

        /** @var string $DataToken */
        public $DataToken;

        /** @var int|null $LastSendMail */
        public $LastSendMail;

        /** @var int|null $LastChangeUsername */
        public $LastChangeUsername;

        /** @var int|null $LastChangeBirth */
        public $LastChangeBirth;

        /** @var int|null $LastConnDate */
        public $LastConnDate;

        /** @var int $CreatedAt */
        public $CreatedAt;

        /** @var int|null $CreatedBy */
        public $CreatedBy;

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
            $this->Ox = intval($account['Ox']);
            $this->XP = intval($account['XP']);
            $this->Achievements = json_decode($account['Achievements'], true);
            $this->AchievementQueue = $account['AchievementQueue'] === null ? null : intval($account['AchievementQueue']);
            $this->DataToken = $account['DataToken'];
            $this->LastSendMail = $account['LastSendMail'] === null ? null : strtotime($account['LastSendMail']);
            $this->LastChangeUsername = $account['LastChangeUsername'] === null ? null : strtotime($account['LastChangeUsername']);
            $this->LastChangeBirth = $account['LastChangeBirth'] === null ? null : strtotime($account['LastChangeBirth']);
            $this->LastConnDate = $account['LastConnDate'] === null ? null : strtotime($account['LastConnDate']);
            $this->CreatedAt = strtotime($account['CreatedAt']);
            $this->CreatedBy = $account['CreatedBy'] === null ? null : strtotime($account['CreatedBy']);
        }
    }

?>