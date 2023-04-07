import * as React from 'react';
import { View, Dimensions, TouchableOpacity, Animated } from 'react-native';

import styles from './style';
import langManager from '../../../Managers/LangManager';
import dataManager from '../../../Managers/DataManager';
import themeManager from '../../../Managers/ThemeManager';

import { Text, Button, TextSwitch } from '../../Components';
import { ActivitySchedule, ActivityExperience } from '../../Widgets';

/**
 * @typedef {import('./index').default} Activity
 */

const SCREEN_HEIGHT = Dimensions.get('window').height;
const INTER = {
    inputRange: [ 0, 1 ],
    outputRange: [ 0, SCREEN_HEIGHT ]
};

/**
 * @this {Activity}
 * @returns {JSX.Element}
 */
function RenderPanelDetails() {
    const lang = langManager.curr['activity'];
    const skillID = this.state.selectedSkill.id;
    const skill = dataManager.skills.GetByID((skillID));
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
            <Text style={styles.categoriesTitle} bold>
                {lang['title-schedule']}
            </Text>
            <ActivitySchedule
                editable={!this.state.visualisationMode}
                onChange={this.onChangeSchedule}
                onChangeState={this.onChangeStateSchedule}
                initialValue={this.state.ActivitySchedule}
            />

            {/* Experience */}
            <Text style={styles.categoriesTitle} bold>
                {experienceText}
            </Text>
            <ActivityExperience
                skillID={this.state.selectedSkill.id}
                duration={this.state.activityDuration}
            />

            {/* Commentary */}
            {this.state.comment === '' ? (
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
                    <Text style={styles.categoriesTitle} bold>
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
                            {this.state.comment}
                        </Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Add / Remove button */}
            {this.state.visualisationMode ? (
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

function ButtonStartActivity() {
    const lang = langManager.curr['activity'];

    return (
        <Button onPress={this.StartActivity} color='main2'>
            {lang['btn-start']}
        </Button>
    );
}

/**
 * @this {Activity}
 * @returns {JSX.Element}
 */
function RenderPanel() {
    const lang = langManager.curr['activity'];
    const panelPosY = this.state.animPosY.interpolate(INTER);
    const stylePanel = {
        minHeight: SCREEN_HEIGHT - this.state.posY - 12,
        transform: [{ translateY: panelPosY }],
        backgroundColor: themeManager.GetColor('backgroundGrey')
    };

    return (
        <Animated.View
            style={[ styles.panel, stylePanel ]}
            onLayout={this.onLayoutPanel}
        >
            {!this.state.visualisationMode &&
                <TextSwitch
                    style={styles.panelTextSwitch}
                    texts={[ lang['swiper-already'], lang['swiper-now'] ]}
                    onChange={this.onChangeMode}
                />
            }

            {
                this.state.startnowMode ?
                ButtonStartActivity.call(this) :
                RenderPanelDetails.call(this)
            }
        </Animated.View>
    );
}

export default RenderPanel;