// main index.js
'use strict';

import { DeviceEventEmitter, NativeModules, Platform } from 'react-native';
import { EventEmitter } from 'events';

let isAppRegistered = false;
const { WeChat } = NativeModules;

// Event emitter to dispatch request and response from WeChat.
const emitter = new EventEmitter();

DeviceEventEmitter.addListener('WeChat_Resp', (resp) => {
    emitter.emit(resp.type, resp);
});

DeviceEventEmitter.addListener('WeChat_Req', (resp) => {
    emitter.emit(resp.type, resp);
});

function wrapRegisterApp(nativeFunc) {
    if (!nativeFunc) {
        return undefined;
    }
    return (...args) => {
        if (isAppRegistered) {
            return Promise.resolve(true);
        }
        isAppRegistered = true;
        return new Promise((resolve, reject) => {
            nativeFunc.apply(null, [
                ...args,
                (error, result) => {
                    if (!error) {
                        return resolve(result);
                    }
                    if (typeof error === 'string') {
                        return reject(new Error(error));
                    }
                    reject(error);
                },
            ]);
        });
    };
}

function wrapApi(nativeFunc) {
    if (!nativeFunc) {
        return undefined;
    }
    return (...args) => {
        if (!isAppRegistered) {
            return Promise.reject(new Error('registerApp required.'));
        }
        return new Promise((resolve, reject) => {
            nativeFunc.apply(null, [
                ...args,
                (error, result) => {
                    if (!error) {
                        return resolve(result);
                    }
                    if (typeof error === 'string') {
                        return reject(new Error(error));
                    }
                    reject(error);
                },
            ]);
        });
    };
}

/**
 * `addListener` inherits from `events` module
 * @method addListener
 * @param {String} eventName - the event name
 * @param {Function} trigger - the function when event is fired
 */
export const addListener = emitter.addListener.bind(emitter);

/**
 * `once` inherits from `events` module
 * @method once
 * @param {String} eventName - the event name
 * @param {Function} trigger - the function when event is fired
 */
export const once = emitter.once.bind(emitter);

/**
 * `removeAllListeners` inherits from `events` module
 * @method removeAllListeners
 * @param {String} eventName - the event name
 */
export const removeAllListeners = emitter.removeAllListeners.bind(emitter);

/**
 * @method registerApp
 * @param {String} appid - the app id
 * @return {Promise}
 */
export const registerApp = wrapRegisterApp(WeChat.registerApp);

// /**
//  * @method registerAppWithDescription
//  * @param {String} appid - the app id
//  * @param {String} appdesc - the app description
//  * @return {Promise}
//  */
// export const registerAppWithDescription = wrapRegisterApp(
//   WeChat.registerAppWithDescription,
// );

/**
 * Return if the wechat app is installed in the device.
 * @method isWXAppInstalled
 * @return {Promise}
 */
export const isWXAppInstalled = wrapApi(WeChat.isWXAppInstalled);

/**
 * Return if the wechat application supports the api
 * @method isWXAppSupportApi
 * @return {Promise}
 */
export const isWXAppSupportApi = wrapApi(WeChat.isWXAppSupportApi);

/**
 * Get the wechat app installed url
 * @method getWXAppInstallUrl
 * @return {String} the wechat app installed url
 */
export const getWXAppInstallUrl = wrapApi(WeChat.getWXAppInstallUrl);

/**
 * Get the wechat api version
 * @method getApiVersion
 * @return {String} the api version string
 */
export const getApiVersion = wrapApi(WeChat.getApiVersion);

/**
 * Open wechat app
 * @method openWXApp
 * @return {Promise}
 */
export const openWXApp = wrapApi(WeChat.openWXApp);
/**
 * Open wechat app
 * @method openCustomerServiceChat
 * @return {Promise}
 */
export const openCustomerServiceChat = wrapApi(WeChat.openCustomerServiceChat);

// wrap the APIs
// const nativeShareToTimeline = wrapApi(WeChat.shareToTimeline);
const nativeLaunchMiniProgram = wrapApi(WeChat.launchMiniProgram);
// const nativeShareToSession = wrapApi(WeChat.shareToSession);
const nativeShareToFavorite = wrapApi(WeChat.shareToFavorite);
// const nativeSendAuthRequest = wrapApi(WeChat.sendAuthRequest);
const nativeShareText = wrapApi(WeChat.shareText);
const nativeShareImage = wrapApi(WeChat.shareImage);
const nativeShareLocalImage = wrapApi(WeChat.shareLocalImage);
const nativeShareMusic = wrapApi(WeChat.shareMusic);
const nativeShareVideo = wrapApi(WeChat.shareVideo);
const nativeShareWebpage = wrapApi(WeChat.shareWebpage);
const nativeShareMiniProgram = wrapApi(WeChat.shareMiniProgram);
const nativeSubscribeMessage = wrapApi(WeChat.subscribeMessage);

