import React from 'react';
import { View, StyleSheet } from 'react-native';

import { Text } from 'Interface/Components';
import langManager from 'Managers/LangManager';

/**
 * Header component with title and date
 * @param {object} props
 * @param {string} props.username - User's name
 * @param {Date} props.date - Date to display
 * @param {string} [props.titleTemplate] - Title template with {} placeholder
 */
const Header = ({ username, date, titleTemplate = 'Today I did - {}' }) => {
    const title = titleTemplate.replace('{}', username);
    const formattedDate = date.toLocaleDateString(langManager.currentLangageKey === 'en' ? 'en-US' : 'fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    return (
        <View style={styles.header}>
            <Text style={styles.title} color='primary'>
                {title}
            </Text>
            <Text style={styles.dateText} color='secondary'>
                {formattedDate}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        alignItems: 'center',
        marginBottom: 12
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 4
    },
    dateText: {
        fontSize: 14
    }
});

export default Header;
