const readEnvValue = (key, defaultValue) => {
    const env = process.env;
    const value = env[key];

    if (!value && defaultValue === undefined) throw new Error(`Environment variable ${key} is missing`);

    return value || defaultValue;
};

const isDevEnv = () => {
    const nodeEnv = process.env?.NODE_ENV;
    return nodeEnv === 'development';
};

module.exports = {
    readEnvValue,
    isDevEnv
};
