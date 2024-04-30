import { Animated } from 'react-native';

import PageBase from 'Interface/FlowEngine/PageBase';
import user from 'Managers/UserManager';

import { Button } from 'Interface/Components';
import { SpringAnimation } from 'Utils/Animations';

class BackTest extends PageBase {
    feKeepMounted = true;

    state = {
        /** @type {Button['props']['appearance']} */
        selectedButon: 'normal',
        input: '',
        switch1: false,
        switch2: true,
        checkbox1: false,
        checkbox2: true,
        switchText: 0,
        combobox: {ID: -1, value: ''}
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

    buttonLoop = () => {
        const { selectedButon } = this.state;
        if (selectedButon === 'normal') {
            this.setState({selectedButon: 'outline'});
        } else if (selectedButon === 'outline') {
            this.setState({selectedButon: 'outline-blur'});
        } else if (selectedButon === 'outline-blur') {
            this.setState({selectedButon: 'normal'});
        }
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

    goToPage2 = () => user.interface.ChangePage('test2');
}

export default BackTest;
