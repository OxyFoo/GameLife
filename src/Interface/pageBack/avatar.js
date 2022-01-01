import * as React from 'react';
import { Animated } from 'react-native';

import user from '../../Managers/UserManager';
import langManager from '../../Managers/LangManager';
import dataManager from '../../Managers/DataManager';

import { Activity } from '../../Class/Activities';
import { isUndefined } from '../../Functions/Functions';
import { SpringAnimation } from '../../Functions/Animations';
import { GetTime } from '../../Functions/Time';

class BackAvatar extends React.Component {
    constructor(props) {
        super(props);

        this.refPage = null;
        this.refAvatar = null;
        this.state = { editorOpened: false };
    }
}

export default BackAvatar;