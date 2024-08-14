import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    parentContent: {
        width: '100%',
        zIndex: 1010,
        elevation: 1010
    },

    overlayParent: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: 128,

        overflow: 'hidden',
        zIndex: 1050,
        elevation: 1050
    },
    overlayPanel: {
        marginBottom: 12,
        borderColor: '#ffffff',
        borderWidth: 1,
        borderTopWidth: 0,
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
        overflow: 'hidden'
    },
    overlayContent: {
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8
    },
    borderFix: {
        position: 'absolute',
        top: -12,
        left: 0,
        right: 0,
        height: 14,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        zIndex: 1020,
        elevation: 1020
    },
    overlayBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
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
        borderRadius: 6,
        zIndex: 800,
        elevation: 800
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
    },
    searchContainer: {
        minHeight: 0
    },
    search: {
        paddingVertical: 4,
        fontSize: 14
    }
});

export default styles;
