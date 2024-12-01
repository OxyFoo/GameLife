import * as React from 'react';
import { View, StyleSheet } from 'react-native';

import BackOnboarding from './back';
import { RenderPage0 } from './panels/0';
import { RenderPage1 } from './panels/1';
import { RenderPage2 } from './panels/2';

import { Swiper } from 'Interface/Components';

class Onboarding extends BackOnboarding {
    render() {
        const { selectedLangKey } = this.state;

        return (
            <View style={styles.page}>
                <Swiper
                    ref={this.refSwiper}
                    pages={[
                        <RenderPage0
                            onNext={this.Next}
                            selectedLangKey={selectedLangKey}
                            selectLanguage={this.selectLanguage}
                        />,
                        <RenderPage1 index={1} anim={this.refSwiper.current?.state.positionX} onNext={this.Next} />,
                        <RenderPage2 index={2} anim={this.refSwiper.current?.state.positionX} onNext={this.Next} />
                    ]}
                    backgroundColor='transparent'
                    disableCircular
                    enableAutoNext={false}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    page: {
        width: '100%',
        height: '100%'
    }
});

export default Onboarding;
