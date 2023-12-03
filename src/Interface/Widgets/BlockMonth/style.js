import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginBottom: 24
    },
    title: {
        marginBottom: 12,
        fontWeight: 'bold'
    },
    loading: {
        width: '100%',
        height: '100%',
        backgroundColor: 'red'
    },
    rowContainer: {
        justifyContent: 'space-evenly'
    },
    day: {
        width: '10%',
        aspectRatio: 1,
        //paddingVertical: 6,
        alignItems: 'center',
        justifyContent: 'center'
    },
    dayTextContainer: {
        width: '100%'
    },
    circle: {
        borderRadius: 50
    },

    dotContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: 'center'
    },
    dot: {
        width: 4,
        height: 4,
        borderRadius: 2
    }
});

export default styles;
