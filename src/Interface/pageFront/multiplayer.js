import * as React from 'react';
import { StyleSheet } from 'react-native';

import BackMultiplayer from '../PageBack/Multiplayer';

import { UserHeader } from '../Widgets';
import { Page, Text } from '../Components';

class Multiplayer extends BackMultiplayer {
    render() {
        return (
            <Page canScrollOver={true}>
                <UserHeader />
                <Text fontSize={42}>Ya rien encore ici, TU PERMETS rooo le mec impatient lààààà</Text>
            </Page>
        )
    }
}

const styles = StyleSheet.create({
});

export default Multiplayer;