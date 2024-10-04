import PageBase from 'Interface/FlowEngine/PageBase';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

class BackWaitmail extends PageBase {
    state = {
        time: 0,
        statusText: ''
    };

    /** @type {number} */
    secondsRemainingToShowSentMessage = 0;

    componentDidMount() {
        this.WaitingMailConfirmation();
        this.tick = setInterval(this.onTick, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.tick);
    }

    onBack = () => {
        user.settings.email = '';
        user.settings.Save();
        user.interface.ChangePage('login', { storeInHistory: false });
    };

    onTick = () => {
        const { time } = this.state;
        const langWait = langManager.curr['wait'];

        if (this.secondsRemainingToShowSentMessage > 0) {
            this.secondsRemainingToShowSentMessage--;
        }

        let statusText = '';
        if (this.secondsRemainingToShowSentMessage > 0) {
            statusText = langWait['wait-email-send'];
        } else if (typeof time === 'number') {
            const SS = time % 60;
            const MM = (time - SS) / 60;
            statusText = langWait['wait-email-remain'].replace('{}', MM.toString()).replace('{}', SS.toString());
        }

        this.setState({
            time: Math.max(0, time - 1),
            statusText: statusText
        });
    };

    WaitingMailConfirmation = async () => {
        const response = await user.server2.tcp.SendAndWait(
            { action: 'wait-mail', email: user.settings.email },
            (data) => {
                // Mail confirmed
                if (data.status === 'wait-mail') {
                    if (data.result === 'confirmed') {
                        return true;
                    }

                    // Mail sent
                    if (data.result === 'sent') {
                        this.secondsRemainingToShowSentMessage = 11;
                        this.setState({ time: data.remainingTime ?? 0 });
                    }

                    // Update time
                    if (data.result === 'wait') {
                        this.setState({ time: data.remainingTime ?? 0 });
                    }
                }

                return false;
            },
            -1,
            false
        );

        if (response === 'timeout' || response === 'not-sent' || response === 'interrupted') {
            user.interface.console?.AddLog('error', `Server connection failed (${response})`);
            user.interface.popup?.OpenT({
                type: 'ok',
                data: {
                    title: langManager.curr['login']['alert-error-title'],
                    message: langManager.curr['login']['alert-error-message']
                },
                callback: () => user.interface.BackHandle(),
                cancelable: false
            });

            user.settings.email = '';
            user.settings.Save();
            return;
        }

        // Error
        if (response.status !== 'wait-mail' || response.result !== 'confirmed' || typeof response.token !== 'string') {
            user.interface.console?.AddLog('error', 'Server error:', response);
            user.interface.popup?.OpenT({
                type: 'ok',
                data: {
                    title: langManager.curr['login']['alert-error-title'],
                    message: langManager.curr['login']['alert-error-message']
                },
                callback: () => user.interface.BackHandle(),
                cancelable: false
            });

            user.settings.email = '';
            user.settings.Save();
            return;
        }

        // Connected
        if (response.result === 'confirmed') {
            user.settings.connected = true;
            user.settings.token = response.token;
            await user.settings.Save();
            user.interface.ChangePage('loading', { storeInHistory: false });
            return;
        }
    };
}

export default BackWaitmail;
