import * as React from 'react';

import user from 'Managers/UserManager';

import { PageBase } from 'Interface/Components';
import ItemCard from '../Profile/cards/ItemCard';

/**
 * @typedef {import('Class/Inventory').Stuff} Stuff
 */

class BackTest extends PageBase {
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

    /** @param {{item: Stuff}} element */
    renderCardItem = ({ item: stuff }) => {
        const stuffSelected = null;
        const equippedStuff = user.inventory.GetEquipments();

        const isSelected = stuffSelected?.ID === stuff.ID;
        const isEquipped = equippedStuff.includes(stuff.ID);

        const onPress = () => {
            console.log('onPress');
        };

        return (
            <ItemCard
                stuff={stuff}
                isSelected={isSelected}
                isEquipped={isEquipped}
                onPress={onPress}
            />
        );
    }
}

export default BackTest;
