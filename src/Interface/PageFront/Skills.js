import * as React from 'react';
import { View, TouchableOpacity, StyleSheet, FlatList, Dimensions } from 'react-native';

import BackSkills from '../PageBack/Skills';
import user from '../../Managers/UserManager';
import langManager from '../../Managers/LangManager';
import dataManager from '../../Managers/DataManager';
import themeManager from '../../Managers/ThemeManager';

import { PageHeader } from '../Widgets';
import { Page, Input, Text, Button, IconCheckable, Icon } from '../Components';

const SCREEN_HEIGHT = Dimensions.get('window').height;

class Skills extends BackSkills {
    renderCategory = ({ item }) => {
        const { ID, Name, LogoID } = item;
        const checked = this.state.selectedCategories.includes(ID);
        const icon = dataManager.skills.GetXmlByLogoID(LogoID);
        return (
            <IconCheckable
                style={{ margin: '2%' }}
                id={ID}
                xml={icon}
                size={32}
                checked={checked}
                onPress={this.switchCategory}
            />
        )
    }

    renderSkill = ({ item }) => {
        const { CategoryID, Creator, ID, LogoID, Name, Stats, XP } = item;

        const name = dataManager.GetText(Name);
        const icon = dataManager.skills.GetXmlByLogoID(LogoID);
        const backgroundActive = { backgroundColor: themeManager.GetColor('main1') };
        const backgroundCard = { backgroundColor: themeManager.GetColor('backgroundCard') };
        const onPress = () => { console.log('TODO - Go to skill page') };

        return (
            <TouchableOpacity style={[styles.skillCard, backgroundCard]} onPress={onPress} activeOpacity={.6}>
                <View style={[styles.skillIcon, backgroundActive]}>
                    <Icon xml={icon} size={64} />
                </View>
                <View style={styles.skillContent}>
                    <Text style={{ textAlign: 'left', marginBottom: 6 }} fontSize={24}>{name}</Text>
                    <Text style={{ textAlign: 'left' }} color='secondary'>Niveau X, XX XP</Text>
                    <Text style={{ textAlign: 'left' }} color='secondary'>25/00/20</Text>
                </View>
            </TouchableOpacity>
        )
    }

    renderEmpty = () => {
        const lang = langManager.curr['skills'];
        return (
            <View style={{ padding: '5%' }}>
                <Text>{lang['text-empty']}</Text>
                <Button style={styles.buttonAddActivity} borderRadius={8} color='main2'>{lang['text-add']}</Button>
            </View>
        )
    }

    render() {
        const lang = langManager.curr['skills'];
        const setheight = (event) => this.setState({ height: event.nativeEvent.layout.height });

        return (
            <>
                <Page canScrollOver={false} bottomOffset={0} onLayout={setheight}>
                    <PageHeader onBackPress={user.interface.BackPage} />

                    <View style={styles.row}>
                        <Input style={{ width: '60%' }} label={lang['input-search']} />
                        <Button style={{ width: '30%' }} borderRadius={8} color='main1'>TODO</Button>
                    </View>

                    <FlatList
                        data={dataManager.skills.categories}
                        renderItem={this.renderCategory}
                        numColumns={6}
                        keyExtractor={(item, index) => 'category-' + index}
                    />

                </Page>

                <View style={[styles.skillsParent, { height: SCREEN_HEIGHT - this.state.height }]}>
                    <FlatList
                        style={{ flex: 1 }}
                        ListEmptyComponent={this.renderEmpty}
                        //data={dataManager.skills.skills}
                        data={[]}
                        renderItem={this.renderSkill}
                        keyExtractor={(item, index) => 'skill-' + index}
                    />
                </View>
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
        bottom: 0
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
    }
});

export default Skills;