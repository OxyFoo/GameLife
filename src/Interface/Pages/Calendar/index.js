import * as React from 'react';
import { View, FlatList, Animated, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import BackCalendar from './back';
import styles from './style';
import themeManager from 'Managers/ThemeManager';

import { cardHeader, cardItem, cardFooter, cardSeparator } from './cards';
import { Icon, Page, Text } from 'Interface/Components';
import { ActivityPanel, BlockMonth } from 'Interface/Widgets';
import { GetFullDate, GetMonthAndYear } from 'Utils/Date';

const SCREEN_HEIGHT = Dimensions.get('window').height;

class Calendar extends BackCalendar {

    month = ({ item }) => (
        <BlockMonth
            style={{ maxHeight: 260, minHeight: 260 }}
            month={item.month}
            year={item.year}
            data={item.data}
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
        const { selectedDate, selectedMonth, selectedYear, animation } = this.state;

        const interPanel = { inputRange: [0, 1], outputRange: [0, SCREEN_HEIGHT] };
        const interDateP = { inputRange: [0, 1], outputRange: [SCREEN_HEIGHT/4, 0] };

        const styleContent = [
            styles.mainContent,
            {
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
                    <View style={[styles.panel, { backgroundColor: themeManager.GetColor('backgroundGrey') }]}>
                        <Text style={styles.date} color='main1' fontSize={18}>{titleSelectedDay}</Text>
                        <FlatList
                            style={styles.panelCard}
                            contentContainerStyle={{ paddingBottom: 64 }}
                            data={this.state.currActivities}
                            ListHeaderComponent={cardHeader.bind(this)}
                            ListFooterComponent={cardFooter.bind(this)}
                            ItemSeparatorComponent={cardSeparator.bind(this)}
                            renderItem={cardItem.bind(this)}
                            keyExtractor={(item, index) =>
                                `activity-card-s-${index}-${item.startTime}`
                            }
                        />
                        <LinearGradient
                            colors={['transparent', themeManager.GetColor('backgroundGrey')]}
                            style={styles.fadeBottom}
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