import React from 'react';
import { View, Text } from 'react-native';

import styles from './style';
import TodayPieChartBack from './back';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import { Switch, PieChart } from 'Interface/Components';

class TodayPieChart extends TodayPieChartBack {
    render() {
        const lang = langManager.curr['home'];
        const { switchValue, totalTime } = this.state;

        const styleContainer = {
            backgroundColor: themeManager.GetColor('dataBigKpi')
        };

        const whiteText = {
            color: themeManager.GetColor('primary')
        };

        const dayPerformance = switchValue ? '24' : totalTime.toString();
        const headerText = lang['chart-today-performance'].replace('{}', dayPerformance);

        return (
            <View style={[styleContainer, styles.container, this.props.style]}>
                {/* Top row view */}
                <View style={styles.flexBetween}>

                    <Text style={styles.headerText}>{headerText}</Text>

                    <Switch
                        value={this.state.switchValue}
                        onValueChanged={this.changeSwitchValue}
                    />
                </View>

                {/* Pie chart view */}
                {this.state.focusedActivity && this.state.dataToDisplay ?
                    <PieChart
                        data={this.state.dataToDisplay}
                        focusedActivity={this.state.focusedActivity}
                    />
                    :
                    <View>
                        <Text style={[whiteText, styles.notEnoughData]}>{lang['chart-today-notmuch']}</Text>
                    </View>
                }
            </View>
        );
    }
}

export default TodayPieChart;