const config = require('../config');

let bffCache = null;
let widgetCache = null;

const getBffCache = () => bffCache;
const getWidgetCache = () => widgetCache;

const initCache = (server) => {
    const DEFAULT_CACHE_EXPIRE = 8640000;

    if (config.enableBffCache) {
        const cacheConfig = {
            cache: 'appCache',
            segment: 'bff',
            expiresIn: DEFAULT_CACHE_EXPIRE
        };
        bffCache = server.cache(cacheConfig);
    }

    if (config.enableWidgetCache) {
        const cacheConfig = {
            cache: 'appCache',
            segment: 'bff',
            expiresIn: DEFAULT_CACHE_EXPIRE
        };
        widgetCache = server.cache(cacheConfig);
    }
};

module.exports = { getBffCache, getWidgetCache, initCache };
