import * as React from 'react';
import { View, FlatList, Animated, Dimensions } from 'react-native';

import BackCalendar from './back';
import styles from './style';
import user from '../../../Managers/UserManager';
import themeManager from '../../../Managers/ThemeManager';

import { Icon, Page, Text } from '../../Components';
import { ActivityCard, BlockMonth } from '../../Widgets';
import { GetFullDate, GetMonthAndYear } from '../../../Utils/Date';

const SCREEN_HEIGHT = Dimensions.get('window').height;

class Calendar extends BackCalendar {

    card = ({ item, index }) => (
        <ActivityCard
            style={{ maxWidth: '48%' }}
            activity={item}
            index={index}
            onPress={() => { user.interface.ChangePage('activity', { activity: item }) }}
        />
    );

    month = ({ item }) => (
        <BlockMonth
            style={{ maxHeight: 260, minHeight: 260 }}
            month={item.month}
            year={item.year}
            data={item.data}
            onPressDay={this.daySelect}
        />
    );

    render() {
        const { selectedDate, selectedMonth, selectedYear, animation } = this.state;

        const interPanel = { inputRange: [0, 1], outputRange: [0, SCREEN_HEIGHT] };
        const interDateP = { inputRange: [0, 1], outputRange: [SCREEN_HEIGHT/4, 0] };

        const styleContent = [styles.mainContent, { transform: [{ translateY: animation.interpolate(interPanel) }] } ];
        const styleCalendar = { transform: [{ translateY: animation.interpolate(interDateP) }] };

        const title = selectedDate === null ? '' : GetMonthAndYear(selectedMonth, selectedYear);
        const titleSelectedDay = GetFullDate(new Date(selectedYear, selectedMonth, selectedDate));

        return (
            <Page style={styles.page} isHomePage scrollable={false}>
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
                            onlyWeek={true}
                            data={[this.state.currWeek]}
                            month={selectedMonth}
                            year={selectedYear}
                            selectedDay={new Date(selectedYear, selectedMonth, selectedDate)}
                            onPressDay={this.daySelect}
                        />
                        <Icon onPress={() => {this.weekSelect(1)}} icon='chevron' color='main1' size={18} />
                    </View>

                    {/* CurrDate + Activities panel */}
                    <View style={[styles.pannel, { backgroundColor: themeManager.GetColor('backgroundGrey') }]}>
                        <Text style={styles.date} color='main1' fontSize={18}>{titleSelectedDay}</Text>
                        <FlatList
                            style={{ marginHorizontal: '5%' }}
                            columnWrapperStyle={{ marginBottom: '5%', justifyContent: 'space-between' }}
                            data={this.state.currActivities}
                            numColumns={2}
                            renderItem={this.card}
                            keyExtractor={(item, index) => `activity-card-s-${index}-${item.startTime}`}
                        />
                    </View>
                </Animated.View>

                <Animated.View style={styleCalendar}>
                    <FlatList
                        ref={(ref) => { this.flatlist = ref}}
                        style={styles.months}
                        data={this.state.months}
                        renderItem={this.month}
                        keyExtractor={(item, index) => `${item.month}-${item.year}`}
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
                        //scrollEnabled={!this.state.isReached}
                        //maintainVisibleContentPosition={{ minIndexForVisible: 0, autoscrollToTopThreshold: undefined }}
                    />
                </Animated.View>

            </Page>
        );
    }
}

export default Calendar;