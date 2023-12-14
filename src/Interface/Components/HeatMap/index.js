import React from 'react';
import { View, Text, Dimensions, FlatList } from 'react-native';

import HeatMapBack from './back';
import styles from './style';


class HeatMap extends HeatMapBack {

    render() {
        return (
            <View style={styles.container}>
                {this.props.data.map((weekLevel, i) => (
                    <View
                        key={i}
                        style={[
                            {height: this.props.gridSize, width: this.props.gridSize, margin: this.props.gridSize / 5},
                            { backgroundColor: this.activityLevelToColor(weekLevel) },
                        ]}
                    />
                ))}
            </View>
        );
    };
}

export default HeatMap;