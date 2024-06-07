import { StyleSheet, Platform } from 'react-native';

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,

        width: '100%',
        height: '100%',
        margin: 0,
        padding: 0
    },
    parent: {
        width: '100%',
        padding: 32,
        paddingBottom: Platform.OS === 'ios' ? 48 : 32,
        backgroundColor: '#00000001'
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        paddingVertical: 0,
        paddingHorizontal: 32,
        borderBottomWidth: 1
    },
    topOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        paddingVertical: 0,
        paddingHorizontal: 32,
        borderBottomWidth: 1
    },
    topOverlayLine: {
        position: 'absolute',
        top: -12,
        left: 0,
        right: 0,
        height: 12
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0
    }
});

export default styles;
