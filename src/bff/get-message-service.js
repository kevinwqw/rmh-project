const ApiSdk = require('../apis/api-sdk');

class GetMessageService extends BaseService {
    constructor(contextId) {
        this.contextId = contextId;
        this.apiSdk = new ApiSdk(contextId);
    }

    async execute() {
        const res = await this.apiSdk.getMessage();
        if (res.success && res.data) {
            return super.createResult(res.data);
        }

        return super.createErrorResult();
    }
}

module.exports = {
    name: 'getMessage',
    service: GetMessageService
};
