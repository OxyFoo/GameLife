import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        paddingVertical: 16,
        paddingHorizontal: 16,
        alignItems: 'center'
    },
    previewContainer: {
        marginBottom: 16,
        borderRadius: 12,
        overflow: 'hidden'
    },
    infoContainer: {
        width: '100%',
        marginBottom: 24,
        alignItems: 'center'
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center'
    },
    description: {
        fontSize: 14,
        opacity: 0.7,
        textAlign: 'center'
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 12,
        width: '100%'
    },
    button: {
        flex: 1,
        paddingVertical: 12
    },
    buttonText: {
        fontSize: 16,
        textAlign: 'center'
    },
    buttonTextDisabled: {
        opacity: 0.5
    }
});

export default styles;
