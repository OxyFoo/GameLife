import * as React from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import BackTodo from './back';
import SectionTitle from './Sections/title';
import SectionDescription from './Sections/description';
import SectionSchedule from './Sections/schedule';
import SectionTasks from './Sections/tasks';
import langManager from 'Managers/LangManager';

import { Button } from 'Interface/Components';
import { PageHeader } from 'Interface/Widgets';
import { WithInterpolation } from 'Utils/Animations';

class Todo extends BackTodo {
    render() {
        const lang = langManager.curr['todo'];
        const { action, tempTodo, error, animEditButton, editButtonHeight } = this.state;
        const title = action === 'new' ? lang['title-new'] : lang['title'];

        const styleAnimEditButton = {
            opacity: animEditButton,
            transform: [
                {
                    translateY: WithInterpolation(animEditButton, 0, -editButtonHeight - 12)
                }
            ]
        };

        return (
            <>
                <ScrollView style={styles.page} onTouchStart={this.keyboardDismiss}>
                    <PageHeader title={title} onBackPress={this.onBackPress} />

                    <SectionTitle todo={tempTodo} error={error} onChangeTodo={this.onChangeTodo} />
                    <SectionSchedule todo={tempTodo} onChangeTodo={this.onChangeTodo} />
                    <SectionDescription todo={tempTodo} onChangeTodo={this.onChangeTodo} />
                    <SectionTasks todo={tempTodo} onChangeTodo={this.onChangeTodo} />
                </ScrollView>

                {/* Button: Add */}
                {action === 'new' && (
                    <Button style={styles.button} onPress={this.addTodo} enabled={error === null}>
                        {lang['button-add']}
                    </Button>
                )}

                {action !== 'new' && (
                    <>
                        {/* Button: Edit (Animated) */}
                        <Button
                            style={styles.button}
                            styleAnimation={styleAnimEditButton}
                            appearance='normal'
                            color='success'
                            onLayout={this.onEditButtonLayout}
                            onPress={this.editTodo}
                            enabled={error === null}
                        >
                            {lang['button-save']}
                        </Button>

                        {/* Button: Remove */}
                        <Button style={styles.button} appearance='outline' icon='trash' onPress={this.removeTodo}>
                            {lang['button-remove']}
                        </Button>
                    </>
                )}
            </>
        );
    }
}

const styles = StyleSheet.create({
    page: {
        paddingHorizontal: 24
    },

    button: {
        position: 'absolute',
        width: 'auto',
        left: 24,
        right: 24,
        bottom: 24
    }
});

export default Todo;
