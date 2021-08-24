import * as React from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';

import GLText from './GLText';
import GLIconButton from './GLIconButton';

class GLDropDown extends React.PureComponent {
    state = {
        opened: false,
        selectedText: undefined
    }

    toggleVisibility = () => {
        if (this.props.disabled) return;
        this.setState({ opened: !this.state.opened });
    }

    listComponent = ({ item }) => {
        const { key, value } = item;

        if (this.props.disabled) {
            return;
        }

        // Events
        const onSelect = () => {
            if (typeof(this.props.onSelect) === 'function') {
                this.props.onSelect(key, item);
            };

            const showOnSelect = this.props.showOnSelect;
            if (typeof(showOnSelect) !== 'undefined' && showOnSelect === true) {
                this.setState({ selectedText: value.toUpperCase() });
            }

            this.toggleVisibility();
        }

        // Component
        return (
            <GLText style={styles.component} title={value.toUpperCase()} onPress={onSelect} />
        )
    }

    render() {
        const opened = this.state.opened;
        const value  = this.state.selectedText || this.props.value.toUpperCase();
        const style  = [ styles.container, this.props.style ];
        const styleBox = [ styles.box, this.props.styleBox ];
        const icon   = opened ? 'chevronTop' : 'chevronBottom';
        const data   = this.props.data;
        const onLongPress = this.props.onLongPress;
        const styleAtTop = { zIndex: 10000, elevation: 10000 };

        return (
            <View style={this.state.opened ? [style, styleAtTop] : style}>
                <TouchableOpacity style={styleBox} activeOpacity={.5} onPress={this.toggleVisibility} onLongPress={onLongPress}>
                    <GLText style={styles.selected} title={value} color='grey' />
                    <GLIconButton style={styles.icon} icon={icon} hide={this.props.disabled} />
                </TouchableOpacity>

                {!this.props.disabled && opened && (
                    <FlatList
                        style={styles.drop}
                        data={data}
                        keyExtractor={(item, i) => 'lang_' + i}
                        renderItem={this.listComponent}
                        removeClippedSubviews={true}
                        maxToRenderPerBatch={20}
                        updateCellsBatchingPeriod={50}
                    />
                )}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        padding: 0,
        marginHorizontal: 12,
        marginVertical: 22,

        zIndex: 100,
        elevation: 100
    },
    box: {
        paddingLeft: 4,
        
        borderColor: '#FFFFFF',
        borderWidth: 3,

        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    selected: {
        maxWidth: '85%',
        paddingVertical: 6,
        textAlign: 'left'
    },
    icon: {
        margin: 0,
        padding: 0
    },
    drop: {
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        marginTop: -3,

        maxHeight: 200,
        padding: 0,

        borderColor: '#FFFFFF',
        borderWidth: 3,
        backgroundColor: '#000011',

        zIndex: 10000,
        elevation: 10000
    },
    component: {
        margin: 4,
        paddingVertical: 4,
        textAlign: 'left'
    }
});

export default GLDropDown;