import * as React from 'react';
import { View, StyleSheet } from 'react-native';

import user from '../Managers/UserManager';
import langManager from '../Managers/LangManager';
import { GLHeader } from '../Components/GL-Components';

class Achievements extends React.Component {
    render() {
        return (
            <View style={{ flex: 1 }}>
                {/* Header */}
                <GLHeader
                    title={langManager.curr['achievements']['page-title']}
                    //small={true}
                    leftIcon="back"
                    onPressLeft={user.backPage}
                />

                {/* Content */}
                <View style={styles.container}>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
});

export default Achievements;