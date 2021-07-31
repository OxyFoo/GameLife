import * as React from 'react';
import { View, StyleSheet } from 'react-native';

import GLText from '../Components/GLText';
import user from '../Managers/UserManager';

class AnimTest extends React.Component {
    animTest = () => {
        user.changePage('home');
    }

    render() {
        return (
            <View style={{flex: 1}} onTouchStart={this.animTest}>
                {/* Header */}
                <GLText title="GAME LIFE" style={Style.header} />
                <View style={Style.separator}></View>

                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#00000001'}}>
                    <GLText title="Test - press to back" style={{marginBottom: 48}} />
                </View>
            </View>
        )
    }
}

const Style = StyleSheet.create({
    header: {
        width: '100%',
        color: '#5AB4F0',
        padding: 14,
        fontSize: 38,
        backgroundColor: '#012D3B'
    },
    separator: {
        width: '100%',
        height: 1,
        backgroundColor: '#FFFFFF'
    },
    content: {
        flex: 1
    },
    name: {
        color: '#5AB4F0',
        fontSize: 36,
        marginTop: 12
    },
    containerLevels: {
        paddingHorizontal: 24,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    containerLevel: {
        flexDirection: 'row',
        alignItems: 'flex-end'
    },
    levelTitle: {
        color: '#55AFF0',
        padding: 0,
        paddingBottom: 6,
        fontSize: 28
    },
    level: {
        color: '#55AFF0',
        padding: 6,
        fontSize: 38
    },
    containerXP: {
        alignItems: 'flex-end'
    },
    levelXP: {
        color: '#CAE6F4',
        fontSize: 12,
        padding: 2
    },
    textXP: {
        textAlign: 'right',
        padding: 0,
        paddingTop: 6,
        paddingBottom: 2,
        paddingRight: 8,
        marginVertical: 12,
        marginHorizontal: 24,
        borderWidth: 2,
        borderColor: '#FFFFFF'
    },
    main: {
        paddingHorizontal: 24,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    containerCalendar: {
        width: '40%',
        borderWidth: 2,
        borderColor: '#888888'
    },
    containerCaracs: {
        width: '60%'
    },
    textTitleCarac: {
        color: '#3E99E7',
        fontSize: 20,
        padding: 0
    },
    textCarac: {
        color: '#5ABEFA',
        fontSize: 18,
        padding: 0,
        marginTop: 8
    },
    textCaracValue: {
        color: '#5ABEFA',
        fontSize: 18,
        padding: 0
    },
    compTitle: {
        color: '#5ABEFA',
        fontSize: 28,
        padding: 24
    },
    containerComp: {
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    },
    comp: {
        width: 48,
        height: 48,
        backgroundColor: 'red'
    }
});

export default AnimTest;