import * as React from 'react';
import { FlatList, StyleSheet } from 'react-native';

import user from '../../Managers/UserManager';
import dataManager from '../../Managers/DataManager';

import { Container, Text } from '../Components';
import langManager from '../../Managers/LangManager';

const ActivityExperienceProps = {
    skillID: 0,
    durationHour: 1
}

class ActivityExperience extends React.Component {
    renderExperience = ({ item }) => {
        const { skillID, durationHour } = this.props;
        const skill = dataManager.skills.GetByID((skillID));
        const pts = skill.Stats[item] * durationHour;
        return (
            <Text containerStyle={{ width: '50%' }} style={styles.attr}>
                {'+' + pts + ' ' + langManager.curr['statistics']['names'][item]}
            </Text>
        )
    }
    render() {
        const { skillID, durationHour } = this.props;
        const skill = dataManager.skills.GetByID((skillID));

        if (skill === null || skill.XP <= 0) {
            return (<></>);
        }

        const containerTitle = '+' + (skill.XP * durationHour) + ' ' + langManager.curr['level']['xp'];
        return (
            <Container text={containerTitle} style={styles.fullWidth}>
                <FlatList
                    style={{ flexGrow: 1 }}
                    columnWrapperStyle={{ marginBottom: 8 }}
                    scrollEnabled={false}
                    data={Object.keys(user.stats).filter(stat => skill.Stats[stat] > 0)}
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