import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        width: 'auto',
        borderRadius: 8,

        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',

        paddingHorizontal: 8,
        paddingVertical: 12
    },
    centerContent: {
        alignItems: 'center'
    },
    progressText: {
        fontWeight: 'bold',
        color: 'white'
    },
    subtitleText: {
        color: 'white',
        marginTop: 2,
        opacity: 0.8
    }
});

export default styles;
