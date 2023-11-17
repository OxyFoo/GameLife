import * as React from 'react';
import { View, FlatList, Animated } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import BackCalendar from './back';
import styles from './style';
import user from 'Managers/UserManager';
import themeManager from 'Managers/ThemeManager';

import { cardHeader, cardItem, cardFooter, cardSeparator } from './cards';
import { Icon, Page, Text, ActivityTimeline } from 'Interface/Components';
import { ActivityPanel, BlockMonth } from 'Interface/Widgets';
import { GetFullDate, GetMonthAndYear } from 'Utils/Date';

class Calendar extends BackCalendar {

    month = ({ item }) => (
        <BlockMonth
            style={{ maxHeight: 260, minHeight: 260 }}
            monthData={item}
            onPressDay={this.daySelect}
        />
    );

    renderActivity = () => (
        <ActivityPanel
            ref={ref => this.refActivityPanel = ref}
            topOffset={200}
            variantTheme
        />
    );

    render() {
        const {
            months,
            selectedDate,
            selectedMonth,
            selectedYear,
            animation,
            currWeek,
            currActivities
        } = this.state;

        const interPanel = { inputRange: [0, 1], outputRange: [0, user.interface.screenHeight] };
        const interDateP = { inputRange: [0, 1], outputRange: [user.interface.screenHeight / 4, 0] };

        const styleContent = [
            styles.mainContent,
            {
                height: user.interface.screenHeight - 130,
                transform: [{ translateY: animation.interpolate(interPanel) }]
            }
        ];
        const styleCalendar = {
            transform: [{ translateY: animation.interpolate(interDateP) }]
        };
        const styleMonth = {
            height: user.interface.screenHeight - 190 // 130 (height of the top bar) + 60 (half of the bottom bar)
        };
        const styleBackground = {
            backgroundColor: themeManager.GetColor('backgroundGrey')
        };

        const title = selectedDate === null ? '' : GetMonthAndYear(selectedMonth, selectedYear);
        const titleSelectedDay = GetFullDate(new Date(selectedYear, selectedMonth, selectedDate));

        return (
            <Page
                ref={ref => this.refPage = ref}
                style={styles.page}
                overlay={this.renderActivity()}
                isHomePage
                scrollable={false}
            >
                <Animated.View style={styleContent}>
                    {/* Month + button to show full calendar */}
                    <View style={styles.row}>
                        <Icon size={32} />
                        <Text style={styles.title} color='main1' fontSize={22}>{title}</Text>
                        <Icon
                            ref={ref => this.refTuto3 = ref}
                            icon='calendar'
                            onPress={() => this.daySelect()}
                            color='main1'
                            size={32}
                        />
                    </View>

                    {/* Date selection + arrows prev/next */}
                    <View style={styles.row}>
                        <Icon onPress={() => { this.weekSelect(-1) }} icon='chevron' color='main1' size={18} angle={180} />
                        <BlockMonth
                            ref={ref => this.refTuto2 = ref}
                            style={styles.weekRow}
                            weekData={currWeek}
                            onPressDay={this.daySelect}
                        />
                        <Icon onPress={() => { this.weekSelect(1) }} icon='chevron' color='main1' size={18} />
                    </View>

                    {/* CurrDate + Activities panel */}
                    <View
                        ref={ref => this.refTuto1 = ref}
                        style={[styles.panel, styleBackground]}
                    >
                        <ActivityTimeline
                            activities={currActivities}
                            ref={this.refActivityTimeline}
                        />
                        <Text style={styles.date} color='main1' fontSize={18}>{titleSelectedDay}</Text>
                        {selectedDate !== null && ( // Force re-render after date selection
                            <FlatList
                                style={styles.panelCard}
                                contentContainerStyle={{ paddingBottom: 64 }}
                                data={currActivities}
                                onScroll={this.handleScroll}
                                ListHeaderComponent={cardHeader.bind(this)}
                                ListFooterComponent={cardFooter.bind(this)}
                                ItemSeparatorComponent={cardSeparator.bind(this)}
                                renderItem={cardItem.bind(this)}
                                keyExtractor={(item, index) =>
                                    `activity-card-s-${index}-${item.startTime}`
                                }
                            />
                        )}
                        <LinearGradient
                            style={styles.fadeBottom}
                            colors={[
                                themeManager.GetColor('backgroundGrey', 0),
                                themeManager.GetColor('backgroundGrey', 1)
                            ]}
                        />
                    </View>
                </Animated.View>

                {/* Big Calendar */}
                <Animated.View style={styleCalendar}>
                    <FlatList
                        ref={(ref) => { this.flatlist = ref }}
                        style={styleMonth}
                        data={months}
                        renderItem={this.month}
                        keyExtractor={(item, index) => `${item.month}-${item.year}`}
                        //windowSize={12}
                        //initialNumToRender={2}
                        getItemLayout={(data, index) => (
                            { length: 260, offset: 260 * index, index }
                        )}
                        //removeClippedSubviews={true}
                        refreshing={false}
                        //onEndReached={(e) => { this.addMonthToBottom() }}
                        //onScroll={(e) => { if (e.nativeEvent.contentOffset.y === 0) this.addMonthToTop() }}
                        onScroll={this.onScroll}
                        //scrollEnabled={!this.state.isReached}
                        //maintainVisibleContentPosition={{ minIndexForVisible: 0, autoscrollToTopThreshold: undefined }}
                    />
                    <LinearGradient
                        style={styles.fadeBottom2}
                        colors={[
                            themeManager.GetColor('ground1b', 0),
                            themeManager.GetColor('ground1b', 1)
                        ]}
                    />
                </Animated.View>

            </Page>
        );
    }
}

export default Calendar;