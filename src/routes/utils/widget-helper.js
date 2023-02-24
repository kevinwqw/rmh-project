const ReactDomServer = require('react-dom/server');
const { getConfig } = require('../../server/config');
const { getWidgetCache } = require('../../server/utils/cache');

const ONE_SECOND = 1000;

const _getScript = (data) => {};

// 只返回container
const _renderClientWidget = async (widget, args) => {
    const data = JSON.stringify({ args });
    const props = {
        id: widget.id,
        html: `${_getScript(data)}<div class="w"></div>`
    };

    return props;
};

// 返回包含widget字符串的container
const _renderServerWidget = async (widget, args, context) => {
    const { component } = await widget.create(args, {}, context);
    const widgetHtml = ReactDomServer.renderToStaticMarkup(component);
    return {
        id: widget.id,
        html: `<div class="w">${widgetHtml}</div>`,
        ready: true
    };
};

const _renderIsomorphicWidget = async (widget, args, context) => {
    const { component, store } = await widget.create(args, {}, context);
    // renderToStaticMarkup不包含data-reactid
    const widgetHtml = ReactDomServer.renderToStaticMarkup(component);
    // 客户端渲染会重新初始化store，并为contextId赋值
    delete store.contextId;
    // 如果store已经通过initialState完成hydrate，则不需要返回args到前端
    const isStoreFilled = Object.keys(store).length > 0;
    const data = JSON.stringify({ args: isStoreFilled ? {} : args, store });
    return {
        id: widget.id,
        html: `${_getScript(data)}<div class="w">${widgetHtml}</div>`
    };
};

const _render = async (widget, args, context) => {
    const renderMode = widget.renderMode.toLowerCase();
    switch (renderMode) {
        case 'client':
            return _renderClientWidget(widget, args);
        case 'server':
            return _renderServerWidget(widget, args, context);
        default:
            return _renderIsomorphicWidget(widget, args, context);
    }
};

const _renderWidget = async (request, widget, args) => {
    const { contextId } = request;
    const context = { contextId };
    const renderMode = widget.renderMode.toLowerCase();
    const config = getConfig();
    const canCache = config.enableWidgetCache && renderMode !== 'client' && widget.caching?.ttl;

    let cacheKey = null;
    if (canCache) {
        cacheKey = `${widget.id}:${JSON.stringify(args)}`;
        const cachedWidget = getWidgetCache(cacheKey);
        if (cachedWidget) return cachedWidget;
    }

    const renderOjb = await _render(widget, args, context);
    if (!renderOjb || !renderOjb.html) return null;

    if (canCache) {
        await getWidgetCache().set(cacheKey, renderOjb, widget.caching.ttl * ONE_SECOND);
    }

    return renderOjb;
};

const renderWidgets = async (request, taggedWidgets) => {
    const renderTasks = taggedWidgets.map((taggedWidget) => {
        const { tag, widget, args, options } = taggedWidget;
        return _renderWidget(request, widget, args).then((res) => {
            if (!res) return null;

            res.options = options;
            return { tag, widget: res };
        });
    });

    const renderTasksResult = await Promise.all(renderTasks);

    const renderWidgetsResult = {};
    renderTasksResult.forEach((taskRes) => {
        if (!taskRes) return;

        let renderedWidget = renderWidgetsResult[taskRes.tag];
        // TODO
        if (!renderedWidget) {
            renderWidgetsResult[taskRes.tag] = [];
            renderedWidget = renderWidgetsResult[taskRes.tag];
        }
        renderedWidget.push(task.widget);
    });

    return renderWidgetsResult;
};

const renderWidgetToString = (widget) => {
    if (!widget || !widget.html) return null;

    const { id, html, ready } = widget;

    if (ready) return `<div class="widget" data-widget-id="${id}" data-render="ready">${html}</div>`;

    return `<div class="widget" data-widget-id="${id}">${html}</div>`;
};

const renderWidgetsToString = (widgets) => {
    if (!widgets || widgets.length < 1) return '';

    return widgets.map((widget) => renderWidgetToString(widget).join(''));
};

module.exports = {
    renderWidgets,
    renderWidgetToString,
    renderWidgetsToString
};
