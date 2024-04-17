import React from 'react';
import { View } from 'react-native';

import styles from './style';
import HeatMapBack from './back';

class HeatMap extends HeatMapBack {
    render() {
        const { gridSize } = this.props;

        return (
            <View style={styles.container}>
                {this.props.data.map((weekLevel, i) => (
                    <View
                        key={'heatmap-' + i.toString()}
                        style={{
                            height: gridSize,
                            width: gridSize,
                            margin: gridSize / 5,
                            backgroundColor: this.activityLevelToColor(weekLevel)
                        }}
                    />
                ))}
            </View>
        );
    }
}

export default HeatMap;
