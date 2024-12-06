import PageBase from 'Interface/FlowEngine/PageBase';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

class BackWaitmail extends PageBase {
    state = {
        time: 0,
        statusText: ''
    };

    loading = true;

    /** @type {number} */
    secondsRemainingToShowSentMessage = 5;

    controller = new AbortController();

    componentDidMount() {
        this.WaitingMailConfirmation();
        this.tick = setInterval(this.onTick, 1000);

        this.listenerServer = user.server2.tcp.state.AddListener((state) => {
            if (state !== 'connected') {
                this.fe.ChangePage('waitinternet', {
                    storeInHistory: false,
                    transition: 'fromBottom'
                });
            }
        });
    }

    componentWillUnmount() {
        this.controller.abort();
        clearInterval(this.tick);
        if (this.listenerServer) {
            user.server2.tcp.state.RemoveListener(this.listenerServer);
        }
    }

    onBack = () => {
        user.settings.email = '';
        user.settings.IndependentSave();
        user.interface.ChangePage('login', { storeInHistory: false });
    };

    onTick = () => {
        const { time } = this.state;
        const langWait = langManager.curr['wait'];

        if (this.secondsRemainingToShowSentMessage > 0) {
            this.secondsRemainingToShowSentMessage--;
        }

        let statusText = '...';
        if (this.loading && this.secondsRemainingToShowSentMessage > 0) {
            statusText = langWait['wait-email-sending'];
        } else if (this.secondsRemainingToShowSentMessage > 0) {
            statusText = langWait['wait-email-send'];
        } else if (typeof time === 'number' && time > 0) {
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
        const response = await user.server2.tcp.SendAndWaitWithoutCallback(
            { action: 'wait-mail', email: user.settings.email },
            (data) => {
                // Error
                if (data.status !== 'wait-mail' || data.result === 'confirmed' || data.result === 'error') {
                    return true;
                }

                // Mail sent
                else if (data.result === 'sent') {
                    this.loading = false;
                    this.secondsRemainingToShowSentMessage = 11;
                    this.setState({ time: data.remainingTime ?? 0 });
                }

                // Update time
                else if (data.result === 'wait') {
                    this.loading = false;
                    this.secondsRemainingToShowSentMessage = 0;
                    this.setState({ time: data.remainingTime ?? 0 });
                }

                return false;
            },
            -1,
            this.controller.signal
        );

        if (response === 'interrupted') {
            return;
        }

        if (
            response === 'timeout' ||
            response === 'not-sent' ||
            response === 'alreadyExist' ||
            response.status !== 'wait-mail' ||
            response.result === 'error'
        ) {
            user.interface.console?.AddLog(
                'error',
                `Server connection failed (${typeof response === 'string' ? response : JSON.stringify(response)})`
            );
            user.interface.popup?.OpenT({
                type: 'ok',
                data: {
                    title: langManager.curr['login']['alert-error-title'],
                    message: langManager.curr['login']['alert-error-message'].replace(
                        '{}',
                        typeof response === 'object' ? response.status : response
                    )
                },
                callback: () => user.interface.BackHandle(),
                cancelable: false
            });

            user.settings.email = '';
            user.settings.IndependentSave();
            return;
        }

        // Error
        if (response.status !== 'wait-mail' || response.result !== 'confirmed' || typeof response.token !== 'string') {
            user.interface.console?.AddLog('error', 'Server error:', response);
            user.interface.popup?.OpenT({
                type: 'ok',
                data: {
                    title: langManager.curr['login']['alert-error-title'],
                    message: langManager.curr['login']['alert-error-message'].replace(
                        '{}',
                        typeof response === 'object' ? response.status : response
                    )
                },
                callback: () => user.interface.BackHandle(),
                cancelable: false
            });

            user.settings.email = '';
            user.settings.IndependentSave();
            return;
        }

        // Connected
        if (response.result === 'confirmed') {
            user.settings.token = response.token;
            await user.settings.IndependentSave();
            user.interface.ChangePage('loading', { storeInHistory: false });
            return;
        }
    };
}

export default BackWaitmail;
