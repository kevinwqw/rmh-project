const ContextManager = require('./ContextManager');

class BaseService {
    constructor(contextId) {
        this.contextId = contextId;
    }

    createResult(data) {
        return { success: true, data };
    }

    createErrorResult(code = 500, message = 'Service Internal Error') {
        return { success: false, error: { code, message } };
    }

    getRequest() {
        return ContextManager.getContext(this.contextId);
    }
}

module.exports = BaseService;
