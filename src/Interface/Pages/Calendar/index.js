import * as React from 'react';
import { Animated, View, FlatList, Dimensions, TouchableOpacity } from 'react-native';

import styles, { getItemLayout } from './style';
import BackCalendar, { TOTAL_DAYS_COUNT } from './back';
import { RenderActivity, RenderDay } from './elements';
import { CardHeader, CardSeparator, CardFooter } from './AddButtons';
import langManager from 'Managers/LangManager';

import { ActivityTimeline, Button, Icon, OxAmount, Text } from 'Interface/Components';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const INITIAL_SCROLL_INDEX = (TOTAL_DAYS_COUNT - SCREEN_WIDTH / getItemLayout(null, 0).length + 1) / 2;

class Calendar extends BackCalendar {
    render() {
        const lang = langManager.curr['calendar'];
        const {
            activities,
            oxAmount,
            todayStrDate,
            selectedDay,
            selectedMonth,
            days,
            animSummaryY,
            animTodayButton,
            selectedIsToday
        } = this.state;

        const summaryStyle = {
            marginTop: animSummaryY
        };

        return (
            <View style={styles.page}>
                {/** Summary (hidden on scroll) */}
                <Animated.View style={[styles.summary, summaryStyle]} onLayout={this.onLayoutSummary}>
                    <View style={styles.summaryHeader}>
                        {/* The date and the share icon are one tap target; a plain date without activities */}
                        <TouchableOpacity
                            style={styles.shareButton}
                            activeOpacity={0.6}
                            disabled={activities.length === 0}
                            onPress={this.openDayRecap}
                        >
                            <Text style={styles.summaryTitle} color='secondary'>
                                {todayStrDate}
                            </Text>
                            {activities.length > 0 && <Icon icon='share-2-outline' color='gradient' size={20} />}
                        </TouchableOpacity>

                        {/* Ox owned, like the shop badge: tap to open the shop */}
                        <Button
                            style={styles.oxButton}
                            appearance='uniform'
                            color='transparent'
                            onPress={this.openShop}
                        >
                            <OxAmount value={oxAmount} fontSize={16} iconSize={20} />
                        </Button>
                    </View>

                    <View style={styles.summaryHoursContent}>
                        <Text fontSize={12} color='secondary'>
                            {'00:00'}
                        </Text>
                        <Text fontSize={12} color='secondary'>
                            {'24:00'}
                        </Text>
                    </View>

                    <ActivityTimeline
                        activities={activities.map((i) => i.activity)}
                        day={selectedDay?.day}
                        isToday={selectedIsToday}
                    />
                </Animated.View>

                {/** Activities list */}
                <View style={styles.activityList}>
                    <FlatList
                        data={activities}
                        keyExtractor={(activity) => `${activity.activity.startTime}`}
                        renderItem={(props) => <RenderActivity {...props} />}
                        ListHeaderComponent={CardHeader.bind(this)}
                        ListFooterComponent={CardFooter.bind(this)}
                        ItemSeparatorComponent={CardSeparator.bind(this)}
                        ListEmptyComponent={() => (
                            <Button
                                style={styles.activityEmptyButton}
                                appearance='outline'
                                icon='add'
                                onPress={this.addActivity}
                            >
                                {lang['add-activity']}
                            </Button>
                        )}
                        onScroll={this.handleActivityScroll}
                    />
                </View>

                {/** Days selection */}
                <View>
                    <View style={styles.dayList}>
                        <Button
                            style={styles.daysButtonOption}
                            appearance='uniform'
                            color='transparent'
                            onPress={this.openCalendar}
                        >
                            <Icon icon='planner' color='main1' size={18} />
                        </Button>
                        <Text style={styles.monthTitle} color='secondary'>
                            {selectedMonth}
                        </Text>
                        <Button
                            style={styles.daysButtonOption}
                            styleAnimation={{ opacity: animTodayButton }}
                            appearance='uniform'
                            color='transparent'
                            onPress={this.openToday}
                        >
                            <Icon icon='retry' color='main2' size={16} />
                        </Button>
                    </View>
                    <FlatList
                        ref={this.refDayList}
                        data={days}
                        keyExtractor={(item) => `${item.year}-${item.month}-${item.day}`}
                        initialScrollIndex={INITIAL_SCROLL_INDEX}
                        getItemLayout={getItemLayout}
                        renderItem={(props) => <RenderDay {...props} />}
                        onLayout={this.onLayoutDayList}
                        onScroll={this.handleDayScroll}
                        onStartReached={this.onDayStartReached}
                        onStartReachedThreshold={0.4}
                        onEndReached={this.onDayEndReached}
                        onEndReachedThreshold={0.4}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                    />
                </View>
            </View>
        );
    }
}

export default Calendar;
