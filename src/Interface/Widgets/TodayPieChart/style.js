import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        padding: 16,
        borderRadius: 20
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
        marginTop:8,
        fontSize: 16
    }
});

export default styles;