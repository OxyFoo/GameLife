import * as React from 'react';
import { View, StyleSheet } from 'react-native';

import langManager from 'Managers/LangManager';

import { InputText, Text } from 'Interface/Components';

/**
 * @typedef {import('Data/User/Todoes').Todo} Todo
 *
 * @typedef {Object} SectionDescriptionPropsType
 * @property {Todo | null} todo
 * @property {(newTodo: Todo) => void} onChangeTodo
 */

/** @type {SectionDescriptionPropsType} */
const SectionDescriptionProps = {
    todo: null,
    onChangeTodo: () => {}
};

class SectionDescription extends React.Component {
    /** @param {SectionDescriptionPropsType} nextProps */
    shouldComponentUpdate(nextProps) {
        return (
            nextProps.todo !== this.props.todo ||
            nextProps.todo?.description !== this.props.todo?.description ||
            nextProps.onChangeTodo !== this.props.onChangeTodo
        );
    }

    /** @param {string} text */
    onChangeText = (text) => {
        const { todo, onChangeTodo } = this.props;
        if (todo === null || text === null) {
            return;
        }

        todo.description = text;
        onChangeTodo(todo);
    };

    render() {
        const lang = langManager.curr['todo'];
        const { todo } = this.props;

        if (todo === null) {
            return null;
        }

        return (
            <View style={styles.parent}>
                {/* Comment title */}
                <Text style={styles.title} color='border'>
                    {lang['input-commentary-title']}
                </Text>

                {/* Comment input */}
                <InputText
                    value={todo.description}
                    placeholder={lang['input-commentary-placeholder']}
                    inactiveColor='border'
                    forceActive={todo.description.length > 0}
                    onChangeText={this.onChangeText}
                    maxLength={1280}
                    multiline
                    showCounter
                />
            </View>
        );
    }
}

SectionDescription.prototype.props = SectionDescriptionProps;
SectionDescription.defaultProps = SectionDescriptionProps;

const styles = StyleSheet.create({
    parent: {
        marginBottom: 24
    },

    title: {
        marginBottom: 8,
        textAlign: 'left',
        fontSize: 14
    }
});

export default SectionDescription;
