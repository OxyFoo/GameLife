import * as React from 'react';
import { View, StyleSheet } from 'react-native';

import user from '../Managers/UserManager';
import langManager from '../Managers/LangManager';
import { GLHeader } from '../Components/GL-Components';

class Skill extends React.Component {
    back = () => { user.changePage('home'); }

    render() {
        return (
            <View style={{ flex: 1 }}>
                {/* Header */}
                <GLHeader
                    title={langManager.curr['skill']['page-title']}
                    leftIcon="back"
                    onPressLeft={this.back}
                />

                {/* Content */}
                <View style={styles.content}>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    content: {
    }
});

export default Skill;