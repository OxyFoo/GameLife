import * as React from 'react';
import { View, StyleSheet } from 'react-native';

import { GLHeader } from '../Components/GL-Components';
import user from '../Managers/UserManager';

class Settings extends React.Component {
    back = () => { user.changePage('home'); }

    render() {
        return (
            <View style={{flex: 1}}>
                {/* Header */}
                <GLHeader
                    title="Settings"
                    leftIcon='back'
                    onPressLeft={this.back}
                />

                {/* Content */}
                <View style={style.content}>
                </View>
            </View>
        )
    }
}

const style = StyleSheet.create({
    content: {
        padding: 24
    }
});

export default Settings;