const utils = require('../common/env-utils');
const BaseUrl = utils.readEnvValue('BASE_URL');

class ApiSdk {
    constructor(contextId) {
        this.contextId = contextId;
    }

    async demoApi() {
        return ApiHelper.get(`${BaseUrl}/api`);
    }
}

module.exports = ApiSdk;
