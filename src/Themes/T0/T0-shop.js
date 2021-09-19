import * as React from 'react';
import { View, StyleSheet } from 'react-native';

import Shop from '../../Pages/shop';
import user from '../../Managers/UserManager';
import langManager from '../../Managers/LangManager';
import { GLHeader, GLText } from './Components/GL-Components';

class T0Shop extends Shop {
    render() {
        return (
            <View style={{ flex: 1 }}>
                {/* Header */}
                <GLHeader
                    title={langManager.curr['shop']['page-title']}
                    leftIcon="back"
                    onPressLeft={user.backPage}
                />

                {/* Content */}
                <View style={styles.container}>
                    <GLText style={styles.wait} title={langManager.curr['shop']['wait']} />
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 24
    },

    wait: {
        padding: 24,
        fontSize: 28
    }
});

export { T0Shop };