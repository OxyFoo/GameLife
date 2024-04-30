import * as React from 'react';
import { View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';

import styles from './style';
import BackTest2 from './back';

import { Text, Button, InputText } from 'Interface/Components';

class Test2 extends BackTest2 {
    render() {
        //console.log('test2');
        return (
            <View>
                <MaskedView
                    style={{ marginVertical: 24 }}
                    maskElement={(<Text fontSize={32}>{'Page de test 2'}</Text>)}
                >
                    <LinearGradient style={{ width: '100%', height: 45 }} colors={['#8CF7FF', '#DBA1FF']} useAngle={true} angle={190} />
                </MaskedView>


                <Button style={styles.marginBot} icon='arrow-square-outline' iconAngle={-90} appearance='outline' onPress={this.back} />
                <Button style={styles.marginBot} loading={true}>{'Bla bla bla'}</Button>

                <InputText
                    style={styles.marginBot}
                    label='Test input'
                    value={this.state.input}
                    onChangeText={(newText) => this.setState({ input: newText })}
                />
            </View>
        );
    }
}

export default Test2;
