import * as React from 'react';
import { View } from 'react-native';

import styles from './style';

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

export { Title };
