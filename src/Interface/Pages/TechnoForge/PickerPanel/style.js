import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        paddingVertical: 16,
        paddingHorizontal: 12
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 12
    },
    title: {
        flex: 1,
        textAlign: 'left'
    },
    clearButton: {
        width: 'auto',
        paddingVertical: 8,
        paddingHorizontal: 12
    },
    hint: {
        marginTop: 4,
        marginBottom: 8,
        paddingHorizontal: 12,
        textAlign: 'left'
    },
    sectionTitle: {
        marginTop: 8,
        marginBottom: 2,
        paddingHorizontal: 12,
        textAlign: 'left',
        textTransform: 'uppercase'
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    // Same cell as the inventory grid of the avatar editor
    cell: {
        width: 'auto',
        paddingVertical: 0,
        paddingHorizontal: 0,
        marginTop: 6,
        marginLeft: 6,
        borderColor: '#8f8f8fff',
        borderWidth: 1
    },
    cellDisabled: {
        opacity: 0.45
    },
    rarityBar: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 3,
        borderTopLeftRadius: 6,
        borderTopRightRadius: 6
    },
    overlay: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    empty: {
        marginTop: 24,
        textAlign: 'center'
    }
});

export default styles;
