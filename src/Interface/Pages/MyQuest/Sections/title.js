import * as React from 'react';

import langManager from 'Managers/LangManager';

import { Input } from 'Interface/Components';

const SectionTitleProps = {
    /** @type {string} */
    title: '',

    /** @param {string} title */
    onChange: (title) => {}
};

class SectionTitle extends React.Component {
    render() {
        const lang = langManager.curr['quest'];
        const { title, onChange } = this.props;

        return (
            <Input
                label={lang['input-title']}
                text={title}
                maxLength={128}
                onChangeText={onChange}
            />
        );
    }
}

SectionTitle.prototype.props = SectionTitleProps;
SectionTitle.defaultProps = SectionTitleProps;

export default SectionTitle;
