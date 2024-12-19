import React from 'react';
import { View } from 'react-native';

import styles from './style';
import YearHeatMapBack from './back';
import langManager from 'Managers/LangManager';

import { HeatMap, SwitchText } from 'Interface/Components';

class YearHeatMap extends YearHeatMapBack {
    render() {
        const lang = langManager.curr['quests'];
        const { dataToDisplay, switchMode } = this.state;

        return (
            <View style={this.props.style}>
                <SwitchText
                    style={styles.switchText}
                    texts={[lang['heatmap-title-day'], lang['heatmap-title-week']]}
                    value={switchMode}
                    onChangeValue={this.changeSwitchValue}
                />

                <HeatMap
                    data={dataToDisplay}
                    gridSize={switchMode === 0 ? 10 : 15}
                    borderSize={switchMode === 0 ? 1.2 : 1.5}
                />
            </View>
        );
    }
}

export default YearHeatMap;
