import user from 'Managers/UserManager';
import dataManager from 'Managers/DataManager';
import langManager from 'Managers/LangManager';

import { GetTime } from 'Utils/Time';

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
    value: skill === null ? '' : langManager.GetText(skill.Name),
    categoryID: skill === null ? 0 : skill.CategoryID,
    onPress: () => callback(skill)
});

/**
 * @param {Category} category
 * @returns {ItemCategory}
 */
const CategoryToItem = (category) => ({
    id: category.ID,
    name: langManager.GetText(category.Name),
    icon: dataManager.skills.GetXmlByLogoID(category.LogoID)
});

/**
 * @param {(param: Skill) => void} callback
 * @returns {Array<ItemSkill>}
 */
const GetRecentSkills = (callback) => {
    const now = GetTime(undefined, 'local');
    return user.activities.Get()
        .filter(activity => activity.startTime <= now)
        .reverse()
        .map(activity => dataManager.skills.GetByID(activity.skillID))
        .filter(skill => skill !== null)
        // Remove duplicate
        .filter((skill, index, self) => self.findIndex(s => s.ID === skill.ID) === index)
        .map(skill => SkillToItem(skill, callback));
};

export { SkillToItem, CategoryToItem, GetRecentSkills };
