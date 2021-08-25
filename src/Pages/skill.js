import * as React from 'react';
import { View, StyleSheet } from 'react-native';

import user from '../Managers/UserManager';
import langManager from '../Managers/LangManager';
import { GLHeader, GLXPBar } from '../Components/GL-Components';

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
                    <GLXPBar value={0} max={10} style={{ padding: 24 }} />
                    <GLXPBar value={5} max={10} style={{ padding: 24 }} />
                    <GLXPBar value={10} max={10} style={{ padding: 24 }} />
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