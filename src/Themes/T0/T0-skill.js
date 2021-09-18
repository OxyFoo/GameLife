import * as React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

import Skill from '../../Pages/skill';
import user from '../../Managers/UserManager';
import langManager from '../../Managers/LangManager';
import { GLBottomSwipePage, GLDoubleCorner, GLHeader, GLStats, GLSvg, GLText, GLXPBar } from './Components/GL-Components';
import { dateToFormatString } from '../../Functions/Functions';

class T0Skill extends Skill {
    render() {
        return (
            <View style={{ position: 'relative', width: '100%', height: '100%' }}>
                {/* Header */}
                <GLHeader
                    title={langManager.curr['skill']['page-title']}
                    leftIcon="back"
                    onPressLeft={this.back}
                />

                {/* Content */}
                <View style={styles.content}>
                    <View style={styles.skillContainer}>
                        <View style={styles.pictureContainer}>
                            <View style={styles.picture}>
                                <GLSvg xml={this.xml} />
                                <GLDoubleCorner />
                            </View>
                        </View>
                        <View style={styles.detailContainer}>
                            <View>
                                <GLText style={styles.detailName} title={this.name} />
                                <GLText style={styles.detailCategory} title={this.category} color="grey" />
                            </View>
                            <View>
                                <GLText style={styles.level} title={this.level} />
                                <GLXPBar value={this.xp} max={this.maxXP} small={true} />
                            </View>
                            <GLText style={styles.creator} title={this.creator} color="grey" />
                        </View>
                    </View>
                    <GLStats containerStyle={styles.stats} data={this.stats} />
                </View>
                <GLBottomSwipePage title={langManager.curr['skill']['page-history'].toUpperCase()}>
                    <FlatList
                        data={this.history}
                        keyExtractor={(item, i) => 'history_' + i}
                        renderItem={({item, i}) => {
                            const date = dateToFormatString(new Date(item.startDate));
                            const text = langManager.curr['skill']['text-history'];
                            const duration = item.duration;
                            const title = text.replace('{}', date).replace('{}', duration);
                            const onPress = () => { user.changePage('activity', { 'activity': item }); }
                            return (
                                <TouchableOpacity activeOpacity={0.5} onPress={onPress}>
                                    <GLText
                                        style={styles.textHistory}
                                        title={title}
                                    />
                                </TouchableOpacity>
                            )
                        }}
                    />
                </GLBottomSwipePage>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    content: {
        flex: 1
    },
    skillContainer: {
        marginVertical: 24,
        display: 'flex',
        flexDirection: 'row'
    },
    pictureContainer: {
        marginHorizontal: 12,
        justifyContent: 'center'
    },
    picture: {
        width: 128,
        height: 128,

        borderWidth: 2,
        borderColor: '#FFFFFF',

        zIndex: -100,
        elevation: -100,

        backgroundColor: '#000000'
    },
    detailContainer: {
        flex: 1,
        paddingTop: 4,
        paddingHorizontal: 12,
        paddingLeft: 0,

        display: 'flex',
        justifyContent: 'space-between'
    },
    detailName: {
        fontSize: 20,
        textAlign: 'left',
        lineHeight: 18
    },
    detailCategory: {
        fontSize: 18,
        textAlign: 'left'
    },
    level: {
        fontSize: 16,
        marginBottom: 4,
        textAlign: 'left'
    },
    creator: {
        fontSize: 12,
        textAlign: 'left'
    },
    stats: {
        height: '60%',
        padding: 24
    },
    textHistory: {
        padding: 24
    }
});

export { T0Skill };