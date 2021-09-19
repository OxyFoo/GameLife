import * as React from 'react';
import { View, StyleSheet } from 'react-native';

import Dailyquest from '../../Pages/dailyquest';
import user from '../../Managers/UserManager';
import langManager from '../../Managers/LangManager';
import { GLHeader, GLText } from './Components/GL-Components';
import { GetTimeToTomorrow } from '../../Functions/Functions';

class T0Dailyquest extends Dailyquest {
    render() {
        const dailyquestTime = langManager.curr['dailyquest']['info-remain-time'] + GetTimeToTomorrow();
        const title = langManager.curr['dailyquest']['daily-title'];

        return (
            <View style={{ flex: 1 }}>
                {/* Header */}
                <GLHeader
                    title={langManager.curr['dailyquest']['page-title']}
                    leftIcon="back"
                    small={true}
                    onPressLeft={user.backPage}
                />

                {/* Content */}
                <View style={styles.container}>
                    <GLText style={styles.remainTime} title={dailyquestTime} />
                    <GLText style={styles.title} title={title} />
                    <View>
                        <GLText title="Une heure d'acivité parmis les catégories suivantes : CAT1 et CAT2" />
                        <GLText title="Un quart d'heure dans la catégorie suivante" />
                    </View>
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

    remainTime: {
        marginRight: 24,
        textAlign: 'right'
    },
    title: {
        paddingVertical: 48,
        fontSize: 26
    }
});

export { T0Dailyquest };