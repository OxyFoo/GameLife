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
        paddingHorizontal: '10%',
    },
    XPBar: {
        marginBottom: 16
    },

    popupContent: {
        padding: 12
    },
    popupContentHeader: {
        position: 'absolute',
        top: 12,
        left: 0,
        right: 0,
        padding: 12,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    popupContentSwiper: {
        justifyContent: 'flex-start',
        paddingBottom: -12
    },
    popupContentStatPage: {
        marginTop: 6,
        marginBottom: 24
    },
    popupContentStat: {
        padding: 12,
        paddingHorizontal: 24
    }
});

export default styles;
