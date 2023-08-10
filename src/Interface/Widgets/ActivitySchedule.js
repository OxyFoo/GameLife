import * as React from 'react';
import { View, Animated, FlatList, StyleSheet } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import { GetDate, GetDurations, GetTime, GetTimeZone } from 'Utils/Time';
import { DateToFormatString, DateToFormatTimeString } from 'Utils/Date';
import { Text, Button, Separator } from 'Interface/Components';
import { SpringAnimation } from 'Utils/Animations';

/**
 * @typedef {import('react-native').LayoutChangeEvent} LayoutChangeEvent
 * 
 * @typedef {import('Managers/ThemeManager').ColorTheme} ColorTheme
 */

const DAY_SECONDS = 86400;
const DURATION = GetDurations();
const STARTDATE = new Date();
STARTDATE.setMinutes(Math.floor(STARTDATE.getMinutes() / 15) * 15, 0, 0);

const ActivityScheduleProps = {
    /** @type {ColorTheme} */
    mainColor: 'main1',

    /** @type {boolean} If false, disable user edition */
    editable: true,

    /** @type {number} Unix timestamp */
    selectedDate: GetTime(),

    /** @type {number} Duration in minutes */
    selectedDuration: 60,

    /**
     * @param {number} startTime Unix timestamp of the start of the activity
     * @param {number} durationTime Duration of the activity in minutes
     */
    onChange: (startTime, durationTime) => {},

    /**
     * Called when component is opened or closed
     * @param {boolean} opened 
     */
    onChangeState: (opened) => {}
}

class ActivitySchedule extends React.Component {
    state = {
        /** @type {Animated.Value} */
        anim: new Animated.Value(0),

        /** @type {boolean} Open or closed */
        selectionMode: false,

        /** @type {LayoutChangeEvent['nativeEvent']['layout']} */
        parent: { width: 0, height: 0, x: 0, y: 0 },

        /** @type {''|'date'|'time'|'datetime'} */
        DTPMode: ''
    }

    componentDidMount() {
        this.resetSelectionMode(true); // TODO: Need ?
    }

    /** @param {LayoutChangeEvent} ev */
    onLayout = (ev) => this.setState({ parent: ev.nativeEvent.layout });

    changeSelectionMode = () => {
        const newMode = !this.state.selectionMode;

        // If panel is already open, or it's closed and editable
        if (!newMode || this.props.editable) {
            const callback = () => this.props.onChangeState(newMode);
            SpringAnimation(this.state.anim, newMode ? 1 : 0).start();
            this.setState({ selectionMode: newMode }, callback);
        }
    }

    resetSelectionMode = (init = false) => {
        if (this.props.editable || init === true) {
            const today = GetTime();
            const startTime = today - (today % (15 * 60));
            const duration = 60;
            this.props.onChange(startTime, duration);
        }
    }

    /** @param {'date'|'time'} mode */
    showDTP = (mode) => this.setState({ DTPMode: mode });
    hideDTP = () => this.setState({ DTPMode: '' });
    selectDuration = (key) => {
        this.props.onChange(this.props.selectedDate, DURATION[key].duration);
    }

    /** @param {Date} date UTC date */
    onChangeDateTimePicker = (date) => {
        const { DTPMode } = this.state;
        this.hideDTP();

        const pickedTime = GetTime(date, 'global');
        let newStartTime = this.props.selectedDate;

        // New date, keep time
        if (DTPMode == 'date') {
            const pickedTimeLocal = pickedTime - GetTimeZone() * 3600;
            const date = pickedTimeLocal - (pickedTimeLocal % DAY_SECONDS);
            const time = newStartTime % DAY_SECONDS;
            newStartTime = date + time;
        }

        // New time, keep date
        else if (DTPMode == 'time') {
            const date = newStartTime - (newStartTime % DAY_SECONDS);
            const time = pickedTime % DAY_SECONDS;
            newStartTime = date + time - GetTimeZone() * 3600;
        }

        this.props.onChange(newStartTime, this.props.selectedDuration);
    }

    renderPanel() {
        const  { x, y, width, height } = this.state.parent;
        const animValue = this.state.anim.interpolate({ inputRange: [0, 1], outputRange: [y+height-20, y+height] });
        const overlayPos = [styles.overlay, {
            width: width,
            opacity: this.state.anim,
            transform: [{ translateX: x }, { translateY: animValue }],
            backgroundColor: themeManager.GetColor('backgroundGrey')
        }];
        const lang = langManager.curr['other'];
        const selectedDate = GetDate(this.props.selectedDate);
        const textDate = DateToFormatString(selectedDate);
        const textTime = DateToFormatTimeString(selectedDate);

        const durationFinder = d => d.duration === this.props.selectedDuration;
        const textDuration = DURATION.find(durationFinder).value;

        const mainColor = themeManager.GetColor('main1');

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
                            {textDuration}
                        </Text>
                        <FlatList
                            data={DURATION}
                            renderItem={({ item }) => (
                                <Text
                                    style={[styles.textBtn, { backgroundColor: mainColor }]}
                                    onPress={() => { this.selectDuration(item.key) }}
                                >
                                    {item.value}
                                </Text>
                            )}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                        />
                    </View>
                </Animated.View>


                <DateTimePickerModal
                    date={selectedDate}
                    mode={this.state.DTPMode || 'date'}
                    onConfirm={this.onChangeDateTimePicker}
                    onCancel={this.hideDTP}
                    isVisible={this.state.DTPMode !== ''}
                    minuteInterval={15}
                    is24Hour={true}
                />
            </>
        );
    }

    render() {
        const DATES = langManager.curr['dates']['names'];
        const DAYS = langManager.curr['dates']['days'];
        const selectedDate = GetDate(this.props.selectedDate);
        const currDay = DAYS[selectedDate.getDay()];
        const text = currDay + ' - ' + DateToFormatString(selectedDate);
        const textTime = DateToFormatTimeString(selectedDate);

        const durationFinder = d => d.duration === this.props.selectedDuration;
        const textDuration = DURATION.find(durationFinder).value;

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
                                {text}
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
                                    {textDuration}
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

ActivitySchedule.prototype.props = ActivityScheduleProps;
ActivitySchedule.defaultProps = ActivityScheduleProps;

const styles = StyleSheet.create({
    button: {
        width: '80%',
        height: 'auto',
        padding: '2%',
        marginHorizontal: '10%',
        marginBottom: 48,
        justifyContent: 'center',
        borderRadius: 8,
        zIndex: 900,
        elevation: 900
    },
    title: {
        textAlign: 'left',
        fontSize: 14,
        opacity: .5
    },
    text: {
        fontSize: 16,
        textAlign: 'left'
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },

    panelRow: {
        padding: '4%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    panelButton: {
        width: 'auto',
        height: 36
    },
    textBtn: {
        padding: 8,
        fontSize: 14,
        marginRight: 12,
        marginBottom: 4,
        borderRadius: 16,
        overflow: 'hidden'
    },
    overlay: {
        position: 'absolute',
        paddingBottom: 0,
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
        zIndex: 800,
        elevation: 800
    },
    overlayBackground: {
        position: 'absolute',
        top: '-1000%',
        left: '-1000%',
        right: '-1000%',
        bottom: '-1000%',
        backgroundColor: '#00000055',
        zIndex: 700,
        elevation: 700
    }
});

export default ActivitySchedule;