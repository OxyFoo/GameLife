import React from 'react';
import { View, Text } from 'react-native';

import styles from './style';
import YearHeatMapBack from './back';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import { Switch, HeatMap } from 'Interface/Components';

class YearHeatMap extends YearHeatMapBack {
    render() {
        const lang = langManager.curr['quests'];

        const styleContainer = {
            backgroundColor: themeManager.GetColor('dataBigKpi')
        };

        const titleWeek = lang['heatmap-title-weeks'];
        const titleDay = lang['heatmap-title-days'];

        return (
            <View style={[styleContainer, styles.container, this.props.style]}>
                {/* Top row view */}
                <View style={styles.flexBetween}>

                    <Text style={styles.headerText}>{this.state.switchValue ? titleWeek : titleDay}</Text>

                    <Switch
                        value={this.state.switchValue}
                        onValueChanged={this.changeSwitchValue}
                    />
                </View>

                {/* Heat Map view */}
                <HeatMap data={this.state.dataToDisplay} gridSize={this.state.gridSize} />

            </View>
        );
    }
}

export default YearHeatMap;
