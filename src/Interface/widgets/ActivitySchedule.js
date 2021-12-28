import * as React from 'react';
import { View, Animated, FlatList, StyleSheet } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import langManager from '../../Managers/LangManager';
import themeManager from '../../Managers/ThemeManager';
import { Text, Button, Separator } from '../Components';
import { SpringAnimation } from '../../Functions/Animations';
import { dateToFormatString, dateToFormatTimeString, getDurations, GetTime } from '../../Functions/Time';

const ActivityScheduleProps = {
    mainColor: 'main1',
    editable: true,
    /**
     * @param {Date} startTime - The starting time of the activity
     * @param {Number} durationTime - Duration of the activity in minutes
     */
    onChange: (startTime, durationTime) => {},
    initialValue: [ null, null ]
}

const DURATION = getDurations();
const STARTDATE = new Date();
STARTDATE.setMinutes(Math.floor(STARTDATE.getMinutes() / 15) * 15, 0, 0);

class ActivitySchedule extends React.Component {
    state = {
        anim: new Animated.Value(0),
        selectionMode: false,
        parent: { width: 0, height: 0, x: 0, y: 0 },

        selectedDate: this.props.initialValue[0] === null ? STARTDATE : new Date(this.props.initialValue[0] * 1000),
        selectedDurationKey: this.props.initialValue[1] === null ? 3 : DURATION.find(d => d.duration === this.props.initialValue[1]).key,
        /**
         * @type {'date'|'time'|'datetime'}
         */
        DTPMode: ''
    }

    componentDidMount() {
        const { selectedDate, selectedDurationKey} = this.state;
        const time = GetTime(selectedDate);
        this.props.onChange(time, DURATION[selectedDurationKey].duration);
    }
    /*componentDidUpdate(prevProps) {
        if (this.props.value[0] !== null && this.props.value[0] !== prevProps.value[0]) {
            const durations = DURATION.filter(d => d.duration === this.props.value[1]);
            if (durations.length) {
                const date = new Date(this.props.value[0] * 1000);
                const key = durations[0].key;
                this.setState({
                    selectedDate: date,
                    selectedDurationKey: key
                });
                console.log({ selectedDate: date, selectedDurationKey: key });
            }
        }
    }*/

    onLayout = (ev) => this.setState({ parent: ev.nativeEvent.layout });
    changeSelectionMode = () => {
        const newValue = this.state.selectionMode ? 0 : 1;
        if (newValue === 0 || this.props.editable) {
            SpringAnimation(this.state.anim, newValue).start();
            this.setState({ selectionMode: !this.state.selectionMode });
        }
    }

    showDTP = (mode) => this.setState({ DTPMode: mode });
    hideDTP = () => this.setState({ DTPMode: '' });
    selectDuration = (key) => {
        const time = GetTime(this.state.selectedDate);
        this.props.onChange(time, DURATION[key].duration);
        this.setState({ selectedDurationKey: key });
    }
    onChangeDateTimePicker = (date) => {
        const { DTPMode, selectedDate, selectedDurationKey } = this.state;
        const newDate = new Date(date);
        this.hideDTP();

        if (DTPMode == 'date') {
            newDate.setHours(selectedDate.getHours(), selectedDate.getMinutes(), 0, 0);
            this.setState({ selectedDate: newDate });
        } else if (DTPMode == 'time') {
            newDate.setFullYear(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
            this.setState({ selectedDate: newDate });
        }
        const time = GetTime(newDate);
        this.props.onChange(time, DURATION[selectedDurationKey].duration);
    }

    renderPanel() {
        const  { x, y, width, height } = this.state.parent;
        const animValue = this.state.anim.interpolate({ inputRange: [0, 1], outputRange: [y+height-20, y+height] });
        const overlayPos = [styles.overlay, {
            width: width,
            opacity: this.state.anim,
            transform: [{ translateX: x }, { translateY: animValue }],
            backgroundColor: themeManager.getColor('backgroundGrey')
        }];
        const lang = langManager.curr['widget'];
        const mainColor = themeManager.getColor('main1');

        return (
            <>
                <Animated.View style={overlayPos} pointerEvents={this.state.selectionMode ? 'auto': 'none'}>
                    {/* Change date */}
                    <View style={styles.panelRow}>
                        <Text fontSize={14}>{dateToFormatString(this.state.selectedDate)}</Text>
                        <Button
                            style={styles.panelButton}
                            onPress={() => { this.showDTP('date'); }}
                            fontSize={14}
                            color='main1'
                        >
                            {lang['btn-edit-time']}
                        </Button>
                    </View>

                    {/* Change start time */}
                    <View style={styles.panelRow}>
                        <Text fontSize={14}>{dateToFormatTimeString(this.state.selectedDate)}</Text>
                        <Button
                            style={styles.panelButton}
                            onPress={() => { this.showDTP('time'); }}
                            fontSize={14}
                            color='main1'
                        >
                            {lang['btn-edit-time']}
                        </Button>
                    </View>

                    {/* Change duration */}
                    <View style={styles.panelRow}>
                        <Text style={{ paddingRight: 24 }} fontSize={14}>
                            {DURATION[this.state.selectedDurationKey].value}
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
                        />
                    </View>
                </Animated.View>


                <DateTimePickerModal
                    date={this.state.selectedDate}
                    mode={this.state.DTPMode}
                    onConfirm={this.onChangeDateTimePicker}
                    onCancel={this.hideDTP}
                    isVisible={this.state.DTPMode != ''}
                    minuteInterval={15}
                    is24Hour={true}
                />
            </>
        );
    }

    render() {
        const DATES = langManager.curr['dates']['names'];
        const DAYS = langManager.curr['dates']['days'];
        const currDay = DAYS[this.state.selectedDate.getDay()];

        return (
            <>
                <Button
                    style={styles.button}
                    icon='chrono'
                    color={this.props.mainColor}
                    onLayout={this.onLayout}
                    onPress={this.changeSelectionMode}
                >
                    <View>
                        <View style={styles.row}>
                            <Text style={styles.title}>
                                {DATES['date'] + ': '}
                            </Text>
                            <Text style={styles.text}>
                                {currDay + ' - ' + dateToFormatString(this.state.selectedDate)}
                            </Text>
                        </View>
                        <Separator.Horizontal style={{ marginVertical: 4 }} />
                        <View style={styles.row}>
                            <View style={styles.row}>
                                <Text style={styles.title}>
                                    {DATES['start-time'] + ': '}
                                </Text>
                                <Text style={styles.text}>
                                    {dateToFormatTimeString(this.state.selectedDate)}
                                </Text>
                            </View>
                            <Separator.Vertical style={{ height: '100%', marginHorizontal: 8 }} />
                            <View style={styles.row}>
                                <Text style={styles.title}>
                                    {DATES['duration'] + ': '}
                                </Text>
                                <Text style={styles.text}>
                                    {DURATION[this.state.selectedDurationKey].value}
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
        borderRadius: 16
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
        top: '-100%',
        left: '-100%',
        right: '-100%',
        bottom: '-100%',
        backgroundColor: '#00000055',
        zIndex: 700,
        elevation: 700
    }
});

export default ActivitySchedule;