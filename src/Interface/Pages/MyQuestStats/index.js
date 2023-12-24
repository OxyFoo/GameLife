import * as React from 'react';

import BackQuest from './back';
import user from 'Managers/UserManager';

import { Page, Button } from 'Interface/Components';
import { PageHeader } from 'Interface/Widgets';

class MyQuestStats extends BackQuest {
    render() {
        return (
            <Page ref={ref => this.refPage = ref}>
                <PageHeader
                    onBackPress={() => user.interface.BackHandle()}
                />
                <Button color='main1' onPress={this.onEditPress}>
                    [Edit]
                </Button>
                <Button color='main1' onPress={this.onAddPress}>
                    [Add]
                </Button>
            </Page>
        );
    }
}

export default MyQuestStats;
