const widgets = require('./widgets');
const routes = require('./server/routes');
const services = require('./server/bff');

module.exports = {
    featureName: 'demo-feature',
    widgets,
    routes,
    services
};
