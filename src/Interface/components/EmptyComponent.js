import * as React from 'react';
import { StyleSheet, View } from 'react-native';

const NewComponentProps = {
}

class NewComponent extends React.Component {
    render() {
        return (
            <View>
            </View>
        );
    }
}

NewComponent.prototype.props = NewComponentProps;
NewComponent.defaultProps = NewComponentProps;

const styles = StyleSheet.create({
});

export default NewComponent;