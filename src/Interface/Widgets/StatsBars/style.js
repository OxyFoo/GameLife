import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    fullW: {
        width: '100%'
    },
    XPHeader: {
        marginBottom: 8,
        paddingHorizontal: '5%',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    XPHeaderSimplified: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: '10%'
    },
    XPBar: {
        marginBottom: 16
    },

    popupContent: {
        padding: 12
    },
    popupContentHeader: {
        position: 'absolute',
        top: 16,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    popupButtonNavigation: {
        width: 'auto',
        paddingVertical: 8,
        paddingHorizontal: 8
    },
    popupContentStatPage: {
        marginTop: 6
    },
    popupContentStat: {
        paddingVertical: 12,
        paddingHorizontal: 24
    }
});

export default styles;
