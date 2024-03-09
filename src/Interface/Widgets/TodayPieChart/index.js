import React from 'react';
import { View } from 'react-native';

import styles from './style';
import TodayPieChartBack from './back';
import langManager from 'Managers/LangManager';

import { Text, Button, PieChart } from 'Interface/Components';

class TodayPieChart extends TodayPieChartBack {
    render() {
        const lang = langManager.curr['home'];
        const { switched } = this.state;

        let headerText = lang['chart-today-recap'];
        if (switched) {
            headerText = lang['chart-today-performance'];
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
                {this.renderContent()}
            </Button>
        );
    }

    renderContent = () => {
        const lang = langManager.curr['home'];

        // If there is no focused activity or no data to display, show a message
        if (!this.state.focusedActivity || !this.state.dataToDisplay) {
            return (
                <Text style={styles.notEnoughData}>{lang['chart-today-notmuch']}</Text>
            );
        }

        return (
            <PieChart
                data={this.state.dataToDisplay}
                dataFullDay={this.state.dataToDisplayFullDay}
                focusedActivity={this.state.focusedActivity}
                focusedActivityFullDay={this.state.focusedActivityFullDay}
                switched={this.state.switched}
                layoutWidth={this.state.layoutWidth - 32}
            />
        );
    }
}

export default TodayPieChart;
