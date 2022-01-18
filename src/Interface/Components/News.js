import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import dataManager from '../../Managers/DataManager';

import Text from './Text';
import Button from './Button';
import user from '../../Managers/UserManager';

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
        const input = dataManager.news[i];
        let component = <></>;

        if (input.length === 1) {
            const text = input[0];
            component = <Text>{text}</Text>;
        } else

        if (input.length === 2) {
            const text = input[0];
            let button = <></>;
            
            const [ btType, btText, redirectType, redirectValue ] = input[1].split(';');

            if (btType === 'button') {
                let redirection = () => {};
                if (redirectType === 'page') {
                    redirection = () => user.interface.ChangePage(redirectValue);
                }
                button = <Button color='main2' onPress={redirection}>{btText}</Button>;
            }
            component = <>
                            <Text>{text}</Text>
                            {button}
                        </>;
        }

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