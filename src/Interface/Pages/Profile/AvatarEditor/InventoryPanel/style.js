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
    },
    itemButtonNoBorder: {
        borderWidth: 0
    },
    colorSquare: {
        borderRadius: 6
    },
    colorSquareBorder: {
        borderColor: '#8f8f8fff',
        borderWidth: 1
    },
    colorSquareSelected: {
        borderColor: '#ffffff',
        borderWidth: 3
    }
});

export default styles;
