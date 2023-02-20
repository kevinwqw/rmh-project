const register = require('@babel/register');
register({ only: [/widgets/] });

const devConfig = {
    NODE_ENV: 'development'
};

Object.entries(devConfig).forEach(([key, value]) => {
    process.env[key] = value;
});

require('./server');
