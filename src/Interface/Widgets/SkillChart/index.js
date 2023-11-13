import React, { useEffect, useState } from 'react';
import { View, Image, Text } from 'react-native';

import SkillChartBack from './back';
import styles from './style';

import { LineChartSvg } from 'Interface/Components';

class SkillChart extends SkillChartBack {

    render() {

        return (
            <View style={[styles.container, this.props.style]}>
                <Text style={styles.headerText}>
                    Activity history (TODO : langmanager)
                </Text>
                {this.state.cleanedData.length > 0 ? // jsp pourquoi ici juste "this.state.cleanedData ?" ca crash sur un undefined 
                    <LineChartSvg
                        data={this.state.cleanedData}
                        style={this.props.style}
                        lineColor={this.state.lineColor}
                    />
                    : <></>}
            </View>
        );
    }

}

export default SkillChart;