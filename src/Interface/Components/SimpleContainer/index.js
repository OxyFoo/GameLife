import * as React from 'react';
import { View } from 'react-native';

import styles from './style';
import SimpleContainerBack from './back';
import themeManager from 'Managers/ThemeManager';

class SimpleContainer extends SimpleContainerBack {

    render() {
        let header, content;
        React.Children.forEach(this.props.children, child => {
            if (React.isValidElement(child)) {
                if (child.type === SimpleContainer.Header) {
                    header = child;
                } else if (child.type === SimpleContainer.Body) {
                    content = child;
                }
            }
        });

        const contentStyle = {
            backgroundColor: themeManager.GetColor(this.props.backgroundColor, { opacity: this.props.colorNextGen ? 0.1 : 1 }),
        };

        return (
            <View style={this.props.style}>
                <View style={this.props.styleHeader}>
                    {header}
                </View>
                <View style={[styles.content, contentStyle, this.props.styleContent]}>
                    {content}
                </View>
            </View>
        );
    }
}

export default SimpleContainer;
