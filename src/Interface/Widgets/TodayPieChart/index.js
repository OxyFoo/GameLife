import React from 'react';
import { View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import styles from './style';
import TodayPieChartBack from './back';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import { Text, Button, PieChart } from 'Interface/Components';

class TodayPieChart extends TodayPieChartBack {
    render() {
        const lang = langManager.curr['home'];


        // If there is no focused activity or no data to display, show add activity button
        if (!this.state.focusedActivity || !this.state.dataToDisplay) {

            return (
                <Button
                    style={[styles.container, this.props.style]}
                    appearance='normal'
                    gradientColors={[
                        themeManager.GetColor('main1', { opacity: 0.12 }),
                        themeManager.GetColor('main1', { opacity: 0.45 })
                    ]}
                    onLayout={this.onLayout}
                    onPress={this.onAddActivityPress}
                >
                    <View style={styles.notEnoughData}>
                        <Text style={styles.notEnoughDataText}>{lang['chart-today-notmuch']}</Text>
                    </View>
                </Button>
            );
        }

        return (
            <Button
                style={[styles.container, this.props.style]}
                appearance='normal'
                gradientColors={[
                    themeManager.GetColor('main1', { opacity: 0.12 }),
                    themeManager.GetColor('main1', { opacity: 0.45 })
                ]}
                onLayout={this.onLayout}
            >
                {/* Pie chart view */}
                <PieChart
                    data={this.state.dataToDisplay}
                    //dataFullDay={this.state.dataToDisplayFullDay}
                    focusedActivity={this.state.focusedActivity}
                    focusedActivityFullDay={this.state.focusedActivityFullDay}
                />
            </Button>
        );
    }
}

export default TodayPieChart;
