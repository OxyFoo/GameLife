import * as React from 'react';
import { View } from 'react-native';

import styles from './style';
import SimpleContainerBack from './back';
import themeManager from 'Managers/ThemeManager';

class SimpleContainer extends SimpleContainerBack {
    render() {
        let header, body;

        const bodyStyle = {
            backgroundColor: themeManager.GetColor(this.props.backgroundColor, { opacity: 0.1 }),
        };

        React.Children.forEach(this.props.children, child => {
            if (React.isValidElement(child)) {
                if (child.type === SimpleContainer.Header) {
                    header = child;
                } else if (child.type === SimpleContainer.Body) {
                    body = React.cloneElement(child, {
                        style: [styles.body, bodyStyle, child.props.style]
                    });
                }
            }
        });

        return (
            <View style={this.props.style}>
                {header}
                {body}
            </View>
        );
    }
}


export default SimpleContainer;
