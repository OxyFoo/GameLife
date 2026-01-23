import React from 'react';
import { ScrollView, View } from 'react-native';

import YearHeatMapBack from './back';

import { HeatMap } from 'Interface/Components';

const GRID_SIZE = 10;
const GRID_MARGIN = GRID_SIZE / 8;
const CELLS_PER_ROW = 38; // 152 days / 4 rows = 38 cells per row

class YearHeatMap extends YearHeatMapBack {
    render() {
        const { dataToDisplay } = this.state;

        // Calculate width to fit exactly CELLS_PER_ROW cells per row
        const cellTotalSize = GRID_SIZE + GRID_MARGIN * 2;
        const heatMapWidth = CELLS_PER_ROW * cellTotalSize;

        return (
            <ScrollView
                ref={this.scrollViewRef}
                style={this.props.style}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
            >
                <View style={{ width: heatMapWidth }}>
                    <HeatMap data={dataToDisplay} gridSize={GRID_SIZE} />
                </View>
            </ScrollView>
        );
    }
}

export default YearHeatMap;
