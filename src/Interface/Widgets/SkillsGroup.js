import * as React from 'react';
import { View, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { StyleProp, ViewStyle } from 'react-native';

import user from '../../Managers/UserManager';
import langManager from '../../Managers/LangManager';

import { Button, Text, Icon } from '../Components';

const SkillsGroupProps = {
    /** @type {StyleProp<ViewStyle>} */
    style: {},

    /** @type {Boolean} Show button to open "skills" page */
    showAllButton: false
}

class SkillsGroup extends React.Component {
    state = {
        skills: user.activities.GetLasts()
    }

    componentDidMount() {
        this.activitiesListener = user.activities.allActivities.AddListener(() => {
            this.setState({ skills: user.activities.GetLasts() });
        });
    }

    componentWillUnmount() {
        user.activities.allActivities.RemoveListener(this.activitiesListener);
    }

    openSkills = () => user.interface.ChangePage('skills');
    openSkill = (ID) => user.interface.ChangePage('skill', { skillID: ID });

    renderSkill = ({ item: { ID, Name, Logo } }) => {
        return (
            <TouchableOpacity
                style={styles.skill}
                onPress={() => this.openSkill(ID)}
                activeOpacity={.6}
            >
                <View style={styles.skillImage}>
                    <Icon xml={Logo} size={52} color='main1' />
                </View>
                <Text fontSize={12}>{Name}</Text>
            </TouchableOpacity>
        );
    }

    render() {
        const { style, showAllButton } = this.props;
        const lang = langManager.curr['other'];

        return (
            <>
                <FlatList
                    style={style}
                    data={this.state.skills}
                    renderItem={this.renderSkill}
                    keyExtractor={(item, index) => 'skill-' + index}
                    numColumns={3}
                />

                {showAllButton && (
                    <Button
                        style={styles.btnSmall}
                        onPress={this.openSkills}
                    >
                        {lang['widget-skills-all']}
                    </Button>
                )}
            </>
        );
    }
}

SkillsGroup.prototype.props = SkillsGroupProps;
SkillsGroup.defaultProps = SkillsGroupProps;

const styles = StyleSheet.create({
    skill: {
        width: '33%',
        alignItems: 'center'
    },
    skillImage: {
        width: '60%',
        aspectRatio: 1,
        marginBottom: 6,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 4
    },
    btnSmall: {
        height: 46,
        marginTop: 24,
        marginHorizontal: 24,
        borderRadius: 8
    }
});

export default SkillsGroup;