const Inert = require('@hapi/inert');
const H2O2 = require('@hapi/h2o2');
const Crumb = require('@hapi/crumb');
const Cookie = require('@hapi/cookie');
const Blipp = require('blipp');

const wrapService = require('./wrapService');

class Register {
    constructor(server) {
        this.server = server;
    }

    async registerPlugins() {
        await this.server.register({ plugin: Inert, options: {} });
        await this.server.register({ plugin: H2O2, options: {} });
        await this.server.register({ plugin: Crumb, options: {} });
        await this.server.register({ plugin: Cookie, options: {} });
        await this.server.register({ plugin: Blipp, options: {} });
    }

    registerRoutes(routes) {
        if (!routes) return;

        if (Array.isArray(routes)) {
            routes.forEach((route) => {
                route(this.server);
            });
        } else {
            routes(this.server);
        }
    }

    registerServices(featureName, services) {
        if (!services) return;

        for (const [key, serviceConfig] of Object.entries(services)) {
            const { name: serviceName } = serviceConfig;
            // wrapService会在global中添加services对象，并对service进行封装处理
            const wrappedService = wrapService(featureName, serviceConfig);
            const serviceKey = `${featureName}-${serviceName}`;

            if (!wrappedService) return;
            if (global.services[serviceKey]) return;

            // 在global对象中注册封装过的service
            global.services[serviceKey] = wrappedService;
        }
    }

    registerFeatures(features) {
        if (!features) return;

        features.forEach((feature) => {
            const { name: featureName, routes, services } = feature;
            if (routes) this.registerRoutes(routes);
            if (services) this.registerServices(featureName, services);
        });
    }
}

module.exports = Register;
