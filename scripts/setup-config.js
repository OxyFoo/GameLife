#!/usr/bin/env node

/**
 * Automatic configuration script for GameLife
 * Copies template files to configuration files if necessary
 * Executed automatically during npm install
 */

/**
 * @typedef {{ template: string, target: string, description: string }} ConfigFile
 */

const fs = require('fs');
const path = require('path');

/**
 * List of configuration files to set up
 * @type {Array<ConfigFile>}
 */
const CONFIG_FILES = [
    {
        template: 'app.json.template',
        target: 'app.json',
        description: 'Google Mobile Ads Configuration'
    },
    {
        template: 'android/app/google-services.json.template',
        target: 'android/app/google-services.json',
        description: 'Google Services Android Configuration'
    },
    {
        template: 'android/local.properties.template',
        target: 'android/local.properties',
        description: 'Android Local Properties Configuration'
    }
];

/**
 * Sets up a configuration file by copying a template to the target location
 * @param {ConfigFile} config - Configuration file details
 */
function setupConfigFile(config) {
    const templatePath = path.join(__dirname, '..', config.template);
    const targetPath = path.join(__dirname, '..', config.target);

    // Check if target file already exists
    if (fs.existsSync(targetPath)) {
        console.log(`✓ ${config.target} already exists, no action needed`);
        return;
    }

    // Check if template exists
    if (!fs.existsSync(templatePath)) {
        console.warn(`⚠️  Template ${config.template} not found, skipped`);
        return;
    }

    try {
        // Create target directory if necessary
        const targetDir = path.dirname(targetPath);
        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
        }

        // Copy template to target file
        fs.copyFileSync(templatePath, targetPath);
        console.log(`✓ ${config.target} created from ${config.template}`);
        console.log(`  → ${config.description}`);
    } catch (error) {
        const errorMessage = /** @type {Error} */ (error)?.message || 'Unknown error';
        console.error(`❌ Error copying ${config.template}:`, errorMessage);
    }
}

function main() {
    console.log('🔧 GameLife automatic configuration...');
    CONFIG_FILES.forEach(setupConfigFile);
}

main();
