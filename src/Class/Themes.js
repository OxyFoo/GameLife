import * as React from 'react';

import COLORS from '../Themes/Colors';
import DataStorage, { STORAGE } from '../Class/DataStorage';

import { T0About } from '../Themes/T0/T0-about';
import { T0Achievements } from '../Themes/T0/T0-achievements';
import { T0Activity } from '../Themes/T0/T0-activity';
import { T0Calendar } from '../Themes/T0/T0-calendar';
import { T0Experience } from '../Themes/T0/T0-experience';
import { T0Home } from '../Themes/T0/T0-home';
import { T0Identity } from '../Themes/T0/T0-identity';
import { T0Leaderboard } from '../Themes/T0/T0-leaderboard';
import { T0Loading } from '../Themes/T0/T0-loading';
import { T0Report } from '../Themes/T0/T0-report';
import { T0Settings } from '../Themes/T0/T0-settings';
import { T0Skill } from '../Themes/T0/T0-skill';
import { T0Skills } from '../Themes/T0/T0-skills';
import { T0Statistic } from '../Themes/T0/T0-statistic';

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
        this.loadTheme();
    }
    
    async loadTheme() {
        const currentTheme = await DataStorage.Load(STORAGE.THEME, false);
        if (Object.values(this.THEMES).includes(currentTheme)) {
            this.setTheme(currentTheme, false);
        }
    }

    saveTheme() {
        DataStorage.Save(STORAGE.THEME, this.selectedTheme, false);
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
                    case 'experience': p = <T0Experience />; break;
                    case 'home': p = <T0Home />; break;
                    case 'identity': p = <T0Identity />; break;
                    case 'leaderboard': p = <T0Leaderboard />; break;
                    case 'loading': p = <T0Loading args={args} />; break;
                    case 'report': p = <T0Report />; break;
                    case 'settings': p = <T0Settings />; break;
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