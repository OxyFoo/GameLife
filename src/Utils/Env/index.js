import { envEnum, envNumber, envString } from './function';

export const env = {
    ENV: envEnum('ENV', ['dev', 'test', 'prod']),
    VPS_PROTOCOL: envEnum('VPS_PROTOCOL', ['none', 'ws', 'wss']),
    VPS_HOST: envString('VPS_HOST', false),
    VPS_PORT: envNumber('VPS_PORT', false)
};
