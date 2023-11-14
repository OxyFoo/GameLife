import React, { useEffect, useState } from 'react';
import { View, Image, Text } from 'react-native';

import SkillChartBack from './back';
import styles from './style';

import { LineChartSvg } from 'Interface/Components';

class SkillChart extends SkillChartBack {

    render() {

        return (
            <View>
            {
                this.state.cleanedData.length > 1 ? // jsp pourquoi ici juste "this.state.cleanedData ?" ca crash sur un undefined 

                <View style={[styles.container, this.props.style]}>
                    <Text style={styles.headerText}>
                        Activity history (TODO : langmanager)
                    </Text>
                    <LineChartSvg
                        data={this.state.cleanedData}
                        style={this.props.style}
                        lineColor={this.state.lineColor}
                    />
                </View>
                : null
            }
            </View>

        );
}

}

export default SkillChart;