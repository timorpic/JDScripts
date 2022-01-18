const APIKey = "CookiesJD";
$ = new API(APIKey, !0);
const CacheKey = "#CookiesJD";

function getCache() {
    var cache = $.read(CacheKey) || "[]";
    return $.log(cache), JSON.parse(cache)
}

function GetCookie() {
    try {
        if ($request.headers && $request.url.indexOf("GetJDUserInfoUnion") > -1) {
            var CV = $request.headers.Cookie || $request.headers.cookie;
            if (CV.match(/(pt_key=.+?pt_pin=|pt_pin=.+?pt_key=)/)) {
                var updateIndex, CookieValue = CV.match(/pt_key=.+?;/) + CV.match(/pt_pin=.+?;/),
                    UserName = CookieValue.match(/pt_pin=(.+?);/)[1],
                    DecodeName = decodeURIComponent(UserName),
                    CookiesData = getCache(),
                    updateCookiesData = [...CookiesData],
                    CookieName = "【账号】",
                    updateCodkie = CookiesData.find(((item, index) => {
                        var ck = item.cookie,
                            Account = ck && ck.match(/pt_pin=.+?;/) ? ck.match(/pt_pin=(.+?);/)[1] : null;
                        const verify = UserName === Account;
                        return verify && (updateIndex = index), verify
                    })),
                    tipPrefix = "";
                updateCodkie ? (updateCookiesData[updateIndex].cookie = CookieValue, CookieName = `【账号${updateIndex+1}】`, tipPrefix = "更新京东") : (updateCookiesData.push({
                    userName: DecodeName,
                    cookie: CookieValue
                }), CookieName = "【账号" + updateCookiesData.length + "】", tipPrefix = "首次写入京东");
                const cacheValue = JSON.stringify(updateCookiesData, null, "\t");
                $.write(cacheValue, CacheKey), $.notify("用户名: " + DecodeName, "", tipPrefix + CookieName + "Cookie成功 🎉")
            } else $.notify("写入京东Cookie失败", "", "请查看脚本内说明, 登录网页获取 ‼️");
            return void $.done()
        }
        $.notify("写入京东Cookie失败", "", "请检查匹配URL或配置内脚本类型 ‼️")
    } catch (eor) {
        $.write("", CacheKey), $.notify("写入京东Cookie失败", "", "已尝试清空历史Cookie, 请重试 ⚠️"), console.log(`\n写入京东Cookie出现错误 ‼️\n${JSON.stringify(eor)}\n\n${eor}\n\n${JSON.stringify($request.headers)}\n`)
    }
    $.done()
}

function ENV() {
    const isQX = "undefined" != typeof $task,
        isLoon = "undefined" != typeof $loon,
        isSurge = "undefined" != typeof $httpClient && !isLoon,
        isJSBox = "function" == typeof require && "undefined" != typeof $jsbox;
    return {
        isQX: isQX,
        isLoon: isLoon,
        isSurge: isSurge,
        isNode: "function" == typeof require && !isJSBox,
        isJSBox: isJSBox,
        isRequest: "undefined" != typeof $request,
        isScriptable: "undefined" != typeof importModule
    }
}

function HTTP(baseURL, defaultOptions = {}) {
    const {
        isQX: isQX,
        isLoon: isLoon,
        isSurge: isSurge,
        isScriptable: isScriptable,
        isNode: isNode
    } = ENV();
    const http = {};
    return ["GET", "POST", "PUT", "DELETE", "HEAD", "OPTIONS", "PATCH"].forEach((method => http[method.toLowerCase()] = options => function send(method, options) {
        (options = "string" == typeof options ? {
            url: options
        } : options).url = baseURL ? baseURL + options.url : options.url;
        const timeout = (options = {
                ...defaultOptions,
                ...options
            }).timeout,
            events = {
                onRequest: () => {},
                onResponse: resp => resp,
                onTimeout: () => {},
                ...options.events
            };
        let worker, timeoutid;
        if (events.onRequest(method, options), isQX) worker = $task.fetch({
            method: method,
            ...options
        });
        else if (isLoon || isSurge || isNode) worker = new Promise(((resolve, reject) => {
            (isNode ? require("request") : $httpClient)[method.toLowerCase()](options, ((err, response, body) => {
                err ? reject(err) : resolve({
                    statusCode: response.status || response.statusCode,
                    headers: response.headers,
                    body: body
                })
            }))
        }));
        else if (isScriptable) {
            const request = new Request(options.url);
            request.method = method, request.headers = options.headers, request.body = options.body, worker = new Promise(((resolve, reject) => {
                request.loadString().then((body => {
                    resolve({
                        statusCode: request.response.statusCode,
                        headers: request.response.headers,
                        body: body
                    })
                })).catch((err => reject(err)))
            }))
        }
        const timer = timeout ? new Promise(((_, reject) => {
            timeoutid = setTimeout((() => (events.onTimeout(), reject(`${method}URL:${options.url}exceeds the timeout ${timeout}ms`))), timeout)
        })) : null;
        return (timer ? Promise.race([timer, worker]).then((res => (clearTimeout(timeoutid), res))) : worker).then((resp => events.onResponse(resp)))
    }(method, options))), http
}

