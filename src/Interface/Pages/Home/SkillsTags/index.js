// TODO: Delete ?

import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';
import dataManager from 'Managers/DataManager';
import themeManager from 'Managers/ThemeManager';

import { Text, Icon, Button } from 'Interface/Components';

/**
 * @typedef {import('@oxyfoo/gamelife-types/Data/App/Skills').EnrichedSkill} EnrichedSkill
 */

/** @param {{ style?: import('react-native').ViewStyle, maxSkills?: number }} props */
function SkillsTags({ style, maxSkills = 4 }) {
    const [skills, setSkills] = React.useState(() => user.activities.GetLastSkills(maxSkills));

    React.useEffect(() => {
        const listener = user.activities.allActivities.AddListener(() => {
            setSkills(user.activities.GetLastSkills(maxSkills));
        });
        return () => {
            user.activities.allActivities.RemoveListener(listener);
        };
    }, [maxSkills]);

    const openSkills = () => {
        user.interface.ChangePage('skills');
    };

    const lang = langManager.curr['home'];

    /** @param {EnrichedSkill} skill */
    const renderSkillTag = (skill) => {
        const category = dataManager.skills.GetCategoryByID(skill.CategoryID);
        const categoryLogoXML = category ? dataManager.skills.GetXmlByLogoID(category.LogoID) : skill.LogoXML;

        return (
            <View key={`skill-tag-${skill.ID}`} style={styles.tag}>
                <LinearGradient
                    style={styles.tagGradient}
                    colors={[
                        themeManager.GetColor('grey', { opacity: 0.5 }),
                        themeManager.GetColor('grey', { opacity: 0.2 })
                    ]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                >
                    <View style={styles.container}>
                        <Icon xml={categoryLogoXML} size={14} color='main1' />
                        <Text style={styles.tagText} fontSize={10}>
                            {skill.FullName}
                        </Text>
                    </View>
                </LinearGradient>
            </View>
        );
    };

    return (
        <Button
            style={[styles.button, style]}
            onPress={openSkills}
            gradientColors={[
                themeManager.GetColor('main1', { opacity: 0.25 }),
                themeManager.GetColor('main1', { opacity: 0.08 })
            ]}
            gradientColorsAngle={90}
        >
            <View style={styles.header}>
                <Text fontSize={16}>{lang['container-skills-title']}</Text>
                <Icon color='gradient' size={24} icon='arrow-square-outline' angle={90} />
            </View>

            {skills.length === 0 ? (
                <Text style={styles.emptyText} fontSize={12} color='light'>
                    {lang['container-skills-empty']}
                </Text>
            ) : (
                <View style={styles.tagsContainer}>{skills.map(renderSkillTag)}</View>
            )}
        </Button>
    );
}

const styles = StyleSheet.create({
    header: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: 8,
        paddingHorizontal: 2
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 10
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8
    },
    tag: {
        borderRadius: 16,
        overflow: 'hidden'
    },
    tagGradient: {
        gap: 6
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 6
    },
    tagText: {
        marginLeft: 4,
        marginTop: 1
    },
    emptyText: {
        textAlign: 'center'
    }
});

export { SkillsTags };
