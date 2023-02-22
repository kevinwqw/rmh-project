// Widgets exported as ES6 module, need to use default to require properly.
const widgets = require('../widgets').default;
const { renderHandler } = require('./utils/pageHandler');

module.exports = (server) => {
    server.route({
        method: 'GET',
        path: '/',
        options: {
            handler: renderHandler((renderer, request) => {
                const { id } = request.params;
                renderer.addMainContentWidget(widgets.Home, { id });
            })
        }
    });
};
