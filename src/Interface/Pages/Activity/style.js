import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    header: {
        marginBottom: 24
    },

    categoriesTitle: {
        marginBottom: 16,
        fontSize: 22
    },
    categoriesFlatlist: {
        width: '100%',
        minHeight: 44 * 2 + 8 * 2,
        marginBottom: 24
    },
    categoriesWrapper: {
        justifyContent: 'space-between'
    },
    category: {
        marginBottom: 8
    },
    categoryEmpty: {
        width: 44,
        height: 44
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
        borderRadius: 8
    }
});

export default styles;