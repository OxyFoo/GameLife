<?php

    class Device
    {
        /** @var int $ID */
        public $ID;

        /** @var string $Identifier */
        public $Identifier;

        /** @var string $Name */
        public $Name;

        /** @var string $OSName "Android" or "iOS" */
        public $OSName;

        /** @var string $OSVersion */
        public $OSVersion;

        /** @var string $Token */
        public $Token;

        /** @var bool $DevMode */
        public $DevMode;

        /** @var bool $Banned */
        public $Banned;

        /** @var DateTime $Created */
        public $Created;

        /** @var DateTime $Updated */
        public $Updated;

        public function __construct($device) {
            $this->ID = intval($device['ID']);
            $this->Identifier = $device['Identifier'];
            $this->Name = $device['Name'];
            $this->OSName = $device['OSName'];
            $this->OSVersion = $device['OSVersion'];
            $this->Token = $device['Token'];
            $this->DevMode = $device['DevMode'] != '0';
            $this->Banned = $device['Banned'] != '0';
            $this->Created = $device['Created'];
            $this->Updated = $device['Updated'];
        }
    }

?>