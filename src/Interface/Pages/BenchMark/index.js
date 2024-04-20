import * as React from 'react';
import { View, FlatList } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';

import styles from './style';
import BackBenchMark from './back';

import { Page } from 'Interface/Global';
import { Button, Text } from 'Interface/Components';
import { PageHeader } from 'Interface/Widgets';

/**
 * @typedef {import('./benchmark').BenchResult} BenchResult
 */

class BenchMark extends BackBenchMark {
    render() {
        const { benchmarking, activitiesCount, activitiesLoaded, benchmarkResults, benchmarkTimes } = this.state;

        return (
            <Page
                ref={ref => this.refPage = ref}
                bottomOffset={96}
                canScrollOver
            >
                <PageHeader
                    style={styles.header}
                    onBackPress={this.handleBackPress}
                />

                <View style={styles.content}>
                    <Text fontSize={24}>BenchMark</Text>

                    <Text>{`Current activities: ${activitiesCount}`}</Text>
                    <Text>{`Activities extended for tests: ${activitiesLoaded.length}`}</Text>

                    <Button
                        color='main1'
                        onPress={this.startBenchMark}
                        loading={benchmarking}
                    >
                        Start
                    </Button>

                    {benchmarking && (
                        <Text>Running... It will freeze the app for a minute</Text>
                    )}
                </View>

                {benchmarkResults.length > 0 && (
                    <View style={styles.content}>
                        <BarChart
                            barWidth={22}
                            noOfSections={2}
                            barBorderRadius={4}
                            frontColor={'#4A90E2'}
                            yAxisTextStyle={styles.barChart}
                            xAxisLabelTextStyle={styles.barChart}
                            data={benchmarkTimes}
                            yAxisThickness={0}
                            xAxisThickness={0}
                        />

                        <Text style={styles.titleResult} fontSize={20}>
                            {`Times for 10k activities`}
                        </Text>

                        <FlatList
                            data={benchmarkResults}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={this.renderItem}
                        />
                    </View>
                )}
            </Page>
        );
    }

    /** @param {{ item: BenchResult }} param0 */
    renderItem = ({ item }) => {
        return (
            <View style={styles.item}>
                <Text>{item.name}</Text>
                <Text>{`${item.time.toFixed(2)}ms`}</Text>
            </View>
        );
    }
}

export default BenchMark;
