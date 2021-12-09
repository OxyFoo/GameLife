import * as React from 'react';
import { StyleSheet, View } from 'react-native';

function GLDoubleCorner(props) {
    const borderWidth = -props.borderWidth || -4;
    const width = props.width || 24;
    const color = props.color || '#FFFFFF';

    const styles = StyleSheet.create({
        cornerTL: {
            position: 'absolute',
            width: width,
            height: width,
            top: borderWidth,
            left: borderWidth,
            borderTopWidth: 2,
            borderLeftWidth: 2,
            borderColor: color,

            zIndex: -1000,
            elevation: -1000
        },
        cornerBR: {
            position: 'absolute',
            width: width,
            height: width,
            right: borderWidth,
            bottom: borderWidth,
            borderRightWidth: 2,
            borderBottomWidth: 2,
            borderColor: color,

            zIndex: -1000,
            elevation: -1000
        }
    });

    return (
        <>
            <View style={styles.cornerTL} />
            <View style={styles.cornerBR} />
        </>
    );
}

export default GLDoubleCorner;