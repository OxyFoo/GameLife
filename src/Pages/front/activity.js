import * as React from 'react';
import { View, StyleSheet, FlatList, Dimensions } from 'react-native';

import BackActivity from '../back/activity';
import { isUndefined } from '../../Functions/Functions';
import { GLDropDown, GLHeader, GLText } from '../Components';

import user from '../../Managers/UserManager';
import langManager from '../../Managers/LangManager';
import dataManager from '../../Managers/DataManager';

class Activity extends BackActivity {
    render() {
        const title_category = !isUndefined(this.state.selectedCategory) ? this.state.selectedCategory.value : langManager.curr['activity']['input-category-default'];
        const title_skill = !isUndefined(this.state.selectedSkill) ? dataManager.skills.getByID(this.state.selectedSkill.skillID).Name : langManager.curr['activity']['input-activity-default'];

        const rightIcon = this.SELECTED ? 'trash' : 'check';
        const rightEvent = this.SELECTED ? this.trash : this.valid;

        let skill, totalXP, bonusXP, textBonusXP;
        if (!isUndefined(this.state.selectedSkill)) {
            const selectedSkill = this.state.selectedSkill;
            const skillID = selectedSkill.skillID;
            const durationHour = (this.DURATION[this.state.selectedTimeKey].duration / 60);
            skill = dataManager.skills.getByID(skillID);
            totalXP = skill.XP * durationHour;
            const untilActivity = this.SELECTED ? selectedSkill : undefined;
            const sagLevel = user.experience.getStatExperience('sag', untilActivity).lvl - 1;
            bonusXP = sagLevel * durationHour;
            textBonusXP = bonusXP === 0 ? '' : ' +' + bonusXP;
        }

        return (
            <View style={{flex: 1}}>
                {/* Header */}
                <GLHeader
                    title={langManager.curr['activity']['page-title']}
                    leftIcon='back'
                    onPressLeft={this.back}
                    //rightIcon={rightIcon}
                    onPressRight={rightEvent}
                />

                {/* Content */}
                <View style={styles.content}>
                    {/* Category 
                    <GLText style={styles.title} title={langManager.curr['activity']['input-category'].toUpperCase()} />
                    <GLDropDown
                        value={title_category}
                        data={this.CATEGORIES}
                        onSelect={this.changeCat}
                        disabled={this.SELECTED}
                        onLongPress={() => this.changeCat('')}
                    />*/}

                    {/* Activity 
                    <GLText style={styles.title} title={langManager.curr['activity']['input-activity'].toUpperCase()} />
                    <GLDropDown
                        value={title_skill}
                        data={this.state.skills}
                        onSelect={this.changeSkill}
                        disabled={this.SELECTED}
                    />*/}

                    {/* Start / duration 
                    <View style={styles.row}>
                        <View style={styles.column}>
                            <GLText style={styles.title} title={langManager.curr['activity']['input-start'].toUpperCase()} />
                            <GLDropDown
                                value={this.DATES[this.state.selectedDateKey].value}
                                data={this.DATES}
                                onSelect={this.changeDate}
                                disabled={this.SELECTED}
                            />
                        </View>

                        <View style={styles.column}>
                            <GLText style={styles.title} title={langManager.curr['activity']['input-duration'].toUpperCase()} />
                            <GLDropDown
                                value={this.DURATION[this.state.selectedTimeKey].value}
                                data={this.DURATION}
                                onSelect={this.changeDuration}
                                disabled={this.SELECTED}
                            />
                        </View>
                    </View>*/}

                    {!isUndefined(skill) && (
                        <View style={styles.containerAttr}>
                            <GLText title={'+' + totalXP + ' ' + langManager.curr['statistics']['xp']['small'] + textBonusXP} style={styles.attr} color='secondary' />
                            <FlatList
                                data={this.STATS}
                                keyExtractor={(item, i) => 'skill_stat_' + i}
                                renderItem={({item}) => {
                                    const pts = skill.Stats[item] * (this.DURATION[this.state.selectedTimeKey].duration / 60);
                                    return pts > 0 && (
                                        <GLText
                                            title={'+' + pts + ' ' + langManager.curr['statistics']['names'][item]}
                                            style={styles.attr}
                                            color={skill.Stats[item] == 0 ? 'dark' : 'secondary'}
                                        />
                                    )
                                }}
                            />
                        </View>
                    )}
                </View>
            </View>
        )
    }
}
const ww = Dimensions.get('window').width ; 
const wh = Dimensions.get('window').height ;

const styles = StyleSheet.create({
    content: {
        paddingVertical: "5%",
        paddingHorizontal: "8%",
    },
    title: {
        marginTop: "3%",
        marginHorizontal: "4%",
        textAlign: 'left',
        fontSize: ww * 53 / 1000, 

    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },

    row: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    column: {
        width: '50%'
    },

    containerAttr: {
        marginTop: "5%",

        zIndex: -10,
        elevation: -10,

        
    },
    attr: {
        marginLeft: "4%",
        marginBottom: "2%",
        fontSize: ww * 586 / 10000,
        textAlign: 'left',
    }
});

export default Activity;