const nativeChooseInvoice = wrapApi(WeChat.chooseInvoice);
const nativeShareFile = wrapApi(WeChat.shareFile);

/**
 * @method sendAuthRequest
 * @param {Array} scopes - the scopes for authentication.
 * @return {Promise}
 */
export function sendAuthRequest(scopes, state) {
    return new Promise((resolve, reject) => {
        WeChat.sendAuthRequest(scopes, state, () => {});
        emitter.once('SendAuth.Resp', (resp) => {
            if (resp.errCode === 0) {
                resolve(resp);
            } else {
                reject(new WechatError(resp));
            }
        });
    });
}

/**
 * Share text
 * @method shareText
 * @param {Object} data
 */
export function shareText(data) {
    if (data && data.scene == null) {
        data.scene = 0;
    }
    return new Promise((resolve, reject) => {
        nativeShareText(data);
        emitter.once('SendMessageToWX.Resp', (resp) => {
            if (resp.errCode === 0) {
                resolve(resp);
            } else {
                reject(new WechatError(resp));
            }
        });
    });
}

/**
 * Choose Invoice
 * @method chooseInvoice
 * @param {Object} data
 */
export function chooseInvoice(data = {}) {
    return new Promise((resolve, reject) => {
        nativeChooseInvoice(data);
        emitter.once('WXChooseInvoiceResp.Resp', (resp) => {
            if (resp.errCode === 0) {
                if (Platform.OS === 'android') {
                    const cardItemList = JSON.parse(resp.cardItemList);
                    resp.cards = cardItemList
                        ? cardItemList.map((item) => ({
                            cardId: item.card_id,
                            encryptCode: item.encrypt_code,
                        }))
                        : [];
                }
                resolve(resp);
            } else {
                reject(new WechatError(resp));
            }
        });
    });
}

/**
 * Share File
 * @method shareFile
 * @param {Object} data
 */
export function shareFile(data) {
    return new Promise((resolve, reject) => {
        nativeShareFile(data);
        emitter.once('SendMessageToWX.Resp', (resp) => {
            if (resp.errCode === 0) {
                resolve(resp);
            } else {
                reject(new WechatError(resp));
            }
        });
    });
}

/**
 * Share image
 * @method shareImage
 * @param {Object} data
 */
export function shareImage(data) {
    if (data && data.scene == null) {
        data.scene = 0;
    }
    return new Promise((resolve, reject) => {
        nativeShareImage(data);
        emitter.once('SendMessageToWX.Resp', (resp) => {
            if (resp.errCode === 0) {
                resolve(resp);
            } else {
                reject(new WechatError(resp));
            }
        });
    });
}

/**
 * Share local image
 * @method shareLocalImage
 * @param {Object} data
 */
export function shareLocalImage(data) {
    if (data && data.scene == null) {
        data.scene = 0;
    }
    return new Promise((resolve, reject) => {
        nativeShareLocalImage(data);
        emitter.once('SendMessageToWX.Resp', (resp) => {
            if (resp.errCode === 0) {
                resolve(resp);
            } else {
                reject(new WechatError(resp));
            }
        });
    });
}

/**
 * Share music
 * @method shareMusic
 * @param {Object} data
 */
export function shareMusic(data) {
    if (data && data.scene == null) {
        data.scene = 0;
    }
    return new Promise((resolve, reject) => {
        nativeShareMusic(data);
        emitter.once('SendMessageToWX.Resp', (resp) => {
            if (resp.errCode === 0) {
                resolve(resp);
            } else {
                reject(new WechatError(resp));
            }
        });
    });
}

/**
 * Share video
 * @method shareVideo
 * @param {Object} data
 */
export function shareVideo(data) {
    if (data && data.scene == null) {
        data.scene = 0;
    }
    return new Promise((resolve, reject) => {
        nativeShareVideo(data);
        emitter.once('SendMessageToWX.Resp', (resp) => {
            if (resp.errCode === 0) {
                resolve(resp);
            } else {
                reject(new WechatError(resp));
            }
        });
    });
}

/**
 * Share webpage
 * @method shareWebpage
 * @param {Object} data
 */
export function shareWebpage(data) {
    if (data && data.scene == null) {
        data.scene = 0;
    }
    return new Promise((resolve, reject) => {
        nativeShareWebpage(data);
        emitter.once('SendMessageToWX.Resp', (resp) => {
            if (resp.errCode === 0) {
                resolve(resp);
            } else {
                reject(new WechatError(resp));
            }
        });
    });
}
/**
 * Share miniProgram
 * @method shareMiniProgram
 * @param {Object} data
 */
