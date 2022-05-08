import * as React from 'react';

import user from '../../../Managers/UserManager';
import langManager from '../../../Managers/LangManager';
import dataManager from '../../../Managers/DataManager';
import { SortByKey } from '../../../Utils/Functions';
import { GetTime } from '../../../Utils/Time';

class BackSkills extends React.Component {
    constructor(props) {
        super(props);

        this.sortList = langManager.curr['skills']['top-sort-list'];
        this.allSkills = this.getAllSkills();

        this.state = {
            height: '40%', // Start approximately at 40% of the screen height
            search: '',
            ascending: true,
            sortSelectedIndex: 0,
            selectedCategories: [],
            skills: this.allSkills
        }
    }
    componentDidMount() {
        this.refreshSkills();
        this.activitiesListener = user.activities.allActivities.AddListener(() => {
            this.allSkills = this.getAllSkills();
            this.refreshSkills();
        });
    }
    componentWillUnmount() {
        user.activities.allActivities.RemoveListener(this.activitiesListener);
    }

    getAllSkills() {
        const now = GetTime();
        const usersActivities = user.activities.Get().filter(activity => activity.startTime <= now);
        const usersActivitiesID = usersActivities.map(activity => activity.skillID);
        const filter = skill => usersActivitiesID.includes(skill.ID);
        const getInfos = skill => ({
            ...skill,
            Name: dataManager.GetText(skill.Name),
            Logo: dataManager.skills.GetXmlByLogoID(skill.LogoID),
            experience: user.experience.GetSkillExperience(skill.ID)
        });
        const allSkills = dataManager.skills.skills.filter(filter);
        return allSkills.map(getInfos);
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
        let newSkills = this.allSkills;
        const { search, selectedCategories } = this.state;

        // Categories filter
        if (selectedCategories.length) {
            const filter = skill => selectedCategories.includes(skill.CategoryID);
            newSkills = newSkills.filter(filter);
        }

        // Search filter
        if (search !== '') {
            const filter = skill => {
                return skill.Name.toLowerCase().includes(search.toLowerCase());
            }
            newSkills = newSkills.filter(filter);
        }

        // Sort
        const sort = this.state.sortSelectedIndex;
        if (sort === 0) { // Sort by xp
            const format = (value) => typeof(value) === 'string' ? value.toLowerCase() : value;
            const compare = (a, b) => format(a['experience']['totalXP']) < format(b['experience']['totalXP']) ? -1 : 1;
            newSkills = newSkills.sort(compare);
        } else if (sort === 1) { // Sort by name
            newSkills = SortByKey(newSkills, 'Name').reverse();
        } else if (sort === 2) { // Sort by date
            const compare = (a, b) => a['experience']['lastTime'] < b['experience']['lastTime'] ? -1 : 1;
            newSkills = newSkills.sort(compare);
        }

        // Ascending
        if (this.state.ascending) {
            newSkills = newSkills.reverse();
        }

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