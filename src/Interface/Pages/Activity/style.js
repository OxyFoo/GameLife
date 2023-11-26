import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    header: {
        marginBottom: 24
    },

    categoriesTitle: {
        marginBottom: 16,
        fontSize: 22
    },
    categoriesContainer: {
        alignItems: 'center'
    },
    categoriesScrollView: {
        maxWidth: '100%',
        marginBottom: 24
    },
    category: {
        marginVertical: 4,
        marginHorizontal: 4
    },
    categoryEmpty: {
        width: 44,
        height: 44
    },

    activitiesTitle: {
        marginBottom: 16,
        fontSize: 22
    },
    activitiesSearchBar: {
        width: '100%',
        paddingHorizontal: 24,
        marginBottom: 12
    },
    activitiesFlatlist: {
        width: '100%',
        height: '100%'
    },
    activityElement: {
        marginHorizontal: 24,
        marginBottom: 6,
        padding: 16,
        borderRadius: 8,
        overflow: 'hidden'
    },

    emptyList: {
        marginTop: 24
    },
    emptyListText: {
        textAlign: 'center',
        fontSize: 24
    }
});

export default styles;
