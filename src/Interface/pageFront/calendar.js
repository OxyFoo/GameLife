import * as React from 'react';
import { View, StyleSheet, FlatList, Animated, Dimensions } from 'react-native';

import user from '../../Managers/UserManager';

import BackCalendar from '../pageBack/calendar';
import { Icon, Page, Text } from '../Components';
import { Activity, BlockMonth, UserHeader } from '../Widgets';
import themeManager from '../../Managers/ThemeManager';
import { GetFullDate, GetMonthAndYear } from '../../Functions/Date';
import dataManager from '../../Managers/DataManager';

const SCREEN_HEIGHT = Dimensions.get('window').height;

class Calendar extends BackCalendar {
    render() {
        const { selectedDate, selectedMonth, selectedYear, animation } = this.state;

        const interPanel = { inputRange: [0, 1], outputRange: [0, SCREEN_HEIGHT] };
        const interDateP = { inputRange: [0, 1], outputRange: [SCREEN_HEIGHT/4, 0] };

        const styleContent = [styles.mainContent, { transform: [{ translateY: animation.interpolate(interPanel) }] } ];
        const styleCalendar = { transform: [{ translateY: animation.interpolate(interDateP) }] };

        const title = selectedDate === null ? '' : GetMonthAndYear(selectedMonth, selectedYear);
        const titleSelectedDay = GetFullDate(new Date(selectedYear, selectedMonth, selectedDate));

        const month = ({ item }) => (
            <BlockMonth
                style={{ maxHeight: 260, minHeight: 260 }}
                month={item.month}
                year={item.year}
                data={item.data}
                onPressDay={this.daySelect}
            />
        );

        return (
            <Page style={{ padding: 0 }} scrollable={false}>
                <UserHeader style={{ padding: '5%', paddingBottom: 0 }} />

                <Animated.View style={styleContent}>
                    {/* Month + arrows to show calendar */}
                    <View style={styles.row}>
                        <Icon icon='arrowLeft' onPress={() => this.daySelect()} color='main1' size={32} />
                        <Text style={styles.title} color='main1' fontSize={22}>{title}</Text>
                        <Icon size={32} />
                    </View>

                    {/* Date selection + arrows prev/next */}
                    <View style={styles.row}>
                        <Icon onPress={() => {this.weekSelect(-1)}} icon='chevron' color='main1' size={18} angle={180} />
                        <BlockMonth
                            style={styles.weekRow}
                            showTitle={false}
                            data={[this.state.currWeek]}
                            month={selectedMonth}
                            year={selectedYear}
                            selectedDay={new Date(selectedYear, selectedMonth, selectedDate)}
                            onPressDay={this.daySelect}
                        />
                        <Icon onPress={() => {this.weekSelect(1)}} icon='chevron' color='main1' size={18} />
                    </View>

                    {/* CurrDate + Activities panel */}
                    <View style={[styles.pannel, { backgroundColor: themeManager.getColor('backgroundGrey') }]}>
                        <Text style={styles.date} color='main1' fontSize={18}>{titleSelectedDay}</Text>
                        <Icon xml='' />
                        <Icon xml={dataManager.skills.skillsIcons[0].Content} />
                    </View>
                </Animated.View>

                <Animated.View style={styleCalendar}>
                    <FlatList
                        ref={(ref) => { this.flatlist = ref}}
                        style={styles.months}
                        data={this.state.months}
                        renderItem={month}
                        keyExtractor={(item, index) => 'm-' + index}
                        //windowSize={12}
                        //initialNumToRender={2}
                        getItemLayout={(data, index) => (
                            {length: 260, offset: 260 * index, index}
                        )}
                        //removeClippedSubviews={true}
                        refreshing={false}
                        //onEndReached={(e) => { this.addMonthToBottom() }}
                        //onScroll={(e) => { if (e.nativeEvent.contentOffset.y === 0) this.addMonthToTop() }}
                        onScroll={this.onScroll}
                    />
                </Animated.View>

            </Page>
        );

        return (
            <View style={{ flex: 1 }}>
                {/* Show activities 
                <FlatList
                    data={this.state.activities}
                    keyExtractor={(item, i) => 'activity_' + i}
                    renderItem={({item}) => {
                        const activity = item;
                        const skill = dataManager.skills.getByID(activity.skillID);
                        const date = new Date(activity.startDate);
                        const timeText = date.getHours() + 'h' + date.getMinutes() + 'm/' + activity.duration + 'm';

                        const durationHour = activity.duration / 60;
                        let totalXP = skill.XP * durationHour;
                        const sagLevel = user.experience.getStatExperience('sag', activity).lvl - 1;
                        totalXP += sagLevel * durationHour;

                        return (
                            <GLActivityBox
                                skill={skill.Name}
                                time={timeText}
                                xp={totalXP}
                                onPress={() => { this.skill_click(activity) }}
                                onRemove={() => { this.skill_remove(activity) }}
                            />
                        )
                    }}
                />*/}

            </View>
        )
    }
}

const styles = StyleSheet.create({
    row: {
        width: '100%',
        marginTop: 12,
        paddingHorizontal: '5%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    weekRow: {
        flex: 1,
        marginBottom: 0
    },
    title: {
        fontWeight: 'bold'
    },
    months: {
        height: '80%'
    },

    mainContent: {
        position: 'absolute',
        top: 130,
        width: '100%',
        height: SCREEN_HEIGHT - 130,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,

        zIndex: 100,
        elevation: 100
    },
    pannel: {
        width: '100%',
        height: '85%',
        marginTop: 12,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16
    },
    date: {
        marginVertical: 24
    }
});

export default Calendar;