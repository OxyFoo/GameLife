import user from 'Managers/UserManager';
import { Animated } from 'react-native';

import { PageBase } from 'Interface/Global';
import { SpringAnimation } from 'Utils/Animations';

class BackTest extends PageBase {
    state = {
        test: '',
        testChecked: false,
        selectedSkill: {ID: -1, value: ''},
        switch: true
    }

    animPanel = new Animated.Value(0);
    panelX = 0;

    componentDidMount() {
        this.intervalPanel = setInterval(() => {
            const newX = this.panelX === 0 ? 200 : 0;
            this.panelX = newX;
            SpringAnimation(this.animPanel, newX).start();
        }, 2000);
    }

    componentWillUnmount() {
        clearInterval(this.intervalPanel);
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
}

export default BackTest;
