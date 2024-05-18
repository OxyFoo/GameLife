import React from 'react';
import { View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import styles from './style';
import StartHelp from './help';
import DailyQuestBack from './back';
import langManager from 'Managers/LangManager';
import dataManager from 'Managers/DataManager';

import { SimpleContainer, Text, Button, Icon } from 'Interface/Components';

/**
 * @typedef {import('Class/Shop').Icons} Icons
 */

class DailyQuest extends DailyQuestBack {
    render() {
        return (
            <SimpleContainer
                ref={ref => this.refContainer = ref}
                style={this.props.style}
            >
                <SimpleContainer.Header>
                    {this.renderHeader()}
                </SimpleContainer.Header>

                <SimpleContainer.Body style={styles.containerItem}>
                    {this.renderBody()}
                </SimpleContainer.Body>
            </SimpleContainer>
        );
    }

    renderHeader = () => {
        const lang = langManager.curr['daily-quest'];
        const titleColors = ['#384065', '#B83EFFE3'];

        /** @type {Icons} */
        let icon = 'arrowLeft';

        return (
            <LinearGradient
                colors={titleColors}
                start={{ x: 0, y: -2 }}
                end={{ x: 1, y: 2 }}
                style={styles.headerStyle}
            >
                <View style={styles.buttonInfo}>
                    <Button
                        style={styles.headerButtonLeft}
                        onPress={StartHelp.bind(this)}
                    >
                        <Icon
                            containerStyle={styles.iconStaticHeader}
                            icon={'info'}
                            size={24}
                        />
                    </Button>
                    <Text color={'primary'}>
                        {lang['container-title']}
                    </Text>
                </View>

                {icon !== null && (
                    <Button
                        ref={ref => this.refOpenStreakPopup = ref}
                        style={styles.headerButtonRight}
                    >
                        <Icon
                            containerStyle={styles.iconStaticHeader}
                            icon={icon}
                            size={24}
                            angle={180}
                        />
                    </Button>
                )}
            </LinearGradient>
        )
    }

    renderBody = () => {
        const lang = langManager.curr['nonzerodays'];
        const { selectedSkill } = this.state;

        if (selectedSkill === null) return null;

        const skillName = langManager.GetText(
            dataManager.skills.GetByID(selectedSkill).Name
        );

        return (
            <View>
                <Text>[Activité à faire aujourd'hui, 1h parmis:]</Text>
                <Text style={styles.itemSkill}>
                    {`- ${skillName}`}
                </Text>
                <Button onPress={this.update}>
                    [Refresh]
                </Button>
            </View>
        );
    }
}

export default DailyQuest;
