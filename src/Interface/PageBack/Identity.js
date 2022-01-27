import * as React from 'react';

import user from '../../Managers/UserManager';

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
        this.state = {
            stateDTP: '',
            editorOpened: false
        };
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