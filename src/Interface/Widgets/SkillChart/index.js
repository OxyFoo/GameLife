import React, { useEffect, useState } from 'react';
import { View, Image, Text } from 'react-native';

import SkillChartBack from './back';
import styles from './style';

import { LineChart, BarChart, LineChartSvg } from 'Interface/Components';

class SkillChart extends SkillChartBack {

    render() {
        const data34 = [{ "date": "15/09/2023", "value": 240 }, { "date": "16/09/2023", "value": 0 }, { "date": "17/09/2023", "value": 0 }, { "date": "18/09/2023", "value": 0 }, { "date": "19/09/2023", "value": 0 }, { "date": "20/09/2023", "value": 0 }, { "date": "21/09/2023", "value": 0 }, { "date": "22/09/2023", "value": 0 }, { "date": "23/09/2023", "value": 0 }, { "date": "24/09/2023", "value": 0 }, { "date": "25/09/2023", "value": 0 }, { "date": "26/09/2023", "value": 0 }, { "date": "27/09/2023", "value": 0 }, { "date": "28/09/2023", "value": 100 }, { "date": "29/09/2023", "value": 0 }, { "date": "30/09/2023", "value": 0 }, { "date": "01/10/2023", "value": 0 }, { "date": "02/10/2023", "value": 0 }, { "date": "03/10/2023", "value": 23 }, { "date": "04/10/2023", "value": 0 }, { "date": "05/10/2023", "value": 0 }, { "date": "06/10/2023", "value": 0 }, { "date": "07/10/2023", "value": 0 }, { "date": "08/10/2023", "value": 0 }, { "date": "09/10/2023", "value": 46 }, { "date": "10/10/2023", "value": 0 }, { "date": "11/10/2023", "value": 0 }, { "date": "12/10/2023", "value": 0 }, { "date": "13/10/2023", "value": 420 }, { "date": "14/10/2023", "value": 0 }, { "date": "15/10/2023", "value": 0 }, { "date": "16/10/2023", "value": 245 }, { "date": "17/10/2023", "value": 0 }, { "date": "18/10/2023", "value": 0 }, { "date": "19/10/2023", "value": 0 }, { "date": "20/10/2023", "value": 0 }, { "date": "21/10/2023", "value": 0 }, { "date": "22/10/2023", "value": 0 }, { "date": "23/10/2023", "value": 0 }, { "date": "24/10/2023", "value": 145 }, { "date": "25/10/2023", "value": 0 }, { "date": "26/10/2023", "value": 0 }, { "date": "27/10/2023", "value": 0 }, { "date": "28/10/2023", "value": 0 }, { "date": "29/10/2023", "value": 0 }, { "date": "30/10/2023", "value": 225 }, { "date": "31/10/2023", "value": 60 }, { "date": "01/11/2023", "value": 0 }, { "date": "02/11/2023", "value": 0 }, { "date": "03/11/2023", "value": 195 }, { "date": "04/11/2023", "value": 465 }]

        return (
            <View>
                <LineChartSvg
                    data={data34}
                    graph_height={200}
                    />
                {/*
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
        */}
            </View>
        );
    }

}

export default SkillChart;