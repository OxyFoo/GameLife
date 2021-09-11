import * as React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import langManager from '../../Managers/LangManager';

import GLText from './GLText';
import GLIconButton from './GLIconButton';

function GLActivityBox(props) {
    const skillTitle = (props.skill || '').toUpperCase();
    const skillTimes = props.time;
    const skillXP = langManager.curr['calendar']['value-xp'].replace('{}', props.xp || 0);
    const styleContainer = [ styles.container, props.style ];
    const eventPress = props.onPress;
    const eventRemove = props.onRemove;

    if (props.small) {
        const smallContainer = [ smallStyles.container, props.style ];
        return (
            <View style={smallContainer}>
                <GLText style={smallStyles.title} title={skillTitle} />
                <GLText style={smallStyles.text} title={skillTimes} />
            </View>
        )
    }

    return (
        <View style={styleContainer}>
            <TouchableOpacity activeOpacity={.5} onPress={eventPress}>
                <GLText style={styles.title} title={skillTitle} />
                <GLText styleText={styles.text} title={langManager.curr['calendar']['skill-time'].toUpperCase()} value={skillTimes} />
                <GLText styleText={styles.text} title={langManager.curr['calendar']['skill-xp'].toUpperCase()} value={skillXP} />
            </TouchableOpacity>
            <GLIconButton style={styles.cross} icon='cross' onPress={eventRemove} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingBottom: 6,
        borderColor: '#FFFFFF',
        borderLeftWidth: 3,
        borderRightWidth: 3,
        borderBottomWidth: 3
    },
    title: {
        padding: 12,
        marginBottom: 12,
        fontSize: 28,
        textAlign: 'left'
    },
    text: {
        fontSize: 18
    },
    cross: {
        position: 'absolute',
        top: 0,
        right: 0,
        margin: 6
    }
});

const smallStyles = StyleSheet.create({
    container: {
        marginVertical: 6
    },
    title: {
        fontSize: 14
    },
    text: {
        fontSize: 12
    }
});

export default GLActivityBox;