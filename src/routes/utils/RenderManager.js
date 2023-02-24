const { renderWidgets, renderWidgetToString, renderWidgetsToString } = require('./widget-helper');
const { renderPageHtml } = require('./html-helper');

const isPjaxRequest = (request) => !!(request && request.headers && request.headers['x-pjax'] === '1');

class RenderManager {
    constructor(request, h, assetManager) {
        this._request = request;
        this._h = h;
        this._assetManager = assetManager;
        this._taggedWidgets = [];
        this._pjax = isPjaxRequest(request);
        // 提供两个widget字符串渲染方法
        this.renderWidgetToString = renderWidgetToString;
        this.renderWidgetsToString = renderWidgetsToString;
    }

    _addWidget(tag, widget, args, options) {
        this._taggedWidgets.push({
            tag,
            widget,
            args,
            options
        });
    }

    setTitle(title) {
        this._title = title;
    }

    addSinglePageWidget(widget, args, options = null) {
        this.addWidget('singlePage', widget, args, options);
    }

    _getPjaxContent(widgets) {}

    _getBodyHtml(widgets) {
        const pjaxContent = this._getPjaxContent(widgets);
        if (this._pjax) return pjaxContent;

        return `
        <div class="main-body">
            <div id="pjax-container">${pjaxContent}</div>
        </div>`;
    }

    async render() {
        try {
            const renderedWidgets = await renderWidgets(this._request, this._taggedWidgets, this._assetManager);
            const pageData = {
                title: this._title,
                stylesUrls: this._assetManager.getStylesUrls(),
                bodyHtml: this._getBodyHtml(renderedWidgets),
                scriptsUrls: this._assetManager.getScriptsUrls()
            };

            if (this._pjax) return this._h.response(data).type('application/json');

            const html = renderPageHtml(this._request, pageData);
            return this._h.response(html);
        } catch (err) {
            return getConfig.errorHandler(this._request, this._h);
        }
    }
}

module.exports = RenderManager;
