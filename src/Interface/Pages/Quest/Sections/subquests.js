import * as React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';

import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import { Quests } from 'Interface/Widgets';
import { Icon, Text } from 'Interface/Components';

/**
 * @typedef {import('Class/Quests').Subquest} Subquest
 */

const SectionSubquestsProps = {
    onChange: () => {}
};

class SectionSubquests extends React.Component {
    state = {
        /** @type {Array<Subquest>} */
        subquests: []
    }

    refHelp1 = null;

    /** @param {Array<Subquest>} subquests */
    SetSubquests = (subquests) => {
        this.setState({ subquests: [ ...subquests ] });
    }
    GetSubquests = () => {
        return this.state.subquests;
    }

    addSubquest = () => {
        let { subquests } = this.state;

        if (subquests.length >= 20) {
            const title = langManager.curr['quest']['alert-subquestslimit-title'];
            const text = langManager.curr['quest']['alert-subquestslimit-text'];
            user.interface.popup.Open('ok', [title, text]);
            return;
        }

        subquests.push({
            Checked: false,
            Title: ''
        });

        this.setState({ subquests });
        this.props.onChange();
    }
    onEditSubquest = (index, checked, title) => {
        let { subquests } = this.state;

        subquests.splice(index, 1, {
            Checked: checked,
            Title: title
        });

        this.setState({ subquests });
        this.props.onChange();
    }
    onDeleteSubquest = (index) => {
        let { subquests } = this.state;

        subquests.splice(index, 1);

        this.setState({ subquests });
        this.props.onChange();
    }

    renderSubquests = () => {
        if (!this.state.subquests.length) return null;

        const background = { backgroundColor: themeManager.GetColor('main1') };

        return (
            <View style={[styles.subquestsContainer, background]}>
                <FlatList
                    style={{ height: 'auto' }}
                    data={this.state.subquests}
                    keyExtractor={(item, index) => 'quest-' + index.toString()}
                    renderItem={({ item, index }) => (
                        <Quests.SubquestElement
                            subquest={item}
                            onSubquestEdit={(checked, title) => this.onEditSubquest(index, checked, title)}
                            onSubquestDelete={() => this.onDeleteSubquest(index)}
                        />
                    )}
                />
            </View>
        );
    }

    render() {
        const lang = langManager.curr['quest'];

        return (
            <View ref={ref => this.refHelp1 = ref}>
                <View style={[styles.row, styles.sectionTitle]}>
                    <Text fontSize={22}>{lang['title-subquests']}</Text>
                    <Icon icon='add' onPress={this.addSubquest} />
                </View>

                <this.renderSubquests />
            </View>
        );
    }
}

SectionSubquests.prototype.props = SectionSubquestsProps;
SectionSubquests.defaultProps = SectionSubquestsProps;

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    sectionTitle: {
        marginTop: 32,
        marginBottom: 12
    },
    subquestsContainer: {
        padding: 28,
        paddingTop: 14,
        borderRadius: 8
    }
});

export default SectionSubquests;