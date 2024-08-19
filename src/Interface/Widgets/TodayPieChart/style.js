import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        width: 'auto',
        paddingVertical: 12,
        paddingHorizontal: 8,
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
        marginBottom: 8,
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
        marginTop: 12,
        paddingVertical: 12
    }
});

export default styles;
