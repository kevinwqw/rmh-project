const { renderWidgets, renderWidgetToString, renderWidgetsToString } = require('./widget-helper');
const { renderPageHtml } = require('./html-helper');

class RenderManager {
    constructor(request, h, assetManager) {
        this._request = request;
        this._h = h;
        this._assetManager = assetManager;
        this._taggedWidgets = [];
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

    _getBodyHtml(widgets) {
        if (widgets.singlePageContent && widgets.singlePageContent.length > 0) {
            return `
            <div class="main-body">
                ${this.renderWidgetsToString(widgets.mainContent)}
            </div
            `;
        }

        return `
        <div class="main-body">
            ${widgets.header ? `<header>${this.renderWidgetsToString(widgets.header)}</header>` : ''}
            <div id="main-container">
                <div class="content-container">
                    ${widgets.leftNav ? `<div class="l-nav">${this.renderWidgetsToString(widgets.leftNav)}</div>` : ''}
                    <div class="main-content">${this.renderWidgetsToString(widgets.mainContent)}</div>
                    ${widgets.rightNav ? `<div class="r-nav">${this.renderWidgetsToString(widgets.rightNav)}</div>` : ''}
                </div>
            </div>
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
            const html = renderPageHtml(this._request, pageData);
            return this._h.response(html);
        } catch (err) {
            return getConfig.errorHandler(this._request, this._h);
        }
    }
}

module.exports = RenderManager;
