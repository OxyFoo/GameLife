import * as React from 'react';
import { View } from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';

import styles from './style';
import BackTest2 from './back';

import { Gradient } from 'Interface/Primitives';
import { Text, Button, InputText } from 'Interface/Components';

class Test2 extends BackTest2 {
    render() {
        return (
            <View style={styles.page}>
                <MaskedView style={styles.maskTitle} maskElement={<Text fontSize={32}>{'Page de test 2'}</Text>}>
                    <Gradient style={styles.gradientTitle} />
                </MaskedView>

                <Button
                    style={styles.marginBot}
                    icon='arrow-square-outline'
                    iconAngle={-90}
                    appearance='outline'
                    onPress={this.back}
                />
                <Button style={styles.marginBot} loading={true}>
                    {'Bla bla bla'}
                </Button>

                <InputText
                    containerStyle={styles.marginBot}
                    label='Test input'
                    value={this.state.input}
                    onChangeText={(newText) => this.setState({ input: newText })}
                />

                <Button onPress={this.openApp}>{"Ouvrir l'app"}</Button>
            </View>
        );
    }
}

export default Test2;
