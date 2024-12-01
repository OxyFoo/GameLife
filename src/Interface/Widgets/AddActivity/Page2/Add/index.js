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
        const { activity, editActivity } = this.props;
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
            <>
                {/* Add later or already done */}
                <Text style={styles.title}>{editActivity === null ? lang['title-add'] : lang['title-edit']}</Text>

                {/* Select start day & start time */}
                <View style={styles.plannerContent}>
                    <Button
                        style={styles.plannerButtonLeft}
                        appearance='outline'
                        fontColor='primary'
                        borderColor='border'
                        onPress={this.setDate}
                    >
                        <Text style={styles.plannerButtonText}>{textStartDate}</Text>
                        <Icon icon='planner-outline' />
                    </Button>

                    <Button
                        style={styles.plannerButtonRight}
                        appearance='outline'
                        fontColor='primary'
                        borderColor='border'
                        onPress={this.setStartTime}
                    >
                        <Text style={styles.plannerButtonText}>{textStartTime}</Text>
                        <Icon icon='clock-outline' />
                    </Button>
                </View>

                {/* Select end time or duration */}
                <View style={styles.starttime}>
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
                {editActivity === null && (
                    <Button style={styles.addActivityButton} onPress={this.onAddActivity} loading={loading}>
                        {lang['button-add']}
                    </Button>
                )}

                {/* Button: Edit activity */}
                {editActivity !== null && this.isEdited() && (
                    <Button style={styles.addActivityButton} onPress={this.onAddActivity} loading={loading}>
                        {lang['button-edit']}
                    </Button>
                )}

                {/* Button: Remove activity */}
                {editActivity !== null && (
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
            </>
        );
    }
}

export { AddActivityPage2Add };
