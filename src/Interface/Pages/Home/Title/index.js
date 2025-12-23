import * as React from 'react';
import { View, StyleSheet } from 'react-native';

import { Text } from 'Interface/Components';

const Title = React.forwardRef(
    /**
     * @param {Object} props
     * @param {string} props.title
     * @param {React.ReactNode} [props.children]
     * @param {React.Ref<View>} ref
     */
    ({ title, children }, ref) => {
        return (
            <View ref={ref} style={styles.sectionContainer} collapsable={false}>
                <Text style={styles.sectionTitle} color='secondary'>
                    {title}
                </Text>

                {children}
            </View>
        );
    }
);

const styles = StyleSheet.create({
    sectionContainer: {
        marginTop: 12,
        marginBottom: 6,
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between'
    },
    sectionTitle: {
        flexShrink: 1,
        paddingVertical: 6,
        fontSize: 21,
        textAlign: 'left',
        textTransform: 'uppercase'
    }
});

export { Title };
