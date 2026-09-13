import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    caption: {
        // Lets a good part of the portrait breathe above the text
        marginTop: 150,
        marginBottom: 4
    },
    // Flush with the text below: the font carries a tall ascender space
    season: {
        textAlign: 'left',
        lineHeight: 14,
        includeFontPadding: false,
        marginBottom: 2
    },
    name: {
        textAlign: 'left'
    },
    subtitle: {
        textAlign: 'left',
        marginTop: 2
    },
    bar: {
        marginTop: 10
    },
    state: {
        textAlign: 'left',
        marginTop: 6
    }
});

export default styles;