function API(name = "untitled", debug = !1) {
    const {
        isQX: isQX,
        isLoon: isLoon,
        isSurge: isSurge,
        isNode: isNode,
        isJSBox: isJSBox,
        isScriptable: isScriptable
    } = ENV();
    return new class {
        constructor(name, debug) {
            this.name = name, this.debug = debug, this.http = HTTP(), this.env = ENV(), this.node = (() => {
                if (isNode) {
                    return {
                        fs: require("fs")
                    }
                }
                return null
            })(), this.initCache();
            Promise.prototype.delay = function (t) {
                return this.then((function (v) {
                    return ((t, v) => new Promise((function (resolve) {
                        setTimeout(resolve.bind(null, v), t)
                    })))(t, v)
                }))
            }
        }
        initCache() {
            if (isQX && (this.cache = JSON.parse($prefs.valueForKey(this.name) || "{}")), (isLoon || isSurge) && (this.cache = JSON.parse($persistentStore.read(this.name) || "{}")), isNode) {
                let fpath = "root.json";
                this.node.fs.existsSync(fpath) || this.node.fs.writeFileSync(fpath, JSON.stringify({}), {
                    flag: "wx"
                }, (err => console.log(err))), this.root = {}, fpath = `${this.name}.json`, this.node.fs.existsSync(fpath) ? this.cache = JSON.parse(this.node.fs.readFileSync(`${this.name}.json`)) : (this.node.fs.writeFileSync(fpath, JSON.stringify({}), {
                    flag: "wx"
                }, (err => console.log(err))), this.cache = {})
            }
        }
        persistCache() {
            const data = JSON.stringify(this.cache);
            isQX && $prefs.setValueForKey(data, this.name), (isLoon || isSurge) && $persistentStore.write(data, this.name), isNode && (this.node.fs.writeFileSync(`${this.name}.json`, data, {
                flag: "w"
            }, (err => console.log(err))), this.node.fs.writeFileSync("root.json", JSON.stringify(this.root), {
                flag: "w"
            }, (err => console.log(err))))
        }
        write(data, key) {
            if (this.log(`SET ${key}`), -1 !== key.indexOf("#")) {
                if (key = key.substr(1), isSurge || isLoon) return $persistentStore.write(data, key);
                if (isQX) return $prefs.setValueForKey(data, key);
                isNode && (this.root[key] = data)
            } else this.cache[key] = data;
            this.persistCache()
        }
        read(key) {
            return this.log(`READ ${key}`), -1 === key.indexOf("#") ? this.cache[key] : (key = key.substr(1), isSurge || isLoon ? $persistentStore.read(key) : isQX ? $prefs.valueForKey(key) : isNode ? this.root[key] : void 0)
        }
        delete(key) {
            this.log(`DELETE ${key}`), -1 !== key.indexOf("#") ? (key = key.substr(1), (isSurge || isLoon) && $persistentStore.write(null, key), isQX && $prefs.removeValueForKey(key), isNode && delete this.root[key]) : delete this.cache[key], this.persistCache()
        }
        notify(title, subtitle = "", content = "", options = {}) {
            const openURL = options["open-url"],
                mediaURL = options["media-url"];
            if (isQX && $notify(title, subtitle, content, options), isSurge && $notification.post(title, subtitle, content + "" + (mediaURL ? "\n多媒体:" + mediaURL : ""), {
                    url: openURL
                }), isLoon) {
                let opts = {};
                openURL && (opts.openUrl = openURL), mediaURL && (opts.mediaUrl = mediaURL), "{}" == JSON.stringify(opts) ? $notification.post(title, subtitle, content) : $notification.post(title, subtitle, content, opts)
            }
            if (isNode || isScriptable) {
                const content_ = content + (openURL ? `\n点击跳转:${openURL}` : "") + (mediaURL ? `\n多媒体:${mediaURL}` : "");
                if (isJSBox) {
                    require("push").schedule({
                        title: title,
                        body: (subtitle ? subtitle + "\n" : "") + content_
                    })
                } else console.log(`${title}\n${subtitle}\n${content_}\n\n`)
            }
        }
        log(msg) {
            this.debug && console.log(msg)
        }
        info(msg) {
            console.log(msg)
        }
        error(msg) {
            console.log("ERROR: " + msg)
        }
        wait(millisec) {
            return new Promise((resolve => setTimeout(resolve, millisec)))
        }
        done(value = {}) {
            isQX || isLoon || isSurge ? $done(value) : isNode && !isJSBox && "undefined" != typeof $context && ($context.headers = value.headers, $context.statusCode = value.statusCode, $context.body = value.body)
        }
    }(name, debug)
}
$request && GetCookie();