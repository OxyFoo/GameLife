import * as React from 'react';
import { View, FlatList, Animated } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import BackCalendar from './back';
import styles from './style';
import user from 'Managers/UserManager';
import themeManager from 'Managers/ThemeManager';

import { cardHeader, cardItem, cardFooter, cardSeparator } from './cards';
import { Page, Text, Button, Icon, ActivityTimeline } from 'Interface/Components';
import { ActivityPanel, BlockMonth } from 'Interface/Widgets';
import { GetFullDate, GetMonthAndYear } from 'Utils/Date';

/**
 * @typedef {import('Interface/Widgets/BlockMonth').MonthData} MonthData
 */

class Calendar extends BackCalendar {
    /** @param {{ item: MonthData }} param0 */
    month = ({ item }) => (
        <BlockMonth
            style={styles.months}
            height={260}
            data={item}
            onPressDay={this.daySelect}
        />
    )

    renderActivity = () => (
        <ActivityPanel
            ref={ref => this.refActivityPanel = ref}
            topOffset={200}
            variantTheme
        />
    )

    render() {
        const { months, selectedALL, animation, currActivities } = this.state;

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

        let title = '';
        let titleSelectedDay = '';
        if (selectedALL !== null) {
            const { day, month, year } = selectedALL;
            title = selectedALL === null ? '' : GetMonthAndYear(month, year);
            titleSelectedDay = GetFullDate(new Date(year, month, day));
        }

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
                            icon='calendar'
                            onPress={this.dayRefresh}
                            color='main1'
                            size={32}
                        />
                    </View>

                    {/* Date selection + arrows prev/next */}
                    <View style={styles.row}>
                        <Button style={styles.btnIcon} rippleColor='white' onPress={this.selectPrevWeek}>
                            <Icon
                                icon='chevron'
                                color='main1'
                                size={18}
                                angle={180}
                            />
                        </Button>
                        <BlockMonth
                            style={styles.weekRow}
                            data={selectedALL}
                            onPressDay={this.daySelect}
                            hideTitle
                        />
                        <Button style={styles.btnIcon} rippleColor='white' onPress={this.selectNextWeek}>
                            <Icon
                                icon='chevron'
                                color='main1'
                                size={18}
                            />
                        </Button>
                    </View>

                    {/* CurrDate + Activities panel */}
                    <View
                        style={[styles.panel, styleBackground]}
                    >
                        <ActivityTimeline
                            ref={this.refActivityTimeline}
                            activities={currActivities}
                        />
                        <Text style={styles.date} color='main1' fontSize={18}>{titleSelectedDay}</Text>
                        {selectedALL?.day && ( // Force re-render after date selection
                            <FlatList
                                style={styles.panelCard}
                                contentContainerStyle={styles.panelCardContainer}
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
                                themeManager.GetColor('backgroundGrey', { opacity: 0 }),
                                themeManager.GetColor('backgroundGrey', { opacity: 1 })
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
                        getItemLayout={(data, index) => (
                            { length: 260, offset: 260 * index, index }
                        )}
                        refreshing={false}
                        onScroll={this.onScroll}
                    />
                    <LinearGradient
                        style={styles.fadeBottom2}
                        colors={[
                            themeManager.GetColor('ground1b', { opacity: 0 }),
                            themeManager.GetColor('ground1b', { opacity: 1 })
                        ]}
                    />
                </Animated.View>

            </Page>
        );
    }
}

export default Calendar;
