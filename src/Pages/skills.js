import * as React from 'react';
import { View, StyleSheet } from 'react-native';

import user from '../Managers/UserManager';
import langManager from '../Managers/LangManager';
import { GLHeader } from '../Components/GL-Components';

class Calendar extends React.Component {
    back = () => { user.changePage('home'); }

    render() {
        return (
            <View style={{ flex: 1 }}>
                {/* Header */}
                <GLHeader
                    title={langManager.curr['calendar']['page-title']}
                    leftIcon="back"
                    onPressLeft={this.back}
                />

                {/* Topbar */}
                <View style={styles.topBar}>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    topBar: {
        width: '100%',
        height: 64,
        flexDirection: 'row',
        borderColor: '#FFFFFF',
        borderWidth: 3,
        borderTopWidth: 2,
        backgroundColor: '#000000'
    }
});

export default Calendar;