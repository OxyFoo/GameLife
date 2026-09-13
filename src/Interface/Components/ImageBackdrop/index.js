import * as React from 'react';
import { Dimensions, Image, StyleSheet } from 'react-native';
import Svg, { Defs, Image as SvgImage, LinearGradient, Mask, Rect, Stop } from 'react-native-svg';

import themeManager from 'Managers/ThemeManager';

/**
 * @typedef {import('react-native').ImageSourcePropType} ImageSourcePropType
 * @typedef {import('react-native').LayoutChangeEvent} LayoutChangeEvent
 */

/**
 * Full-bleed image behind a page, fading out towards the bottom.
 *
 * The fade is an **alpha ramp on the image itself**, not a colour painted over it: the app
 * background is animated (`DynamicBackground`), so an overlay ending on a flat theme colour met it
 * with a visible seam at the bottom of the page.
 *
 * Drawn with `react-native-svg` rather than `MaskedView`: the geometry here is fully specified
 * (`width`/`height` at 100% of the viewport, an image box derived from the artwork's own ratio),
 * where a masked view derives its size from a measure pass over the mask element — which is not
 * something this component can reason about, and which left an unexplained gap on one side.
 *
 * The artwork is laid out edge to edge at the top, at its own ratio: never stretched, never cropped
 * sideways, and whatever runs past the bottom is already inside the fade. Its height **must** be
 * given explicitly — an `Image` without one falls back to the asset's pixel size, so a 4000px boss
 * was handed a box ten screens tall of which only the very top showed.
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

    // Seeded with the window rather than 0: the backdrop spans the page, so the first frame is
    // already right and `onLayout` only ever corrects a narrower container.
    const [width, setWidth] = React.useState(() => Dimensions.get('window').width);
    const onLayout = React.useCallback(
        (/** @type {LayoutChangeEvent} */ event) => setWidth(event.nativeEvent.layout.width),
        []
    );

    // A remote source carries no size until it has loaded: cover the viewport from the top until
    // the ratio is known, rather than collapse the artwork to nothing.
    const asset = Image.resolveAssetSource(source);
    const ratio = asset?.width && asset?.height ? asset.height / asset.width : 0;
    const height = ratio > 0 ? width * ratio : '100%';

    return (
        <Svg style={StyleSheet.absoluteFill} width='100%' height='100%' onLayout={onLayout} pointerEvents='none'>
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
                height={height}
                preserveAspectRatio='xMidYMin slice'
                opacity={opacity}
                mask={`url(#${maskID})`}
            />
        </Svg>
    );
}

export { ImageBackdrop };
