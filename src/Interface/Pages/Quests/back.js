import React from 'react';

import StartTutorial from './tuto';
import StartMission from './mission';
import { PageBase } from 'Interface/Components';

/**
 * @typedef {import('Interface/Widgets').NonZeroDay} NonZeroDay
 * @typedef {import('Interface/Widgets').MyQuestsList} MyQuestsList
 * @typedef {import('Interface/Widgets').TodoList} TodoList
 */

class BackNewPage extends PageBase {
    /** @type {React.RefObject<NonZeroDay>} */
    refNonZeroDay = React.createRef();

    /** @type {React.RefObject<MyQuestsList>} */
    refMyQuestsList = React.createRef();

    /** @type {React.RefObject<TodoList>} */
    refTodoList = React.createRef();

    componentDidMount() {
        super.componentDidMount();
    }

    componentDidFocused = (args) => {
        StartTutorial.call(this, args?.tuto);
        StartMission.call(this, args?.missionName);
    }
}

export default BackNewPage;
