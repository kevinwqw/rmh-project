const readEnvValue = (key, defaultValue) => {
    const env = process.env;
    const value = env[key];

    if (!value && defaultValue === undefined) throw new Error(`Environment variable ${key} is missing`);

    return value || defaultValue;
};

module.exports = {
    readEnvValue
};
