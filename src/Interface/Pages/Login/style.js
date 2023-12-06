import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    body: {
        width: '100%',
        height: '100%',
        paddingHorizontal: '5%'
    },
    container: {
        width: '100%',
        paddingVertical: 24,
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden'
    },
    mainImageContainer: {
        width: '100%',
        height: '30%',
        marginTop: '15%',

        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    mainImage: {
        height: '80%',
        aspectRatio: 1
    },
    backgroundCircles: {
        position: 'absolute',
        top: 0,
        right: 0
    },
    title: {
        marginTop: '10%',
        fontSize: 58
    },
    smallTitle: {
        marginTop: '5%',
        fontSize: 40
    },
    text: {
        margin: 12,
        textAlign: 'center',
        fontSize: 16
    },
    input: {
        width: '90%'
    },
    button: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        margin: 24
    },
    backButton: {
        position: 'absolute',
        width: 64,
        left: 24,
        bottom: 24
    },
    cgu: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: -8
    },
    error: {
        margin: 2,
        fontSize: 12
    }
});

export default styles;
