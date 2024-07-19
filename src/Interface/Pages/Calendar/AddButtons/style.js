import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    separator: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 12
    },
    separatorText: {
        width: 80,
        textAlign: 'right',
        fontSize: 12
    },
    separatorButton: {
        width: 'auto',
        paddingVertical: 6,
        paddingHorizontal: 16
    },
    separatorEmptyView: {
        height: 12
    }
});

export default styles;
