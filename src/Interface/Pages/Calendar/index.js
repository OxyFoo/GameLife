import * as React from 'react';
import { Animated, View, FlatList } from 'react-native';

import BackCalendar from './back';
import styles from './style';

import { Text, Button, Icon } from 'Interface/Components';
import themeManager from 'Managers/ThemeManager';

class Calendar extends BackCalendar {
    render() {
        return (
            <View style={styles.page}>
                <Text style={styles.title} color='secondary'>
                    [Activités du jour]
                </Text>

                <FlatList
                    data={Array(5).fill(0)}
                    renderItem={this.renderActivity}
                    keyExtractor={(_, index) => index.toString()}
                    ItemSeparatorComponent={() => <View style={styles.activitySeparator} />}
                />
            </View>
        );
    }

    renderActivity = () => {
        const borderColor = {
            borderColor: themeManager.GetColor('border')
        };

        return (
            <Button
                style={[borderColor, styles.activity]}
                styleContent={styles.activityButtonContent}
                appearance='uniform'
                color='transparent'
            >
                <View style={styles.activityChild}>
                    <Icon icon='home' size={24} color='primary' />
                    <Text style={styles.activityHour}>[9:00 / 11:00]</Text>
                </View>
                <View style={styles.activityChild}>
                    <Text style={styles.activityName}>[Nom de l'activité]</Text>
                </View>
            </Button>
        );
    };
}

export default Calendar;
