import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    mention: {
        alignItems: 'center'
    },
    button: {
        marginBottom: 12,
        paddingHorizontal: 12
    },
    // The Button content wraps by default: without `nowrap` the icon lands alone on a first line as
    // soon as the label is too long, the text shrinks and wraps inside its own box instead
    content: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8
    },
    icon: {
        flexShrink: 0
    },
    text: {
        flexShrink: 1
    }
});

export default styles;
