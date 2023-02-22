import React from 'react';
import isEmpty from 'lodash/isEmpty';

const createMobxWidget = (Widget, Store, StoreContext) => async (params, initialState, context) => {
    const store = new Store();
    const isInitialized = !isEmpty(initialState);

    if (isInitialized) {
        store.hydrate(initialState);
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
