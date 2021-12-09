import * as React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Dimensions } from 'react-native';

import user from '../../Managers/UserManager';
import langManager from '../../Managers/LangManager';
import themeManager from '../../Managers/ThemeManager';

import BackSkill from '../pageBack/skill';
import { GLBottomSwipePage, GLDoubleCorner, GLHeader, GLStats, GLSvg, GLText, GLXPBar } from '../Components';
import { dateToFormatString } from '../../Functions/Time';

class Skill extends BackSkill {
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
                            <View style={[styles.picture, { backgroundColor: themeManager.colors['globalBackcomponent'] }]}>
                                <GLSvg xml={this.xml} />
                                <GLDoubleCorner />
                            </View>
                        </View>
                        <View style={styles.detailContainer}>
                            <View>
                                <GLText style={styles.detailName} title={this.name} />
                                <GLText style={styles.detailCategory} title={this.category} color="secondary" />
                            </View>
                            <View>
                                <GLText style={styles.level} title={this.level} />
                                <GLXPBar value={this.xp} max={this.maxXP} small={true} />
                            </View>
                            <GLText style={styles.creator} title={this.creator} color="secondary" />
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

const ww = Dimensions.get('window').width ; 
const wh = Dimensions.get('window').height ;

const styles = StyleSheet.create({
    content: {
        flex: 1
    },
    skillContainer: {
        marginVertical: "5%",
        display: 'flex',
        flexDirection: 'row',
    },
    pictureContainer: {
        marginHorizontal: "5%",
        justifyContent: 'center'
    },
    picture: {
        width: ww*34/100,
        height: ww*34/100,

        borderWidth: ww*5/1000,
        borderColor: '#FFFFFF',

        zIndex: -100,
        elevation: -100
    },
    detailContainer: {
        flex: 1,
        paddingTop: "1%",
        paddingHorizontal: "5%",
        paddingLeft: 0,

        display: 'flex',
        justifyContent: 'space-between',
    },
    detailName: {
        fontSize: ww * 60 / 1000,
        textAlign: 'left',
        lineHeight: wh * 375 / 10000,
        
    },
    detailCategory: {
        fontSize: ww * 55 / 1000,
        textAlign: 'left'
    },
    level: {
        fontSize: ww * 50 / 1000,
        marginBottom: 4,
        textAlign: 'left'
    },
    creator: {
        fontSize: ww * 40 / 1000,
        textAlign: 'left'
    },
    stats: {
        height: '60%',
        padding: "6%"
    },
    textHistory: {
        padding: "5%"
    }
});

export default Skill;