import * as React from 'react';
import { StyleSheet } from 'react-native';

import langManager from 'Managers/LangManager';

import { Input, Text } from 'Interface/Components';

const SectionTitleProps = {
    /** @type {string} */
    title: '',

    /** @type {string} */
    error: '',

    /**
     * @param {string} title 
     * @param {boolean} [init=false]
     */
    onChangeTitle: (title, init = false) => {}
};

class SectionTitle extends React.Component {
    render() {
        const lang = langManager.curr['quest'];
        const { title, error, onChangeTitle } = this.props;

        return (
            <>
                <Input
                    style={styles.top}
                    label={lang['input-title']}
                    text={title}
                    maxLength={128}
                    onChangeText={onChangeTitle}
                />
                <Text fontSize={16} color='error'>{error}</Text>
            </>
        );
    }
}

SectionTitle.prototype.props = SectionTitleProps;
SectionTitle.defaultProps = SectionTitleProps;

const styles = StyleSheet.create({
    top: {
        marginTop: 32,
        marginBottom: 6
    }
});

export default SectionTitle;
