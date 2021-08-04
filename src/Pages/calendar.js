import * as React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';

import { GLCalendarTask, GLHeader, GLIconButton, GLText } from '../Components/GL-Components';
import user from '../Managers/UserManager';

class Calendar extends React.Component {
    back = () => { user.changePage('home'); }
    activity = () => { user.changePage('activity'); }

    render() {
        return (
            <View style={{flex: 1}}>
                {/* Header */}
                <GLHeader
                    title="Calendrier"
                    leftIcon='back'
                    onPressLeft={this.back}
                    rightIcon='plus'
                    onPressRight={this.activity}
                />

                {/* Head */}
                <TouchableOpacity style={style.head}>
                    <GLText style={style.headText} title='DD / MM / YY' icon='check' />
                    <GLIconButton icon='chevronBottom' />
                </TouchableOpacity>

                {/* Content */}
                <View style={style.content}>
                    <GLCalendarTask />
                </View>
            </View>
        )
    }
}

const style = StyleSheet.create({
    content: {
        padding: 24
    },
    head: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    headText: {
        fontSize: 24,
        color: '#5AB4F0',
    },
    content: {
        borderTopColor: '#FFFFFF',
        borderTopWidth: 1
    }
});

export default Calendar;