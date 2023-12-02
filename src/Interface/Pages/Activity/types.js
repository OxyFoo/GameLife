import dataManager from 'Managers/DataManager';

/**
 * @typedef {import('Data/Skills').Category} Category
 * @typedef {import('Data/Skills').Skill} Skill
 * @typedef {import('Data/Skills').EnrichedSkill} EnrichedSkill
 * @typedef {{ id: number, value: string, categoryID: number, onPress: () => void }} ItemSkill
 * @typedef {{ id: number, name: string, icon: string }} ItemCategory
 */

/**
 * @param {Skill | EnrichedSkill | null} skill Null if no skill is selected
 * @param {(param: Skill) => void} callback
 * @returns {ItemSkill}
 */
const SkillToItem = (skill = null, callback = (param) => {}) => ({
    id: skill === null ? 0 : skill.ID,
    value: skill === null ? '' : dataManager.GetText(skill.Name),
    categoryID: skill === null ? 0 : skill.CategoryID,
    onPress: () => callback(skill)
});

/**
 * @param {Category} category
 * @returns {ItemCategory}
 */
const CategoryToItem = (category) => ({
    id: category.ID,
    name: dataManager.GetText(category.Name),
    icon: dataManager.skills.GetXmlByLogoID(category.LogoID)
});

export { SkillToItem, CategoryToItem };
