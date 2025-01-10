import { StyleSheet, Dimensions } from 'react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const styles = StyleSheet.create({
    background: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: '#00000060'
    },
    container: {
        position: 'absolute',
        top: 0,
        width: '70%',
        minWidth: 200,
        marginLeft: '15%',
        maxHeight: Math.max(SCREEN_HEIGHT / 2, 200),
        paddingVertical: 12,
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 10,
        backgroundColor: '#000000D0'
    },
    flatlist: {
        width: '100%',
        height: '100%'
    },
    separator: {
        width: '90%',
        marginLeft: '5%',
        marginVertical: 12
    }
});

export default styles;
