import * as React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import user from '../../Managers/UserManager';
import langManager from '../../Managers/LangManager';
import dataManager from '../../Managers/DataManager';
import themeManager from '../../Managers/ThemeManager';
import { DateToFormatString } from '../../Functions/Time';

import GLSvg from './GLSvg';
import GLText from './GLText';

function GLSkillBox(props) {
    const skillID = props.item.skillID;
    const skill = dataManager.skills.GetByID(skillID);
    const skillExperience = user.experience.GetSkillExperience(skillID);
    const level = skillExperience.lvl;
    const totalXP = skillExperience.totalXP;

    const text_title = (skill.Name || '').toUpperCase();
    const text_level = langManager.curr['level']['level'] + ' ' + level + ', ' + totalXP + langManager.curr['level']['xp'];
    const text_date = DateToFormatString(new Date(props.item.startTime));

    const styleContainer = [ styles.container, props.style ];
    const backgroundColor = { backgroundColor: themeManager.colors['globalBackcomponent'] };
    const eventPress = () => { user.interface.ChangePage('skill', { skillID: skillID }) };
    const xml = dataManager.skills.GetXmlByLogoID(skill.LogoID);

    return (
        <View style={styleContainer}>
            <TouchableOpacity style={styles.container2} activeOpacity={.5} onPress={eventPress}>
                <View style={[styles.icon, backgroundColor]}>
                    <GLSvg xml={xml} />
                </View>
                <View style={styles.column}>
                    <GLText style={styles.title} title={text_title} />
                    <GLText style={styles.text} title={text_level} color='secondary' />
                    <GLText style={styles.text2} title={text_date} color='secondary' />
                </View>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        borderColor: '#FFFFFF',
        borderLeftWidth: 3,
        borderRightWidth: 3,
        borderBottomWidth: 3
    },
    container2: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    column: {
        width: '70%',
        height: 64,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between'
    },
    title: {
        fontSize: 16,
        textAlign: 'left',
        textAlign: 'left'
    },
    text: {
        fontSize: 14,
        textAlign: 'left'
    },
    text2: {
        fontSize: 16,
        textAlign: 'left'
    },
    icon: {
        width: 64,
        height: 64,
        margin: 12,
        borderWidth: 3,
        borderColor: 'white'
    }
});

export default GLSkillBox;