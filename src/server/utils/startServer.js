const Hapi = require('@hapi/hapi');
const Register = require('./Register');
const { getConfig } = require('../config');
const { initCache } = require('./cache');

const startServer = async ({ pre, post }, customConfig) => {
    const config = getConfig();
    // Merge user config with default config
    Object.assign(config, customConfig);

    const defaultOptions = {
        host: config.server.host,
        port: config.server.port,
        router: { isCaseSensitive: false, stripTrailingSlash: true },
        /**
         * timeout: maximum time for server to respond 503 error.
         */
        routes: { timeout: { server: 300000, socket: 310000 } },
        state: { isSecure: config.secureCookie, isSameSite: 'Lax' }
    };

    // 根据配置，实例化Hapi server
    const server = Hapi.server(defaultOptions);

    // 如果有预处理函数pre，则在启动前拦截，执行server预处理
    if (pre) await pre(server);

    const register = new Register(server);
    register.registerPlugins();
    // Register feature routes and services
    register.registerFeatures();

    //启动server
    try {
        await server.start();
    } catch (err) {
        server.log(['error'], err);
    }

    initCache(server);

    // 如果有后处理函数post，则在启动后拦截，执行server后处理
    if (post) await post(server);

    return server;
};

module.exports = { startServer };
