<?php

/**
 * Script called directly from application.
 */

require('./src/commands.php');

$input = file_get_contents('php://input');
$data = json_decode($input, true);
$action = $data['action'];
if (!isset($action)) exit();

$commands = new Commands($data);

switch ($action) {
    case 'ping':                $commands->Ping();              break;
    case 'login':               $commands->Login();             break;
    case 'signin':              $commands->Signin();            break;
    case 'getInternalData':     $commands->GetInternalData();   break;
    case 'getUserData':         $commands->GetUserData();       break;
    case 'addUserData':         $commands->AddUserData();       break;
    case 'addAchievements':     $commands->AddAchievements();   break;
    case 'claimAchievement':    $commands->ClaimAchievement();  break;
    case 'setUsername':         $commands->SetUsername();       break;
    case 'getDailyDeals':       $commands->GetDailyDeals();     break;
    case 'buyDailyDeals':       $commands->BuyDailyDeals();     break;
    case 'buyRandomChest':      $commands->BuyRandomChest();    break;
    case 'buyTargetedChest':    $commands->BuyTargetChest();    break;
    case 'buyDye':              $commands->BuyDye();            break;
    case 'buyOx':               $commands->BuyOx();             break;
    case 'sellStuff':           $commands->SellStuff();         break;
    case 'claimNonZeroDays':    $commands->ClaimNonZeroDays();  break;
    case 'claimGlobalNotifs':   $commands->claimGlobalNotifs(); break;
    case 'claimMission':        $commands->claimMission();      break;
    case 'adWatched':           $commands->AdWatched();         break;
    case 'report':              $commands->Report();            break;
    case 'getDate':             $commands->GetDate();           break;
    case 'giftCode':            $commands->GiftCode();          break;
    case 'getDevices':          $commands->GetDevices();        break;
    case 'disconnect':          $commands->Disconnect();        break;
    case 'deleteAccount':       $commands->DeleteAccount();     break;

    case 'checkToken':          $commands->CheckToken();        break;
}

$output = $commands->GetOutput();
echo($output);
unset($commands);

?>
