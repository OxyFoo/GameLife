import React from 'react';
import { View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import styles from './style';
import TodayActivitiesPieChartBack from './back';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import { Button, Text } from 'Interface/Components';
import { PieChart } from 'Interface/Widgets';

class TodayActivitiesPieChart extends TodayActivitiesPieChartBack {
    render() {
        const { style } = this.props;
        const lang = langManager.curr['home'];

        return (
            <View ref={this.props.refParent} style={[styles.container, style]}>
                {/* Absolute add button */}
                <Button
                    style={styles.absoluteAddButton}
                    appearance='uniform'
                    color='transparent'
                    icon='add-outline'
                    fontColor='gradient'
                    onPress={this.onAddActivityPress}
                />

                {/* Button with Gradient background for the chart container */}
                <Button
                    style={styles.parentButton}
                    appearance='uniform'
                    color='transparent'
                    onPress={this.switchDonutLegends}
                >
                    <LinearGradient
                        key={`gradient-${this.state.showDonut}`}
                        style={[styles.gradientContainer, this.props.style]}
                        colors={[
                            themeManager.GetColor('main1', { opacity: 0.45 }),
                            themeManager.GetColor('main1', { opacity: 0.12 })
                        ]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                    >
                        <View style={styles.content}>
                            <View style={styles.header} pointerEvents='box-none'>
                                <Text fontSize={16} color='white' style={styles.title} pointerEvents='none'>
                                    {lang['today-activity']}
                                </Text>
                            </View>

                            {!this.state.focusedActivity || !this.state.dataToDisplay ? (
                                /* If there is no focused activity or no data to display, show message */
                                <View style={styles.notEnoughData}>
                                    <Text fontSize={16}>{lang['chart-today-notmuch']}</Text>
                                </View>
                            ) : (
                                /* Pie chart view */
                                <PieChart
                                    data={this.state.dataToDisplay}
                                    isDonutView={this.state.showDonut}
                                    focusedActivity={this.state.focusedActivity}
                                />
                            )}
                        </View>
                    </LinearGradient>
                </Button>
            </View>
        );
    }
}

export { TodayActivitiesPieChart };
