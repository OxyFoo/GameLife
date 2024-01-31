import * as React from 'react';
import { View, Linking } from 'react-native';

import styles from './style';
import user from 'Managers/UserManager';
import dataManager from 'Managers/DataManager';
import langManager from 'Managers/LangManager';

import Text from 'Interface/Components/Text';
import Icon from 'Interface/Components/Icon';
import Button from 'Interface/Components/Button';
import { Random } from 'Utils/Functions';

/**
 * @typedef {import('Managers/PageManager').PageName} PageName
 * @typedef {import('Data/Quotes').Quote} Quote
 */

/**
 * @param {*} eventText String to parse: if it starts with 'https://', open
 *                      the link in the browser, else change the page
 */
const buttonEvent = (eventText) => {
    if (eventText.startsWith('https://')) {
        Linking.openURL(eventText);
    } else if (user.interface.IsPage(eventText)) {
        user.interface.ChangePage(eventText);
    }
};

/** @param {Quote} currentQuote */
const renderQuote = (currentQuote) => {
    const lang = langManager.curr['quote'];

    if (currentQuote === null) {
        return (
            <View style={styles.quote}>
                <Text style={styles.citation}>{lang['not-found']}</Text>
            </View>
        );
    }

    const anonymousAuthors = lang['anonymous-author-list'];
    const quote = dataManager.GetText(currentQuote.Quote);
    const author = currentQuote.Author || anonymousAuthors[Random(0, anonymousAuthors.length)];
    return (
        <View style={styles.quote}>
            <Text style={styles.citation}>{quote}</Text>
            <Text style={styles.author}>{author}</Text>
        </View>
    );
}

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

export default News;
