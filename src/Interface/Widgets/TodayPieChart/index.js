import React from 'react';
import { View } from 'react-native';

import styles from './style';
import TodayPieChartBack from './back';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import { Text, Button, PieChart } from 'Interface/Components';

class TodayPieChart extends TodayPieChartBack {
    render() {
        const lang = langManager.curr['home'];
        const { switched } = this.state;

        let headerText = lang['chart-today-recap'];
        if (switched) {
            headerText = lang['chart-today-performance'];
        }

        // If there is no focused activity or no data to display, show add activity button
        if (!this.state.focusedActivity || !this.state.dataToDisplay) {
            const background = {
                backgroundColor: themeManager.GetColor('dataBigKpi')
            };

            return (
                <View style={[styles.container, background, this.props.style]}>
                    <View style={styles.notEnoughData}>
                        <Text style={styles.notEnoughDataText}>
                            {lang['chart-today-notmuch']}
                        </Text>
                        <Button
                            style={styles.notEnoughDataButton}
                            color='main2'
                            onPress={this.onAddActivityPress}
                        >
                            {lang['chart-today-notmuch-button']}
                        </Button>
                    </View>
                </View>
            );
        }

        return (
            <Button
                style={[styles.container, this.props.style]}
                color='dataBigKpi'
                onPress={this.onPress}
                onLayout={this.onLayout}
            >
                {/* Top row view */}
                <View style={styles.flexBetween}>
                    <Text style={styles.headerText}>{headerText}</Text>
                </View>

                {/* Pie chart view */}
                <PieChart
                    data={this.state.dataToDisplay}
                    dataFullDay={this.state.dataToDisplayFullDay}
                    focusedActivity={this.state.focusedActivity}
                    focusedActivityFullDay={this.state.focusedActivityFullDay}
                    switched={this.state.switched}
                    layoutWidth={this.state.layoutWidth - 32}
                />
            </Button>
        );
    }
}

export default TodayPieChart;
