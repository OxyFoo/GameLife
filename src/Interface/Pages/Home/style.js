import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    page: {
        flex: 1,
        paddingHorizontal: 24
    },

    // Special styles for section title and add button
    sectionTitleAddButton: {
        width: 'auto',
        paddingVertical: 8,
        paddingHorizontal: 8
    },

    // Styles for main content
    chartsContainer: {
        flexDirection: 'row',
        alignItems: 'stretch',
        justifyContent: 'space-between',
        gap: 12
    },

    // Two columns layout
    leftColumn: {
        maxWidth: '50%',
        paddingRight: 8
    },
    rightColumn: {
        position: 'absolute',
        top: -40,
        left: 0,
        right: '-60%',
        alignItems: 'center',
        justifyContent: 'flex-start',
        zIndex: -100,
        elevation: -100
    },

    lastWidget: {
        marginBottom: 24
    }
});

export default styles;
