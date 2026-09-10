import * as React from 'react';
import { StyleSheet } from 'react-native';
import Svg, { Defs, Image as SvgImage, LinearGradient, Mask, Rect, Stop } from 'react-native-svg';

import themeManager from 'Managers/ThemeManager';

/**
 * @typedef {import('react-native').ImageSourcePropType} ImageSourcePropType
 */

/**
 * Full-bleed image behind a page, fading out towards the bottom.
 *
 * The fade is an **alpha ramp on the image itself**, not a colour painted over it: the app
 * background is animated (`DynamicBackground`), so an overlay ending on a flat theme colour met it
 * with a visible seam at the bottom of the page.
 *
 * Drawn with `react-native-svg` rather than `MaskedView`: the geometry here is fully specified
 * (`width`/`height` at 100% of the viewport, `slice` for a cover fit), where a masked view derives
 * its size from a measure pass over the mask element — which is not something this component can
 * reason about, and which left an unexplained gap on one side.
 *
 * The gradient is white with a ramp on `stopOpacity`: an SVG mask reads luminance times alpha, and
 * white keeps luminance at 1 whichever of the two a platform favours.
 *
 * The image is dimmed so text stays readable, which would leave the app background — including the
 * `DynamicGrid` lines — showing through the artwork. An opaque ground is therefore painted under it,
 * carrying the same alpha ramp: the two vanish together, so the background reappears through the
 * fade instead of at a seam.
 *
 * @param {object} props
 * @param {ImageSourcePropType} props.source
 * @param {number} [props.opacity] Dimming of the image, so text stays readable over it
 * @param {number} [props.fadeStart] Height ratio where the image starts fading out
 * @param {number} [props.fadeEnd] Height ratio where it has completely gone
 */
function ImageBackdrop({ source, opacity = 0.5, fadeStart = 0.3, fadeEnd = 0.85 }) {
    // Ids live in the SVG document: two backdrops coexist during a page transition, so each
    // instance needs its own. `useId` carries colons, which an `url(#id)` reference rejects.
    const id = React.useId().replace(/:/g, '');
    const gradientID = `${id}-fade`;
    const maskID = `${id}-mask`;

    return (
        <Svg style={StyleSheet.absoluteFill} width='100%' height='100%' pointerEvents='none'>
            <Defs>
                <LinearGradient id={gradientID} x1='0' y1='0' x2='0' y2='1'>
                    <Stop offset={0} stopColor='#ffffff' stopOpacity={1} />
                    <Stop offset={fadeStart} stopColor='#ffffff' stopOpacity={1} />
                    <Stop offset={fadeEnd} stopColor='#ffffff' stopOpacity={0} />
                </LinearGradient>
                <Mask id={maskID}>
                    <Rect x='0' y='0' width='100%' height='100%' fill={`url(#${gradientID})`} />
                </Mask>
            </Defs>

            <Rect
                x='0'
                y='0'
                width='100%'
                height='100%'
                fill={themeManager.GetColor('ground1')}
                mask={`url(#${maskID})`}
            />
            <SvgImage
                href={source}
                x='0'
                y='0'
                width='100%'
                preserveAspectRatio='xMidYMid slice'
                opacity={opacity}
                mask={`url(#${maskID})`}
            />
        </Svg>
    );
}

export { ImageBackdrop };
