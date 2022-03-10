import * as React from 'react';
import { FlatList, StyleSheet } from 'react-native';

import user from '../../Managers/UserManager';
import dataManager from '../../Managers/DataManager';
import langManager from '../../Managers/LangManager';

import { Container, Text } from '../Components';

const ActivityExperienceProps = {
    skillID: 0,
    duration: 1
}

class ActivityExperience extends React.Component {
    renderExperience = ({ item: { statKey, statName, statValue } }) => {
        return (
            <Text containerStyle={{ width: '50%' }} style={styles.attr}>
                {'+' + statValue + ' ' + statName}
            </Text>
        );
    }

    render() {
        const { skillID, duration } = this.props;

        const skill = dataManager.skills.GetByID(skillID);
        if (skill === null || skill.XP <= 0) {
            return (<></>);
        }

        const XPamount = skill.XP * (duration / 60);
        const XPtext = langManager.curr['level']['xp'];
        const containerTitle = `+ ${XPamount} ${XPtext}`;

        const data = user.statsKey
            .filter(stat => skill.Stats[stat] > 0)
            .map(statKey => ({
                statKey: statKey,
                statName: langManager.curr['statistics']['names'][statKey],
                statValue: skill.Stats[statKey] * (duration / 60)
            }));

        return (
            <Container text={containerTitle} style={styles.fullWidth}>
                <FlatList
                    style={{ flexGrow: 1 }}
                    columnWrapperStyle={{ marginBottom: 8 }}
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
    attr: {
        width: '100%',
        textAlign: 'left'
    }
});

export default ActivityExperience;