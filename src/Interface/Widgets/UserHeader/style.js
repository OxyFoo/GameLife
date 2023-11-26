import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    absolute: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        overflow: 'hidden'
    },
    linear: {
        width: '100%'
    },
    container: {
        padding: 32,
        paddingBottom: 0
    },

    header: {
        width: '100%',
        marginBottom: 6,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    content: {
        justifyContent: 'center',
        height: 84
    },
    usernameContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end'
    },
    username: {
        marginTop: 6,
        fontSize: 28,
        textAlign: 'left'
    },
    age: {
        marginLeft: 6,
        marginBottom: 2,
        fontSize: 20
    },
    title: {
        fontSize: 24,
        textAlign: 'left'
    },
    avatar: {
        height: 48,
        aspectRatio: 1,
        borderRadius: 4,
        borderColor: 'white',
        borderWidth: 2,
        paddingVertical: 0,
        paddingHorizontal: 0
    }
});

export default styles;
