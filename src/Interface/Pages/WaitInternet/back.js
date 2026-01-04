import { Linking } from 'react-native';

import user from 'Managers/UserManager';

import PageBase from 'Interface/FlowEngine/PageBase';
import langManager from 'Managers/LangManager';

import { env } from 'Utils/Env';

const REFRESH_DELAY_SECONDS = 30;

/**
 * @typedef {'not-connected' | 'maintenance' | 'authenticated-failed' | 'error'} WaitInternetStatus
 *
 * @typedef {object} WaitInternetArgs
 * @property {WaitInternetStatus} [status]
 */

/** @type {{ args?: WaitInternetArgs }} */
const BackWaitinternetProps = {
    args: {
        status: 'not-connected'
    }
};

class BackWaitinternet extends PageBase {
    state = {
        /** @type {WaitInternetStatus} */
        currentStatus: this.props.args?.status ?? 'not-connected',

        /** @type {string | null} */
        lastError: user.server2.tcp.GetLastError()
    };

    componentDidMount() {
        this.interval = setInterval(this.Loop, REFRESH_DELAY_SECONDS * 1000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    Loop = async () => {
        const status = await user.server2.Initialize();
        if (status === 'authenticated' || status === 'already-authenticated') {
            user.interface.ChangePage('login', { storeInHistory: false });
        } else if (status === 'update') {
            user.interface.ChangePage('loading', { storeInHistory: false });
        } else if (status === 'maintenance') {
            this.setState({ currentStatus: 'maintenance', lastError: null });
        } else if (status === 'not-connected' || status === 'authenticated-failed') {
            const lastError = user.server2.tcp.GetLastError();
            this.setState({
                currentStatus: status,
                lastError: lastError ?? 'Unknown error'
            });
        } else {
            this.setState({
                currentStatus: 'error',
                lastError: status
            });
        }
    };

    goToWebsite = () => {
        Linking.openURL(env.LINK_WEBSITE)
            .catch((err) => {
                const lang = langManager.curr['app'];

                user.interface.console?.AddLog('error', `[BackWaitinternet] Failed to open website link: ${err}`);

                user.interface.popup?.OpenT({
                    type: 'ok',
                    data: {
                        title: lang['alert-link-error-title'],
                        message: lang['alert-link-error-message']
                    },
                    priority: true
                });
            })
            .then(() => {
                user.statistics.RecordLinkClick(env.LINK_WEBSITE);
            });
    };

    goToDiscord = () => {
        Linking.openURL(env.LINK_DISCORD)
            .catch((err) => {
                const lang = langManager.curr['app'];

                user.interface.console?.AddLog('error', `[BackWaitinternet] Failed to open Discord link: ${err}`);

                user.interface.popup?.OpenT({
                    type: 'ok',
                    data: {
                        title: lang['alert-link-error-title'],
                        message: lang['alert-link-error-message']
                    },
                    priority: true
                });
            })
            .then(() => {
                user.statistics.RecordLinkClick(env.LINK_DISCORD);
            });
    };
}

BackWaitinternet.defaultProps = BackWaitinternetProps;
BackWaitinternet.prototype.props = BackWaitinternetProps;

export default BackWaitinternet;
