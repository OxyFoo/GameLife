import * as React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

import user from '../Managers/UserManager';
import langManager from '../Managers/LangManager';
import { GLBottomSwipePage, GLDoubleCorner, GLHeader, GLStats, GLText, GLXPBar } from '../Components/GL-Components';
import { dateToFormatString } from '../Functions/Functions';

class Skill extends React.Component {
    constructor(props) {
        super(props);

        if (typeof(props.args) === 'undefined') {
            user.backPage();
            return;
        }

        const skillID = props.args['skillID'];
        const skill = user.getSkillByID(skillID);
        const skillXP = user.experience.getSkillExperience(skillID);

        this.name = skill.Name;
        this.category = skill.Category;
        this.level = langManager.curr['level']['level-small'] + ' ' + skillXP.lvl;
        this.xp = skillXP.xp;
        this.maxXP = skillXP.next;
        if (skill.Creator) {
            this.creator = langManager.curr['skill']['text-author'] + ' ' + skill.Creator;
        } else {
            this.creator = '';
        }
        this.stats = skill.Stats;
        this.history = [];
        for (let a in user.activities) {
            const activity = user.activities[a];
            if (activity.skillID === skillID) {
                this.history.push(activity);
            }
        }
    }
    back = () => { user.backPage(); }

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
                                <GLDoubleCorner />
                            </View>
                        </View>
                        <View style={styles.detailContainer}>
                            <GLText style={styles.detailName} title={this.name} />
                            <GLText style={styles.detailCategory} title={this.category} color="grey" />
                            <View>
                                <GLText style={styles.level} title={this.level} />
                                <GLXPBar value={this.xp} max={this.maxXP} small={true} />
                            </View>
                            {this.creator !== '' && (
                                <GLText style={styles.creator} title={this.creator} color="grey" />
                            )}
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
                            return (
                                <TouchableOpacity activeOpacity={0.5}>
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
        height: '25%',
        display: 'flex',
        flexDirection: 'row'
    },
    pictureContainer: {
        marginVertical: 24,
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
        paddingHorizontal: 12,
        marginVertical: 18,
        paddingLeft: 0,

        display: 'flex',
        justifyContent: 'space-between'
    },
    detailName: {
        fontSize: 20,
        textAlign: 'left'
    },
    detailCategory: {
        fontSize: 18,
        textAlign: 'left'
    },
    level: {
        fontSize: 14,
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

export default Skill;