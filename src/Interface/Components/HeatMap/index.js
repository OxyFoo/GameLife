import React from 'react';
import { View, Text, Dimensions } from 'react-native';

import HeatMapBack from './back';
import styles from './style';

const LEVELS = 7; // Number of different color levels
const WEEKS = 52; // Number of weeks in a year

class HeatMap extends HeatMapBack {

    render() {
        // You might want to calculate the color based on the activity level
        const getColor = (level) => {
            const colorLevel = Math.floor((255 * level) / (LEVELS - 1));
            return `rgb(0, ${colorLevel}, 0)`; // Green color with varying intensity
        };

        return (
            <View style={styles.container}>
                {this.props.yearData.map((weekLevel, i) => (
                    <View
                        key={i}
                        style={[
                            this.state.styleCell,
                            { backgroundColor: getColor(weekLevel) },
                        ]}
                    />
                ))}
            </View>
        );
    };
}

export default HeatMap;