import * as React from 'react';

import user from '../../Managers/UserManager';
import langManager from '../../Managers/LangManager';
import { getTimeToTomorrow } from '../../Functions/Time';

class BackDailyquest extends React.Component {
    constructor(props) {
        super(props);

        this.daily_states = user.quests.dailyTodayCheck();
    }
    state = {
        informations: false,
        enable: false,
        time: getTimeToTomorrow(),
        selectedSkill1: undefined,
        selectedSkill2: undefined,
        daily_bonus: user.quests.dailyGetBonusCategory(),
        enable: user.quests.daily.length > 0,

        selectedTodo: null,
        taskTitle: '',
        taskDescription: ''
    }
    
    componentDidMount() {
        this.SKILLS = user.skills.getAsObj();
        this.interval = setInterval(this.loop, 1000);
    }
    
    componentWillUnmount() {
        clearInterval(this.interval);
    }
    
    loop = () => {
        const newBonus = user.quests.dailyGetBonusCategory();
        if (newBonus != this.state.daily_bonus) {
            this.setState({ daily_bonus: newBonus });
        }
        this.setState({ time: getTimeToTomorrow() });
    }

    back = () => {
        if (this.state.informations) {
            this.setState({ informations: false });
        } else if (!this.state.enable && user.quests.daily.length) {
            this.setState({ enable: true });
        } else if (this.state.selectedTodo !== null) {
            this.setState({ selectedTodo: null });
        } else {
            user.backPage();
        }
    }

    // EDIT

    changeSkill1 = (skillID) => {
        if (typeof(skillID) !== 'number') {
            this.setState({ selectedSkill1: undefined });
            return;
        }
        this.setState({ selectedSkill1: skillID });
    }

    changeSkill2 = (skillID) => {
        if (typeof(skillID) !== 'number') {
            this.setState({ selectedSkill2: undefined });
            return;
        }
        this.setState({ selectedSkill2: skillID });
    }

    saveClick = () => {
        const valid = this.state.selectedSkill1 !== undefined && this.state.selectedSkill2 !== undefined;
        if (!valid) {
            const title = langManager.curr['dailyquest']['alert-notfill-title'];
            const text = langManager.curr['dailyquest']['alert-notfill-text'];
            user.openPopup('ok', [ title, text ]);
        } else {
            if (this.state.selectedSkill1 == this.state.selectedSkill2) {
                const title = langManager.curr['dailyquest']['alert-same-title'];
                const text = langManager.curr['dailyquest']['alert-same-text'];
                user.openPopup('ok', [ title, text ]);
            } else {
                this.save();
            }
        }
    }

    save = () => {
        const skillID1 = this.state.selectedSkill1;
        const skillID2 = this.state.selectedSkill2;
        user.quests.dailyOnChange(skillID1, skillID2)
        this.saved();
    }

    saved = () => {
        const enable = () => { this.setState({ enable: true }); }
        const title = langManager.curr['dailyquest']['alert-success-title'];
        const text = langManager.curr['dailyquest']['alert-success-text'];
        user.openPopup('ok', [ title, text ], enable, false);
    }

    // DAILY QUESTS

    edit = () => {
        if (user.quests.dailyAlreadyChanged()) {
            const title = langManager.curr['dailyquest']['alert-warn-title'];
            const text = langManager.curr['dailyquest']['alert-warn-text'];
            user.openPopup('ok', [ title, text ]);
            return;
        }
        this.setState({
            enable: false,
            selectedSkill1: undefined,
            selectedSkill2: undefined
        });
    }

    info = () => {
        this.setState({ informations: true });
    }

    // Todo List

    selectTodo = (id) => {
        const showTitle = id === -1 ? '' : user.quests.todoList[id].title;
        const showDescription = id === -1 ? '' : user.quests.todoList[id].description;
        this.setState({
            selectedTodo: id,
            taskTitle: showTitle,
            taskDescription: showDescription
        });
    }
    toggleTodo = (id) => {
        if (id < 0) return;

        const currentState = user.quests.todoList[id].complete;
        if (currentState === false) {
            user.quests.todoToggle(id);
        } else {
            const title = langManager.curr['dailyquest']['alert-taskremove-title'];
            const text = langManager.curr['dailyquest']['alert-taskremove-text'];
            const event = (button) => {
                if (button === 'yes') {
                    user.quests.todoRemove(id);
                } else {
                    user.quests.todoToggle(id);
                }
            }
            user.openPopup('yesno', [ title, text ], event);
        }
    }
    onChangeTaskTitle = (newTitle) => {
        if (newTitle.length > 30) return;
        this.setState({ taskTitle: newTitle });
    }
    onChangeTaskDescription = (newDescription) => {
        this.setState({ taskDescription: newDescription });
    }
    saveTask = () => {
        const { taskTitle, taskDescription } = this.state;

        if (!taskTitle.length) {
            const title = langManager.curr['dailyquest']['alert-tasknotitle-title'];
            const text = langManager.curr['dailyquest']['alert-tasknotitle-text'];
            user.openPopup('ok', [ title, text ]);
        } else {
            if (this.state.selectedTodo === -1) {
                // Add todo
                user.quests.todoAdd(taskTitle, taskDescription);
            } else {
                // Save todo
                user.quests.todoEdit(this.state.selectedTodo, false, taskTitle, taskDescription);
            }
            this.back();
            user.saveData();
        }
    }
}

export default BackDailyquest;