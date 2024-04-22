import * as React from 'react';

import styles from './style';
import BackNewPage from './back';

import { Page } from 'Interface/Global';

class NewPage extends BackNewPage {
    render() {
        return (
            <Page ref={this.refPage} canScrollOver>
            </Page>
        );
    }
}

export default NewPage;
