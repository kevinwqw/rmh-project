import { makeObservable } from 'mobx';
// import BFFSdk from '../../sdk';

class Store {
    constructor() {
        makeObservable(this);
    }

    message = '';

    hydrate(data) {
        Object.assign(this, data);
    }

    async init(params, context) {
        const { id } = params;
        this.contextId = context.contextId;
        // this.getMsgData(id);
    }

    // * getMsgData(id) {
    //     const sdk = new BFFSdk(this.contextId);
    //     const res = yield sdk.getMsgData(id);
    //     if (res.success && res.data) {
    //         this.message = res.data;
    //     }
    // }
}

export default Store;
