import * as React from 'react';
import { Animated, BackHandler } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import user from '../Managers/UserManager';
import langManager from './LangManager';
import { TimingAnimation } from '../Functions/Animations';
import { isUndefined } from '../Functions/Functions';
import { BottomBar, Popup } from '../Interface/Widgets';

import About from '../Interface/pageFront/about';
import Achievements from '../Interface/pageFront/achievements';
import Activity from '../Interface/pageFront/activity';
import ActivityTimer from '../Interface/pageFront/activityTimer';
import Calendar from '../Interface/pageFront/calendar';
import Dailyquest from '../Interface/pageFront/dailyquest';
import Display from '../Interface/pageFront/display';
import Experience from '../Interface/pageFront/experience';
import Home from '../Interface/pageFront/home';
import Identity from '../Interface/pageFront/identity';
import Leaderboard from '../Interface/pageFront/leaderboard';
import Loading from '../Interface/pageFront/loading';
import Login from '../Interface/pageFront/login';
import Report from '../Interface/pageFront/report';
import Settings from '../Interface/pageFront/settings';
import Shop from '../Interface/pageFront/shop';
import Skill from '../Interface/pageFront/skill';
import Skills from '../Interface/pageFront/skills';
import Waitinternet from '../Interface/pageFront/waitinternet';
import Waitmail from '../Interface/pageFront/waitmail';
import Test from '../Interface/pageFront/test';

class PageManager extends React.Component{
    state = {
        page1: '',
        page2: '',
        animOpacity1: new Animated.Value(0),
        animOpacity2: new Animated.Value(0),
        arguments: {},
        ignorePage: false,

        bottomBarShow: false,
        pageIndex: -1
    }

    constructor(props) {
        super(props);

        /**
         * @description Disable changing page while loading
         */
        this.changing = false;

        /**
         * @description Disable back button
         */
        this.backable = true;

        /**
         * @description Represent all pages before current page
         * Increment when changing page
         */
        this.path = [];

        /**
         * Link this class to user to skip cycle warnings
         */
        user.interface = this;

        this.popup = new React.createRef();
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.backHandle);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.backHandle);
    }

    backHandle = () => {
        if (!this.backable) return false;

        if (this.popup.Close()) return true;
        else if (this.backPage()) return true;

        /*const popup_opened = this.state.popupArgs[0] !== null;
        const cancelable = this.state.popupArgs[2];
        if (popup_opened && cancelable) {
            this.popup.Close();
        } else if (!popup_opened) {
            this.backPage();
        }*/
        return true;
    }

    backPage = () => {
        if (this.changing) return false;
        if (this.path.length < 1) {
            const title = langManager.curr['home']['alert-exit-title'];
            const text = langManager.curr['home']['alert-exit-text'];
            const callback = (btn) => btn === 'yes' && BackHandler.exitApp();
            this.popup.Open('yesno', [ title, text ], callback);
            return false;
        }
        this.changing = true;
        const [ prevPage, prevArgs ] = this.path[this.path.length - 1];
        this.path.length = this.path.length - 1;
        this.setState({ arguments: prevArgs, ignorePage: false });
        this.pageAnimation(prevPage);
        return true;
    }

    changePage = (newpage, args, ignorePage = false, forceUpdate = false) => {
        if (this.changing) return false;

        const prevPage = this.state.page1 || this.state.page2;

        if (isUndefined(newpage) || newpage === '') {
            this.forceUpdate(); return false;
        }

        if (!forceUpdate && newpage == prevPage) {
            return false;
        }

        if (!this.GetPageContent(newpage)) {
            console.error('Calling an incorrect page');
            return false;
        };

        // If current (prev) page is not ignored, add it to path, except first loading (no first pages)
        if (!this.state.ignorePage && prevPage != '') {
            this.path.push([prevPage, this.state.arguments]);
        }

        const newArgs = !isUndefined(args) ? args : {};
        this.setState({ arguments: newArgs, ignorePage: ignorePage });

        this.changing = true;
        this.pageAnimation(newpage);

        return true;
    }

    pageAnimation = (newpage) => {
        const animation_duration = 200;
        const animation_delay = 100;

        // Switch pages animation
        if (!this.state.page1) {
            // Clear page 2
            TimingAnimation(this.state.animOpacity2, 0, 100).start(() => { this.setState({ page2: '' }); });
            // Load page 1
            setTimeout(() => { this.setState({ page1: newpage }); }, 0);
            setTimeout(() => { TimingAnimation(this.state.animOpacity1, 1, animation_duration).start(); }, animation_delay);
        } else {
            // Clear page 1
            TimingAnimation(this.state.animOpacity1, 0, 100).start(() => { this.setState({ page1: '' }); });
            // Load page 2
            setTimeout(() => { this.setState({ page2: newpage }); }, 0);
            setTimeout(() => { TimingAnimation(this.state.animOpacity2, 1, animation_duration).start(); }, animation_delay);
        }

        // Bottom bar selected index animation
        const bottomBarPages = [ 'home', 'calendar', 'x', 'settings', 'shop' ];
        const bottomBarShow = bottomBarPages.includes(newpage);
        this.setState({ bottomBarShow: bottomBarShow });
        const index = bottomBarPages.indexOf(newpage);
        this.setState({ pageIndex: index !== -1 ? index : 2 });

        setTimeout(() => {
            this.changing = false;
        }, animation_delay + animation_duration + 200);
    }

    GetCurrentPage = () => {
        return this.state.page1 || this.state.page2;
    }

    GetPageContent(page, args) {
        let p;
        switch (page) {
            case 'about': p = <About />; break;
            case 'achievements': p = <Achievements />; break;
            case 'activity': p = <Activity args={args} />; break;
            case 'activitytimer': p = <ActivityTimer args={args} />; break;
            case 'calendar': p = <Calendar />; break;
            case 'dailyquest': p = <Dailyquest />; break;
            case 'display': p = <Display args={args} />; break;
            case 'experience': p = <Experience />; break;
            case 'home': p = <Home />; break;
            case 'identity': p = <Identity />; break;
            case 'leaderboard': p = <Leaderboard />; break;
            case 'loading': p = <Loading args={args} />; break;
            case 'login': p = <Login />; break;
            case 'report': p = <Report />; break;
            case 'settings': p = <Settings />; break;
            case 'shop': p = <Shop />; break;
            case 'skill': p = <Skill args={args} />; break;
            case 'skills': p = <Skills />; break;
            case 'waitinternet': p = <Waitinternet />; break;
            case 'waitmail': p = <Waitmail args={args} />; break;
            case 'test': p = <Test />; break;
        }
        return p;
    }

    render() {
        const page1 = this.GetPageContent(this.state.page1, this.state.arguments);
        const page2 = this.GetPageContent(this.state.page2, this.state.arguments);

        const fullscreen = { width: '100%', height: '100%' }

        return (
            <LinearGradient style={fullscreen} colors={['#03052E', '#353657']}>
                <Animated.View pointerEvents={this.state.page1 ? 'auto' : 'none'} style={[fullscreen, { position: 'absolute', left: 0, top: 0, opacity: this.state.animOpacity1 }]}>
                    {page1}
                </Animated.View>
                <Animated.View pointerEvents={this.state.page2 ? 'auto' : 'none'} style={[fullscreen, { position: 'absolute', left: 0, top: 0, opacity: this.state.animOpacity2 }]}>
                    {page2}
                </Animated.View>
                <BottomBar show={this.state.bottomBarShow} selectedIndex={this.state.pageIndex} />
                <Popup ref={ref => { if (ref !== null) this.popup = ref }} />
            </LinearGradient>
        )
    }
}

export default PageManager;