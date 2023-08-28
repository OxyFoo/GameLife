import * as React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';

import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import { Button, Text } from 'Interface/Components';

const SectionDescriptionProps = {
    onChange: () => {}
};

class SectionDescription extends React.Component {
    state = {
        /** @type {string} */
        description: ''
    }

    /** @param {string} description */
    SetDescription = (description) => {
        this.setState({ description });
    }
    GetDescription = () => {
        return this.state.description;
    }

    onAddComment = () => {
        const callback = (text) => {
            this.props.onChange();
            this.setState({ description: text });
        };
        const titleCommentary = langManager.curr['task']['title-commentary'];
        user.interface.screenInput.Open(titleCommentary, '', callback, true);
    }
    onEditComment = () => {
        const callback = (text) => {
            this.props.onChange();
            this.setState({ description: text });
        };
        const titleCommentary = langManager.curr['task']['title-commentary']
        user.interface.screenInput.Open(titleCommentary, this.state.description, callback, true);
    }
    onRemComment = () => {
        const callback = (btn) => {
            if (btn === 'yes') {
                this.props.onChange();
                this.setState({ description: '' });
            }
        }
        const title = langManager.curr['task']['alert-remcomment-title'];
        const text = langManager.curr['task']['alert-remcomment-text'];
        user.interface.popup.Open('yesno', [title, text], callback);
    }

    render() {
        const lang = langManager.curr['task'];
        const { description } = this.state;
        const backgroundCard = { backgroundColor: themeManager.GetColor('backgroundCard') };

        if (description === '') {
            return (
                <Button
                    style={styles.comButton}
                    onPress={this.onAddComment}
                    color='main1'
                    fontSize={14}
                >
                    {lang['button-commentary']}
                </Button>
            );
        }

        return (
            <>
                {/* Comment title */}
                <Text style={styles.sectionTitle} fontSize={22}>{lang['title-commentary']}</Text>

                {/* Comment content */}
                <TouchableOpacity
                    style={[styles.commentContainer, backgroundCard]}
                    activeOpacity={.6}
                    onPress={this.onEditComment}
                    onLongPress={this.onRemComment}
                >
                    <Text style={styles.commentText}>{description}</Text>
                </TouchableOpacity>
            </>
        );
    }
}

SectionDescription.prototype.props = SectionDescriptionProps;
SectionDescription.defaultProps = SectionDescriptionProps;

const styles = StyleSheet.create({
    comButton: {
        height: 48,
        marginTop: 48,
        marginHorizontal: 20
    },
    sectionTitle: {
        marginTop: 32,
        marginBottom: 12
    },

    commentContainer: {
        padding: '5%',
        borderRadius: 24
    },
    commentText: {
        fontSize: 16,
        textAlign: 'left'
    }
});

export default SectionDescription;