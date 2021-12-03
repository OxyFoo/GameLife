import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import Icon from './Icon';
import Input from './Input';

const ComboboxProps = {
    style: {},
    activeColor: 'main1'
}

class Combobox extends React.Component {
    render() {
        return (
            <View style={[styles.parent, this.props.style]}>
                <Input staticLabel={true} />
                <Icon style={styles.chevron} icon='chevron' />
            </View>
        );
    }
}

Combobox.prototype.props = ComboboxProps;
Combobox.defaultProps = ComboboxProps;

const styles = StyleSheet.create({
    parent: {
        width: '100%'
    },
    chevron: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: 'red'
    }
});

export default Combobox;