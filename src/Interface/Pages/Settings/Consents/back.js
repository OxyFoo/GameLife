import user from 'Managers/UserManager';

import PageBase from 'Interface/FlowEngine/PageBase';

class BackSettingsNotifications extends PageBase {
    state = {
        switchShareData: true,
        waitingConsentPopup: false
    };

    /** @type {NodeJS.Timeout | null} */
    intervalConsentChecking = null;

    componentDidMount() {
        if (user.consent.loading) {
            this.setState({ waitingConsentPopup: true });
            this.intervalConsentChecking = setInterval(() => {
                if (!user.consent.loading) {
                    this.setState({ waitingConsentPopup: false });
                    if (this.intervalConsentChecking !== null) {
                        clearInterval(this.intervalConsentChecking);
                    }
                }
            }, 100);
        }
    }

    componentWillUnmount() {
        if (this.intervalConsentChecking !== null) {
            clearInterval(this.intervalConsentChecking);
        }
    }

    onBack = () => user.interface.BackHandle();

    /** @param {boolean} value */
    changeShareData = (value) => {
        this.setState({ switchShareData: value });
    };

    openConsentPopup = async () => {
        this.setState({ waitingConsentPopup: true });
        await user.consent.ShowTrackingPopup(true);
        this.setState({ waitingConsentPopup: false });
    };
}

export default BackSettingsNotifications;
