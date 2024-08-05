import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    page: {
        height: '100%',
        paddingHorizontal: 24
    },
    pageHeader: {
        marginBottom: 24
    },

    sectionTitle: {
        textAlign: 'left',
        marginTop: 36,
        marginBottom: 12
    },
    sectionError: {
        marginTop: 6,
        fontSize: 16
    },

    addButton: {
        width: 'auto',
        marginTop: 48,
        marginBottom: 48
    },
    removeButton: {
        width: 'auto',
        marginTop: 48
    },
    overlayButton: {
        position: 'absolute',
        width: 'auto',
        left: 24,
        right: 24,
        bottom: 24
    }
});

export default styles;
