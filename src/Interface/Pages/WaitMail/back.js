import PageBase from 'Interface/FlowEngine/PageBase';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

const BackWaitMailProps = {
    args: {
        /** @type {string | null} */
        email: null
    }
};

class BackWaitmail extends PageBase {
    state = {
        statusText: '',
        showResendButton: false
    };

    isStarting = true;

    remainingTimes = {
        secondsBeforeNextMail: 0, // Seconds
        secondsToShowSentMessage: 5 // Seconds
    };

    controller = new AbortController();

    componentDidMount() {
        this.WaitingMailConfirmation();
        this.tick = setInterval(this.onTick, 1000);

        // Exit if connection is lost
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

    onResend = () => {
        const { email } = this.props.args;

        // Check if email is set
        if (!email) {
            user.interface.console?.AddLog('error', 'No email set, cannot resend confirmation email');
            user.interface.popup?.OpenT({
                type: 'ok',
                data: {
                    title: langManager.curr['login']['alert-error-title'],
                    message: langManager.curr['login']['alert-error-message'].replace('{}', 'No email set')
                },
                callback: () => user.interface.BackHandle(),
                cancelable: false
            });
            return;
        }

        const sended = user.server2.tcp.Send({
            action: 'wait-mail',
            email: email,
            resend: true
        });

        if (!sended) {
            user.interface.console?.AddLog('error', 'Failed to send confirmation email');
            user.interface.popup?.OpenT({
                type: 'ok',
                data: {
                    title: langManager.curr['login']['alert-error-title'],
                    message: langManager.curr['login']['alert-error-message'].replace(
                        '{}',
                        'Failed to send confirmation email'
                    )
                },
                callback: () => user.interface.BackHandle(),
                cancelable: false
            });
            return;
        }

        // Reset timers
        this.remainingTimes.secondsToShowSentMessage = 5;
        this.remainingTimes.secondsBeforeNextMail = 0;
        this.setState({
            showResendButton: false,
            statusText: langManager.curr['wait']['wait-email-sending']
        });
    };

    onBack = async () => {
        user.settings.waitingEmail = '';
        await user.settings.IndependentSave();
        user.interface.ChangePage('login', { storeInHistory: false });
    };

    onTick = () => {
        if (this.state.showResendButton) {
            return;
        }

        const langWait = langManager.curr['wait'];

        // Define the status text based on the remaining time
        let statusText = '...';
        if (this.remainingTimes.secondsToShowSentMessage > 0) {
            statusText = this.isStarting ? langWait['wait-email-sending'] : langWait['wait-email-sent'];
        } else if (this.remainingTimes.secondsBeforeNextMail > 0) {
            const SS = this.remainingTimes.secondsBeforeNextMail % 60;
            const MM = (this.remainingTimes.secondsBeforeNextMail - SS) / 60;
            statusText = langWait['wait-email-remain'].replace('{}', MM.toString()).replace('{}', SS.toString());
        }

        // Decrease time counters
        if (this.remainingTimes.secondsToShowSentMessage > 0) {
            this.remainingTimes.secondsToShowSentMessage--;
        }
        if (this.remainingTimes.secondsBeforeNextMail > 0) {
            this.remainingTimes.secondsBeforeNextMail--;
        }

        // Update status text
        this.setState({ statusText });
    };

    WaitingMailConfirmation = async () => {
        const { email } = this.props.args;

        if (email === null) {
            user.interface.console?.AddLog('error', 'No email set, cannot wait for mail confirmation');
            user.interface.popup?.OpenT({
                type: 'ok',
                data: {
                    title: langManager.curr['login']['alert-error-title'],
                    message: langManager.curr['login']['alert-error-message'].replace('{}', 'No email set')
                },
                callback: () => user.interface.BackHandle(),
                cancelable: false
            });
            return;
        }

        const response = await user.server2.tcp.SendAndWaitWithoutCallback(
            { action: 'wait-mail', email: email },
            (data) => {
                // Error
                if (data.status !== 'wait-mail' || data.result === 'confirmed' || data.result === 'error') {
                    // Stop the loop and return the result to "response"
                    return true;
                }

                // Mail sent
                else if (data.result === 'sent') {
                    this.isStarting = false;
                    this.remainingTimes.secondsToShowSentMessage = 11;
                    this.remainingTimes.secondsBeforeNextMail = data.remainingTime ?? 0;
                }

                // Update time
                else if (data.result === 'wait') {
                    this.isStarting = false;
                    this.remainingTimes.secondsToShowSentMessage = 0;
                    this.remainingTimes.secondsBeforeNextMail = data.remainingTime ?? 0;
                }

                // Show resend button
                else if (data.result === 'can-resend') {
                    this.setState({ showResendButton: true });
                }

                // Continue waiting
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
            return;
        }

        // Error
        if (response.status !== 'wait-mail' || response.result !== 'confirmed') {
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
            return;
        }

        // Connected
        if (response.result === 'confirmed') {
            user.settings.waitingEmail = '';
            await user.settings.IndependentSave();
            user.server2.userAuth.SetEmail(email);
            user.interface.ChangePage('loading', { storeInHistory: false });
            return;
        }
    };
}

BackWaitmail.defaultProps = BackWaitMailProps;
BackWaitmail.prototype.props = BackWaitMailProps;

export default BackWaitmail;
