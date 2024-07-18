import * as React from 'react';
import { View } from 'react-native';

import styles from './style';
import BackResponsive from './back';

import { ComboBox, Text } from 'Interface/Components';
import { PageHeader } from 'Interface/Widgets';

/** @typedef {import('Interface/Components/ComboBox/back').ComboBoxItem} ComboBoxItem */

/** @type {ComboBoxItem[]} */
const SCALES = Array(7)
    .fill(0)
    .map((_, i) => {
        return {
            key: i,
            value: `${0.5 + i / 4}`
        };
    });

/** @type {ComboBoxItem[]} */
const PADDINGS = Array(10)
    .fill(0)
    .map((_, i) => {
        return {
            key: i,
            value: `${i * 6}`
        };
    });

class Responsive extends BackResponsive {
    render() {
        const { scaleValue, paddingVerticalValue, paddingHorizontalValue } = this.state;

        return (
            <View style={styles.page}>
                <PageHeader style={styles.header} onBackPress={this.handleBackPress} />

                <Text style={styles.title}>Responsive manager</Text>

                <ComboBox
                    style={styles.combobox}
                    title='Scale'
                    data={SCALES}
                    selectedValue={scaleValue}
                    onSelect={this.handleChangeAspectRatio}
                />

                <ComboBox
                    style={styles.combobox}
                    title='Vertical padding'
                    data={PADDINGS}
                    selectedValue={paddingVerticalValue}
                    onSelect={this.handleChangePaddingVertical}
                />

                <ComboBox
                    style={styles.combobox}
                    title='Horizontal padding'
                    data={PADDINGS}
                    selectedValue={paddingHorizontalValue}
                    onSelect={this.handleChangePaddingHorizontal}
                />
            </View>
        );
    }
}

export default Responsive;
