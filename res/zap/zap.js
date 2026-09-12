// @ts-nocheck

// Simple poses (`high`, `up`, `firefly`, `upThumb`) are drawn as is; `up` is the same file as `onTwoLegs.face`
const ZAP_IMAGES = {
    day: {
        normal: {
            onTwoLegs: {
                face: require('Ressources/zap/purple/normal/up.png'),
                show: require('Ressources/zap/purple/normal/upShow.png')
            },
            onFourLegs: {
                face: require('Ressources/zap/purple/normal/down.png'),
                show: require('Ressources/zap/purple/normal/downShow.png')
            },
            high: require('Ressources/zap/purple/normal/high.png'),
            up: require('Ressources/zap/purple/normal/up.png'),
            firefly: require('Ressources/zap/purple/normal/firefly.png'),
            upThumb: require('Ressources/zap/purple/normal/upThumb.png')
        },
        christmas: {
            onTwoLegs: {
                face: require('Ressources/zap/purple/christmas/up.png'),
                show: require('Ressources/zap/purple/christmas/upShow.png')
            },
            onFourLegs: {
                face: require('Ressources/zap/purple/christmas/down.png'),
                show: require('Ressources/zap/purple/christmas/downShow.png')
            },
            high: require('Ressources/zap/purple/christmas/high.png'),
            up: require('Ressources/zap/purple/christmas/up.png'),
            firefly: require('Ressources/zap/purple/christmas/firefly.png'),
            upThumb: require('Ressources/zap/purple/christmas/upThumb.png')
        }
    },
    night: {
        normal: {
            onTwoLegs: {
                face: require('Ressources/zap/black/normal/up.png'),
                show: require('Ressources/zap/black/normal/upShow.png')
            },
            onFourLegs: {
                face: require('Ressources/zap/black/normal/down.png'),
                show: require('Ressources/zap/black/normal/downShow.png')
            },
            high: require('Ressources/zap/black/normal/high.png'),
            up: require('Ressources/zap/black/normal/up.png'),
            firefly: require('Ressources/zap/black/normal/firefly.png'),
            upThumb: require('Ressources/zap/black/normal/upThumb.png')
        },
        christmas: {
            onTwoLegs: {
                face: require('Ressources/zap/black/christmas/up.png'),
                show: require('Ressources/zap/black/christmas/upShow.png')
            },
            onFourLegs: {
                face: require('Ressources/zap/black/christmas/down.png'),
                show: require('Ressources/zap/black/christmas/downShow.png')
            },
            high: require('Ressources/zap/black/christmas/high.png'),
            up: require('Ressources/zap/black/christmas/up.png'),
            firefly: require('Ressources/zap/black/christmas/firefly.png'),
            upThumb: require('Ressources/zap/black/christmas/upThumb.png')
        }
    }
};

export default ZAP_IMAGES;
