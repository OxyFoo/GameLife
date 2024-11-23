import { Dimensions, StyleSheet } from 'react-native';

const SCREEN_HEIGHT = Dimensions.get('window').height;

const styles = StyleSheet.create({
    // Popup
    popup: {
        height: '100%',
        overflow: 'hidden'
    },

    categoriesContainer: {
        width: '100%',
        marginTop: 24,
        alignItems: 'center'
    },
    categoriesParent: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 0
    },
    categoryItem: {
        flex: 1,
        aspectRatio: 1,
        width: 'auto',
        marginLeft: 6,
        paddingVertical: 0,
        paddingHorizontal: 0,
        justifyContent: 'center'
    },
    categoryItemFirst: {
        marginLeft: 0
    },

    searchContainer: {
        position: 'absolute',
        top: 24,
        left: 0,
        right: 0,
        marginHorizontal: 16
    },
    searchButton: {
        width: 'auto',
        paddingVertical: 8,
        paddingHorizontal: 8
    },
    containerTitle: {
        marginTop: 6,
        marginBottom: 4,
        marginHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },

    // Skill item
    activitiesFlatlist: {
        width: '100%',
        height: SCREEN_HEIGHT * 0.6,
        marginTop: 12
    },
    activityElement: {
        marginHorizontal: 12,
        marginBottom: 6,
        padding: 8,
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
