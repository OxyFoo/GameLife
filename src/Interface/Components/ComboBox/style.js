import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: 128,
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
        zIndex: 1000,
        elevation: 1000
    },
    overlayBackground: {
        position: 'absolute',
        top: '-1000%',
        left: '-1000%',
        right: '-1000%',
        bottom: '-1000%',
        backgroundColor: '#00000055',
        zIndex: 900,
        elevation: 900
    },
    hoverButton: {
        position: 'absolute',
        width: 'auto',
        height: 'auto',
        top: 2,
        left: 2,
        right: 2,
        bottom: 2,
        borderRadius: 2,
        zIndex: 800,
        elevation: 800
    },

    parent: {
        width: '100%'
    },
    chevron: {
        position: 'absolute',
        top: 0,
        right: 12,
        bottom: 0,
        justifyContent: 'center'
    },

    item: {
        padding: 12
    },
    itemText: {
        textAlign: 'left'
    },
    parentSearchBar: {
        padding: 8
    }
});

export default styles;