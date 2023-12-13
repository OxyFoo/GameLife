import React from 'react';
import { View, Text, Dimensions, FlatList } from 'react-native';

import HeatMapBack from './back';
import styles from './style';

class HeatMap extends HeatMapBack {

    render() {
        

        /*
        // Je le laisse for now pour voir si t'as une soluce mieux que ce que j'ai fait 
        // mais dans l'idée lui il est appelé avant le compute() du back 
        // et donc le styleCell à pas eu le temps de se mettre à jour donc l'affichage fais pas ce que je veux
        console.log("Render component", this.props.gridSize, this.state.styleCell)
        const dataToDisplay = this.props.data.map((weekLevel, i) => (
            <View
                key={i}
                style={[
                    this.state.styleCell,
                    { backgroundColor: activityLevelToColor(weekLevel) },
                ]}
            />
        ))
        */

        return (
            <View style={styles.container}>
                {this.state.dataToDisplay.length > 0 && this.state.dataToDisplay}
            </View>
        );
    };
}

export default HeatMap;