import React from 'react';
import { View } from 'react-native';

import styles from './style';
import SkillChartBack from './back';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import { LineChartSvg, Text } from 'Interface/Components';

class SkillChart extends SkillChartBack {
    render() {
        const lang = langManager.curr['skill'];

        const styleContainer = {
            backgroundColor: themeManager.GetColor('dataBigKpi')
        };

        return (
            <View>
                <View style={[styleContainer, styles.container, this.props.style]}>
                    <View style={{ alignItems: 'flex-start', justifyContent: 'flex-start' }}>
                        <Text color='primary' fontSize={16} bold>
                            {
                                // TODO : le bold marche pas ici c'est pas normal (iOS)
                            }
                            {lang['history-activity']}
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
