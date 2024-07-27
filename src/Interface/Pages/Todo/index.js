import * as React from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import BackTodo from './back';
import SectionTitle from './Sections/title';
import SectionDescription from './Sections/description';
import SectionSchedule from './Sections/schedule';
import SectionTasks from './Sections/tasks';

import { Button } from 'Interface/Components';
import { PageHeader } from 'Interface/Widgets';

class Todo extends BackTodo {
    render() {
        const { title, action, button, tempTodo, error } = this.state;

        return (
            <>
                <ScrollView style={styles.page} onTouchStart={this.keyboardDismiss}>
                    <PageHeader title={title} onBackPress={this.onBackPress} />

                    <SectionTitle todo={tempTodo} error={error} onChangeTodo={this.onChangeTodo} />
                    <SectionSchedule todo={tempTodo} onChangeTodo={this.onChangeTodo} />
                    <SectionDescription todo={tempTodo} onChangeTodo={this.onChangeTodo} />
                    <SectionTasks todo={tempTodo} onChangeTodo={this.onChangeTodo} />
                </ScrollView>

                <Button
                    style={styles.button}
                    appearance={action === 'new' ? 'normal' : 'uniform'}
                    color={button.color}
                    onPress={this.onButtonPress}
                    enabled={error === null}
                >
                    {button.text}
                </Button>
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
