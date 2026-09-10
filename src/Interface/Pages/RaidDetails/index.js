import * as React from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';

import styles, { CONTENT_PADDING } from './style';
import BackRaidDetails from './back';
import { Activities } from './Sections/Activities';
import { History } from './Sections/History';
import { BossBackground, BossCaption } from './BossHero';
import langManager from 'Managers/LangManager';

import { Tabs } from 'Interface/Components';
import { PageHeader } from 'Interface/Widgets';

class RaidDetails extends BackRaidDetails {
    render() {
        const lang = langManager.curr['raids'];
        const { tab, historyState, history } = this.state;

        return (
            <View style={styles.page}>
                <BossBackground scrollY={this.scrollY} />

                <SafeAreaInsetsContext.Consumer>
                    {(insets) => (
                        <ScrollView
                            style={styles.scrollview}
                            onScroll={this.handleScroll}
                            scrollEventThrottle={16}
                            contentContainerStyle={[
                                styles.content,
                                {
                                    paddingTop: insets?.top ?? 0,
                                    paddingLeft: CONTENT_PADDING + (insets?.left ?? 0),
                                    paddingRight: CONTENT_PADDING + (insets?.right ?? 0)
                                }
                            ]}
                        >
                            <PageHeader title={lang['title']} onBackPress={this.onBack} />

                            <BossCaption />

                            <Tabs
                                style={styles.tabs}
                                texts={[lang['tab-this-raid'], lang['tab-history']]}
                                value={tab}
                                onChangeValue={this.setTab}
                            />

                            {tab === 0 ? (
                                <Activities />
                            ) : (
                                <History state={historyState} entries={history} onRetry={this.fetchHistory} />
                            )}
                        </ScrollView>
                    )}
                </SafeAreaInsetsContext.Consumer>
            </View>
        );
    }
}

export default RaidDetails;
