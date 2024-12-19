import React from 'react';
import { View } from 'react-native';

import styles from './style';
import HeatMapBack from './back';
import themeManager from 'Managers/ThemeManager';

/**
 * @typedef {import('./back').HeatMapDataType} HeatMapDataType
 */

class HeatMap extends HeatMapBack {
    render() {
        const { style, data } = this.props;

        return <View style={[styles.container, style]}>{data.map(this.renderCell)}</View>;
    }

    /**
     * @param {HeatMapDataType} item
     * @param {number} i
     */
    renderCell = (item, i) => {
        const { gridSize, borderSize } = this.props;

        const opacity = 0.1 + item.level * 0.9;
        let backgroundColor = 'transparent';
        if (item.level >= 0) {
            backgroundColor = themeManager.GetColor(item.backgroundColor, { opacity });
        }
        const borderWidth = item.level < 0 ? borderSize : 0;
        const borderColor = themeManager.GetColor(item.borderColor ?? 'border', { opacity: 0.2 });

        return (
            <View
                key={`heatmap-${i}-${item}`}
                style={[
                    styles.cell,
                    {
                        height: gridSize,
                        width: gridSize,
                        margin: gridSize / 5,
                        borderColor,
                        borderWidth,
                        backgroundColor
                    }
                ]}
            />
        );
    };
}

export { HeatMap };
