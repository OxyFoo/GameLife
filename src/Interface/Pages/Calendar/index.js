import * as React from 'react';
import { View, FlatList, Dimensions } from 'react-native';

import { RenderActivity, RenderDay } from './elements';
import BackCalendar, { TOTAL_DAYS_COUNT } from './back';
import styles, { getItemLayout } from './style';
import langManager from 'Managers/LangManager';

import { Text } from 'Interface/Components';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const INITIAL_SCROLL_INDEX = (TOTAL_DAYS_COUNT - SCREEN_WIDTH / getItemLayout(null, 0).length + 1) / 2;

class Calendar extends BackCalendar {
    render() {
        const { activities, selectedMonth, days } = this.state;

        return (
            <View style={styles.page}>
                <View style={styles.activityList}>
                    <Text style={styles.activityTitle} color='secondary'>
                        {langManager.curr['calendar']['activities-title']}
                    </Text>

                    <FlatList
                        data={activities}
                        renderItem={(props) => <RenderActivity {...props} />}
                        keyExtractor={(activity) => `${activity.activity.startTime}`}
                        ItemSeparatorComponent={() => <View style={styles.activitySeparator} />}
                    />
                </View>

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
