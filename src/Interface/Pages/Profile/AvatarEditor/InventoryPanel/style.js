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
    },
    itemRarityBar: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 3,
        borderTopLeftRadius: 6,
        borderTopRightRadius: 6
    }
});

export default styles;
