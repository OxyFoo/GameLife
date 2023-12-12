import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    parent: {
        width: 32,
        justifyContent: 'center',
        borderWidth: 1.5,
        borderRadius: 20,
        aspectRatio: 1
    },

    oblicLine: {
        position: 'absolute',
        top: -1,
        bottom: -1,
        left: '50%',
        width: 1.5,
        transform: [
            { translateX: -.75 }, // -width/2
            { rotate: '45deg' }
        ]
    }
});

export default styles;
