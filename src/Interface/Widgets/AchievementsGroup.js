import * as React from 'react';
import { TouchableOpacity, FlatList, StyleSheet } from 'react-native';

import user from 'Managers/UserManager';
import dataManager from 'Managers/DataManager';
import langManager from 'Managers/LangManager';

import { Button, Separator, Text } from 'Interface/Components';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 */

const AchievementsGroupProps = {
    /** @type {StyleProp} */
    style: {},

    /** @type {boolean} Show button to open "skills" page */
    showAllButton: false
}

class AchievementsGroup extends React.Component {
    state = {
        lastAchievements: user.achievements.GetLast()
    }

    componentDidMount() {
        this.achievementsListener = user.achievements.allSolved.AddListener(() => {
            this.setState({
                lastAchievements: user.achievements.GetLast()
            });
        });
    }
    componentWillUnmount() {
        user.achievements.allSolved.RemoveListener(this.achievementsListener);
    }

    openAchievements = () => user.interface.ChangePage('achievements');
    onAchievementPress = (ID) => user.achievements.ShowCardPopup(ID);

    renderAchievement = ({ item: { Name, ID } }) => {
        const Title = dataManager.GetText(Name);
        return (
            <TouchableOpacity
                onPress={() => this.onAchievementPress(ID)}
                activeOpacity={.6}
            >
                <Text style={styles.text}>{Title}</Text>
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
                    data={this.lastAchievements}
                    renderItem={this.renderAchievement}
                    keyExtractor={(item, index) => 'skill-' + index}
                    ItemSeparatorComponent={() => (
                        <Separator.Horizontal style={{ height: .4 }} color='main1' />
                    )}
                />

                {showAllButton && (
                    <Button
                        style={styles.btnSmall}
                        onPress={this.openAchievements}
                    >
                        {lang['widget-achievements-all']}
                    </Button>
                )}
            </>
        );
    }
}

AchievementsGroup.prototype.props = AchievementsGroupProps;
AchievementsGroup.defaultProps = AchievementsGroupProps;

const styles = StyleSheet.create({
    text: {
        marginVertical: 12,
        fontSize: 16
    },
    btnSmall: {
        height: 46,
        marginTop: 24,
        marginHorizontal: 24,
        borderRadius: 8
    }
});

export default AchievementsGroup;