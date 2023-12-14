import * as React from 'react';
import { View, FlatList } from 'react-native';

import styles from './style';
import user from 'Managers/UserManager';

import { Text, Icon, Button } from 'Interface/Components';

import DayClock from '../../../Components/DayClock';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 *
 * @typedef {import('Class/Quests').Quest} Quest
 * @typedef {import('Managers/ThemeManager').ThemeText} ThemeText
 */

const QuestProps = {
    /** @type {StyleProp} */
    style: {},

    /** @type {Quest | null} */
    quest: null,

    /** Icon to drag => onTouchStart event (quest only) */
    onDrag: () => {}
};

class QuestElement extends React.Component {
    /** @param {QuestProps} props */
    constructor(props) {
        super(props);

        if (props.quest === null) return;
    }

    renderDay = ({ item, index }) => {
        /** @type {import('Interface/Components/DayClock/back').DayClockStates[]} */
        const states = [
            'normal',
            'normal',
            'full',
            'full',
            'filling',
            'disabled',
            'disabled'
        ];
        const randomState = states[index];

        return (
            <DayClock
                day={item}
                isToday={index === 0}
                state={randomState}
                fillingValue={.5}
            />
        );
    }

    renderContentScrollable() {
        const { quest, onDrag } = this.props;
        if (quest === null) return null;

        const { title } = quest;

        return (
            <View
                style={styles.itemScrollable}
                onTouchStart={() => onDrag()}
            >
                <View style={styles.scrollableHeader}>
                    <Icon icon='default' color='main1' />
                    <Text style={styles.scrollableTitle}>{title}</Text>
                </View>
                <Icon icon='moveVertical' color='main1' />
            </View>
        );
    }

    render() {
        const { style, quest } = this.props;
        if (quest === null) return null;

        const { title } = quest;
        const openQuest = () => user.interface.ChangePage('myqueststats', { quest }, true);

        return (
            <View style={[styles.item, style]}>
                <Button
                    style={styles.content}
                    onPress={openQuest}
                >
                    <View style={styles.header}>
                        <View style={styles.headerTitle}>
                            <Icon icon='default' color='main1' />
                            <Text style={styles.title}>{title}</Text>
                        </View>
                        <View style={styles.headerStreak}>
                            <Text style={styles.streak}>{'[182]'}</Text>
                            <Icon icon='flame' />
                        </View>
                    </View>

                    <FlatList
                        data={[0,1,2,3,4,5,6]}
                        numColumns={7}
                        keyExtractor={item => 'quest-day-' + item.toString()}
                        columnWrapperStyle={styles.flatlistColumnWrapper}
                        renderItem={this.renderDay}
                    />
                </Button>
            </View>
        );
    }
}

QuestElement.prototype.props = QuestProps;
QuestElement.defaultProps = QuestProps;

export default QuestElement;
