import About from './Pages/About';
import Achievements from './Pages/Achievements';
import Activity from './Pages/Activity';
import ActivityTimer from './Pages/ActivityTimer';
import BenchMark from './Pages/BenchMark';
import Calendar from './Pages/Calendar';
import ChestReward from './Pages/ChestReward';
import Display from './Pages/Display';
import Home from './Pages/Home';
import Leaderboard from './Pages/Leaderboard';
import Loading from './Pages/Loading';
import Login from './Pages/Login';
import Multiplayer from './Pages/Multiplayer';
import MyQuest from './Pages/MyQuest';
import MyQuestStats from './Pages/MyQuestStats';
import Onboarding from './Pages/Onboarding';
import Profile from './Pages/Profile';
import ProfileFriend from './Pages/ProfileFriend';
import Quests from './Pages/Quests';
import Report from './Pages/Report';
import Settings from './Pages/Settings';
import Shop from './Pages/Shop';
import Skill from './Pages/Skill';
import Skills from './Pages/Skills';
import Waitinternet from './Pages/WaitInternet';
import Waitmail from './Pages/WaitMail';
import Test from './Pages/Test';
import Test2 from './Pages/Test2';
import Todo from './Pages/Todo';

const PAGES = {
    'about':            About,
    'achievements':     Achievements,
    'activity':         Activity,
    'activitytimer':    ActivityTimer,
    'benchmark':        BenchMark,
    'calendar':         Calendar,
    'chestreward':      ChestReward,
    'display':          Display,
    'home':             Home,
    'leaderboard':      Leaderboard,
    'loading':          Loading,
    'login':            Login,
    'multiplayer':      Multiplayer,
    'myquest':          MyQuest,
    'myqueststats':     MyQuestStats,
    'onboarding':       Onboarding,
    'profile':          Profile,
    'profilefriend':    ProfileFriend,
    'quests':           Quests,
    'report':           Report,
    'settings':         Settings,
    'shop':             Shop,
    'skill':            Skill,
    'skills':           Skills,
    'waitinternet':     Waitinternet,
    'waitmail':         Waitmail,
    'test':             Test,
    'test2':            Test2,
    'todo':             Todo
};

/**
 * @typedef {keyof typeof PAGES} PageNames
 */

export default PAGES;
