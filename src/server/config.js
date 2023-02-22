let configInstance = null;

const getConfig = () => {
    if (configInstance) {
        return configInstance;
    }

    configInstance = {
        server: {
            host: 'localhost',
            port: 3000
        },
        secureCookie: false,
        rootDirectory: null
    };

    return configInstance;
};

module.exports = { getConfig };
