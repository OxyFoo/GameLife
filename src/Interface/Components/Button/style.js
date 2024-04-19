import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    body: {
        width: '100%',
        paddingVertical: 16,
        paddingHorizontal: 24,

        borderRadius: 8,
        backgroundColor: 'transparent',
        overflow: 'hidden'
    },
    content: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center'
    },
    gradientContent: {
        marginVertical: 16,
        marginHorizontal: 24
    },
    absolute: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    },
    backgroundView: {
        width: '100%',
        height: '100%',
        borderColor: 'white',
        borderWidth: 1,
        borderRadius: 8
    },
    backgroundBlur: {
        margin: 1
    },
    backgroundTransparent: {
    },
    loadingIcon: {
        marginTop: -6,
        marginBottom: -6
    },

    buttonBadgeContainer: {
        width: 'auto',
        height: 'auto',
        maxHeight: 48,
        paddingVertical: 0,
        paddingHorizontal: 0,
        borderRadius: 8
    }
});

export default styles;
