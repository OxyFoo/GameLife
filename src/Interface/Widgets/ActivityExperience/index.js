import * as React from 'react';
import { FlatList } from 'react-native';

import styles from './style';
import ActivityExperienceBack from './back';
import langManager from 'Managers/LangManager';

import { Container, Text } from 'Interface/Components';

/**
 * @typedef {import('./back').Stat} Stat
 */

class ActivityExperience extends ActivityExperienceBack {
    render() {
        const { title, data } = this.state;
        const { compact } = this.props;

        return (
            <Container
                text={title}
                style={[styles.fullWidth, this.props.style]}
                styleContainer={styles.container}
                styleHeader={styles.containerHeader}
            >
                <FlatList
                    style={styles.flatlist}
                    columnWrapperStyle={!compact && styles.flatlistWrapper}
                    scrollEnabled={false}
                    data={data}
                    keyExtractor={(item, i) => 'xp-' + i}
                    numColumns={compact ? 3 : 2}
                    renderItem={compact ? this.renderExperienceCompact : this.renderExperience}
                />
            </Container>
        );
    }

    /** @param {{ item: Stat }} param0 */
    renderExperience = ({ item: { key, value } }) => {
        const lang = langManager.curr['statistics']['names'];

        return (
            <Text containerStyle={styles.itemContainer} style={styles.item} fontSize={18}>
                {'+ ' + value + ' ' + lang[key]}
            </Text>
        );
    }

    /** @param {{ item: Stat }} param0 */
    renderExperienceCompact = ({ item: { key, value } }) => {
        const lang = langManager.curr['statistics']['names-min'];

        return (
            <Text containerStyle={styles.itemContainerCompact} style={styles.item} fontSize={14}>
                {'+ ' + value + ' ' + lang[key]}
            </Text>
        );
    }
}

export default ActivityExperience;
