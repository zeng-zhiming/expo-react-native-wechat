// main index.js
'use strict';

export const registerApp = (appId, universalLink) => {
    return Promise.reject(false);
};

export const openCustomerServiceChat = (corpId, kfUrl) => {
    return Promise.reject("Web is not supported.");
};

export const isWXAppInstalled = () => {
    return Promise.reject(false);
};

export const isWXAppSupportApi = () => {
    return Promise.reject(false);
};

export const getApiVersion = () => {
    return Promise.reject("0");
};

export const openWXApp = () => {
    return Promise.reject(false);
};

export const sendAuthRequest = (scope, state) => {
    return Promise.reject({
        errCode: -1,
        errStr: "Web is not supported.",
        openId: "",
        code: "",
        url: "",
        lang: "",
        country: "",
    });
};

export const shareText = (message) => {
    return Promise.reject({ errCode: -1, errStr: "Web is not supported." });
};

export const shareImage = (message) => {
    return Promise.reject({ errCode: -1, errStr: "Web is not supported." });
};

export const shareLocalImage = (message) => {
    return Promise.reject({ errCode: -1, errStr: "Web is not supported." });
};

export const shareMusic = (message) => {
    return Promise.reject({ errCode: -1, errStr: "Web is not supported." });
};

export const shareVideo = (message) => {
    return Promise.reject({ errCode: -1, errStr: "Web is not supported." });
};

export const shareWebpage = (message) => {
    return Promise.reject({ errCode: -1, errStr: "Web is not supported." });
};

export const shareMiniProgram = (message) => {
    return Promise.reject({ errCode: -1, errStr: "Web is not supported." });
};

export const launchMiniProgram = (message) => {
    return Promise.reject({ errCode: -1, errStr: "Web is not supported." });
};

export const subscribeMessage = (message) => {
    return Promise.reject({ errCode: -1, errStr: "Web is not supported." });
};

export const pay = (payload) => {
    return Promise.reject({ errCode: -1, errStr: "Web is not supported." });
};

export const chooseInvoice = (data) => {
    return Promise.reject({ errCode: -1, errStr: "Web is not supported.", cards: [] });
};

export const shareFile = (data) => {
    return Promise.reject({ errCode: -1, errStr: "Web is not supported." });
};

























