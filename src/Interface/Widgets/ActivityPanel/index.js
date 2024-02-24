import * as React from 'react';
import { View, Animated, TouchableOpacity } from 'react-native';

import styles from './style';
import ActivityPanelBack from './back';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';
import dataManager from 'Managers/DataManager';
import themeManager from 'Managers/ThemeManager';

import Text from 'Interface/Components/Text';
import Icon from 'Interface/Components/Icon';
import Button from 'Interface/Components/Button';
import TextSwitch from 'Interface/Components/TextSwitch';
import PanelScreen from 'Interface/Widgets/PanelScreen';
import ActivitySchedule from 'Interface/Widgets/ActivitySchedule';
import ActivityExperience from 'Interface/Widgets/ActivityExperience';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').Animated.AnimatedProps<ViewStyle>} AnimatedViewProp
 */

class ActivityPanel extends ActivityPanelBack {
    render() {
        const lang = langManager.curr['activity'];
        const { style, topOffset, variantTheme } = this.props;
        const { activityText, mode } = this.state;
        const { selectedPage } = user.interface.state;

        const stylePanel = {
            backgroundColor: themeManager.GetColor(
                !variantTheme ? 'backgroundGrey' : 'backgroundCard'
            )
        };
        const styleTitle = {
            borderColor: themeManager.GetColor('main1')
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

                    <Button
                        onPress={this.onOpenSkill}
                        style={[styleTitle, styles.buttonViewContainer]}
                    >
                        <View
                            style={styles.buttonView}
                        >
                            <Text style={styles.panelTitle} bold>
                                {activityText}
                            </Text>
                            {selectedPage !== 'skill' && (
                                <Text style={styles.subPanelTitle}>
                                    {lang['title-click-me']}
                                </Text>
                            )}
                        </View>
                    </Button>

                    <Icon
                        containerStyle={[styles.panelTitleIcon]}
                        size={42}
                        icon='arrowLeft'
                        angle={-90}
                        onPress={this.Close}
                    />
                </View>

                {/* Start mode - Already / Now */}
                <View ref={ref => this.refHelp1 = ref}>
                    {mode === 'activity' ? null : (
                        <TextSwitch
                            style={styles.panelTextSwitch}
                            texts={[lang['swiper-already'], lang['swiper-now']]}
                            onChange={this.onChangeMode}
                        />
                    )}
                </View>

                <View>
                    {this.renderStartActivity.call(this)}
                    {this.renderPanelDetails.call(this)}
                </View>
            </PanelScreen>
        );
    }

    renderPanelDetails() {
        const lang = langManager.curr['activity'];
        const { variantTheme } = this.props;
        const { activity, startMode, mode } = this.state;

        const maxDuration = activity?.skillID === 168 ? 12 : 4;
        const pointerEvents = startMode === 'schedule' ? 'auto' : 'none';

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

        return (
            <Animated.View style={viewOpacity} pointerEvents={pointerEvents}>
                {/* Schedule */}
                <Text style={styles.tempTitle} bold>
                    {lang['title-schedule']}
                </Text>

                <ActivitySchedule
                    ref={this.refActivitySchedule}
                    editable={mode === 'skill'}
                    selectedDate={activity?.startTime ?? 0}
                    selectedDuration={activity?.duration ?? 60}
                    maxDuration={maxDuration}
                    onChange={this.onChangeSchedule}
                    onChangeState={this.onChangeStateSchedule}
                />

                {/* Experience */}
                <View ref={ref => this.refHelp3 = ref}>
                    {this.renderExperienceText.call(this)}
                </View>

                {/* Friends */}
                {this.renderFriends.call(this)}

                {/* Commentary */}
                {!activity?.comment ? (
                    <Button
                        ref={ref => this.refHelp4 = ref}
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
                    <Button onPress={this.onRemoveActivity} color='danger'>
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

    renderStartActivity() {
        const lang = langManager.curr['activity'];
        /** @type {AnimatedViewProp} */
        const btnOpacity = {
            opacity: this.state.animButtonNow
        };

        return (
            <Button
                style={styles.buttonNow}
                styleAnimation={btnOpacity}
                onPress={this.onStartNow}
                color='main2'
            >
                {lang['btn-start']}
            </Button>
        );
    }

    renderExperienceText() {
        const lang = langManager.curr['activity'];
        const { activity, selectedSkillID, mode } = this.state;

        let noXpText = '';
        const skill = dataManager.skills.GetByID(selectedSkillID);
        if (skill === null) return null;

        if (mode === 'activity') {
            const experienceStatus = user.activities.GetExperienceStatus(activity);
            if (experienceStatus === 'beforeLimit') {
                noXpText = lang['title-before-limit'];
            } else if (experienceStatus === 'isNotPast') {
                noXpText = lang['title-not-past'];
            }
        }

        if (skill.XP <= 0) {
            noXpText = lang['title-no-experience'];
        }

        if (noXpText !== '') {
            return (
                <Text style={styles.tempTitleNoXP} bold>
                    {noXpText}
                </Text>
            );
        }

        return (
            <>
                <Text style={styles.tempTitle} bold>
                    {lang['title-experience']}
                </Text>
                <ActivityExperience
                    style={styles.experience}
                    skillID={selectedSkillID}
                    duration={activity?.duration ?? 0}
                    bonus={user.experience.GetExperienceFriendBonus(activity)}
                />
            </>
        );
    }

    renderFriends() {
        const lang = langManager.curr['activity'];
        const { activity } = this.state;
        if (activity === null) {
            return null;
        }

        const { friends } = activity;

        if (friends.length === 0) {
            return null;
        }

        const friendsText = friends
            .map(friendID => user.multiplayer.GetFriendByID(friendID))
            .filter(friend => friend !== null)
            .map(friend => friend.username)
            .join(', ');

        const bonus = user.experience.GetExperienceFriendBonus(activity);
        const bonusText = `+${bonus * 100}%`;

        const styleBackground = {
            backgroundColor: themeManager.GetColor('background')
        };

        return (
            <View style={[styles.container, styleBackground]}>
                <Text style={styles.bonus} fontSize={12}>{bonusText}</Text>
                <Text style={styles.title}>{lang['title-friends']}</Text>
                <Text color={'primary'} fontSize={16}>{friendsText}</Text>
            </View>
        );
    }
}

export default ActivityPanel;
