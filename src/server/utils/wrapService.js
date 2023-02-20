const { getConfig } = require('../config');
const { getBffCache } = require('./cache');

global.services = {};

const ONE_SECOND = 1000;

const CODE_UNAUTHORIZED = 401;
const CODE_ERROR = 500;

const buildErrorResult = (code, message) => ({ success: false, error: { code, message } });

const tryExecuteService = (serviceClass, args, contextId) => {
    const serviceInstance = new serviceClass(contextId);
    return serviceInstance.execute(...args);
};

const executeService = async (featureName, serviceConfig, args, contextId) => {
    const { name: serviceName, service: serviceClass } = serviceConfig;
    const serviceKey = `${featureName}:${serviceName}`;
    const config = getConfig();
    const canCache = config.enableBffCache && serviceConfig.caching?.ttl;

    // 获取service缓存数据
    if (canCache) {
        const cacheKey = `${serviceKey}:${JSON.stringify(args)}`;
        const bffCache = getBffCache();
        const cacheValue = await bffCache.get(cacheKey);

        if (cacheValue) return cacheValue;

        const result = await tryExecuteService(serviceClass, args, contextId);
        if (result.success) {
            const cachePeriod = serviceConfig.caching.ttl * ONE_SECOND;
            await bffCache.set(cacheKey, result, cachePeriod);
        }

        return result;
    }

    // 执行service获取数据
    return tryExecuteService(serviceClass, args, contextId);
};

// 根据contextId检查用户认证状态
const wrapService = (featureName, serviceConfig) => {
    if (!serviceConfig || !serviceConfig.service) return null;

    const wrappedService = async (args, contextId) => {
        let context = ContextManager.getContext(contextId);
        if (!context) context = { request: { auth: { isAuthenticated: false } } };
        const { isAuthenticated } = context.request.auth;

        if (!isAuthenticated) return Promise.resolve(buildErrorResult(CODE_UNAUTHORIZED, 'Unauthorized'));

        return executeService(featureName, serviceConfig, args, contextId);
    };

    return async (args, contextId) => {
        try {
            return await wrappedService(args, contextId);
        } catch (err) {
            logger.logError(err, { contextId });
            return buildErrorResult(CODE_ERROR, err.message);
        }
    };
};

module.exports = { wrapService };
