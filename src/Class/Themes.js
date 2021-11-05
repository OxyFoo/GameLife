import * as React from 'react';

import DataStorage, { STORAGE } from '../Class/DataStorage';
import { isUndefined } from '../Functions/Functions';

import { T0About } from '../Pages/front/about';
import { T0Achievements } from '../Pages/front/achievements';
import { T0Activity } from '../Pages/front/activity';
import { T0Calendar } from '../Pages/front/calendar';
import { T0Dailyquest } from '../Pages/front/dailyquest';
import { T0Experience } from '../Pages/front/experience';
import { T0Home } from '../Pages/front/home';
import { T0Identity } from '../Pages/front/identity';
import { T0Leaderboard } from '../Pages/front/leaderboard';
import { T0Loading } from '../Pages/front/loading';
import { T0Report } from '../Pages/front/report';
import { T0Settings } from '../Pages/front/settings';
import { T0Shop } from '../Pages/front/shop';
import { T0Skill } from '../Pages/front/skill';
import { T0Skills } from '../Pages/front/skills';
import { T0Statistic } from '../Pages/front/statistic';

const COLORS = {
    "T0": {
        globalBackground: '#000020',
        globalBackcomponent: '#000000',
        xpBar: '#ECECEC',
        text: {
            main: '#ECECEC',
            secondary: '#C2C2C2',
            dark: '#808080'
        }
    }
}

class ThemeManager {
    THEMES = {
        T0: "T0",
        T0V1: "T0.1",
        T0V2: "T0.2"
    }
    DEFAULT = this.THEMES.T0;
    selectedTheme = this.DEFAULT;
    colors = COLORS[this.selectedTheme];

    constructor() {
        //this.loadTheme();
    }
    
    async loadTheme() {
        const data = await DataStorage.Load(STORAGE.THEME, false);
        if (!isUndefined(data) && data.hasOwnProperty('theme')) {
            const currentTheme = data['theme'];
            if (Object.values(this.THEMES).includes(currentTheme)) {
                this.setTheme(currentTheme, false);
            }
        }
    }

    saveTheme() {
        const data = { 'theme': this.selectedTheme };
        DataStorage.Save(STORAGE.THEME, data, false);
    }

    setTheme(theme, save = true) {
        this.selectedTheme = theme;
        this.colors = COLORS[theme];
        if (save) this.saveTheme();
    }

    isTheme(theme) {
        return Object.values(this.THEMES).includes(theme);
    }

    GetPageContent(page, args) {
        let p;
        switch (this.selectedTheme) {
            default:
            case this.THEMES.T0:
            case this.THEMES.T0V1:
            case this.THEMES.T0V2:
                switch (page) {
                    case 'about': p = <T0About />; break;
                    case 'achievements': p = <T0Achievements />; break;
                    case 'activity': p = <T0Activity args={args} />; break;
                    case 'calendar': p = <T0Calendar />; break;
                    case 'dailyquest': p = <T0Dailyquest />; break;
                    case 'experience': p = <T0Experience />; break;
                    case 'home': p = <T0Home />; break;
                    case 'identity': p = <T0Identity />; break;
                    case 'leaderboard': p = <T0Leaderboard />; break;
                    case 'loading': p = <T0Loading args={args} />; break;
                    case 'report': p = <T0Report />; break;
                    case 'settings': p = <T0Settings />; break;
                    case 'shop': p = <T0Shop />; break;
                    case 'skill': p = <T0Skill args={args} />; break;
                    case 'skills': p = <T0Skills />; break;
                    case 'statistic': p = <T0Statistic args={args} />; break;
                }
                break;
        }
        return p;
    }
}

export default ThemeManager;