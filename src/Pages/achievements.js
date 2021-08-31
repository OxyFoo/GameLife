import * as React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';

import user from '../Managers/UserManager';
import langManager from '../Managers/LangManager';
import { GLHeader, GLText } from '../Components/GL-Components';

const DATA_TEST = [ 1, 2, 3, 4, 5, 6 ];

class Achievements extends React.Component {
    achievementRender({ item }) {
        const name = item;

        return (
            <View style={styles.achievementsContainer}>
                <View style={styles.achievementsBox}>
                    <View style={styles.row}>
                        <View style={styles.colHeader}>
                            <View style={styles.image}>
                                <GLText title="Image" color="black" />
                            </View>
                            <GLText style={styles.imageText} title="JJ/MM/YY" />
                        </View>
                        <View style={styles.colContent}>
                                <GLText style={styles.title} title={name} />
                                <GLText style={styles.description} title="Description Description Description Description Description Description" color="grey" />
                        </View>
                    </View>
                </View>
            </View>
        )
    }

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
                    <FlatList
                        style={styles.achievements}
                        data={DATA_TEST}
                        keyExtractor={(item, i) => 'achievements' + i}
                        renderItem={this.achievementRender}
                        numColumns={2}
                    />
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    achievements: {
        paddingTop: 48
    },
    achievementsContainer: {
        width: '50%',
        padding: 12
    },
    achievementsBox: {
        borderColor: '#FFFFFF',
        borderTopWidth: 3,
        borderBottomWidth: 3,
        borderLeftWidth: 6,
        borderRightWidth: 6,
        backgroundColor: '#000000'
    },
    row: {
        display: 'flex',
        flexDirection: 'row'
    },
    colHeader: {
        width: '40%'
    },
    colContent: {
        width: '60%'
    },
    image: {
        width: 48,
        height: 48,
        margin: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF'
    },
    imageText: {
        position: 'absolute',
        left: 0,
        right: -6,
        bottom: 12,
        fontSize: 10
    },
    title: {
        marginVertical: 4,
        fontSize: 14
    },
    description: {
        marginBottom: 12,
        fontSize: 12
    }
});

export default Achievements;