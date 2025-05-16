import * as React from 'react';
import { View, StyleSheet } from 'react-native';

import langManager from 'Managers/LangManager';

import { InputText, Text } from 'Interface/Components';

/**
 * @typedef {import('@oxyfoo/gamelife-types/Data/User/Todos').Todo} Todo
 *
 * @typedef {Object} SectionTitlePropsType
 * @property {Todo | null} todo
 * @property {string | null} error
 * @property {(newTodo: Todo) => void} onChangeTodo
 */

/** @type {SectionTitlePropsType} */
const SectionTitleProps = {
    todo: null,
    error: null,
    onChangeTodo: () => {}
};

class SectionTitle extends React.Component {
    /** @param {SectionTitlePropsType} nextProps */
    shouldComponentUpdate(nextProps) {
        return (
            this.props.todo !== nextProps.todo ||
            this.props.todo?.title !== nextProps.todo?.title ||
            this.props.error !== nextProps.error ||
            this.props.onChangeTodo !== nextProps.onChangeTodo
        );
    }

    /** @param {string} title */
    onChangeTitle = (title) => {
        const { todo, onChangeTodo } = this.props;
        if (todo === null) return;

        todo.title = title;
        onChangeTodo(todo);
    };

    render() {
        const lang = langManager.curr['todo'];
        const { todo, error } = this.props;

        if (todo === null) {
            return null;
        }

        return (
            <View style={styles.parent}>
                <Text style={styles.title} color='border'>
                    {lang['input-title']}
                </Text>

                <InputText
                    value={todo.title}
                    placeholder={lang['input-title-placeholder']}
                    activeColor={error === null ? 'main1' : 'danger'}
                    inactiveColor='border'
                    forceActive={todo.title.length > 0 || error !== null}
                    maxLength={128}
                    icon={error === null ? 'check-filled' : 'close-filled'}
                    onChangeText={this.onChangeTitle}
                    showCounter
                />

                {/* Error */}
                {error === null ? null : (
                    <Text style={styles.error} fontSize={16} color='error'>
                        {error}
                    </Text>
                )}
            </View>
        );
    }
}

SectionTitle.prototype.props = SectionTitleProps;
SectionTitle.defaultProps = SectionTitleProps;

const styles = StyleSheet.create({
    parent: {
        marginTop: 24,
        paddingBottom: 24
    },

    title: {
        marginBottom: 8,
        textAlign: 'left',
        fontSize: 14
    },
    error: {
        marginTop: 8,
        fontSize: 16
    }
});

export default SectionTitle;
