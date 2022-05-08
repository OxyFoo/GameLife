import * as React from 'react';

import user from '../../../Managers/UserManager';
import dataManager from '../../../Managers/DataManager';

class BackTest extends React.Component {
    state = {
        test: '',
        testChecked: false,
        selectedSkill: {ID: -1, value: ''},
        switch: true
    }

    openSI = () => {
        user.interface.screenInput.Open('test', 'abc', console.log);
    }

    openSL = () => {
        const test = [
            {id: 0, value:'abc'},
            {id: 1, value:'def'},
            {id: 2, value:'ghi'},
            {id: 3, value:'jkl'},
            {id: 4, value:'mno'},
            {id: 5, value:'pqr'},
            {id: 6, value:'stu'},
            {id: 7, value:'vwx'},
            {id: 8, value:'yz'}
        ];
        user.interface.screenList.Open('test', test, console.log);
    }

    addSkill = () => {
        if (dataManager.skills.skills.length <= 1) {
            console.warn("Aucun skill !");
            return;
        }
        user.interface.ChangePage('activity');
    }
    openIdentity = () => { user.interface.ChangePage('identity'); }
    openCalendar = () => { user.interface.ChangePage('calendar'); }
    openSkill = (skillID) => { user.interface.ChangePage('skill', { skillID: skillID }); }
    openSkills = () => { user.interface.ChangePage('skills'); }
    openExperience = () => { user.interface.ChangePage('experience'); }
}

export default BackTest;