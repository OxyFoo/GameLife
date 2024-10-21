import user from 'Managers/UserManager';
import dataManager from 'Managers/DataManager';
import langManager from 'Managers/LangManager';

import { GetLocalTime } from 'Utils/Time';

/**
 * @typedef {import('Types/Data/App/Skill').Skill} Skill
 * @typedef {import('Types/Data/App/SkillCategory').SkillCategory} SkillCategory
 *
 * @typedef {{ id: number, value: string, categoryID: number, onPress: () => void }} ItemSkill
 * @typedef {{ id: number, name: string, icon: string }} ItemCategory
 */

/**
 * @param {Skill | null} skill Null if no skill is selected
 * @param {(param: Skill) => void} callback
 * @returns {ItemSkill}
 */
const SkillToItem = (skill = null, callback = () => {}) => ({
    id: skill === null ? 0 : skill.ID,
    value: skill === null ? '' : langManager.GetText(skill.Name),
    categoryID: skill === null ? 0 : skill.CategoryID,
    onPress: () => skill !== null && callback(skill)
});

/**
 * @param {SkillCategory} category
 * @returns {ItemCategory}
 */
const CategoryToItem = (category) => ({
    id: category.ID,
    name: langManager.GetText(category.Name),
    icon: dataManager.skills.GetXmlByLogoID(category.LogoID)
});

/**
 * @param {(param: Skill) => void} [callback]
 * @returns {Array<ItemSkill>}
 */
const GetRecentSkills = (callback) => {
    const now = GetLocalTime();
    return (
        user.activities
            .Get()
            .filter((activity) => activity.startTime <= now)
            .reverse()
            .map((activity) => dataManager.skills.GetByID(activity.skillID))
            .filter((skill) => skill !== null && skill.Enabled)
            // Remove duplicate
            .filter((skill, index, self) => self.findIndex((s) => s !== null && s.ID === skill?.ID) === index)
            .map((skill) => SkillToItem(skill, callback))
    );
};

export { SkillToItem, CategoryToItem, GetRecentSkills };
