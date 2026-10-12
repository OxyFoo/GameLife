#!/usr/bin/env node

/**
 * Selects the @oxyfoo/avatar-factory build installed in node_modules
 * Executed automatically during npm install, after setup-config.js
 *
 * The package is published under the same name and version in two registries:
 * - npmjs: public build, a JS placeholder without native renderer nor textures
 * - GitHub Packages: full build, private (native renderer + textures)
 * package.json and package-lock.json only reference the public one, so anyone can install and run the app.
 * With GAMELIFE_AVATARS=full, the full build of the locked version is downloaded from GitHub Packages and
 * replaces the public one; the lockfile itself is never modified.
 * It requires a token with the read:packages scope in ~/.npmrc:
 *   //npm.pkg.github.com/:_authToken=<TOKEN>
 */

/**
 * @typedef {{ name: string, version: string }} Manifest
 */

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const PACKAGE_NAME = '@oxyfoo/avatar-factory';
const FULL_REGISTRY = 'https://npm.pkg.github.com/';

/** Only the full build ships native code, the public one has no podspec */
const FULL_BUILD_MARKER = 'AvatarFactory.podspec';

const ROOT_DIR = path.join(__dirname, '..');
const NODE_MODULES_DIR = path.join(ROOT_DIR, 'node_modules');
const PACKAGE_DIR = path.join(NODE_MODULES_DIR, PACKAGE_NAME);

/**
 * Version locked by package-lock.json, null if the lockfile does not reference the public build
 * @returns {string | null}
 */
function getLockedVersion() {
    const lockfile = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'package-lock.json'), 'utf8'));
    const entry = lockfile.packages?.[`node_modules/${PACKAGE_NAME}`];
    if (typeof entry?.version !== 'string') {
        console.error(`❌ ${PACKAGE_NAME} not found in package-lock.json`);
        return null;
    }

    // Both builds share the same name and version, only the source tells them apart
    if (typeof entry.resolved === 'string' && entry.resolved.startsWith(FULL_REGISTRY)) {
        console.error(`❌ package-lock.json resolves ${PACKAGE_NAME} from GitHub Packages instead of npmjs`);
        console.error('  → Nobody can install it without a token: restore the @oxyfoo line of .npmrc,');
        console.error(`    remove the ${PACKAGE_NAME} entry from package-lock.json and run npm install`);
        return null;
    }

    return entry.version;
}

/**
 * @param {string} packageDir
 * @returns {Manifest | null}
 */
function readManifest(packageDir) {
    const manifestPath = path.join(packageDir, 'package.json');
    if (!fs.existsSync(manifestPath)) {
        return null;
    }
    return JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
}

/**
 * @param {string} packageDir
 * @returns {boolean}
 */
function isFullBuild(packageDir) {
    return fs.existsSync(path.join(packageDir, FULL_BUILD_MARKER));
}

/**
 * Downloads the full build and swaps it in place of the installed package
 * The work directory sits in node_modules so that the final rename never crosses filesystems
 * @param {string} version
 */
function downloadFullBuild(version) {
    const workDir = fs.mkdtempSync(path.join(NODE_MODULES_DIR, '.avatar-factory-'));

    try {
        execFileSync(
            'npm',
            [
                'pack',
                `${PACKAGE_NAME}@${version}`,
                `--@oxyfoo:registry=${FULL_REGISTRY}`,
                '--pack-destination',
                workDir,
                '--loglevel=error'
            ],
            { cwd: ROOT_DIR, stdio: ['ignore', 'ignore', 'inherit'], shell: process.platform === 'win32' }
        );

        const tarball = fs.readdirSync(workDir).find((file) => file.endsWith('.tgz'));
        if (!tarball) {
            throw new Error('npm pack did not produce any tarball');
        }
        execFileSync('tar', ['-xzf', tarball], { cwd: workDir });

        const extractedDir = path.join(workDir, 'package');
        const manifest = readManifest(extractedDir);
        if (manifest?.name !== PACKAGE_NAME || manifest.version !== version || !isFullBuild(extractedDir)) {
            throw new Error('the downloaded tarball is not the full build');
        }

        fs.rmSync(PACKAGE_DIR, { recursive: true, force: true });
        fs.renameSync(extractedDir, PACKAGE_DIR);
    } finally {
        fs.rmSync(workDir, { recursive: true, force: true });
    }
}

/**
 * Installs the full build of the locked version, unless it is already there
 * @param {string} version
 * @returns {boolean} false if it could not be installed
 */
function setupFullBuild(version) {
    if (readManifest(PACKAGE_DIR)?.version === version && isFullBuild(PACKAGE_DIR)) {
        console.log(`✓ ${PACKAGE_NAME}@${version}: full build already installed`);
        return true;
    }

    console.log(`🎨 Installing the full build of ${PACKAGE_NAME}@${version} from GitHub Packages...`);
    try {
        downloadFullBuild(version);
    } catch (error) {
        const errorMessage = /** @type {Error} */ (error)?.message || 'Unknown error';
        console.error(`❌ Could not install the full build: ${errorMessage}`);
        console.error('  → ~/.npmrc needs a GitHub token with the read:packages scope');
        console.error('  → Or unset GAMELIFE_AVATARS to keep the public build');
        return false;
    }

    console.log(`✓ ${PACKAGE_NAME}@${version}: full build installed in place of the public one`);
    return true;
}

function main() {
    const mode = process.env.GAMELIFE_AVATARS || 'lite';
    if (mode !== 'lite' && mode !== 'full') {
        console.error(`❌ GAMELIFE_AVATARS must be "full" or "lite" (got "${mode}")`);
        process.exitCode = 1;
        return;
    }

    const version = getLockedVersion();
    if (version === null) {
        process.exitCode = 1;
        return;
    }

    // An explicit request for the full build never falls back to the public one
    if (mode === 'full') {
        if (!setupFullBuild(version)) {
            process.exitCode = 1;
        }
        return;
    }

    // npm keeps a previously swapped full build as long as the locked version does not change
    if (isFullBuild(PACKAGE_DIR)) {
        console.warn(`⚠️  The full build of ${PACKAGE_NAME} is still installed, run npm ci to get the public one back`);
    } else {
        console.log(`✓ ${PACKAGE_NAME}: public build (placeholder avatars)`);
    }
}

main();
