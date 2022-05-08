import * as React from 'react';
import { View, TouchableOpacity, StyleSheet, FlatList, Dimensions } from 'react-native';

import BackSkills from '../PageBack/Skills';
import user from '../../Managers/UserManager';
import langManager from '../../Managers/LangManager';
import dataManager from '../../Managers/DataManager';
import themeManager from '../../Managers/ThemeManager';

import { GetDate } from '../../Utils/Time';
import { DateToFormatString } from '../../Utils/Date';
import { PageHeader } from '../Widgets';
import { Page, Input, Text, Button, IconCheckable, Icon } from '../Components';

const SCREEN_WIDTH = Dimensions.get('window').width;

class Skills extends BackSkills {
    constructor(props) {
        super(props);
        this.backgroundActive = { backgroundColor: themeManager.GetColor('main1') };
        this.backgroundCard = { backgroundColor: themeManager.GetColor('backgroundCard') };
    }

    renderCategory = ({ item }) => {
        if (item === 0) {
            return <View style={{ width: 44, height: 44 }} />;
        }
        const { ID, Name, LogoID } = item;
        const checked = this.state.selectedCategories.includes(ID);
        const icon = dataManager.skills.GetXmlByLogoID(LogoID);
        return (
            <IconCheckable
                style={{ marginBottom: 8 }}
                id={ID}
                xml={icon}
                size={32}
                checked={checked}
                onPress={this.onSwitchCategory}
            />
        )
    }

    renderSkill = ({ item }) => {
        const { CategoryID, Creator, ID, LogoID, Logo, Name, Stats, XP, experience } = item;

        const xpLang = langManager.curr['level'];
        const { lvl, xp, lastTime } = experience;
        const last = DateToFormatString(GetDate(lastTime));
        const onPress = () => user.interface.ChangePage('skill', { skillID: ID });

        return (
            <TouchableOpacity style={[styles.skillCard, this.backgroundCard]} onPress={onPress} activeOpacity={.6}>
                <View style={[styles.skillIcon, this.backgroundActive]}>
                    <Icon xml={Logo} size={64} />
                </View>
                <View style={styles.skillContent}>
                    <Text style={{ textAlign: 'left', marginBottom: 6 }} fontSize={24}>{Name}</Text>
                    <Text style={{ textAlign: 'left' }} color='secondary'>{`${xpLang['level']} ${lvl}, ${xp} ${xpLang['xp']}`}</Text>
                    <Text style={{ textAlign: 'left' }} color='secondary'>{last}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    renderEmpty = () => {
        const lang = langManager.curr['skills'];
        return (
            <View style={{ padding: '5%' }}>
                <Text>{lang['text-empty']}</Text>
                <Button
                    style={styles.buttonAddActivity}
                    borderRadius={8}
                    color='main2'
                    onPress={this.addActivity}
                >
                    {lang['text-add']}
                </Button>
            </View>
        )
    }

    render() {
        const lang = langManager.curr['skills'];
        const setheight = (event) => this.setState({ height: event.nativeEvent.layout.height });
        const sortType = this.sortList[this.state.sortSelectedIndex];

        let categories = dataManager.skills.categories;
        if (categories.length % 6 !== 0) categories.push(...Array(6 - (categories.length % 6)).fill(0));

        return (
            <>
                <Page canScrollOver={false} bottomOffset={0} onLayout={setheight}>
                    <PageHeader onBackPress={user.interface.BackPage} />

                    <View style={styles.row}>
                        <Input
                            style={{ width: SCREEN_WIDTH - 80 - 96 }}
                            label={lang['input-search']}
                            text={this.state.search}
                            onChangeText={this.onChangeSearch}
                        />
                        <Button
                            style={{ width: 96, paddingHorizontal: 12 }}
                            borderRadius={8}
                            color='backgroundCard'
                            icon='filter'
                            onPress={this.onSwitchSort}
                        >
                            {sortType}
                        </Button>
                    </View>

                    <FlatList
                        data={categories}
                        columnWrapperStyle={{ justifyContent: 'space-between' }}
                        renderItem={this.renderCategory}
                        numColumns={6}
                        keyExtractor={(item, index) => 'category-' + index}
                    />

                </Page>

                <View style={[styles.skillsParent, { top: this.state.height }]}>
                    <FlatList
                        style={{ flex: 1 }}
                        ListEmptyComponent={this.renderEmpty}
                        data={this.state.skills}
                        renderItem={this.renderSkill}
                        keyExtractor={(item, index) => 'skill-' + index}
                    />
                </View>

                <Button
                    style={styles.buttonSort}
                    color='main2'
                    icon='chevron'
                    iconAngle={this.state.ascending ? 90 : -90}
                    onPress={this.switchOrder}
                />
            </>
        )
    }
}

const styles = StyleSheet.create({
    row: {
        marginBottom: 24,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    skillsParent: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        paddingHorizontal: '5%'
    },
    skillCard: {
        marginBottom: 24,
        borderRadius: 12,
        flexDirection: 'row'
    },
    skillIcon: {
        width: 88,
        margin: 12,
        padding: 12,
        borderRadius: 12
    },
    skillContent: {
        paddingVertical: 12,
        justifyContent: 'space-between'
    },
    buttonAddActivity: {
        width: '50%',
        height: 48,
        marginTop: 24,
        marginLeft: '25%'
    },
    buttonSort: {
        position: 'absolute',
        right: 24,
        bottom: 24,
        aspectRatio: 1,
        paddingHorizontal: 0
    }
});

export default Skills;