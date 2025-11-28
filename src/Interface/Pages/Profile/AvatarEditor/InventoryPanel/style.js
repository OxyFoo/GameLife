import { Dimensions, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        paddingVertical: 16
    },
    flatList: {
        height: Dimensions.get('window').height * 0.4
    },
    itemsContainer: {
        alignItems: 'center'
    },
    itemButton: {
        width: 'auto',
        paddingVertical: 0,
        paddingHorizontal: 0,
        marginTop: 6,
        marginLeft: 6,
        borderColor: '#8f8f8fff',
        borderWidth: 1
    }
});

export default styles;
