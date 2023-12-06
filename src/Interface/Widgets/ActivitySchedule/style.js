import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    button: {
        width: '80%',
        height: 'auto',
        padding: '2%',
        marginHorizontal: '10%',
        marginBottom: 48,
        justifyContent: 'center',
        borderRadius: 8,
        zIndex: 900,
        elevation: 900
    },
    title: {
        textAlign: 'left',
        fontSize: 14,
        opacity: .5
    },
    text: {
        fontSize: 16,
        textAlign: 'left'
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },

    panelRow: {
        padding: '4%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    panelButton: {
        width: 'auto',
        height: 36
    },
    overlay: {
        position: 'absolute',
        paddingBottom: 0,
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
        zIndex: 800,
        elevation: 800
    },
    overlayBackground: {
        position: 'absolute',
        top: '-1000%',
        left: '-1000%',
        right: '-1000%',
        bottom: '-1000%',
        backgroundColor: '#00000055',
        zIndex: 700,
        elevation: 700
    }
});

export default styles;
