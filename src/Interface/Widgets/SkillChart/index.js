import React, { useEffect, useState } from 'react';
import { View, Image, Text } from 'react-native';

import SkillChartBack from './back';
import styles from './style';

import { LineChart, BarChart } from 'Interface/Components';

class SkillChart extends SkillChartBack {

    render() {
        return (
            <View>
                <BarChart
                    skillID={this.props.skillID}
                    chartWidth={300}
                />
                <LineChart
                    skillID={this.props.skillID}
                    chartWidth={300}
                    data={this.state.cleanedData}
                    maxVal={this.maxVal}
                    spacing={this.spacing}
                />
            </View>
        );
    }

}

export default SkillChart;