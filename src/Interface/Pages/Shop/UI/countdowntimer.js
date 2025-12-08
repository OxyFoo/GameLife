import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Icon, Text } from 'Interface/Components';

/**
 * Calculate time remaining until midnight (next day reset)
 * @returns {{ hours: number, minutes: number, seconds: number }}
 */
function getTimeUntilMidnight() {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setDate(midnight.getDate() + 1);
    midnight.setHours(0, 0, 0, 0);

    const diff = midnight.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return { hours, minutes, seconds };
}

/**
 * Format time with leading zeros
 * @param {number} value
 * @returns {string}
 */
function formatTime(value) {
    return value.toString().padStart(2, '0');
}

/**
 * Timer component that shows countdown to midnight
 */
export class CountdownTimer extends React.Component {
    state = {
        hours: 0,
        minutes: 0,
        seconds: 0
    };

    /** @type {NodeJS.Timeout | null} */
    interval = null;

    componentDidMount() {
        this.updateTime();
        this.interval = setInterval(this.updateTime, 1000);
    }

    componentWillUnmount() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }

    updateTime = () => {
        const time = getTimeUntilMidnight();
        this.setState(time);
    };

    render() {
        const { hours, minutes, seconds } = this.state;

        return (
            <View style={styles.timerContainer}>
                <Icon icon='clock' size={16} color='border' />
                <Text fontSize={14} color='border'>
                    {formatTime(hours)}:{formatTime(minutes)}:{formatTime(seconds)}
                </Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    timerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF15',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        gap: 6
    }
});
