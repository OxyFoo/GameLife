import * as React from 'react';
import { FlatList, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';

import GLText from './GLText';
import GLIconButton from './GLIconButton';
import user from '../../../../Managers/UserManager';

class GLDropDown extends React.PureComponent {
    state = {
        toggleMode: this.props.toggleMode || false,
        selectedIndexes: [],
        opened: false,
        selectedText: undefined
    }

    toggleVisibility = () => {
        if (this.props.disabled) return;
        const forcePopupMode = this.props.forcePopupMode || false;
        if (Platform.OS === 'ios' || forcePopupMode) {
            user.openPopup('list', this.contentRender.bind(this));
        } else {
            this.setState({ opened: !this.state.opened });
        }
    }

    backgroundPress = (ev) => {
        if (Platform.OS === 'android' && this.state.opened) {
            this.toggleVisibility();
        }
    }

    listComponent = ({ item }) => {
        const { key, value } = item;

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
                user.closePopup();
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
        const color = (!this.state.toggleMode || isSelected) ? 'main' : 'dark';

        // Component
        return (
            <GLText style={styles.component} title={value.toUpperCase()} onPress={onSelect} color={color} />
        )
    }

    render() {
        const opened = this.state.opened;
        const style  = [ styles.container, this.props.style ];
        const styleBox = [ styles.box, this.props.styleBox ];
        const icon   = opened ? 'chevronTop' : 'chevronBottom';
        const onLongPress = this.props.onLongPress;
        const simpleText = this.props.simpleText || false;
        const forcePopupMode = this.props.forcePopupMode || false;

        let value  = this.state.selectedText || this.props.value;
        if (!simpleText) value = value.toUpperCase();

        return !simpleText ? (
            <>
                {this.state.opened && <View style={styles.androidHitbox} onTouchStart={this.backgroundPress} />}
                <View style={style}>
                    <TouchableOpacity style={styleBox} activeOpacity={.5} onPress={this.toggleVisibility} onLongPress={onLongPress}>
                        <GLText style={styles.selected} title={value} color='secondary' />
                        <GLIconButton style={styles.icon} icon={icon} hide={this.props.disabled} />
                    </TouchableOpacity>

                    {!this.props.disabled && opened && !forcePopupMode && Platform.OS === 'android' && (
                        this.contentRender([styles.drop, { backgroundColor: user.themeManager.colors['globalBackcomponent'] }])
                    )}
                </View>
            </>
        ) : (
            <GLText style={[this.props.style]} title={value} onPress={this.toggleVisibility} color='secondary' />
        )
    }

    contentRender(style) {
        const data = this.props.data;
        return (
            <View style={style}>
                <FlatList
                    data={data}
                    keyExtractor={(item, i) => 'lang_' + i}
                    renderItem={this.listComponent}
                    removeClippedSubviews={true}
                    maxToRenderPerBatch={50}
                    updateCellsBatchingPeriod={50}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    androidHitbox: {
        position: 'absolute',
        top: '-1000%',
        left: '-1000%',
        width: '2000%',
        height: '2000%',
        backgroundColor: '#00000066'
    },
    container: {
        padding: 0,
        marginHorizontal: 12,
        marginVertical: 22,
        overflow: 'visible'
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