import * as React from 'react';

import { CheckZapGPTActivities } from './activityConverter';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { ParsePlural } from 'Utils/String';

/**
 * @typedef {import('Class/Activities').Activity} Activity
 */

class ZapGPTBack extends React.Component {
    state = {
        loading: false,
        text: '',
        error: null,

        /** @type {Array<Activity> | null} */
        data: null
    }

    componentDidMount() {
        if (user.tcp.IsConnected() === false) {
            if (user.interface.popup.opened) {
                user.interface.popup.Close();
            }
        }
        user.interface.SetCustomBackHandler(() => false);
    }
    componentWillUnmount() {
        user.interface.ResetCustomBackHandler();
    }

    /** @param {string} text */
    onChangeText = (text) => {
        this.setState({ text });
    }

    ZapGPThandler = async () => {
        const lang = langManager.curr['zap-gpt'];

        if (user.tcp.IsConnected() === false) {
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

        user.tcp.Send({
            action: 'zap-gpt',
            prompt: this.state.text,
            callbackID: 'activity-prompt'
        });

        const result = await user.tcp.WaitForCallback('activity-prompt', 15000);
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
    }

    /** @param {number} index */
    RemoveActivity = (index) => {
        const { data } = this.state;
        data.splice(index, 1);

        if (data.length === 0) {
            this.setState({ data: null });
        } else {
            this.setState({ data });
        }
    }

    Validate = () => {
        const lang = langManager.curr['zap-gpt'];

        let addedActivities = 0;
        for (let i = 0; i < this.state.data.length; i++) {
            const activity = this.state.data[i];
            const result = user.activities.Add(activity);
            if (result === 'added') {
                addedActivities++;
            }
        }

        user.interface.popup.Close();

        const text = ParsePlural(lang['added-message'], addedActivities > 1);
        if (addedActivities > 0) {
            user.interface.ChangePage('display', {
                'icon': 'success',
                'iconRatio': .8,
                'text': text.replace('{}', addedActivities.toString()),
                'button': 'OK'
            }, true);
        }
    }

    Retry = () => {
        this.setState({
            loading: false,
            error: null,
            data: null
        }, this.ZapGPThandler);
    }

    Reset = () => {
        this.setState({
            loading: false,
            text: '',
            error: null,
            data: null
        });
    }

    Back = () => {
        user.interface.popup.Close();
    }
}

export default ZapGPTBack;
