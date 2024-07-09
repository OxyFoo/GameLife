import * as React from 'react';
import { Animated, View, FlatList, Dimensions } from 'react-native';

import { RenderActivity, RenderDay } from './elements';
import BackCalendar, { TOTAL_DAYS_COUNT } from './back';
import styles, { getItemLayout } from './style';
import langManager from 'Managers/LangManager';

import { ActivityTimeline, Button, Text } from 'Interface/Components';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const INITIAL_SCROLL_INDEX = (TOTAL_DAYS_COUNT - SCREEN_WIDTH / getItemLayout(null, 0).length + 1) / 2;

class Calendar extends BackCalendar {
    render() {
        const lang = langManager.curr['calendar'];
        const { activities, selectedDay, selectedMonth, days } = this.state;

        const summaryStyle = {
            marginTop: this.state.animSummaryY
        };

        return (
            <View style={styles.page}>
                {/** Summary (hidden on scroll) */}
                <Animated.View style={[styles.summary, summaryStyle]} onLayout={this.onLayoutSummary}>
                    <Text style={styles.summaryTitle} color='secondary'>
                        {lang['summary-title']}
                    </Text>

                    <View style={styles.summaryHoursContent}>
                        <Text fontSize={12} color='secondary'>
                            {'00:00'}
                        </Text>
                        <Text fontSize={12} color='secondary'>
                            {'24:00'}
                        </Text>
                    </View>

                    <ActivityTimeline activities={activities.map((i) => i.activity)} />
                </Animated.View>

                {/** Activities list */}
                <View style={styles.activityList}>
                    <View style={styles.activityTitleContent}>
                        <Text style={styles.activityTitle} color='secondary'>
                            {lang['activities-title']}
                        </Text>
                        <Text style={styles.activityTitleDate} color='secondary'>
                            {`${selectedDay?.day} ${langManager.curr['dates']['month'][selectedDay?.month || 0]} ${selectedDay?.year}`}
                        </Text>
                    </View>

                    <FlatList
                        data={activities}
                        keyExtractor={(activity) => `${activity.activity.startTime}`}
                        renderItem={(props) => <RenderActivity {...props} />}
                        ItemSeparatorComponent={() => <View style={styles.activitySeparator} />}
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
                <View style={styles.dayList}>
                    <Text style={styles.monthTitle} color='secondary'>
                        {selectedMonth}
                    </Text>
                    <FlatList
                        ref={this.refDayList}
                        data={days}
                        keyExtractor={(item) => `${item.year}-${item.month}-${item.day}`}
                        initialScrollIndex={INITIAL_SCROLL_INDEX}
                        getItemLayout={getItemLayout}
                        renderItem={(props) => <RenderDay {...props} />}
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
