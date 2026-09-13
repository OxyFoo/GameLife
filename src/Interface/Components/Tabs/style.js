import { StyleSheet } from 'react-native';

const TABS_GAP = 8;
const TABS_HEIGHT = 40;

const styles = StyleSheet.create({
    parent: {
        flexDirection: 'row',
        alignItems: 'center',
        height: TABS_HEIGHT,
        gap: TABS_GAP
    },
    pill: {
        position: 'absolute',
        top: 0,
        left: 0,
        height: TABS_HEIGHT,
        borderRadius: TABS_HEIGHT / 2,
        overflow: 'hidden'
    },
    cell: {
        height: TABS_HEIGHT,
        borderRadius: TABS_HEIGHT / 2,
        borderWidth: 1.2,
        overflow: 'hidden'
    },
    touchable: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 6
    }
});

export { TABS_GAP, TABS_HEIGHT };
export default styles;
