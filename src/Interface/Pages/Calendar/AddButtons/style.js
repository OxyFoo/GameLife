import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    separator: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 8
    },
    separatorText: {
        textAlign: 'center',
        fontSize: 12
    },
    separatorButton: {
        width: 'auto',
        paddingVertical: 6,
        paddingHorizontal: 0
    },
    separatorEmptyView: {
        height: 12
    }
});

export default styles;
