import * as React from 'react';
import { ScrollView } from 'react-native';

import styles from './style';
import BackTodo from './back';
import SectionTitle from './Sections/title';
import SectionDescription from './Sections/description';
import SectionSchedule from './Sections/schedule';
import SectionTasks from './Sections/Tasks';
import langManager from 'Managers/LangManager';

import { Button } from 'Interface/Components';
import { PageHeader } from 'Interface/Widgets';
import { WithInterpolation } from 'Utils/Animations';

class Todo extends BackTodo {
    render() {
        const lang = langManager.curr['todo'];
        const { action, tempTodo, error, animEditButton, editButtonHeight, scrollable } = this.state;
        const title = action === 'new' ? lang['title-new'] : lang['title'];

        const styleAnimEditButton = {
            opacity: animEditButton,
            transform: [
                {
                    translateY: WithInterpolation(animEditButton, editButtonHeight, 0)
                }
            ]
        };

        return (
            <>
                <ScrollView
                    ref={this.refScrollView}
                    style={styles.page}
                    onTouchStart={this.keyboardDismiss}
                    onScroll={this.onScroll}
                    scrollEnabled={scrollable}
                >
                    <PageHeader title={title} onBackPress={this.onBackPress} />

                    <SectionTitle todo={tempTodo} error={error} onChangeTodo={this.onChangeTodo} />
                    <SectionSchedule todo={tempTodo} onChangeTodo={this.onChangeTodo} />
                    <SectionDescription todo={tempTodo} onChangeTodo={this.onChangeTodo} />
                    <SectionTasks
                        todo={tempTodo}
                        onChangeTodo={this.onChangeTodo}
                        changeScrollable={this.onChangeScrollable}
                    />

                    {/* Button: Remove */}
                    {action !== 'new' && (
                        <Button
                            style={[styles.removeButton, action === 'edit' && styles.removeButtonWithEdit]}
                            appearance='outline'
                            icon='trash'
                            onPress={this.removeTodo}
                        >
                            {lang['button-remove']}
                        </Button>
                    )}
                </ScrollView>

                {/* Button: Add */}
                {action === 'new' && (
                    <Button style={styles.button} onPress={this.addTodo} enabled={error === null}>
                        {lang['button-add']}
                    </Button>
                )}

                {/* Button: Edit (Animated) */}
                {action !== 'new' && (
                    <Button
                        style={styles.button}
                        styleAnimation={styleAnimEditButton}
                        appearance='normal'
                        color='success'
                        onLayout={this.onEditButtonLayout}
                        onPress={this.editTodo}
                        enabled={error === null}
                        pointerEvents={action === 'edit' ? 'auto' : 'none'}
                    >
                        {lang['button-save']}
                    </Button>
                )}
            </>
        );
    }
}

export default Todo;
