import * as React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import GLText from './GLText';
import GLXPBar from './GLXPBar';

function GLXP(props) {
    const onPress = props.onPress;

    return (
        <TouchableOpacity activeOpacity={onPress ? 0.5 : 1} onPress={onPress} >
            <View style={Style.containerLevels}>
                <View style={Style.containerLevel}>
                    <GLText title="Level" style={Style.levelTitle} />
                    <GLText title="XX" style={Style.level} />
                </View>
                <View style={Style.containerXP}>
                    <GLText title="xp total XXXXX" style={Style.levelXP} />
                    <GLText title="average xp / day XXXXX" style={Style.levelXP} />
                </View>
            </View>

            {/* XP */}
            <GLXPBar />
        </TouchableOpacity>
    )
}

const Style = StyleSheet.create({
    containerLevels: {
        padding: 0,
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
        fontSize: 28
    },
    level: {
        color: '#55AFF0',
        padding: 0,
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
    }
});

export default GLXP;