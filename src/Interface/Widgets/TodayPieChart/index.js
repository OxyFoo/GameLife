import React, { useEffect, useState } from 'react';
import { View, Image, Text } from 'react-native';

import TodayPieChartBack from './back';
import styles from './style';

import { Switch, PieChart } from 'Interface/Components';

class TodayPieChartFront extends TodayPieChartBack {

    render() {
        return (
            <View style={[styles.container, this.props.style]}>

                {/* Top row view */}
                <View style={styles.flexBetween}>

                    <Text style={styles.headerText}>
                        Performance of the day {this.state.switchValue ? "(24h)" : "(" + this.state.totalTime + "h)"}
                    </Text>

                    <Switch
                        value={this.state.switchValue}
                        onValueChanged={this.changeSwitchValue}
                    />
                </View>

                {/* Pie chart view */}
                {this.state.displayChart && this.state.focusedActivity && this.state.dataToDisplay ?
                    <PieChart
                        data={this.state.dataToDisplay}
                        focusedActivity={this.state.focusedActivity}
                    />
                    :
                    <View>
                        <Text>Il n'y a pas assez de données pour afficher le graphique</Text>
                    </View>}
            </View>
        );
    }
}

export default TodayPieChartFront;