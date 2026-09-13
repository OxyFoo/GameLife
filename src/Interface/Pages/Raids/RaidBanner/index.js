import * as React from 'react';

import { ImageBackdrop } from 'Interface/Components';
import { useRaid } from '../RaidCard/useRaid';

/**
 * Season landscape behind the whole raid page: edge to edge, under the user header and under the
 * status bar (the page declares `feHeaderOverlay`). An unknown season falls back to the generic
 * visual, never to a blank page.
 */
function RaidBanner() {
    const { images } = useRaid();
    return <ImageBackdrop source={images.background} />;
}

export { RaidBanner };
