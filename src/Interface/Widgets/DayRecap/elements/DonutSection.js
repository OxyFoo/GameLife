import React from 'react';
import { View, StyleSheet } from 'react-native';

import { DonutChart, Text } from 'Interface/Components';

/**
 * @typedef {object} SkillData
 * @property {string} name - Skill name
 * @property {number} durationMinutes - Duration in minutes
 */

/**
 * Donut chart with activities list
 * @param {object} props
 * @param {Array<{label: string, value: number, stroke: string}>} props.donutData - Data for donut chart
 * @param {string} props.totalTime - Formatted total time
 * @param {SkillData[]} props.skills - List of skills
 * @param {(minutes: number) => string} props.formatDuration - Duration formatter function
 */
const DonutSection = ({ donutData, totalTime, skills, formatDuration }) => {
    return (
        <View style={styles.mainContent}>
            <View style={styles.donutContainer}>
                <DonutChart data={donutData} size={80} strokeWidth={7} strokeLinecap='round' delay={0} segmentGap={10}>
                    <View style={styles.donutCenter}>
                        <Text style={styles.donutCenterText} color='primary'>
                            {totalTime}
                        </Text>
                    </View>
                </DonutChart>
            </View>

            <View style={styles.activitiesList}>
                {skills.slice(0, 5).map((skill, index) => (
                    <View key={index} style={styles.activityItem}>
                        <Text style={styles.activityName} color='primary'>
                            {skill.name}{' '}
                            <Text style={styles.activityDuration} color='secondary'>
                                - {formatDuration(skill.durationMinutes)}
                            </Text>
                        </Text>
                    </View>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    mainContent: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12
    },
    donutContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12
    },
    donutCenter: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center'
    },
    donutCenterText: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    activitiesList: {
        flex: 1,
        overflow: 'hidden'
    },
    activityItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 2
    },
    activityName: {
        flex: 1,
        fontSize: 13,
        textAlign: 'left'
    },
    activityDuration: {
        flexShrink: 0,
        fontSize: 13,
        textAlign: 'left'
    }
});

export default DonutSection;
