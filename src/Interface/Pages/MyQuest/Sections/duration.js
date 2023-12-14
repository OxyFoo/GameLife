import * as React from 'react';
import { View, StyleSheet } from 'react-native';

import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import { Text, Button } from 'Interface/Components';
import { TIME_STEP_MINUTES } from 'Utils/Activities';

const DurationProps = {
    /** @type {number} */
    initDuration: 0,

    /** @param {number} duration */
    onChange: (duration) => {}
};

class SectionDuration extends React.Component {
    state = {
        /** @type {number} */
        duration: 0
    }

    refHelp1 = null;

    onChange = () => {
        // TODO: Calculate duration
        const duration = 0;
        this.props.onChange(duration);
    }

    render() {
        const lang = langManager.curr['quest'];

        const backgroundColor = {
            backgroundColor: themeManager.GetColor('backgroundCard')
        };

        return (
            <View
                ref={ref => this.refHelp1 = ref}
                style={[backgroundColor, styles.schedulePanel]}
            >
                <Text fontSize={16}>{'[TEST]'}</Text>
            </View>
        );
    }
}

SectionDuration.prototype.props = DurationProps;
SectionDuration.defaultProps = DurationProps;

const styles = StyleSheet.create({
    schedulePanel: {
        padding: 24,
        borderRadius: 12
    }
});

export default SectionDuration;
