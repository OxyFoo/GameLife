import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    textRollableHeader: {
        padding:0,
        paddingRight: 24
    },
    iconStaticHeader: {
        width: 'auto',
        height: 'auto',
        padding: 12,
        paddingRight: 0
    },
    content: {
        borderBottomStartRadius: 8,
        borderBottomEndRadius: 8,
        overflow: 'hidden'
    }
});

export default styles;
