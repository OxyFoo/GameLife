import * as React from 'react';
import { View, Animated, TouchableOpacity } from 'react-native';

import styles from './style';
import ActivityPanelBack from './back';
import langManager from 'Managers/LangManager';
import dataManager from 'Managers/DataManager';
import themeManager from 'Managers/ThemeManager';

import { StartActivity } from './utils';
import { Text, Button, TextSwitch, Icon } from 'Interface/Components';
import { ActivitySchedule, ActivityExperience, PanelScreen } from 'Interface/Widgets';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').Animated.AnimatedProps<ViewStyle>} AnimatedViewProp
 */

class ActivityPanel extends ActivityPanelBack {
    RenderPanelDetails() {
        const lang = langManager.curr['activity'];
        const { variantTheme } = this.props;
        const { activity, startMode, selectedSkillID, mode } = this.state;

        const skill = dataManager.skills.GetByID(selectedSkillID);

        let experienceText = lang['title-no-experience'];
        if (skill !== null && skill.XP > 0) {
            experienceText = lang['title-experience'];
        }

        const viewOpacity = {
            transform: [{
                translateY: this.state.animButtonNow.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 96]
                })
            }],
            opacity: this.state.animButtonNow.interpolate({
                inputRange: [0, 1],
                outputRange: [1, .2]
            })
        };
        const backgroundCard = {
            backgroundColor: themeManager.GetColor(
                !variantTheme ? 'backgroundCard' : 'backgroundGrey'
            )
        };
        const pointerEvents = startMode === 'schedule' ? 'auto' : 'none';

        return (
            <Animated.View style={viewOpacity} pointerEvents={pointerEvents}>
                {/* Schedule */}
                <Text style={styles.tempTitle} bold>
                    {lang['title-schedule']}
                </Text>
                <ActivitySchedule
                    editable={mode === 'skill'}
                    selectedDate={activity?.startTime ?? 0}
                    selectedDuration={activity?.duration ?? 60}
                    onChange={this.onChangeSchedule}
                    onChangeState={this.onChangeStateSchedule}
                />

                {/* Experience */}
                <Text style={styles.tempTitle} bold>
                    {experienceText}
                </Text>
                <ActivityExperience
                    skillID={selectedSkillID}
                    duration={activity?.duration ?? 0}
                />

                {/* Commentary */}
                {!activity?.comment ? (
                    <Button
                        style={styles.commentButtonAdd}
                        onPress={this.onEditComment}
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
                                {activity.comment}
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Add / Remove button */}
                {mode === 'activity' ? (
                    <Button onPress={this.onRemoveActivity} color='main2'>
                        {lang['btn-remove']}
                    </Button>
                ) : (
                    <Button onPress={this.onAddActivity} color='main2'>
                        {lang['btn-add']}
                    </Button>
                )}
            </Animated.View>
        );
    }

    RenderStartActivity() {
        const lang = langManager.curr['activity'];
        /** @type {AnimatedViewProp} */
        const btnOpacity = {
            opacity: this.state.animButtonNow
        };

        return (
            <Button
                style={styles.buttonNow}
                styleAnimation={btnOpacity}
                onPress={StartActivity.bind(this)}
                color='main2'
            >
                {lang['btn-start']}
            </Button>
        );
    }

    render() {
        const lang = langManager.curr['activity'];
        const { style, topOffset, variantTheme } = this.props;
        const { loaded, activityText, mode } = this.state;

        if (!loaded) {
            return null;
        }

        const stylePanel = {
            backgroundColor: themeManager.GetColor(
                !variantTheme ? 'backgroundGrey' : 'backgroundCard'
            )
        };

        return (
            <PanelScreen
                ref={ref => this.refPanelScreen = ref}
                containerStyle={[styles.panel, stylePanel, style]}
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
                {mode === 'activity' ? null : (
                    <TextSwitch
                        style={styles.panelTextSwitch}
                        texts={[ lang['swiper-already'], lang['swiper-now'] ]}
                        onChange={this.onChangeMode}
                    />
                )}

                <View>
                    {this.RenderStartActivity.call(this)}
                    {this.RenderPanelDetails.call(this)}
                </View>
            </PanelScreen>
        );
    }
}

export default ActivityPanel;