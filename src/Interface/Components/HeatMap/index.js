import React from 'react';
import { View, Text, Dimensions } from 'react-native';

import HeatMapBack from './back';
import styles from './style';

class HeatMap extends HeatMapBack {

    render() {
        
        return (
            <View style={styles.container}>
                {this.state.dataToDisplay ?? this.state.dataToDisplay}
            </View>
        );
    };
}

export default HeatMap;