export function shareMiniProgram(data) {
    if (data && data.scene == null) {
        data.scene = 0;
    }
    if (data && data.miniProgramType == null) {
        data.miniProgramType = 0;
    }
    return new Promise((resolve, reject) => {
        nativeShareMiniProgram(data);
        emitter.once('SendMessageToWX.Resp', (resp) => {
            if (resp.errCode === 0) {
                resolve(resp);
            } else {
                reject(new WechatError(resp));
            }
        });
    });
}

/**
 * 打开小程序
 * @method launchMini
 * @param
 * @param {String} userName - 拉起的小程序的username
 * @param {Integer} miniProgramType - 拉起小程序的类型. 0-正式版 1-开发版 2-体验版
 * @param {String} path - 拉起小程序页面的可带参路径，不填默认拉起小程序首页
 */
export function launchMiniProgram({
                                      userName,
                                      miniProgramType = 0,
                                      path = '',
                                  }) {
    return new Promise((resolve, reject) => {
        if (
            miniProgramType !== 0 &&
            miniProgramType !== 1 &&
            miniProgramType !== 2
        ) {
            reject(
                new WechatError({
                    errStr: '拉起小程序的类型不对，0-正式版 1-开发版 2-体验版',
                    errCode: -1,
                })
            );
            return;
        }
        nativeLaunchMiniProgram({ userName, miniProgramType, path });
        emitter.once('WXLaunchMiniProgramReq.Resp', (resp) => {
            if (resp.errCode === 0) {
                resolve(resp);
            } else {
                reject(new WechatError(resp));
            }
        });
    });
}

/**
 * 一次性订阅消息
 * @method shareVideo
 * @param {Object} data
 */
export function subscribeMessage(data) {
    if (data && data.scene == null) {
        data.scene = 0;
    }
    return new Promise((resolve, reject) => {
        nativeSubscribeMessage(data);
        emitter.once('WXSubscribeMsgReq.Resp', (resp) => {
            if (resp.errCode === 0) {
                resolve(resp);
            } else {
                reject(new WechatError(resp));
            }
        });
    });
}

/**
 * Share something to favorite
 * @method shareToFavorite
 * @param {Object} data
 * @param {String} data.thumbImage - Thumb image of the message, which can be a uri or a resource id.
 * @param {String} data.type - Type of this message. Could be {news|text|imageUrl|imageFile|imageResource|video|audio|file}
 * @param {String} data.webpageUrl - Required if type equals news. The webpage link to share.
 * @param {String} data.imageUrl - Provide a remote image if type equals image.
 * @param {String} data.videoUrl - Provide a remote video if type equals video.
 * @param {String} data.musicUrl - Provide a remote music if type equals audio.
 * @param {String} data.filePath - Provide a local file if type equals file.
 * @param {String} data.fileExtension - Provide the file type if type equals file.
 */
export function shareToFavorite(data) {
    return new Promise((resolve, reject) => {
        nativeShareToFavorite(data);
        emitter.once('SendMessageToWX.Resp', (resp) => {
            if (resp.errCode === 0) {
                resolve(resp);
            } else {
                reject(new WechatError(resp));
            }
        });
    });
}

/**
 * wechat pay
 * @param {Object} data
 * @param {String} data.partnerId
 * @param {String} data.prepayId
 * @param {String} data.nonceStr
 * @param {String} data.timeStamp
 * @param {String} data.package
 * @param {String} data.sign
 * @returns {Promise}
 */
export function pay(data) {
    function correct(actual, fixed) {
        if (!data[fixed] && data[actual]) {
            data[fixed] = data[actual];
            delete data[actual];
        }
    }
    correct('prepayid', 'prepayId');
    correct('noncestr', 'nonceStr');
    correct('partnerid', 'partnerId');
    correct('timestamp', 'timeStamp');

    // FIXME(94cstyles)
    // Android requires the type of the timeStamp field to be a string
    if (Platform.OS === 'android') data.timeStamp = String(data.timeStamp);

    return new Promise((resolve, reject) => {
        WeChat.pay(data, (result) => {
            if (result) reject(result);
        });
        emitter.once('PayReq.Resp', (resp) => {
            if (resp.errCode === 0) {
                resolve(resp);
            } else {
                reject(new WechatError(resp));
            }
        });
    });
}

/**
 * promises will reject with this error when API call finish with an errCode other than zero.
 */
export class WechatError extends Error {
    constructor(resp) {
        const message = resp.errStr || resp.errCode.toString();
        super(message);
        this.name = 'WechatError';
        this.code = resp.errCode;

        // avoid babel's limition about extending Error class
        // https://github.com/babel/babel/issues/3083
        if (typeof Object.setPrototypeOf === 'function') {
            Object.setPrototypeOf(this, WechatError.prototype);
        } else {
            this.__proto__ = WechatError.prototype;
        }
    }
}
