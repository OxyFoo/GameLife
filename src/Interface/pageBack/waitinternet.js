import * as React from 'react';

import user from '../../Managers/UserManager';

const REFRESH_DELAY = 2; // seconds

class BackWaitinternet extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false
        };
    }

    componentDidMount() {
        this.interval = setInterval(this.Loop, REFRESH_DELAY * 1000);
    }
    componentWillUnmount() {
        clearInterval(this.interval);
    }
    Loop = async () => {
        await user.server.Ping();
        if (user.server.online) {
            user.interface.changePage('login', undefined, true);
        }
    }
}

export default BackWaitinternet;