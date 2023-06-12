import * as React from 'react';

import user from 'Managers/UserManager';
import dataManager from 'Managers/DataManager';

import { PageBack } from 'Interface/Components';

class BackTest extends PageBack {
    state = {
        test: '',
        testInt: 0,
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
    openProfile = () => { user.interface.ChangePage('profile'); }
    openCalendar = () => { user.interface.ChangePage('calendar'); }
    openSkill = (skillID) => { user.interface.ChangePage('skill', { skillID: skillID }); }
    openSkills = () => { user.interface.ChangePage('skills'); }
    openExperience = () => { user.interface.ChangePage('experience'); }

    /** @param {{item: Stuff}} element */
    renderCardItem = ({ item: stuff }) => {
        const stuffSelected = null;
        const equippedStuff = user.inventory.GetEquipments();

        const isSelected = stuffSelected?.ID === stuff.ID;
        const isEquipped = equippedStuff.includes(stuff.ID);

        return (
            <ItemCard
                stuff={stuff}
                isSelected={isSelected}
                isEquipped={isEquipped}
                onPress={this.selectItem}
            />
        );
    }
}

export default BackTest;