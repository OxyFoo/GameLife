import * as React from 'react';
import { View, FlatList, Animated } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import BackCalendar from './back';
import styles from './style';
import user from 'Managers/UserManager';
import themeManager from 'Managers/ThemeManager';

import { cardHeader, cardItem, cardFooter, cardSeparator } from './cards';
import { Icon, Page, Text } from 'Interface/Components';
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
        const interDateP = { inputRange: [0, 1], outputRange: [user.interface.screenHeight/4, 0] };

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
                    {/* Month + arrow to show calendar */}
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
                            weekData={currWeek}
                            onPressDay={this.daySelect}
                        />
                        <Icon onPress={() => {this.weekSelect(1)}} icon='chevron' color='main1' size={18} />
                    </View>

                    {/* CurrDate + Activities panel */}
                    <View style={[styles.panel, { backgroundColor: themeManager.GetColor('backgroundGrey') }]}>
                        <Text style={styles.date} color='main1' fontSize={18}>{titleSelectedDay}</Text>
                        {selectedDate !== null && ( // Force re-render after date selection
                            <FlatList
                                style={styles.panelCard}
                                contentContainerStyle={{ paddingBottom: 64 }}
                                data={currActivities}
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

                <Animated.View style={styleCalendar}>
                    <FlatList
                        ref={(ref) => { this.flatlist = ref}}
                        style={styles.months}
                        data={months}
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