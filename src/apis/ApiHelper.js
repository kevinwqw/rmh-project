const axios = require('axios');
const ContextManager = require('../common/ContextManager');

const getHeaders = (contextId) => {
    const headers = {};
    const context = ContextManager.getContext(contextId);
    if (!context) return headers;
    const authToken = context?.auth?.artifacts?.authToken;
    if (authToken) headers['Authorization'] = authToken;

    return headers;
};

const successHandler = (response) => {
    const { status, data } = response;
    const res = { success: true, status, data };

    return res;
};

const errorHandler = (error) => {
    const { status, stack, response } = error;
    const res = { success: false, code: status, stack, data: response?.data };

    return res;
};

class ApiHelper {
    static async get(url, contextId, responseType) {
        return axios
            .get(url, { headers: { ...getHeaders(contextId) }, contextId, responseType })
            .then(successHandler)
            .catch(errorHandler);
    }

    static async post(url, data, contextId, responseType) {
        const jsonData = JSON.stringify(data);
        return axios
            .post(url, jsonData, {
                headers: { 'Content-Type': 'application/json', ...getHeaders(contextId) },
                contextId,
                responseType
            })
            .then(successHandler)
            .catch(errorHandler);
    }

    static async put(url, data, contextId) {
        const jsonData = JSON.stringify(data);
        return axios
            .put(url, jsonData, { headers: { 'Content-Type': 'application/json', ...getHeaders(contextId) } })
            .then(successHandler)
            .catch(errorHandler);
    }

    static async delete(url, data, contextId) {
        return axios
            .delete(url, { headers: { 'Content-Type': 'application/json', ...getHeaders(contextId) }, contextId, data })
            .then(successHandler)
            .catch(errorHandler);
    }
}

module.exports = ApiHelper;
