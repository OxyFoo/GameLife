import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        height: 'auto',
        padding: 16,
        paddingBottom: 8,
        paddingHorizontal: 16,
        borderRadius: 20,

        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-start'
    },
    flexBetween: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    headerText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold'
    },
    notEnoughData: {
        width: '100%'
    },
    notEnoughDataText: {
        fontSize: 16
    },
    notEnoughDataButton: {
        height: 'auto',
        marginVertical: 12,
        marginHorizontal: 24,
        paddingVertical: 12
    }
});

export default styles;
