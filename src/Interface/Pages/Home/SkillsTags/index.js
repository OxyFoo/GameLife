import * as React from 'react';
import { View, StyleSheet } from 'react-native';

import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';
import dataManager from 'Managers/DataManager';
import themeManager from 'Managers/ThemeManager';

import { Text, Icon, Button } from 'Interface/Components';

/**
 * @typedef {import('@oxyfoo/gamelife-types/Data/App/Skills').EnrichedSkill} EnrichedSkill
 */

/**
 * @param {object} props
 * @param {import('react-native').ViewStyle} [props.style]
 * @param {number} [props.maxSkills]
 * @param {React.RefObject<import('react-native').View | null>} [props.refParent] Ref of the root button (tutorial target)
 */
function SkillsTags({ style, maxSkills = 4, refParent }) {
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
    const renderSkillCard = (skill) => {
        const category = dataManager.skills.GetCategoryByID(skill.CategoryID);
        const categoryLogoXML = category ? dataManager.skills.GetXmlByLogoID(category.LogoID) : skill.LogoXML;

        return (
            <View key={`skill-card-${skill.ID}`} style={styles.card}>
                <View style={styles.cardSquareParent}>
                    <Button
                        style={[styles.cardSquare, { borderColor: themeManager.GetColor('main1', { opacity: 0.45 }) }]}
                        gradientColors={[
                            themeManager.GetColor('main1', { opacity: 0.35 }),
                            themeManager.GetColor('main1', { opacity: 0.12 })
                        ]}
                        gradientColorsAngle={45}
                        iconXml={categoryLogoXML}
                        iconSize={28}
                        // @ts-ignore
                        fontColor={category?.Color || 'main1'}
                    />
                </View>

                <Text style={styles.cardText} fontSize={10} color='light' numberOfLines={2}>
                    {skill.FullName}
                </Text>
            </View>
        );
    };

    return (
        <Button
            style={[styles.button, style]}
            nativeRef={refParent}
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
                <View style={styles.cardsContainer}>{skills.map(renderSkillCard)}</View>
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
        paddingHorizontal: 2
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 10
    },
    cardsContainer: {
        width: '100%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center'
    },
    card: {
        width: '50%',
        alignItems: 'center',
        padding: 0,
        marginTop: 8
    },
    cardSquareParent: {
        width: '65%'
    },
    cardSquare: {
        aspectRatio: 1,
        paddingVertical: 0,
        paddingHorizontal: 0,
        borderRadius: 12,
        borderWidth: 0.6,
        justifyContent: 'center'
    },
    cardText: {
        width: '100%',
        textAlign: 'center',
        marginTop: 2
    },
    emptyText: {
        textAlign: 'center'
    }
});

export { SkillsTags };
