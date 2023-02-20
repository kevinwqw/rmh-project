class ApiSdk {
    constructor(contextId) {
        this.contextId = contextId;
    }

    async demoApi() {
        return ApiHelper.get(`${BaseUrl}/api`);
    }
}
