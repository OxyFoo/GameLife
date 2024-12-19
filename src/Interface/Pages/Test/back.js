import React from 'react';
import { Animated, FlatList, View } from 'react-native';

import PageBase from 'Interface/FlowEngine/PageBase';

import { Text } from 'Interface/Components';
import { SpringAnimation, TimingAnimation } from 'Utils/Animations';
import user from 'Managers/UserManager';

/**
 * @typedef {import('Interface/Components').Button} Button
 */

class BackTest extends PageBase {
    static feKeepMounted = true;

    state = {
        /** @type {Button['props']['appearance']} */
        selectedButon: 'normal',
        input: '',
        switch1: false,
        switch2: true,
        checkbox1: false,
        checkbox2: true,
        switchText: 0,
        combobox: { ID: -1, value: '' },
        digit1: 1,
        digit2: 2
    };

    animLoop = new Animated.Value(0);
    animLinear = new Animated.Value(0);
    panelX = 0;

    componentDidMount() {
        this.intervalPanel = setInterval(() => {
            const newX = this.panelX === 0 ? 200 : 0;
            this.panelX = newX;
            SpringAnimation(this.animLoop, newX).start();
            TimingAnimation(this.animLinear, newX, 300).start();
        }, 2000);
    }

    componentWillUnmount() {
        clearInterval(this.intervalPanel);
    }

    buttonLoop = () => {
        const { selectedButon } = this.state;
        if (selectedButon === 'normal') {
            this.setState({ selectedButon: 'outline' });
        } else if (selectedButon === 'outline') {
            this.setState({ selectedButon: 'outline-blur' });
        } else if (selectedButon === 'outline-blur') {
            this.setState({ selectedButon: 'uniform' });
        } else {
            this.setState({ selectedButon: 'normal' });
        }
    };

    /*
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
    */

    goToHome = () => this.fe.ChangePage('home');

    openPopup = (count = 1) => {
        for (let i = 0; i < count; i++) {
            this.fe.popup?.OpenT({
                type: 'acceptornot',
                data: {
                    title: 'Test' + i.toString(),
                    message: 'This is a test message'
                },
                callback: (closeReason) => {
                    if (closeReason === 'accept' && i === count - 1) {
                        //this.fe.console?.Enable();
                    }
                },
                cancelable: i % 2 === 0
            });
        }
    };

    openBottomPanel = () => {
        this.fe.bottomPanel?.Open({
            content: (
                <View style={{ width: '100%', height: 256, paddingVertical: 4, backgroundColor: 'red' }}>
                    <FlatList
                        ref={user.interface.bottomPanel?.mover.SetScrollView}
                        onLayout={user.interface.bottomPanel?.mover.onLayoutFlatList}
                        onContentSizeChange={user.interface.bottomPanel?.mover.onContentSizeChange}
                        style={{ flex: 1, backgroundColor: 'blue' }}
                        data={Array.from({ length: 100 }).map((_, i) => ({ key: i }))}
                        renderItem={({ item }) => <Text>{`Test ${item.key}`}</Text>}
                    />
                </View>
            ),
            maxPosY: 500,
            defaultPosY: 1,
            onClose: () => {
                console.log('Closed');
            }
        });
    };

    openBigBottomPanel = () => {
        this.fe.bottomPanel?.Open({
            content: (
                <View style={{ width: '100%', height: 3000, backgroundColor: 'blue' }}>
                    <Text>Test</Text>
                </View>
            ),
            defaultPosY: 1,
            onClose: () => {
                console.log('Closed');
            }
        });
    };
}

export default BackTest;
