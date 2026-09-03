/**
 * Ambient declarations for the static assets bundled by Metro.
 *
 * Metro resolves `require('…/foo.png')` to an opaque asset reference, but
 * TypeScript has no built-in knowledge of these extensions and reports
 * TS2307 without them. The declared type matches what `Image.source`
 * accepts for a bundled asset (`ImageRequireSource`, i.e. a number).
 */

declare module '*.png' {
    const asset: number;
    export = asset;
}

declare module '*.jpg' {
    const asset: number;
    export = asset;
}

declare module '*.jpeg' {
    const asset: number;
    export = asset;
}

declare module '*.gif' {
    const asset: number;
    export = asset;
}

declare module '*.webp' {
    const asset: number;
    export = asset;
}
