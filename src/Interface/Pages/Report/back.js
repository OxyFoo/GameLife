import PageBase from 'Interface/FlowEngine/PageBase';
import { Dimensions, Keyboard } from 'react-native';

import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { Sum } from 'Utils/Functions';

/**
 * @typedef {import('react-native').LayoutChangeEvent} LayoutChangeEvent
 *
 * @typedef {import('Managers/UserManager').Stats} Stats
 * @typedef {import('Class/Server').ReportTypes} ReportTypes
 * @typedef {import('Interface/Components/ComboBox').ComboBoxItem} ComboBoxItem
 */

const MAX_POINTS = 7;

class BackReport extends PageBase {
    state = {
        sending: false,
        selectedType: 0,
        reportHeight: 0,

        input_activity: {},
        input_skillname: '',
        input_skillcategory: '',

        /** @type {{ [key in keyof Stats]: number }} */
        input_skillstats: Object.assign({}, ...user.statsKey.map((i) => ({ [i]: 0 }))),

        /** @type {{ [key in keyof Stats]: number }} */
        input_skillstats_max: Object.assign({}, ...user.statsKey.map((i) => ({ [i]: MAX_POINTS }))),

        input_skillstats_remain: MAX_POINTS,

        input_suggest: '',
        input_bug1: '',
        input_bug2: '',
        input_message: ''
    };

    reportTypes = [
        { key: 0, value: langManager.curr['report']['types']['activity'] },
        { key: 1, value: langManager.curr['report']['types']['suggest'] },
        { key: 2, value: langManager.curr['report']['types']['bug'] },
        { key: 3, value: langManager.curr['report']['types']['message'] }
    ];

    back = () => user.interface.BackHandle();

    /** @param {LayoutChangeEvent} event */
    onLayout = (event) => {
        const { height } = Dimensions.get('window');
        const { y } = event.nativeEvent.layout;

        const reportHeight = height - y - 48;
        this.setState({ reportHeight });
    };

    /** @param {ComboBoxItem | null} item */
    selectType = (item) => {
        if (item === null) return;
        this.setState({ selectedType: item.key });
    };

    /** @param {string} text */
    changeTextInputSkillName = (text) => {
        this.setState({ input_skillname: text });
    };

    /** @param {string} text */
    changeTextInputSkillCategory = (text) => {
        this.setState({ input_skillcategory: text });
    };

    /** @param {string} text */
    changeTextInputSuggest = (text) => {
        this.setState({ input_suggest: text });
    };

    /** @param {string} text */
    changeTextInputBug1 = (text) => {
        this.setState({ input_bug1: text });
    };

    /** @param {string} text */
    changeTextInputBug2 = (text) => {
        this.setState({ input_bug2: text });
    };

    /** @param {string} text */
    changeTextInputMessage = (text) => {
        this.setState({ input_message: text });
    };

    keyboardDismiss = () => {
        Keyboard.dismiss();
        return false;
    };

    /**
     * @param {keyof Stats} stat
     * @param {number} value
     */
    changeDigit = (stat, value) => {
        const { input_skillstats, input_skillstats_max } = this.state;

        const newStats = { ...input_skillstats, [stat]: value };
        const total = Sum(Object.values(newStats));
        const remain = MAX_POINTS - total;

        /** @type {keyof Stats} */
        let key;
        const newMaxStat = { ...input_skillstats_max };
        for (key in input_skillstats) {
            if (key !== stat) {
                newMaxStat[key] = Math.min(input_skillstats[key] + remain, MAX_POINTS);
            }
        }

        this.setState({
            input_skillstats: newStats,
            input_skillstats_max: newMaxStat,
            input_skillstats_remain: remain
        });
    };

    sendData = async () => {
        const type = this.state.selectedType;

        /** @type {Array<ReportTypes>} */
        const types = ['activity', 'suggest', 'bug', 'message'];
        if (type < 0 || type >= types.length) {
            user.interface.console?.AddLog(
                'info',
                'Error report: Invalid selected type (selectedType: "' + type + '")'
            );
            return;
        }

        let isFilled = true;
        let dataReport = {};
        switch (type) {
            case 0: // Activity
                dataReport['name'] = this.state.input_skillname;
                dataReport['category'] = this.state.input_skillcategory;
                dataReport['stats'] = this.state.input_skillstats;

                if (
                    dataReport['name'] === '' ||
                    dataReport['category'] === '' ||
                    this.state.input_skillstats_remain !== 0
                ) {
                    isFilled = false;
                }

                break;
            case 1: // Suggest
                dataReport['suggest'] = this.state.input_suggest;

                if (dataReport['suggest'] === '') {
                    isFilled = false;
                }

                break;
            case 2: // Bug
                dataReport['bug-description'] = this.state.input_bug1;
                dataReport['bug-details'] = this.state.input_bug2;

                if (dataReport['bug-description'] === '' || dataReport['bug-details'] === '') {
                    isFilled = false;
                }

                break;
            case 3: // Message
                dataReport['message'] = this.state.input_message;

                if (dataReport['message'] === '') {
                    isFilled = false;
                }

                break;
        }

        if (!isFilled) {
            user.interface.popup?.OpenT({
                type: 'ok',
                data: {
                    title: langManager.curr['report']['alert-notfill-title'],
                    message: langManager.curr['report']['alert-notfill-message']
                }
            });
            return;
        }

        this.setState({ sending: true });
        const sendSuccessfully = await user.server.SendReport(types[type], dataReport);
        this.setState({ sending: false });

        if (sendSuccessfully) {
            user.interface.popup?.OpenT({
                type: 'ok',
                data: {
                    title: langManager.curr['report']['alert-success-title'],
                    message: langManager.curr['report']['alert-success-message']
                },
                callback: this.back,
                cancelable: false
            });
        } else {
            user.interface.popup?.OpenT({
                type: 'ok',
                data: {
                    title: langManager.curr['report']['alert-error-title'],
                    message: langManager.curr['report']['alert-error-message']
                }
            });
            user.interface.console?.AddLog('error', 'Report: Send report failed');
        }
    };
}

export default BackReport;
