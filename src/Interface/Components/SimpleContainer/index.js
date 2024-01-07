import * as React from 'react';
import { View } from 'react-native';

import styles from './style';
import SimpleContainerBack from './back';
import themeManager from 'Managers/ThemeManager';

class SimpleContainer extends SimpleContainerBack {
    render() {
        let header, body;

        React.Children.forEach(this.props.children, child => {
            if (React.isValidElement(child)) {
                if (child.type === SimpleContainer.Header) {
                    header = child;
                } else if (child.type === SimpleContainer.Body) {
                    body = child;
                }
            }
        });

        const bodyStyle = {
            backgroundColor: themeManager.GetColor(this.props.backgroundColor, { opacity: 0.1 }),
        };

        return (
            <View style={this.props.style}>
                {header}
                <View style={[styles.body, bodyStyle]}>
                    {body}
                </View>
            </View>
        );
    }
}

export default SimpleContainer;
