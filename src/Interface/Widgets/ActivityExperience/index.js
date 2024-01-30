import * as React from 'react';
import { FlatList } from 'react-native';

import styles from './style';
import ActivityExperienceBack from './back';

import { Container, Text } from 'Interface/Components';

/**
 * @typedef {import('./back').Stat} Stat
 */

class ActivityExperience extends ActivityExperienceBack {
    /** @param {{ item: Stat }} param0 */
    renderExperience = ({ item: { key, name, value } }) => (
        <Text containerStyle={styles.itemContainer} style={styles.item}>
            {'+ ' + value + ' ' + name}
        </Text>
    );

    render() {
        const { title, data } = this.state;

        return (
            <Container
                text={title}
                style={[styles.fullWidth, this.props.style]}
                styleHeader={styles.container}
            >
                <FlatList
                    style={styles.flatlist}
                    columnWrapperStyle={styles.flatlistWrapper}
                    scrollEnabled={false}
                    data={data}
                    keyExtractor={(item, i) => 'xp-' + i}
                    numColumns={2}
                    renderItem={this.renderExperience}
                />
            </Container>
        );
    }
}

export default ActivityExperience;
