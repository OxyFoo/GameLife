import React from 'react';
import { View } from 'react-native';

import styles from './style';
import NonZeroDayBack from './back';

import { Container, Text } from 'Interface/Components';

class NonZeroDay extends NonZeroDayBack {
    render() {
        return (
            <Container
                style={this.props.style}
                type='static'
                text={'[NonZeroDay]'}
            >
                <Text>{'[TEST]'}</Text>
            </Container>
        );
    }
}

export default NonZeroDay;
