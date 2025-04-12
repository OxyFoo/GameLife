import * as React from 'react';
import { View } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import BackActivityPage2Add from './back';
import styles from './style';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import { Text, Button, Icon, InputText, Digit } from 'Interface/Components';
import { GetDate } from 'Utils/Time';
import { DateFormat } from 'Utils/Date';
import { MAX_TIME_MINUTES, TIME_STEP_MINUTES } from 'Utils/Activities';

class AddActivityPage2Add extends BackActivityPage2Add {
    render() {
        const lang = langManager.curr['activity'];
        const langDatesNames = langManager.curr['dates']['names'];
        const { nativeRef, activity, baseActivity } = this.props;
        const { loading, selectedHours, selectedMinutes, DTPMode, DTPDate } = this.state;

        const startDate = GetDate(activity.startTime);
        const textStartDate = DateFormat(startDate, 'DD/MM/YYYY');
        const textStartTime = DateFormat(startDate, 'HH:mm');

        const endDate = startDate;
        endDate.setMinutes(startDate.getMinutes() + activity.duration);
        const textEndTime = DateFormat(startDate, 'HH:mm');
        const maxDuration = Math.floor(MAX_TIME_MINUTES / 60);

        const styleBorderColor = {
            borderColor: themeManager.GetColor('border')
        };

        return (
            <View ref={nativeRef} collapsable={false}>
                {/* Add later or already done */}
                <Text style={styles.title}>{baseActivity === null ? lang['title-add'] : lang['title-edit']}</Text>

                <View style={styles.plannerContent}>
                    {/* Select start day */}
                    <View style={styles.plannerButtonLeft}>
                        <View style={styles.hintView}>
                            <View style={styles.hintBar} />
                            <Text style={styles.hintText}>{lang['hint-date']}</Text>
                        </View>
                        <Button appearance='outline' fontColor='primary' borderColor='border' onPress={this.setDate}>
                            <Text style={styles.plannerButtonText}>{textStartDate}</Text>
                            <Icon icon='planner-outline' />
                        </Button>
                    </View>

                    {/* Select start time */}
                    <View style={styles.plannerButtonRight}>
                        <View style={styles.hintView}>
                            <View style={styles.hintBar} />
                            <Text style={styles.hintText}>{lang['hint-start']}</Text>
                        </View>
                        <Button
                            appearance='outline'
                            fontColor='primary'
                            borderColor='border'
                            onPress={this.setStartTime}
                        >
                            <Text style={styles.plannerButtonText}>{textStartTime}</Text>
                            <Icon icon='clock-outline' />
                        </Button>
                    </View>
                </View>

                {/* Select end time or duration */}
                <View style={styles.starttime}>
                    <View style={styles.hintView}>
                        <View style={styles.hintBar} />
                        <Text style={styles.hintText}>{lang['hint-duration']}</Text>
                    </View>

                    {/* Input: End time (by duration) */}
                    <View style={[styles.stButtonLeft, styleBorderColor]}>
                        {/* Icon: Hourglass */}
                        <Icon icon='hourglass-outline' />

                        <View style={styles.stLeftViewParent}>
                            <View style={styles.stViewLeftParent2}>
                                <View style={styles.stDigitView}>
                                    <Digit
                                        style={[styles.stDigit, styleBorderColor]}
                                        maxValue={maxDuration}
                                        velocity={1.25}
                                        value={selectedHours}
                                        onChangeValue={this.setDurationHours}
                                    />
                                    <Text>{langDatesNames['hours-min']}</Text>
                                </View>

                                <View style={styles.stDigitView}>
                                    <Digit
                                        style={[styles.stDigit, styleBorderColor]}
                                        minValue={activity.duration < 60 ? 5 : 0}
                                        maxValue={activity.duration >= maxDuration * 60 ? 0 : 59}
                                        stepValue={5}
                                        velocity={2}
                                        value={selectedMinutes}
                                        onChangeValue={this.setDurationMinutes}
                                    />
                                    <Text>{langDatesNames['minutes-min']}</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Input: End time (by time) */}
                    <View>
                        <View style={styles.hintView}>
                            <View style={styles.hintBar} />
                            <Text style={styles.hintText}>{lang['hint-end']}</Text>
                        </View>
                        <Button
                            style={styles.stButtonRight}
                            styleBackground={styles.stButtonRightBackground}
                            appearance='outline'
                            fontColor='primary'
                            borderColor='border'
                            onPress={this.setDurationByTime}
                        >
                            <Text style={styles.stButtonRightText}>{textEndTime}</Text>
                            <Icon icon='clock-outline' />
                        </Button>
                    </View>
                </View>

                {/* Notifications */}
                {activity.notifyBefore === null ? (
                    <Button
                        style={[styles.notificationsAddButton, styleBorderColor]}
                        styleContent={styles.notificationsAddButtonContent}
                        appearance='uniform'
                        color='transparent'
                        onPress={this.enableNotification}
                    >
                        <Icon icon='bell-outline' />
                        <Text>{lang['notifications-add']}</Text>
                        <Icon icon='add-outline' />
                    </Button>
                ) : (
                    <View style={styles.notifications}>
                        <View style={[styles.notificationsContent, styleBorderColor]}>
                            <Icon icon='bell-outline' />

                            <View style={styles.notificationsDigitView}>
                                <Digit
                                    style={[styles.stDigit, styleBorderColor]}
                                    stepValue={5}
                                    maxValue={60}
                                    velocity={2}
                                    value={activity.notifyBefore}
                                    onChangeValue={this.setNotificationMinutes}
                                />
                                <Text>{lang['notifications-add-text']}</Text>
                            </View>

                            <Button
                                style={styles.notificationRemoveBtn}
                                appearance='uniform'
                                color='transparent'
                                onPress={this.disableNotification}
                            >
                                <Icon icon='trash-outline' color='danger' />
                            </Button>
                        </View>
                    </View>
                )}

                {/* Input: Comment */}
                <InputText
                    style={styles.commentInputText}
                    containerStyle={styles.commentInputTextContainer}
                    label={lang['placeholder-comment']}
                    inactiveColor='border'
                    numberOfLines={4}
                    value={activity?.comment}
                    onChangeText={this.setCommentary}
                    multiline
                />

                {/* Button: Add to planner */}
                {baseActivity === null && (
                    <Button style={styles.addActivityButton} onPress={this.onAddActivity} loading={loading}>
                        {lang['button-add']}
                    </Button>
                )}

                {/* Button: Edit activity */}
                {baseActivity !== null && this.isEdited() && (
                    <Button style={styles.addActivityButton} onPress={this.onAddActivity} loading={loading}>
                        {lang['button-edit']}
                    </Button>
                )}

                {/* Button: Remove activity */}
                {baseActivity !== null && (
                    <Button
                        style={styles.addActivityButton}
                        appearance='outline'
                        onPress={this.onRemoveActivity}
                        loading={loading}
                    >
                        {lang['button-remove']}
                    </Button>
                )}

                {/** Date/Time selection */}
                <DateTimePickerModal
                    date={DTPDate}
                    mode={DTPMode || 'date'}
                    onConfirm={this.onChangeDateTimePicker}
                    onCancel={this.hideDTP}
                    isVisible={DTPMode !== ''}
                    minuteInterval={TIME_STEP_MINUTES}
                    is24Hour={true}
                />
            </View>
        );
    }
}

export { AddActivityPage2Add };
