import React from 'react';
import { View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import styles from './style';
import TodayPieChartBack from './back';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import { Button, Text } from 'Interface/Components';
import { PieChart } from 'Interface/Widgets';

class TodayPieChart extends TodayPieChartBack {
    render() {
        const lang = langManager.curr['home'];

        return (
            <>
                {/* Absolute Header with title and add button */}
                <View style={styles.header}>
                    <Text fontSize={16} color='white' style={styles.title}>
                        {lang['today-activity']}
                    </Text>
                    <Button
                        style={styles.sectionTitleAddButton}
                        appearance='uniform'
                        color='transparent'
                        icon='add-outline'
                        fontColor='gradient'
                        onPress={this.onAddActivityPress}
                    />
                </View>

                <Button
                    style={styles.button}
                    appearance='uniform'
                    color='transparent'
                    onPress={this.switchDonutLegends}
                >
                    <LinearGradient
                        style={[styles.gradientContainer, this.props.style]}
                        colors={[
                            themeManager.GetColor('main1', { opacity: 0.45 }),
                            themeManager.GetColor('main1', { opacity: 0.12 })
                        ]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        onLayout={this.onLayout}
                    >
                        <View style={styles.container}>
                            <View style={styles.content}>
                                {/* If there is no focused activity or no data to display, show message */}
                                {!this.state.focusedActivity || !this.state.dataToDisplay ? (
                                    <View style={styles.notEnoughData}>
                                        <Text style={styles.notEnoughDataText}>{lang['chart-today-notmuch']}</Text>
                                    </View>
                                ) : (
                                    /* Pie chart view */
                                    <PieChart
                                        data={this.state.dataToDisplay}
                                        isDonutView={this.state.showDonut}
                                        //dataFullDay={this.state.dataToDisplayFullDay}
                                        focusedActivity={this.state.focusedActivity}
                                        focusedActivityFullDay={this.state.focusedActivityFullDay}
                                    />
                                )}
                            </View>
                        </View>
                    </LinearGradient>
                </Button>
            </>
        );
    }
}

export default TodayPieChart;
