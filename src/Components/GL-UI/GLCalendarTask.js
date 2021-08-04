import * as React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import GLText from './GLText';

function Task({ item, index }) {
}

function GLCalendarTask(props) {
    const time = props.time;
    const title = props.title;
    const onPress = props.onPress;

    return (
        <TouchableOpacity style={Style.content} activeOpacity={.5} onPress={onPress}>
            <GLText title='test' />
        </TouchableOpacity>
    )
}

const Style = StyleSheet.create({
    content: {
        marginTop: 48,
        borderTopColor: '#3E99E7',
        borderTopWidth: 2,
        backgroundColor: '#203A43'
    },
    task: {
    }
});

export default GLCalendarTask;