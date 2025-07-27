import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    gradientContainer: {
        flex: 1,
        borderRadius: 8
    },
    container: {
        paddingHorizontal: 4,
        paddingVertical: 4,
        marginBottom: 4
    },
    button: {
        paddingVertical: 0,
        paddingHorizontal: 0
    },

    header: {
        position: 'absolute',
        width: '100%',
        padding: 4,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    title: {
        color: 'white',
        fontSize: 16,
        paddingVertical: 4,
        paddingHorizontal: 4
    },
    sectionTitleAddButton: {
        width: 'auto',
        paddingVertical: 4,
        paddingHorizontal: 4,
        zIndex: 10,
        elevation: 10
    },

    content: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 32,
        marginBottom: 4
    },

    notEnoughData: {
        width: '100%',
        paddingVertical: 8,
        paddingHorizontal: 8
    },
    notEnoughDataText: {
        fontSize: 16
    }
});

export default styles;
