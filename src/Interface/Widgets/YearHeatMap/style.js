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
        justifyContent: 'space-between',
        marginBottom: 8
    },
    headerText: {
        fontSize: 16,
        fontWeight: 'bold'
    }
});

export default styles;
