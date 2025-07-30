import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    absoluteAddButton: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: 'auto',
        paddingVertical: 8,
        paddingHorizontal: 8,
        shadowColor: 'transparent',
        zIndex: 10,
        elevation: 10
    },

    parentButton: {
        flex: 1,
        flexDirection: 'row',
        paddingVertical: 0,
        paddingHorizontal: 0
    },

    gradientContainer: {
        width: '100%',
        height: '100%',
        flexDirection: 'row',
        alignItems: 'stretch'
    },

    content: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginBottom: 12
    },

    header: {
        width: '100%',
        padding: 8
    },
    title: {
        textAlign: 'left'
    },

    donut: {
        marginBottom: 0
    },

    notEnoughData: {
        flex: 1,
        justifyContent: 'center',
        paddingVertical: 8,
        paddingHorizontal: 8
    }
});

export default styles;
