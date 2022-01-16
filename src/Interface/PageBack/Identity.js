import * as React from 'react';
import { Animated } from 'react-native';

import user from '../../Managers/UserManager';
import langManager from '../../Managers/LangManager';
import dataManager from '../../Managers/DataManager';

import { Activity } from '../../Class/Activities';
import { IsUndefined } from '../../Functions/Functions';
import { SpringAnimation } from '../../Functions/Animations';
import { GetTime } from '../../Functions/Time';

class BackIdentity extends React.Component {
    constructor(props) {
        super(props);

        this.totalActivityLength = user.activities.activities.length;

        const totalActivityTime = user.activities.GetTotalDuration();
        this.totalActivityTime = Math.floor(totalActivityTime / 60);

        const playTime = this.totalActivityTime <= 0 ? 0 : user.activities.GetTimeFromFirst() / 60;
        this.playTime = Math.floor(playTime / 60);

        this.refPage = null;
        this.refAvatar = null;
        this.state = { editorOpened: false };
    }

    onBack = () => {
        if (this.refAvatar !== null && this.refAvatar.state.editorOpened) {
            this.refAvatar.CloseEditor();
        } else {
            user.interface.BackPage();
        }
    }
}

export default BackIdentity;