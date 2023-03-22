import * as React from 'react';
import { View, StyleSheet, Linking } from 'react-native';

import user from '../../Managers/UserManager';
import dataManager from '../../Managers/DataManager';

import Text from './Text';
import Icon from './Icon';
import Button from './Button';

const renderQuote = (currentQuote) => quote = currentQuote === null ? null : (
    <View style={{ padding: '5%' }}>
        <Text style={styles.citation}>{currentQuote.Quote}</Text>
        <Text style={styles.author}>{currentQuote.Author}</Text>
    </View>
);

/**
 * @typedef {import('../../Data/News').New} New
 * @param {New} Nw
 */
const renderNew = (Nw) => {
    const renderInteraction = () => {
        const svgIcon = Nw.Icon;
        const btText = Nw.ButtonText === null ? null : dataManager.GetText(Nw.ButtonText);

        if (btText !== null) {
            const eventText = Nw.ButtonEvent;
            const event = eventText === null ? undefined : () => {
                if (eventText.startsWith('https://')) {
                    Linking.openURL(eventText);
                } else {
                    user.interface.ChangePage(eventText);
                }
            };
            return (
                <View style={styles.newInteraction}>
                    <Button
                        style={styles.newButton}
                        color='main2'
                        iconXml={svgIcon === null ? undefined : svgIcon}
                        iconColor='#ffffff'
                        onPress={event}
                        fontSize={12}
                        borderRadius={8}
                    >
                        {btText}
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

    const renderText = () => {
        const text = dataManager.GetText(Nw.Content);
        return (
            <View style={styles.newText}>
                <Text>{text}</Text>
            </View>
        )
    };

    const renderT = renderText();
    const renderI = renderInteraction();

    const align = Nw.TextAlign === 'right' && renderI !== null ? 'row-reverse' : 'row';
    const styleAlign = { flexDirection: align };
    return (
        <View style={[styles.new, styleAlign]}>
            {renderT}
            {Nw.ButtonText !== null && <View style={styles.separator} />}
            {renderI}
        </View>
    );
}

const News = () => {
    let pages = [];

    // First tab: Random quote
    const currentQuote = dataManager.quotes.currentQuote;
    pages.push(renderQuote(currentQuote));

    // Others tab: News (if online)
    if (dataManager.news.news.length) {
        try       { pages = [...pages, ...dataManager.news.news.map(renderNew)]; }
        catch (e) { user.interface.console.AddLog('error', 'News loading failed: ' + e); }
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
    }
});

export default News;