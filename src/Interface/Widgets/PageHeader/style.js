import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    header: {
        width: '100%',
        marginTop: 36,
        marginBottom: 36,

        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',

        elevation: 1000,
        zIndex: 1000,
    },
    headerWithIcon: {
        marginTop: 28
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    headerLeftArrow: {
        marginRight: 16
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    beta: {
        fontSize: 14,
        textAlign: 'center',
        fontWeight: 'bold',
        color: '#505050',
        paddingHorizontal: 6,
        paddingVertical: 4,
        borderRadius: 5,
    },
    secondaryButton: {
        width: 'auto',
        paddingVertical: 8,
        paddingHorizontal: 8
    },
    textContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 10
    }
});

export default styles;
