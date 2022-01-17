import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import dataManager from '../../Managers/DataManager';

import Text from './Text';

// TODO - Terminer les news (buttons + icons)

const News = () => {
    const currentQuote = dataManager.quotes.currentQuote;
    const quote = currentQuote === null ? null : (
        <View style={{ padding: '5%' }}>
            <Text style={styles.citation}>{currentQuote.Quote}</Text>
            <Text style={styles.author}>{currentQuote.Author}</Text>
        </View>
    );

    let pages = [ quote ];
    for (let i = 0; i < dataManager.news.length; i++) {
        const text = dataManager.news[i][0];
        const component = <Text>{text}</Text>;
        pages.push(component);
    }

    return pages;
};

const styles = StyleSheet.create({
    citation: {
        fontSize: 16,
        textAlign: 'justify'
    },
    author: {
        marginTop: 8,
        marginRight: 24,
        fontSize: 16,
        textAlign: 'right',
        fontWeight: 'bold'
    }
});

export default News;