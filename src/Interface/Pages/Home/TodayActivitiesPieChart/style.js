import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1
    },

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

    // Same height as the header of the raid widget beside it (10 + icon 24 + 4), so both rings
    // start at the same distance from the top and their titles share the same line
    header: {
        width: '100%',
        minHeight: 38,
        paddingTop: 10,
        paddingBottom: 4,
        paddingHorizontal: 8,
        justifyContent: 'center'
    },
    title: {
        textAlign: 'left'
    },

    notEnoughData: {
        flex: 1,
        justifyContent: 'center',
        paddingVertical: 8,
        paddingHorizontal: 8
    }
});

export default styles;
