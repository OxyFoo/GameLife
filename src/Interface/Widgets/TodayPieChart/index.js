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

        let headerText = lang['chart-today-recap'];

        // If there is no focused activity or no data to display, show add activity button
        if (!this.state.focusedActivity || !this.state.dataToDisplay) {
            const background = {
                backgroundColor: themeManager.GetColor('dataBigKpi')
            };

            return (
                <LinearGradient
                    colors={[
                        themeManager.GetColor('main1', { opacity: 0.45 }),
                        themeManager.GetColor('main1', { opacity: 0.12 })
                    ]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[styles.container, background, this.props.style]}
                >
                    <View style={styles.notEnoughData}>
                        <Text style={styles.notEnoughDataText}>{lang['chart-today-notmuch']}</Text>
                        <Button style={styles.notEnoughDataButton} color='main2' onPress={this.onAddActivityPress}>
                            {lang['chart-today-notmuch-button']}
                        </Button>
                    </View>
                </LinearGradient>
            );
        }

        return (
            <Button
                style={[styles.container, this.props.style]}
                appearance='uniform'
                color='backgroundTransparent'
                onLayout={this.onLayout}
            >
                {/* Top row view */}
                <View style={styles.flexBetween}>
                    <Text style={styles.headerText}>{headerText}</Text>
                </View>

                {/* Pie chart view */}
                <PieChart
                    data={this.state.dataToDisplay}
                    //dataFullDay={this.state.dataToDisplayFullDay}
                    focusedActivity={this.state.focusedActivity}
                    focusedActivityFullDay={this.state.focusedActivityFullDay}
                    //layoutWidth={this.state.layoutWidth - 32}
                />
            </Button>
        );
    }
}

export default TodayPieChart;
