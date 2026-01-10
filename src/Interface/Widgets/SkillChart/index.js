import React from 'react';
import { View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import styles from './style';
import SkillChartBack from './back';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import { LineChartSvg, Text } from 'Interface/Components';

class SkillChart extends SkillChartBack {
    render() {
        const lang = langManager.curr['skill'];

        return (
            <View>
                <LinearGradient
                    style={[styles.container, this.props.style]}
                    colors={[
                        themeManager.GetColor('border', { opacity: 0.2 }),
                        themeManager.GetColor('border', { opacity: 0.06 })
                    ]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                >
                    <View style={styles.gradientInner}>
                        <View style={styles.titleView}>
                            <Text color='primary' fontSize={16} bold>
                                {lang['history-activity']}
                            </Text>
                        </View>
                        <LineChartSvg
                            data={this.state.cleanedData}
                            style={this.props.style}
                            lineColor={this.state.lineColor}
                        />
                    </View>
                </LinearGradient>
            </View>
        );
    }
}

export default SkillChart;
