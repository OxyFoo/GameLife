import * as React from 'react';
import { View } from 'react-native';

import styles from './style';
import BackNewComponent from './back';

class NewComponent extends BackNewComponent {
    render() {
        return <View />;
    }
}

export default NewComponent;
