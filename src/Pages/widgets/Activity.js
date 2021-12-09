import * as React from 'react';
import { StyleSheet, View } from 'react-native';

const ActivityProps = {
}

class Activity extends React.Component {
    render() {
        return (
            <View>
            </View>
        );
    }
}

Activity.prototype.props = ActivityProps;
Activity.defaultProps = ActivityProps;

const styles = StyleSheet.create({
});

export default Activity;