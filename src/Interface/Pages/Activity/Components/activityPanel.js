import * as React from 'react';
import { View, TouchableOpacity } from 'react-native';

import styles from './style';
import ActivityPanelBack from './activityPanelBack';
import langManager from '../../../../Managers/LangManager';
import dataManager from '../../../../Managers/DataManager';
import themeManager from '../../../../Managers/ThemeManager';

import {
    onAddComment, onEditComment, onRemComment,
    StartActivity, AddActivity, RemActivity
} from './activityUtils';
import { Text, Button, TextSwitch, Icon } from '../../../Components';
import { ActivitySchedule, ActivityExperience, PanelScreen } from '../../../Widgets';

class ActivityPanel extends ActivityPanelBack {
    RenderPanelDetails() {
        const lang = langManager.curr['activity'];
        const { activityStart, activityDuration, comment } = this.state;

        const skillID = this.state.selectedSkill.id;
        const skill = dataManager.skills.GetByID(skillID);

        let experienceText = lang['title-no-experience'];
        if (skill !== null && skill.XP > 0) {
            experienceText = lang['title-experience'];
        }
    
        const backgroundCard = {
            backgroundColor: themeManager.GetColor('backgroundCard')
        };
    
        return (
            <View>
                {/* Schedule */}
                <Text style={styles.tempTitle} bold>
                    {lang['title-schedule']}
                </Text>
                <ActivitySchedule
                    editable={!this.editMode}
                    selectedDate={activityStart}
                    selectedDuration={activityDuration}
                    onChange={this.onChangeSchedule}
                    onChangeState={this.onChangeStateSchedule}
                />
    
                {/* Experience */}
                <Text style={styles.tempTitle} bold>
                    {experienceText}
                </Text>
                <ActivityExperience
                    skillID={skillID}
                    duration={activityDuration}
                />
    
                {/* Commentary */}
                {comment === '' ? (
                    <Button
                        style={styles.commentButtonAdd}
                        onPress={onAddComment.bind(this)}
                        color='main1'
                        fontSize={14}
                    >
                        {lang['add-commentary']}
                    </Button>
                ) : (
                    <View style={styles.commentView}>
                        {/* Comment title */}
                        <Text style={styles.tempTitle} bold>
                            {lang['title-commentary']}
                        </Text>
    
                        {/* Comment content */}
                        <TouchableOpacity
                            style={[styles.commentPanel, backgroundCard]}
                            activeOpacity={.6}
                            onPress={onEditComment.bind(this)}
                            onLongPress={onRemComment.bind(this)}
                        >
                            <Text style={styles.commentText}>
                                {comment}
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
    
                {/* Add / Remove button */}
                {this.editMode ? (
                    <Button onPress={RemActivity.bind(this)} color='main2'>
                        {lang['btn-remove']}
                    </Button>
                ) : (
                    <Button onPress={AddActivity.bind(this)} color='main2'>
                        {lang['btn-add']}
                    </Button>
                )}
            </View>
        );
    }
    
    renderStartActivity() {
        const lang = langManager.curr['activity'];
    
        return (
            <Button onPress={StartActivity.bind(this)} color='main2'>
                {lang['btn-start']}
            </Button>
        );
    }

    render() {
        const lang = langManager.curr['activity'];
        const { topOffset } = this.props;
        const { activityText, startMode } = this.state;

        const stylePanel = {
            backgroundColor: themeManager.GetColor('backgroundGrey')
        };

        return (
            <PanelScreen
                ref={ref => this.refPanelScreen = ref}
                containerStyle={[styles.panel, stylePanel]}
                topOffset={topOffset}
                onClose={this.Close}
                disableBackground
            >
                {/* Title */}
                <View style={styles.panelTitleView}>
                    <Text style={styles.panelTitle} bold>
                        {activityText}
                    </Text>
                    <Icon
                        containerStyle={[styles.panelTitleIcon]}
                        size={42}
                        icon='arrowLeft'
                        angle={-90}
                        onPress={this.Close}
                    />
                </View>

                {/* Start mode - Already / Now */}
                {!this.editMode &&
                    <TextSwitch
                        style={styles.panelTextSwitch}
                        texts={[ lang['swiper-already'], lang['swiper-now'] ]}
                        onChange={this.onChangeMode}
                    />
                }

                {
                    startMode === 'schedule' ?
                    this.RenderPanelDetails.call(this) :
                    this.renderStartActivity.call(this)
                }
            </PanelScreen>
        );
    }
}

export default ActivityPanel;