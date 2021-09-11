import * as React from 'react';
import { View, StyleSheet } from 'react-native';

import langManager from '../../Managers/LangManager';
import { GLHeader, GLText } from '../../Components/GL-Components';

import Report from '../../Pages/report';

class T0Report extends Report {
    render() {
        return (
            <View style={{ flex: 1 }}>
                {/* Header */}
                <GLHeader
                    title={langManager.curr['report']['page-title']}
                    leftIcon="back"
                    onPressLeft={this.back}
                    rightIcon="info"
                    onPressRight={this.test}
                />

                {/* Content */}
                <View style={styles.container}>
                    <View>
                        <GLText style={styles.title} title={langManager.curr['about']['block-devs']} />
                        <GLText styleText={styles.text} title={"Pierre Marsaa"} value={langManager.curr['about']['text-manager']} />
                        <GLText styleText={styles.text} title={"Gérémy Lecaplain"} value={langManager.curr['about']['text-developer']} />
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 24,

        display: 'flex',
        justifyContent: 'space-evenly'
    },
    title: {
        fontSize: 32,
        marginBottom: 24
    },
    text: {
        fontSize: 20
    },

    contributors: {
        height: '20%',
        borderColor: '#FFFFFF',
        borderWidth: 3
    },
    contributorsText: { marginVertical: 4 },
    contributorsValues: { fontSize: 16 },
    row: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly'
    }
});

export default T0Report;