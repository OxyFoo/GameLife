import * as React from 'react';

import user from '../../Managers/UserManager';
import langManager from '../../Managers/LangManager';
import { sum } from '../../Functions/Functions';
import { Request_Async } from '../../Functions/Request';

class BackReport extends React.Component {
    constructor(props) {
        super(props);

        this.maxPoints = 7;

        this.types = [
            { key: 0, value: langManager.curr['report']['types']['activity'] },
            { key: 1, value: langManager.curr['report']['types']['suggest'] },
            { key: 2, value: langManager.curr['report']['types']['bug'] },
            { key: 3, value: langManager.curr['report']['types']['message'] }
        ];
        this.stats = {
            'sag': 0,
            'int': 0,
            'con': 1,
            'for': 0,
            'end': 0,
            'agi': 0,
            'dex': 0
        };

        this.state = {
            selectedType: 0,
            input_activity: {},
            input_skillname: '',
            input_skillcategory: '',
            input_suggest: '',
            input_bug1: '',
            input_bug2: '',
            input_message: '',
            remain: 0,
            statsRemain: {
                'sag': 0,
                'int': 0,
                'con': 0,
                'for': 0,
                'end': 0,
                'agi': 0,
                'dex': 0
            }
        }
    }

    componentDidMount() {
        this.refreshRemainPoints();
    }

    back = () => { user.backPage(); }
    info = () => {
        const title = langManager.curr['report']['alert-buginfo-title'];
        const text = langManager.curr['report']['alert-buginfo-text'];
        user.openPopup('ok', [ title, text ]);
    }

    selectType = (index) => { this.setState({ selectedType: index }); }
    changeTextInputSkillName = (text) => { this.setState({ input_skillname: text }); }
    changeTextInputSkillCategory = (text) => { this.setState({ input_skillcategory: text }); }
    changeTextInputSuggest = (text) => { this.setState({ input_suggest: text }); }
    changeTextInputBug1 = (text) => { this.setState({ input_bug1: text }); }
    changeTextInputBug2 = (text) => { this.setState({ input_bug2: text }); }
    changeTextInputMessage = (text) => { this.setState({ input_message: text }); }

    changeDigit = (index, value) => {
        if (Object.keys(this.stats).includes(index)) {
            this.stats[index] = value;
            this.refreshRemainPoints();
        }
    }
    refreshRemainPoints = () => {
        const total = sum(Object.values(this.stats));
        const remain = this.maxPoints - total;
        let newStatsRemain = {...this.state.statsRemain};
        for (let key in this.stats) {
            const newMaxValue = Math.min(this.stats[key] + remain, this.maxPoints);
            newStatsRemain[key] = newMaxValue;
        }
        this.setState({ statsRemain: newStatsRemain, remain: remain });
    }

    async sendData() {
        const type = this.state.selectedType;
        const types = [ 'activity', 'suggest', 'bug', 'message' ];
        let report_type = "";
        if (type >= 0 && type < types.length) {
            report_type = types[type];
        }

        let report = {};
        switch (type) {
            case 0: // Activity
                report["name"] = this.state.input_skillname;
                report["category"] = this.state.input_skillcategory;
                report["stats"] = this.stats;
                break;
            case 1: // Suggest
                report["suggest"] = this.state.input_suggest;
                break;
            case 2: // Bug
                report["bug-description"] = this.state.input_bug1;
                report["bug-details"] = this.state.input_bug2;
                break;
            case 3: // Message
                report["message"] = this.state.input_message;
                break;
        }

        let isFilled = true;
        for (let key in report) {
            if (typeof(report[key]) === 'undefined' || report[key] == '') {
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
            user.openPopup('ok', [ title, text ]);
            return;
        }

        let data = {
            'action': 'report',
            'token': user.conn.token,
            'type': report_type,
            'data': JSON.stringify(report)
        };

        const result_ping = await Request_Async(data);

        if (result_ping.hasOwnProperty("status") && result_ping["status"] === 'ok') {
            const title = langManager.curr['report']['alert-success-title'];
            const text = langManager.curr['report']['alert-success-text'];
            user.openPopup('ok', [ title, text ], user.backPage, false);
        }
    }
}

export default BackReport;