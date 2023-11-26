import { PageBase } from 'Interface/Components';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';
import dataManager from 'Managers/DataManager';

import { GetTime } from 'Utils/Time';
import { SortByKey } from 'Utils/Functions';

/**
 * @typedef {import('Data/Skills').Skill} Skill
 * @typedef {import('Data/Skills').EnrichedSkill} EnrichedSkill
 */

class BackSkills extends PageBase {
    sortList = langManager.curr['skills']['top-sort-list'];
    refSkills = null;

    state = {
        height: '40%', // Start approximately at 40% of the screen height
        search: '',
        ascending: true,
        sortSelectedIndex: 0,
        selectedCategories: [],
        skills: this.allSkills
    }

    componentDidMount() {
        super.componentDidMount();

        // Get all skills
        this.allSkills = this.getAllSkills();
        this.refreshSkills();

        // Listen to activities changes
        this.activitiesListener = user.activities.allActivities.AddListener(() => {
            this.allSkills = this.getAllSkills();
            this.refreshSkills();
        });
    }
    componentWillUnmount() {
        user.activities.allActivities.RemoveListener(this.activitiesListener);
    }

    setheight = (event) => this.setState({ height: event.nativeEvent.layout.height + 24 });

    /**
     * @param {Skill} skill
     * @returns {EnrichedSkill} Skill with Name, Logo & experience
     */
    upgradeSkill = (skill) => ({
        ...skill,
        FullName: dataManager.GetText(skill.Name),
        LogoXML: dataManager.skills.GetXmlByLogoID(skill.LogoID),
        Experience: user.experience.GetSkillExperience(skill.ID)
    });

    /** @returns {EnrichedSkill[]} All skills with their Name, Logo & experience */
    getAllSkills = () => {
        const now = GetTime();
        const usersActivities = user.activities.Get().filter(activity => activity.startTime <= now);
        const usersActivitiesID = usersActivities.map(activity => activity.skillID);
        const filter = skill => usersActivitiesID.includes(skill.ID);
        const allSkills = dataManager.skills.Get().filter(filter);
        return allSkills.map(this.upgradeSkill);
    }

    addActivity = () => { user.interface.ChangePage('activity', undefined, true); }

    onSwitchCategory = (ID) => {
        let newSelectedCategories = [];
        const contains = this.state.selectedCategories.includes(ID);
        if (contains) {
            newSelectedCategories = [...this.state.selectedCategories];
            const index = newSelectedCategories.indexOf(ID);
            newSelectedCategories.splice(index, 1);
        } else {
            newSelectedCategories = [ ...this.state.selectedCategories, ID ];
        }

        this.setState({ selectedCategories: newSelectedCategories }, this.refreshSkills);
    }
    onChangeSearch = (search) => {
        this.setState({ search: search }, this.refreshSkills);
    }
    onSwitchSort = () => {
        const newIndex = (this.state.sortSelectedIndex + 1) % this.sortList.length;
        this.setState({ sortSelectedIndex: newIndex }, this.refreshSkills);
    }
    switchOrder = () => {
        this.setState({ ascending: !this.state.ascending }, this.refreshSkills);
    }

    refreshSkills = () => {
        /** @type {EnrichedSkill[]} */
        let newSkills = this.allSkills;
        const { search, selectedCategories } = this.state;

        // Categories filter
        if (selectedCategories.length) {
            const filter = skill => selectedCategories.includes(skill.CategoryID);
            newSkills = newSkills.filter(filter);
        }

        // Get recent skills
        if (selectedCategories.includes(0)) {
            /** @type {EnrichedSkill[]} */
            let recentSkills = [];
            const now = GetTime(undefined, 'local');
            const usersActivities = user.activities
                .Get()
                .filter(activity => activity.startTime <= now)
                .sort((a, b) => b.startTime - a.startTime);
            for (const activity of usersActivities) {
                const skill = dataManager.skills.GetByID(activity.skillID);
                if (skill === null) continue;

                if (!recentSkills.find(s => s.ID === skill.ID)) {
                    recentSkills.push(this.upgradeSkill(skill));
                    if (recentSkills.length >= 10) {
                        break;
                    }
                }
            }

            newSkills.push(...recentSkills);
        }

        // Search filter
        if (search !== '') {
            newSkills = newSkills.filter(skill => {
                return skill.FullName.toLowerCase().includes(search.toLowerCase());
            });
        }

        const sort = this.state.sortSelectedIndex;
        // Sort by xp
        if (sort === 0) {
            const format = (value) => typeof(value) === 'string' ? value.toLowerCase() : value;
            /** @param {EnrichedSkill} a @param {EnrichedSkill} b */
            const compare = (a, b) => format(a['Experience']['totalXP']) < format(b['Experience']['totalXP']) ? -1 : 1;
            newSkills = newSkills.sort(compare);
        }

        // Sort by name
        else if (sort === 1) {
            newSkills = SortByKey(newSkills, 'FullName').reverse();
        }

        // Sort by date
        else if (sort === 2) {
            /** @param {EnrichedSkill} a @param {EnrichedSkill} b */
            const compare = (a, b) => a['Experience']['lastTime'] < b['Experience']['lastTime'] ? -1 : 1;
            newSkills = newSkills.sort(compare);
        }

        // Ascending
        if (this.state.ascending) {
            newSkills = newSkills.reverse();
        }

        this.refSkills.scrollToOffset({ offset: 0, animated: true });
        this.setState({ skills: newSkills });
    }

    changeText = (newText) => {
        this.setState({ search: newText });
        setTimeout(this.refreshSkills, 50);
    }
    filterChange = (indexes) => {
        this.setState({ selectedFiltersIndex: indexes });
        setTimeout(this.refreshSkills, 50);
    }
}

export default BackSkills;