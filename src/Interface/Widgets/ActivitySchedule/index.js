import * as React from 'react';
import { View, Animated } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import styles from './style';
import ActivityScheduleBack from './back';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import { TIME_STEP_MINUTES } from 'Utils/Activities';
import { Text, Button, Separator, Digit } from 'Interface/Components';
import { GetDate, TimeToFormatString } from 'Utils/Time';
import { DateToFormatString, DateToFormatTimeString } from 'Utils/Date';

class ActivitySchedule extends ActivityScheduleBack {
    renderPanel() {
        const { selectedDuration, maxDuration } = this.props;
        const { x, y, width, height } = this.state.parent;
        const animValue = this.state.anim.interpolate({ inputRange: [0, 1], outputRange: [y+height-20, y+height] });
        const overlayPos = [styles.overlay, {
            width: width,
            opacity: this.state.anim,
            transform: [{ translateX: x }, { translateY: animValue }],
            backgroundColor: themeManager.GetColor('backgroundGrey')
        }];

        const lang = langManager.curr['other'];
        const langDatesNames = langManager.curr['dates']['names'];
        const selectedDate = GetDate(this.props.selectedDate);
        const textDate = DateToFormatString(selectedDate);
        const textTime = DateToFormatTimeString(selectedDate);

        return (
            <>
                <Animated.View style={overlayPos} pointerEvents={this.state.selectionMode ? 'auto': 'none'}>
                    {/* Change date */}
                    <View style={styles.panelRow}>
                        <Text fontSize={14}>{textDate}</Text>
                        <Button
                            style={styles.panelButton}
                            onPress={() => { this.showDTP('date'); }}
                            fontSize={14}
                            color='main1'
                        >
                            {lang['widget-button-editTime']}
                        </Button>
                    </View>

                    {/* Change start time */}
                    <View style={styles.panelRow}>
                        <Text fontSize={14}>{textTime}</Text>
                        <Button
                            style={styles.panelButton}
                            onPress={() => { this.showDTP('time'); }}
                            fontSize={14}
                            color='main1'
                        >
                            {lang['widget-button-editTime']}
                        </Button>
                    </View>

                    {/* Change duration */}
                    <View style={styles.panelRow}>
                        <Text style={{ paddingRight: 24 }} fontSize={14}>
                            {lang['widget-duration']}
                        </Text>

                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Digit
                                ref={this.refDigitHour}
                                name='duration_hour'
                                containerStyle={{
                                    marginRight: 6,
                                    borderRadius: 4,
                                    borderColor: themeManager.GetColor('main1', { opacity: 0.5 })
                                }}
                                minDigitWidth={12}
                                fadeColor='backgroundGrey'
                                initValue={1}
                                maxValue={maxDuration}
                                velocity={.75}
                                callback={this.onChangeDurationDigit}
                            />
                            <Text>{langDatesNames['hours-min']}</Text>
                            <Digit
                                ref={this.refDigitMinute}
                                name='duration_minute'
                                containerStyle={{
                                    marginHorizontal: 6,
                                    borderRadius: 4,
                                    borderColor: themeManager.GetColor('main1', { opacity: 0.5 })
                                }}
                                fadeColor='backgroundGrey'
                                minValue={selectedDuration < 60 ? 5 : 0}
                                maxValue={selectedDuration >= maxDuration * 60 ? 0 : 59}
                                stepValue={5}
                                velocity={2}
                                callback={this.onChangeDurationDigit}
                            />
                            <Text>{langDatesNames['minutes-min']}</Text>
                        </View>
                    </View>
                </Animated.View>

                {/** Date/Time selection */}
                <DateTimePickerModal
                    date={selectedDate}
                    mode={this.state.DTPMode || 'date'}
                    onConfirm={this.onChangeDateTimePicker}
                    onCancel={this.hideDTP}
                    isVisible={this.state.DTPMode !== ''}
                    minuteInterval={TIME_STEP_MINUTES}
                    is24Hour={true}
                />
            </>
        );
    }

    render() {
        const DATES = langManager.curr['dates']['names'];
        const DAYS = langManager.curr['dates']['days'];

        const selectedDate = GetDate(this.props.selectedDate);
        const selectedDuration = TimeToFormatString(this.props.selectedDuration * 60);
        const currDay = DAYS[selectedDate.getDay()];
        const textDate = DateToFormatString(selectedDate);
        const textTime = DateToFormatTimeString(selectedDate);

        return (
            <>
                <Button
                    style={styles.button}
                    icon='chrono'
                    color={this.props.mainColor}
                    onLayout={this.onLayout}
                    onPress={this.changeSelectionMode}
                    onLongPress={this.resetSelectionMode}
                >
                    <View style={{ marginRight: 8 }}>
                        <View style={styles.row}>
                            <Text style={styles.title}>
                                {DATES['date'] + ': '}
                            </Text>
                            <Text style={styles.text}>
                                {currDay + ' - ' + textDate}
                            </Text>
                        </View>
                        <Separator.Horizontal style={{ marginVertical: 4 }} />
                        <View style={styles.row}>
                            <View style={styles.row}>
                                <Text style={styles.title}>
                                    {DATES['start-time'] + ': '}
                                </Text>
                                <Text style={styles.text}>
                                    {textTime}
                                </Text>
                            </View>
                            <Separator.Vertical style={{ height: '100%', marginHorizontal: 8 }} />
                            <View style={styles.row}>
                                <Text style={styles.title}>
                                    {DATES['duration'] + ': '}
                                </Text>
                                <Text style={styles.text}>
                                    {selectedDuration}
                                </Text>
                            </View>
                        </View>
                    </View>
                </Button>
                {this.state.selectionMode && <View style={styles.overlayBackground} onTouchStart={this.changeSelectionMode} />}
                {this.renderPanel()}
            </>
        );
    }
}

export default ActivitySchedule;
