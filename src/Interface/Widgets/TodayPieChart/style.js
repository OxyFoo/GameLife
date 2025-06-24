import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    gradientContainer: {
        flex: 1,
        borderRadius: 8
    },
    container: {
        paddingHorizontal: 8,
        paddingVertical: 8,
        marginBottom: 4
    },

    header: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12
    },
    title: {
        color: 'white',
        fontSize: 16
    },
    sectionTitleAddButton: {
        width: 'auto',
        paddingVertical: 0,
        paddingHorizontal: 0
    },

    content: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },

    notEnoughData: {
        width: '100%',
        paddingVertical: 8,
        paddingHorizontal: 8
    },
    notEnoughDataText: {
        fontSize: 16
    },
    notEnoughDataButton: {
        marginTop: 12,
        paddingVertical: 12
    }
});

export default styles;
