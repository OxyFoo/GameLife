import * as React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';

import user from '../Managers/UserManager';
import langManager from '../Managers/LangManager';
import { getDates, getDurations, isUndefined } from '../Functions/Functions';
import { GLDropDown, GLHeader, GLText } from '../Components/GL-Components';

const STATS = [ "sag", "int", "con", "for", "end", "agi", "dex" ];

class Activity extends React.Component {
    constructor(props) {
        super(props);

        this.SELECTED = typeof(props.args['activity']) !== 'undefined';

        if (this.SELECTED) {
            const activity = props.args['activity'];
            const skillID = activity.skillID;
            const skill = user.getSkillByID(skillID);

            const date = new Date(activity.startDate);
            const dateTxt = date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes();
            const timeTxt = parseInt(activity.duration/60) + ':' + parseInt(activity.duration%60);
            const duration = activity.duration;

            this.CATEGORIES = [];
            this.DATES = [{ key: 0, value: dateTxt, fulldate: date }];
            this.DURATION = [{ key: 0, value: timeTxt, duration: duration }];

            const category = { key: 0, value: skill.Category };

            this.state = {
                skills: [],

                selectedCategory: category,
                selectedActivity: activity,
                selectedDateKey: 0,
                selectedTimeKey: 0
            }
        } else {
            const MAX_DAYS = 2;
            const STEP_MINUTES = 15;
            const TOTAL_HOUR_DURATION = 2;
            const SKILLS = user.getSkills();

            this.CATEGORIES = user.getSkillCategories();
            this.DATES = getDates(MAX_DAYS, STEP_MINUTES);
            this.DURATION = getDurations(TOTAL_HOUR_DURATION, STEP_MINUTES);
            this.state = {
                skills: SKILLS,
        
                selectedCategory: undefined,
                selectedActivity: undefined,
                selectedDateKey: 0,
                selectedTimeKey: 3
            }
        }
    }

    back = () => { user.backPage(); }
    valid = () => {
        if (typeof(this.state.selectedActivity) === 'undefined') {
            console.warn("Il faut remplir les champs");
        } else {
            const skillID = this.state.selectedActivity.skillID;
            const date = this.DATES[this.state.selectedDateKey].fulldate;
            const duration = this.DURATION[this.state.selectedTimeKey].duration;
            if (!user.addActivity(skillID, date, duration)) {
                console.warn("L'activité commence ou termine durant une autre !");
                return;
            }
            this.back();
        }
    };
    trash = () => {
        const remove = (button) => {
            if (button === 'yes') {
                user.remActivity(this.state.selectedActivity);
                this.back();
            }
        }
        const title = langManager.curr['calendar']['popup-remove-title'];
        const text = langManager.curr['calendar']['popup-remove-message'];
        user.openPopup('yesno', [ title, text ], remove);
    }

    changeCat = (categoryIndex) => {
        if (typeof(categoryIndex) !== 'number') {
            this.setState({
                skills: user.getSkills(),
                selectedCategory: undefined,
                selectedActivity: undefined
            });
            return;
        }
        const category = this.CATEGORIES[categoryIndex];
        this.setState({
            skills: user.getSkills(category.value),
            selectedCategory: category,
            selectedActivity: undefined
        });
    }
    changeSkill = (skillID) => {
        const activity = { skillID: skillID };
        const skill = user.getSkillByID(skillID);

        // Get category ID
        let category;
        for (let i = 0; i < this.CATEGORIES.length; i++) {
            const cat = this.CATEGORIES[i];
            if (cat.value === skill.Category) {
                category = cat;
                break;
            }
        }

        this.setState({
            selectedActivity: activity,
            selectedCategory: category,
            skills: user.getSkills(category.value)
        });
    }
    changeDate = (key) => {
        this.setState({ selectedDateKey: key });
    }
    changeDuration = (key) => {
        this.setState({ selectedTimeKey: key });
    }

    render() {
        const title_category = !isUndefined(this.state.selectedCategory) ? this.state.selectedCategory.value : langManager.curr['activity']['input-category-default'];
        const title_skill = !isUndefined(this.state.selectedActivity) ? user.getSkillByID(this.state.selectedActivity.skillID).Name : langManager.curr['activity']['input-activity-default'];

        const rightIcon = this.SELECTED ? 'trash' : 'check';
        const rightEvent = this.SELECTED ? this.trash : this.valid;

        let skill, totalXP;
        if (!isUndefined(this.state.selectedActivity)) {
            const skillID = this.state.selectedActivity.skillID;
            const durationHour = (this.DURATION[this.state.selectedTimeKey].duration / 60);
            skill = user.getSkillByID(skillID);
            totalXP = user.experience.getXPperHour() * durationHour;
        }

        return (
            <View style={{flex: 1}}>
                {/* Header */}
                <GLHeader
                    title={langManager.curr['activity']['page-title']}
                    leftIcon='back'
                    onPressLeft={this.back}
                    rightIcon={rightIcon}
                    onPressRight={rightEvent}
                />

                {/* Content */}
                <View style={styles.content}>
                    {/* Category */}
                    <GLText style={styles.title} title={langManager.curr['activity']['input-category'].toUpperCase()} />
                    <GLDropDown
                        value={title_category}
                        data={this.CATEGORIES}
                        onSelect={this.changeCat}
                        disabled={this.SELECTED}
                        onLongPress={() => this.changeCat('')}
                    />

                    {/* Activity */}
                    <GLText style={styles.title} title={langManager.curr['activity']['input-activity'].toUpperCase()} />
                    <GLDropDown
                        value={title_skill}
                        data={this.state.skills}
                        onSelect={this.changeSkill}
                        disabled={this.SELECTED}
                    />

                    {/* Start / duration */}
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
                    </View>

                    {!isUndefined(skill) && (
                        <View style={styles.containerAttr}>
                            <GLText title={'+' + totalXP + ' ' + langManager.curr['statistics']['xp']['small']} style={styles.attr} color='grey' />
                            <FlatList
                                data={STATS}
                                keyExtractor={(item, i) => 'skill_stat_' + i}
                                renderItem={({item}) => (
                                    <GLText
                                        title={'+' + (skill.Stats[item] * (this.DURATION[this.state.selectedTimeKey].duration / 60)) + ' ' + langManager.curr['statistics']['names'][item]}
                                        style={styles.attr}
                                        color={skill.Stats[item] == 0 ? 'darkgrey' : 'grey'}
                                    />
                                )}
                            />
                        </View>
                    )}
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    content: {
        paddingVertical: 48,
        paddingHorizontal: 36
    },
    title: {
        marginTop: 12,
        marginHorizontal: 12,
        textAlign: 'left',
        fontSize: 20
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
        marginTop: 12,

        zIndex: -10,
        elevation: -10
    },
    attr: {
        marginLeft: 12,
        marginBottom: 6,
        fontSize: 22,
        textAlign: 'left'
    }
});

export default Activity;