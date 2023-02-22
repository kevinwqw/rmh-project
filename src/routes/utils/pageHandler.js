const AssetManager = require('./AssetManager');
const RenderManager = require('./RenderManager');

const renderHandler = (addWidgets) => async (request, h) => {
    const assetManager = new AssetManager();
    assetManager.init();
    assetManager.addFeatureAssets('rmh-project');

    const renderer = new RenderManager(request, h, assetManager);
    renderer.setTitle('RMH');

    if (addWidgets) {
        await addWidgets(renderer, request);
    }

    return renderer.render();
};

module.exports = {
    renderHandler
};
