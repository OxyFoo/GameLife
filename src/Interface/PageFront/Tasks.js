import * as React from 'react';
import { Animated, FlatList, StyleSheet } from 'react-native';

import BackTasks from '../PageBack/Tasks';
import user from '../../Managers/UserManager';
import langManager from '../../Managers/LangManager';

import { Button, Container, Page, Text } from '../Components';
import { PageHeader, TaskElement } from '../Widgets';

class Tasks extends BackTasks {
    renderSelection = () => {
        const { draggedItem, mouseY } = this.state;
        if (draggedItem === null) return null;

        const translate = { transform: [{ translateY: mouseY }] };

        return (
            <Animated.View style={[styles.selection, translate]}>
                <TaskElement style={{ marginTop: 0 }} task={draggedItem} />
            </Animated.View>
        );
    }
    render() {
        const lang = langManager.curr['tasks'];
        const { adState, scrollable, draggedItem } = this.state;

        const renderItem = ({ item }) => (
            <TaskElement
                style={{ opacity: draggedItem !== null && item.Title === draggedItem.Title ? .25 : 1 }}
                task={item}
                onTaskCheck={this.onTaskCheck}
                onDrag={() => this.onDrag(item)}
            />
        );
        const renderEmpty = () => (
            <>
                <Text style={styles.emptyText}>{lang['tasks-empty-title']}</Text>
                <Button onPress={this.addTask} color='main1'>{lang['tasks-empty-button']}</Button>
            </>
        );

        return (
            <Page scrollable={false} bottomOffset={0}>
                <PageHeader
                    onBackPress={() => user.interface.BackPage()}
                />

                <Button.Ad
                    style={styles.spaceBottom}
                    state={adState}
                    onPress={this.watchAd}
                />

                <Container
                    styleContainer={styles.tasksContainer}
                    type='static'
                    icon='add'
                    text={lang['container-title']}
                    onLayout={this.onLayout}
                    onIconPress={this.addTask}
                >
                    {this.renderSelection()}
                    <FlatList
                        ref={ref => this.refFlatlist = ref}
                        style={{ height: 'auto' }}

                        onTouchStart={this.onTouchStart}
                        onTouchMove={this.onTouchMove}
                        onTouchEnd={this.onTouchEnd}
                        onScroll={this.onScroll}
                        onContentSizeChange={(w, h) => this.flatlist.contentSizeHeight = h}
                        onLayout={(event) => this.flatlist.layoutMeasurementHeight = event.nativeEvent.layout.height}

                        data={this.state.tasks}
                        scrollEnabled={scrollable}
                        keyExtractor={(item, index) => 'task-' + index.toString()}
                        renderItem={renderItem}
                        ListEmptyComponent={renderEmpty}
                    />
                </Container>
            </Page>
        );
    }
}

const styles = StyleSheet.create({
    selection: {
        position: 'absolute',
        left: 0,
        right: 0,
        paddingVertical: 4,
        marginHorizontal: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        backgroundColor: '#00000080',
        zIndex: 10
    },
    tasksContainer: { padding: 28, paddingTop: 14 },
    spaceBottom: { marginBottom: 32 },
    emptyText: { marginBottom: 12 },
    adButton: { justifyContent: 'space-between', borderRadius: 14 },
    adText: { marginRight: 6 },
    adIcon: { flexDirection: 'row' }
});

export default Tasks;