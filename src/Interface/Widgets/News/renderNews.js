import * as React from 'react';
import { View, Linking } from 'react-native';

import styles from './style';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import Text from 'Interface/OldComponents/Text';
import Icon from 'Interface/OldComponents/Icon';
import Button from 'Interface/OldComponents/Button';

/**
 * @typedef {import('Data/News').New} New
 * @param {New} Nw
 */
const RenderNew = (Nw) => {
    const reverse = Nw.TextAlign === 'right' && RenderInteraction({ Nw }) !== null;
    const align = reverse ? 'column-reverse' : 'column';

    return (
        <View style={[styles.new, { flexDirection: align }]}>
            <RenderText Nw={Nw} />
            <RenderInteraction Nw={Nw} />
        </View>
    );
};

/**
 * @param {Object} props
 * @param {New} props.Nw
 * @returns {React.ReactElement | null}
 */
const RenderText = ({ Nw }) => {
    const text = langManager.GetText(Nw.Content);
    return (
        <View style={styles.newText}>
            <Text fontSize={16}>{text}</Text>
        </View>
    );
};

/**
 * @param {Object} props
 * @param {New} props.Nw
 * @returns {React.ReactElement | null}
 */
const RenderInteraction = ({ Nw }) => {
    const svgIcon = Nw.Icon;

    if (Nw.ButtonText !== null) {
        const eventText = Nw.ButtonEvent;

        let event;
        if (eventText !== null) {
            event = buttonEvent.bind(null, eventText);
        }

        return (
            <View style={styles.newInteraction}>
                <Button
                    style={styles.newButton}
                    color='main2'
                    iconXml={svgIcon}
                    iconColor='white'
                    onPress={event}
                    fontSize={12}
                    borderRadius={8}
                >
                    {langManager.GetText(Nw.ButtonText)}
                </Button>
            </View>
        );
    }

    if (svgIcon !== null) {
        return <Icon style={styles.newIcon} size={52} color='main2' xml={svgIcon} />;
    }

    return null;
};

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

export default RenderNew;
