import * as React from 'react';
import { Animated, FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';

import GLText from './GLText';
import GLIconButton from './GLIconButton';
import { OptionsAnimation } from '../Animations';
import user from '../../Managers/UserManager';

class GLPopup extends React.PureComponent {
    state = {
        opened: false,
        animOpacity: new Animated.Value(0),
        animScale: new Animated.Value(.8)
    }

    componentDidUpdate() {
        const propsOpened = this.props.type != null;
        if (typeof(propsOpened) === 'boolean') {
            if (propsOpened !== this.state.opened) {
                this.toggleVisibility();
            }
        }
    }

    toggleVisibility = () => {
        const opened = !this.state.opened;
        this.setState({ opened: opened });
        if (opened) {
            // Open
            OptionsAnimation(this.state.animOpacity, 1, 200).start();
            OptionsAnimation(this.state.animScale, 1, 200).start();
        } else {
            // Close
            OptionsAnimation(this.state.animOpacity, 0, 200).start();
            OptionsAnimation(this.state.animScale, .8, 200).start();
        }
    }

    listComponent = ({ item }) => {
        const { key, value } = item;
        return (
            <GLText style={styles.component} title={value.toUpperCase()} color={'white'} onPress={() => {}} />
        )

        if (this.props.disabled) {
            return;
        }

        // Events
        const onSelect = () => {
            if (!this.state.toggleMode) {
                if (typeof(this.props.onSelect) === 'function') {
                    this.props.onSelect(key, item);
                };

                const showOnSelect = this.props.showOnSelect;
                if (typeof(showOnSelect) !== 'undefined' && showOnSelect === true) {
                    this.setState({ selectedText: value.toUpperCase() });
                }

                this.toggleVisibility();
            } else {
                // Toggle element
                let selected = this.state.selectedIndexes;
                if (selected.includes(key)) selected.splice(selected.indexOf(key), 1);
                else selected.push(key);
                this.setState({ selectedIndexes: selected });

                if (typeof(this.props.onSelect) === 'function') {
                    this.props.onSelect(selected);
                };

                this.forceUpdate();
            }
        }

        const isSelected = this.state.selectedIndexes.includes(key);
        const color = (!this.state.toggleMode || isSelected) ? 'white' : 'darkgrey';

        // Component
        return (
            <GLText style={styles.component} title={value.toUpperCase()} onPress={onSelect} color={color} />
        )
    }

    render() {
        return (
            <Animated.View
                style={[styles.parent, { opacity: this.state.animOpacity }]}
                pointerEvents={this.props.type !== null ? 'auto' : 'none'}
                onTouchEnd={() => { this.forceUpdate() }}
            >
                <View style={styles.background} onTouchStart={user.closePopup} />
                <Animated.View style={[styles.container, {
                        transform: [{ scale: this.state.animScale }]
                    }]}
                >
                    {this.props.type === "list" && this.props.args.contentRender()}
                    {/*this.props.type === 'list' && (
                        <FlatList
                            data={this.props.args}
                            keyExtractor={(item, i) => 'lang_' + i}
                            renderItem={this.listComponent}
                            removeClippedSubviews={true}
                            maxToRenderPerBatch={20}
                            updateCellsBatchingPeriod={50}
                        />
                    )*/}
                </Animated.View>
            </Animated.View>
        )
    }
}

const styles = StyleSheet.create({
    parent: {
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000000'
    },
    background: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: '#00000011'
    },
    container: {
        width: '80%',
        maxHeight: '50%',
        borderColor: '#FFFFFF',
        borderWidth: 2
    },
    component: {
        margin: 4,
        paddingVertical: 4,
        textAlign: 'left'
    }
});

export default GLPopup;