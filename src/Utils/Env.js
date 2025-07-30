import { getEnvVar } from 'dotenv-oxy/react-native';

export const env = {
    ENV: getEnvVar('ENV', 'enum', ['dev', 'test', 'prod']),

    SHOW_PAGE_TEST: getEnvVar('SHOW_PAGE_TEST', 'boolean', false) || false,
    SHOW_CONSOLE_IN_APP: getEnvVar('SHOW_CONSOLE_IN_APP', 'boolean', false) || false,

    LINK_DISCORD: getEnvVar('LINK_DISCORD', 'string', false) || 'https://discord.com/invite/FfJRxjNAwS',

    VPS_PROTOCOL: getEnvVar('VPS_PROTOCOL', 'enum', ['none', 'ws', 'wss']),
    VPS_HOST: getEnvVar('VPS_HOST', 'string', false),
    VPS_PORT: getEnvVar('VPS_PORT', 'number', false),

    GOOGLE_WEB_CLIENT_ID: getEnvVar('GOOGLE_WEB_CLIENT_ID', 'string', false),
    SSL_PINNING_PRIMARY_KEY: getEnvVar('SSL_PINNING_PRIMARY_KEY', 'string', false),
    SSL_PINNING_BACKUP_KEY: getEnvVar('SSL_PINNING_BACKUP_KEY', 'string', false)
};
