import * as React from 'react';
import { View, TouchableOpacity, Animated, Dimensions } from 'react-native';

import styles from './style';
import ActivityPanelBack from './activityPanelBack';
import langManager from '../../../../Managers/LangManager';
import dataManager from '../../../../Managers/DataManager';
import themeManager from '../../../../Managers/ThemeManager';

import { Text, Button, TextSwitch, Icon } from '../../../Components';
import { ActivitySchedule, ActivityExperience } from '../../../Widgets';

/**
 * @typedef {import('../index').default} Activity
 */

const SCREEN_HEIGHT = Dimensions.get('window').height;

class ActivityPanel extends ActivityPanelBack {
    RenderPanelDetails() {
        const lang = langManager.curr['activity'];
        const { selectedSkill, activityDuration, comment } = this.state;

        const skill = dataManager.skills.GetByID(selectedSkill.id);

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
                    onChange={this.onChangeSchedule}
                    onChangeState={this.onChangeStateSchedule}
                    initialValue={this.initialSchedule}
                />
    
                {/* Experience */}
                <Text style={styles.tempTitle} bold>
                    {experienceText}
                </Text>
                <ActivityExperience
                    skillID={selectedSkill.id}
                    duration={activityDuration}
                />
    
                {/* Commentary */}
                {comment === '' ? (
                    <Button
                        style={styles.commentButtonAdd}
                        onPress={this.onAddComment}
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
                            onPress={this.onEditComment}
                            onLongPress={this.onRemComment}
                        >
                            <Text style={styles.commentText}>
                                {comment}
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
    
                {/* Add / Remove button */}
                {this.editMode ? (
                    <Button onPress={this.RemActivity} color='main2'>
                        {lang['btn-remove']}
                    </Button>
                ) : (
                    <Button onPress={this.AddActivity} color='main2'>
                        {lang['btn-add']}
                    </Button>
                )}
            </View>
        );
    }
    
    renderStartActivity() {
        const lang = langManager.curr['activity'];
    
        return (
            <Button onPress={this.StartActivity} color='main2'>
                {lang['btn-start']}
            </Button>
        );
    }

    render() {
        const lang = langManager.curr['activity'];
        const { topOffset } = this.props;
        const { animPosY, posY, activityText, startMode } = this.state;
    
        const interpolation = {
            inputRange: [ 0, 1 ],
            outputRange: [ SCREEN_HEIGHT, topOffset - 6 ]
        };
        const panelPosY = animPosY.interpolate(interpolation);
        const stylePanel = {
            minHeight: SCREEN_HEIGHT - posY - 12,
            transform: [{ translateY: panelPosY }],
            backgroundColor: themeManager.GetColor('backgroundGrey')
        };

        const { selectedSkill } = this.state;
        const styleCloseButton = {
            opacity: selectedSkill.id === 0 ? 0 : 1
        };

        return (
            <Animated.View
                style={[ styles.panel, stylePanel ]}
                onLayout={this.onLayout}
                pointerEvents={this.state.selectedSkill.id === 0 ? 'none' : 'auto'}
            >
                {/* Title */}
                <Text style={styles.panelTitle} bold>
                    {activityText}
                </Text>

                {/* TODO: NEW TITLE */}
                <View style={styles.activitiesTitleView}>
                    <Text style={styles.activitiesTitle} bold>
                        {lang['title-activity']}
                    </Text>
                    <Icon
                        containerStyle={[styles.activitiesTitleIcon, styleCloseButton]}
                        size={42}
                        icon='arrowLeft'
                        angle={-90}
                        onPress={this.Close}
                    />
                </View>

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
            </Animated.View>
        );
    }
}

export default ActivityPanel;