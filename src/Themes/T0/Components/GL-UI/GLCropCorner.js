import * as React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

function GLCropCorner(props) {
    //const offset = props.offset || 3;
    const backgroundColor = props.backgroundColor || '#000022';
    const size = props.size || 50;

    const styles = StyleSheet.create({
        corner: {
            position: 'absolute',
            right: -3,
            bottom: -3,
    
            width: 0,
            height: 0,
            backgroundColor: "transparent",
            borderStyle: "solid",
            borderRightWidth: size,
            borderTopWidth: size,
            borderRightColor: "transparent",
            borderTopColor: backgroundColor,
    
            transform: [{ rotate: "180deg" }]
        },
        cornerBorder: {
            position: 'absolute',
            right: -3 + size/2,
            bottom: -3 - size/5,
            width: 3,
            height: ((size**2)*2)**0.5, // Pythagore
            transform: [{ rotate: "45deg" }],
            backgroundColor: '#FFFFFF'
        }
    });

    return (
        <>
            <View style={styles.corner} />
            <View style={styles.cornerBorder} />
        </>
    );
}

export default GLCropCorner;