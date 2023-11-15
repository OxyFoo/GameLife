import React from 'react';
import { View } from 'react-native';

import themeManager from 'Managers/ThemeManager';
import SkillChartBack from './back';
import styles from './style';

import { LineChartSvg, Text } from 'Interface/Components';

class SkillChart extends SkillChartBack {

    render() {

        if (this.state.cleanedData.length <= 1) {
            return null;
        }

        return (
            <View>
                <View style={[{ backgroundColor: themeManager.GetColor("dataBigKpi") }, styles.container, this.props.style]}>
                    <View style={{alignItems: 'flex-start', justifyContent: 'flex-start',}}>
                        <Text color='primary' fontSize={16} bold={true}>
                            Activity history TODO {/*(TODO : langmanager && BOLD qui a disparu jsp pq)*/}
                        </Text>
                    </View>
                    <LineChartSvg
                        data={this.state.cleanedData}
                        style={this.props.style}
                        lineColor={this.state.lineColor}
                    />
                </View>
            </View>

        );
    }

}

export default SkillChart;