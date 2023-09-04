import { PageBack } from 'Interface/Components';
import { Keyboard } from 'react-native';

import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { Sum } from 'Utils/Functions';

class BackReport extends PageBack {
    stats = Object.assign({}, ...user.statsKey.map(i => ({[i]: 0})));
    state = {
        sending: false,
        selectedType: 0,
        reportHeight: 0,

        input_activity: {},
        input_skillname: '',
        input_skillcategory: '',
        input_suggest: '',
        input_bug1: '',
        input_bug2: '',
        input_message: '',
        remain: 0,
        statsRemain: this.stats
    };

    maxPoints = 6;

    reportTypes = [
        { key: 0, value: langManager.curr['report']['types']['activity'] },
        { key: 1, value: langManager.curr['report']['types']['suggest'] },
        { key: 2, value: langManager.curr['report']['types']['bug'] },
        { key: 3, value: langManager.curr['report']['types']['message'] }
    ];

    componentDidMount() {
        super.componentDidMount();
        this.refreshRemainPoints();
    }

    back = user.interface.BackHandle;
    info = () => {
        const title = langManager.curr['report']['alert-buginfo-title'];
        const text = langManager.curr['report']['alert-buginfo-text'];
        user.interface.popup.Open('ok', [ title, text ]);
    }

    onLayout = (event) => {
        const { y } = event.nativeEvent.layout;
        const reportHeight = user.interface.screenHeight - y - 48;
        this.setState({ reportHeight: reportHeight });
    }

    selectType = (item) => item !== null && this.setState({ selectedType: item.key });
    changeTextInputSkillName = (text) => { this.setState({ input_skillname: text }); }
    changeTextInputSkillCategory = (text) => { this.setState({ input_skillcategory: text }); }
    changeTextInputSuggest = (text) => { this.setState({ input_suggest: text }); }
    changeTextInputBug1 = (text) => { this.setState({ input_bug1: text }); }
    changeTextInputBug2 = (text) => { this.setState({ input_bug2: text }); }
    changeTextInputMessage = (text) => { this.setState({ input_message: text }); }

    keyboardDismiss = () => {
        Keyboard.dismiss();
        return false;
    }

    changeDigit = (index, value) => {
        if (Object.keys(this.stats).includes(index)) {
            this.stats[index] = value;
            this.refreshRemainPoints();
        }
    }
    refreshRemainPoints = () => {
        const total = Sum(Object.values(this.stats));
        const remain = this.maxPoints - total;
        let newStatsRemain = {...this.state.statsRemain};
        for (let key in this.stats) {
            const newMaxValue = Math.min(this.stats[key] + remain, this.maxPoints);
            newStatsRemain[key] = newMaxValue;
        }
        this.setState({ statsRemain: newStatsRemain, remain: remain });
    }

    sendData = async () => {
        const type = this.state.selectedType;
        const types = [ 'activity', 'suggest', 'bug', 'message' ];
        if (type < 0 || type >= types.length) {
            user.interface.console.AddLog('info', 'Error report: Invalid selected type (selectedType: "' + type + '")');
            return;
        }

        let dataReport = {};
        switch (type) {
            case 0: // Activity
                dataReport["name"] = this.state.input_skillname;
                dataReport["category"] = this.state.input_skillcategory;
                dataReport["stats"] = this.stats;
                break;
            case 1: // Suggest
                dataReport["suggest"] = this.state.input_suggest;
                break;
            case 2: // Bug
                dataReport["bug-description"] = this.state.input_bug1;
                dataReport["bug-details"] = this.state.input_bug2;
                break;
            case 3: // Message
                dataReport["message"] = this.state.input_message;
                break;
        }

        let isFilled = true;
        for (let key in dataReport) {
            if (typeof(dataReport[key]) === 'undefined' || dataReport[key] == '') {
                isFilled = false;
                break;
            }
        }
        if (type === 0 && this.state.remain != 0) {
            isFilled = false;
        }

        if (!isFilled) {
            const title = langManager.curr['report']['alert-notfill-title'];
            const text = langManager.curr['report']['alert-notfill-text'];
            user.interface.popup.Open('ok', [ title, text ]);
            return;
        }

        this.setState({ sending: true });
        const sendSuccessfully = await user.server.SendReport(types[type], dataReport);
        this.setState({ sending: false });

        if (sendSuccessfully) {
            const title = langManager.curr['report']['alert-success-title'];
            const text = langManager.curr['report']['alert-success-text'];
            user.interface.popup.Open('ok', [ title, text ], user.interface.BackHandle, false);
        } else {
            const title = langManager.curr['report']['alert-error-title'];
            const text = langManager.curr['report']['alert-error-text'];
            user.interface.popup.Open('ok', [ title, text ]);
            user.interface.console.AddLog('error', 'Report: Send report failed');
        }
    }
}

export default BackReport;