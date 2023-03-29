import React from 'react';
import isEmpty from 'lodash/isEmpty';

const createMobxWidget = (Widget, Store, StoreContext) => async (params, initialState, context) => {
    // 每个widget要有一个自己的store
    const store = new Store();
    const isInitialized = !isEmpty(initialState);

    // 判断是否已经注水
    if (isInitialized) {
        store.hydrate(initialState);
        // 未注水则发数据请求
    } else if (store.init) {
        await store.init(params, context);
    }

    const widgetElement = React.createElement(Widget, null);

    return {
        component: React.createElement(StoreContext.Provider, { value: store }, widgetElement),
        store
    };
};

export default createMobxWidget;
