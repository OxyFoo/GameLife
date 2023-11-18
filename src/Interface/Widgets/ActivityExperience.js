import * as React from 'react';
import { FlatList, StyleSheet } from 'react-native';

import user from 'Managers/UserManager';
import dataManager from 'Managers/DataManager';
import langManager from 'Managers/LangManager';

import { Round } from 'Utils/Functions';
import { Container, Text } from 'Interface/Components';

/**
 * @typedef {{ key: string, name: string, value: number }} Stat
 */

const ActivityExperienceProps = {
    /** @type {number} Skill ID or 0 to unselect */
    skillID: 0,

    /** @type {number} Duration of the activity in minutes */
    duration: 60
}

class ActivityExperience extends React.Component {
    state = {
        /** @type {string} */
        title: '',

        /** @type {Array<Stat>} */
        data: []
    };

    componentDidMount() {
        this.updateSkill();
    }

    componentDidUpdate(prevProps) {
        const { skillID, duration } = this.props;

        if (prevProps.skillID !== skillID || prevProps.duration !== duration) {
            this.updateSkill();
            return true;
        }

        return false;
    }

    updateSkill = () => {
        const { title, data } = this.state;
        const { skillID, duration } = this.props;

        const skill = dataManager.skills.GetByID(skillID);
        if (skill === null) {
            if (title.length > 0 || data.length > 0) {
                this.setState({ title: '', data: [] });
            }
            return;
        }

        const XPamount = Round(skill.XP * (duration / 60), 2);
        const XPtext = langManager.curr['level']['xp'];

        /** @type {Stat[]} */
        const newData = user.statsKey
            .filter(stat => skill.Stats[stat] > 0)
            .map(statKey => ({
                key: statKey,
                name: langManager.curr['statistics']['names'][statKey],
                value: Round(skill.Stats[statKey] * (duration / 60), 2)
            }));

        this.setState({ title: `+ ${XPamount} ${XPtext}`, data: newData });
    }

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
                style={styles.fullWidth}
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

ActivityExperience.prototype.props = ActivityExperienceProps;
ActivityExperience.defaultProps = ActivityExperienceProps;

const styles = StyleSheet.create({
    fullWidth: {
        width: '100%',
        marginBottom: 48
    },
    container: {
        justifyContent: 'center'
    },
    flatlist: {
        flexGrow: 1
    },
    flatlistWrapper: {
        marginBottom: 8
    },
    item: {
        width: '100%',
        textAlign: 'left',
        fontSize: 18
    },
    itemContainer: {
        width: '50%'
    }
});

export default ActivityExperience;