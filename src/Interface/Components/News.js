import * as React from 'react';
import { View, StyleSheet, Linking } from 'react-native';

import user from 'Managers/UserManager';
import dataManager from 'Managers/DataManager';

import Text from 'Interface/Components/Text';
import Icon from 'Interface/Components/Icon';
import Button from 'Interface/Components/Button';
import { PAGES } from 'Managers/PageManager';

/**
 * @typedef {import('Managers/PageManager').PageName} PageName
 */

/**
 * @param {*} eventText String to parse: if it starts with 'https://', open
 *                      the link in the browser, else change the page
 */
const buttonEvent = (eventText) => {
    if (eventText.startsWith('https://')) {
        Linking.openURL(eventText);
    } else if (PAGES.hasOwnProperty(eventText)) {
        user.interface.ChangePage(eventText);
    }
};

const renderQuote = (currentQuote) => currentQuote !== null && (
    <View style={styles.quote}>
        <Text style={styles.citation}>{currentQuote.Quote}</Text>
        <Text style={styles.author}>{currentQuote.Author}</Text>
    </View>
);

/**
 * @typedef {import('Data/News').New} New
 * @param {New} Nw
 */
const renderNew = (Nw) => {
    const RenderInteraction = () => {
        const svgIcon = Nw.Icon;

        if (Nw.ButtonText !== null) {
            const eventText = Nw.ButtonEvent;

            let event = undefined;
            if (eventText !== null) {
                event = buttonEvent.bind(null, eventText);
            }

            return (
                <View style={styles.newInteraction}>
                    <Button
                        style={styles.newButton}
                        color='main2'
                        iconXml={svgIcon === null ? undefined : svgIcon}
                        iconColor='white'
                        onPress={event}
                        fontSize={12}
                        borderRadius={8}
                    >
                        {dataManager.GetText(Nw.ButtonText)}
                    </Button>
                </View>
            );
        }

        if (svgIcon !== null) {
            return (
                <Icon
                    style={styles.newIcon}
                    size={52}
                    color='main2'
                    xml={svgIcon}
                />
            );
        }

        return null;
    };

    const RenderText = () => {
        const text = dataManager.GetText(Nw.Content);
        return (
            <View style={styles.newText}>
                <Text>{text}</Text>
            </View>
        )
    };

    const reverse = Nw.TextAlign === 'right' && RenderInteraction() !== null;
    const align = reverse ? 'row-reverse' : 'row';

    return (
        <View style={[styles.new, { flexDirection: align }]}>
            <RenderText />
            {Nw.ButtonText !== null && <View style={styles.separator} />}
            <RenderInteraction />
        </View>
    );
};

const News = () => {
    let pages = [];

    // First tab: Random quote
    const currentQuote = dataManager.quotes.currentQuote;
    pages.push(renderQuote(currentQuote));

    // Others tab: News (if online)
    if (dataManager.news.news.length) {
        try {
            pages.push(...dataManager.news.news.map(renderNew));
        } catch (e) {
            user.interface.console.AddLog('error', 'News loading failed: ' + e);
        }
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
    },

    new: {
        padding: '5%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    separator: {
        width: 0,
        height: '100%',
        marginHorizontal: 12
    },
    newInteraction: {
        flex: 1
    },
    newButton: {
        height: 48,
        paddingHorizontal: 12
    },
    newText: {
        flex: 2
    },
    newIcon: {
        flex: .6,
        alignItems: 'center',
        justifyContent: 'center'
    },

    quote: {
        padding: '5%'
    }
});

export default News;
