import * as React from 'react';

import langManager from 'Managers/LangManager';

import { Input } from 'Interface/Components';

const SectionCommentProps = {
    /** @type {string} */
    comment: '',

    /** @param {string} comment */
    onChange: (comment) => {}
};

class SectionComment extends React.Component {
    render() {
        const lang = langManager.curr['quest'];
        const { comment, onChange } = this.props;

        return (
            <Input
                text={comment}
                label={lang['input-comment']}
                onChangeText={onChange}
                multiline={true}
                maxLength={1024}
            />
        );
    }
}

SectionComment.prototype.props = SectionCommentProps;
SectionComment.defaultProps = SectionCommentProps;

export default SectionComment;
