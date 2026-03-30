import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';

import YearHeatMapBack from './back';

import { HeatMap, Text } from 'Interface/Components';

const GRID_SIZE = 10;
const GRID_MARGIN = GRID_SIZE / 8;
const CELLS_PER_ROW = 91; // 364 days / 4 rows = 91 cells per row

class YearHeatMap extends YearHeatMapBack {
    render() {
        const { dataToDisplay, monthLabels } = this.state;

        // Calculate width to fit exactly CELLS_PER_ROW cells per row
        const cellTotalSize = GRID_SIZE + GRID_MARGIN * 2;
        const heatMapWidth = CELLS_PER_ROW * cellTotalSize;

        return (
            <ScrollView
                ref={this.scrollViewRef}
                style={this.props.style}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                onContentSizeChange={this.handleContentSizeChange}
            >
                <View style={{ width: heatMapWidth }}>
                    <View style={styles.monthLabelContainer}>
                        {monthLabels.map((month, index) => (
                            <Text
                                key={`month-${index}`}
                                color='secondary'
                                fontSize={10}
                                style={[
                                    styles.monthLabel,
                                    {
                                        left: month.position * cellTotalSize
                                    }
                                ]}
                            >
                                {month.name}
                            </Text>
                        ))}
                    </View>
                    <HeatMap data={dataToDisplay} gridSize={GRID_SIZE} />
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    monthLabelContainer: {
        flexDirection: 'row',
        height: 12,
        marginBottom: 4
    },
    monthLabel: {
        position: 'absolute'
    }
});

export default YearHeatMap;
