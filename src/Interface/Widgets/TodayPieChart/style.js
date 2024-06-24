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
        width: '100%',
        paddingHorizontal: 12
    },
    notEnoughDataText: {
        fontSize: 16
    },
    notEnoughDataButton: {
        marginVertical: 12,
        paddingVertical: 12
    }
});

export default styles;
