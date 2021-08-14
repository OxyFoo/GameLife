import * as React from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';

import GLText from './GLText';
import GLIconButton from './GLIconButton';

class GLDropDown extends React.Component {
    state = {
        opened: true
    }

    toggleVisibility = () => {
        this.setState({ opened: !this.state.opened });
    }

    langComponent = ({ item }) => {
        const { key, value } = item;

        // Events
        let onSelect = null;
        if (typeof(this.props.onSelect) === 'function') {
            onSelect = () => {
                this.props.onSelect(key);
                this.toggleVisibility();
            };
        }

        // Component
        return (
            <GLText style={styles.component} title={value.toUpperCase()} onPress={onSelect} />
        )
    }

    render() {
        const opened = this.state.opened;
        const value  = this.props.value.toUpperCase() || this.props.defaultValue.toUpperCase();
        const style  = styles.selected;
        const icon   = opened ? 'chevronTop' : 'chevronBottom';
        const data   = this.props.data;

        return (
            <View style={this.props.style}>
                <TouchableOpacity style={styles.box} activeOpacity={.5} onPress={this.toggleVisibility}>
                    <GLText style={style} title={value} color='grey' />
                    <GLIconButton style={styles.icon} icon={icon} />
                </TouchableOpacity>

                {opened && (
                    <FlatList
                        style={styles.drop}
                        data={data}
                        keyExtractor={(item, i) => 'lang_' + i}
                        renderItem={this.langComponent}
                    />
                )}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    box: {
        margin: 24,
        paddingLeft: 4,

        borderColor: '#FFFFFF',
        borderWidth: 3,

        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    selected: {
        textAlign: 'left'
    },
    icon: {
        margin: 0,
        padding: 0
    },
    drop: {
        position: 'absolute',
        top: 60,
        left: 0,
        right: 0,

        marginHorizontal: 24,
        padding: 0,

        borderColor: '#FFFFFF',
        borderWidth: 3,
        backgroundColor: '#000011',

        zIndex: 1000,
        elevation: 1000
    },
    component: {
        margin: 4,
        paddingVertical: 4,
        textAlign: 'left'
    }
});

export default GLDropDown;