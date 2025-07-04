import * as React from 'react';

import { CheckZapGPTActivities } from './activityConverter';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { ParsePlural } from 'Utils/String';

/**
 * @typedef {import('Data/User/Activities/index').Activity} Activity
 * @typedef {import('@oxyfoo/gamelife-types/TCP/GameLife/Request_Types').ConnectionState} ConnectionState
 */

const ZapGPTProps = {
    /** @type {() => void} */
    onScrollToTop: () => {},

    /** @type {() => void} */
    onChangePage: () => {}
};

class ZapGPTBack extends React.Component {
    state = {
        loading: false,
        text: '',
        error: null,

        /** @type {ConnectionState} */
        tcpState: user.server2.tcp.state.Get(),

        /** @type {Array<Activity> | null} */
        data: null
    };

    /** @type {Symbol | null} */
    listenerTCP = null;

    componentDidMount() {
        this.listenerTCP = user.server2.tcp.state.AddListener((state) => {
            if (state !== this.state.tcpState) {
                this.setState({ tcpState: state });
            }
        });
    }

    componentWillUnmount() {
        user.server2.tcp.state.RemoveListener(this.listenerTCP);
    }

    /** @param {string} text */
    onChangeText = (text) => {
        this.setState({ text });
    };

    ZapGPThandler = async () => {
        const lang = langManager.curr['zap-gpt'];

        if (user.server2.tcp.IsConnected() === false) {
            this.setState({ error: lang['errors']['tcp-not-connected'] });
            return;
        }

        if (!this.state.text.length) {
            this.setState({ error: lang['errors']['request-empty'] });
            return;
        }

        this.setState({
            loading: true,
            error: null
        });

        user.server2.tcp.Send({
            action: 'zap-gpt',
            prompt: this.state.text,
            callbackID: 'activity-prompt'
        });

        const result = await user.server2.tcp.WaitForCallback('activity-prompt', 15000);
        if (result === 'timeout') {
            this.setState({
                loading: false,
                error: lang['errors']['request-timeout']
            });
            return;
        }
        if (result === null) {
            this.setState({
                loading: false,
                error: lang['errors']['request-invalid']
            });
            return;
        }
        if (result === 'limit-reached') {
            this.setState({
                loading: false,
                error: lang['errors']['limit-reached']
            });
            return;
        }

        const rawActivities = JSON.parse(result);
        const activities = CheckZapGPTActivities(rawActivities);

        if (activities.length === 0) {
            this.setState({
                loading: false,
                error: lang['errors']['no-activities']
            });
            return;
        }

        this.setState({
            loading: false,
            error: null,
            data: activities
        });
    };

    /** @param {number} index */
    RemoveActivity = (index) => {
        const { data } = this.state;
        if (data === null) {
            return;
        }

        data.splice(index, 1);

        if (data.length === 0) {
            this.setState({ data: null });
        } else {
            this.setState({ data });
        }
    };

    Validate = () => {
        const lang = langManager.curr['zap-gpt'];
        const { data } = this.state;

        if (data === null) {
            return;
        }

        let addedActivities = 0;
        for (let i = 0; i < data.length; i++) {
            const activity = data[i];
            const { status } = user.activities.Add(activity);
            if (status === 'added') {
                addedActivities++;
            }
        }

        const text = ParsePlural(lang['added-message'], addedActivities > 1);
        if (addedActivities > 0) {
            this.props.onChangePage();
            user.interface.ChangePage(
                'display',
                {
                    icon: 'success',
                    iconRatio: 0.8,
                    text: text.replace('{}', addedActivities.toString()),
                    button: 'OK'
                },
                true
            );
        } else {
            const title = lang['no-activities-title'];
            const text = lang['no-activities-text'];
            user.interface.popup.Open('ok', [title, text]);
        }
    };

    Retry = () => {
        this.setState(
            {
                loading: false,
                error: null,
                data: null
            },
            this.ZapGPThandler
        );
        this.props.onScrollToTop();
    };

    Reset = () => {
        this.setState({
            loading: false,
            text: '',
            error: null,
            data: null
        });
        this.props.onScrollToTop();
    };
}

ZapGPTBack.prototype.props = ZapGPTProps;
ZapGPTBack.defaultProps = ZapGPTProps;

export default ZapGPTBack;
