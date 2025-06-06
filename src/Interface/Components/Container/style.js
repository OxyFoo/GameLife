import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    staticHeader: {
        paddingVertical: 0,
        paddingHorizontal: 0
    },
    container: {
        padding: 24
    },
    headerButton: {
        paddingVertical: 0,
        paddingHorizontal: 0
    },
    headerGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 24
    },
    headerGradientContainer: {
        width: '100%',
        height: '100%'
    },
    textRollableHeader: {
        padding: 0,
        paddingRight: 24
    },
    iconStaticHeader: {
        width: 'auto',
        height: 'auto',
        marginRight: -12,
        paddingVertical: 0,
        paddingHorizontal: 0
    },
    content: {
        borderBottomStartRadius: 8,
        borderBottomEndRadius: 8,
        overflow: 'hidden'
    }
});

export default styles;
