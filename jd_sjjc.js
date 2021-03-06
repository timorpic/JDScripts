const Ariszy = "手机竞猜_Timorpic",
    $ = Env(Ariszy),
    notify = $.isNode() ? require("./sendNotify") : "";
cookiesArr = [], CodeArr = [], cookie = "";
var brandlistArr = [],
    shareidArr = [];
const jdCookieNode = $.isNode() ? require("./jdCookie.js") : "";
cookiesArr = [$.getdata("CookieJD"), $.getdata("CookieJD2"), ...jsonParse($.getdata("CookiesJD") || "[]").map((item => item.cookie))].filter((item => !!item));
let tz = $.getval("tz") || "1";
const invite = 1,
    logs = 0;
var hour = "",
    minute = "";

function PostRequest(uri, body) {
    return {
        url: `https://api.m.jd.com/api/${uri}`,
        method: "POST",
        headers: {
            Accept: "application/json, text/plain, */*",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "zh-cn",
            Connection: "keep-alive",
            "Content-Type": "application/x-www-form-urlencoded",
            Cookie: cookie,
            Host: "api.m.jd.com",
            Origin: "https://electricsuper.jd.com",
            Referer: "https://electricsuper.jd.com/?lng=121.406936&lat=31.363832&sid=8610c0280494250aa210ed252f7ad28w&un_area=13_1016_47166_57860",
            "User-Agent": "jdapp;iPhone;10.2.2;14.4;0bcbcdb2a68f16cf9c9ad7c9b944fd141646a849;M/5.0;network/wifi;ADID/;model/iPhone12,1;addressid/2377723269;appBuild/167863;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 14_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1;"
        },
        body: body
    }
}

function PostRequests(body) {
    return {
        url: "https://api.m.jd.com/api",
        method: "POST",
        headers: {
            Accept: "application/json, text/plain, */*",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "zh-cn",
            Connection: "keep-alive",
            "Content-Type": "application/x-www-form-urlencoded",
            Cookie: cookie,
            Host: "api.m.jd.com",
            Origin: "https://electricsuper.jd.com",
            Referer: "https://electricsuper.jd.com/?lng=121.406936&lat=31.363832&sid=8610c0280494250aa210ed252f7ad28w&un_area=13_1016_47166_57860",
            "User-Agent": "jdapp;iPhone;10.2.2;14.4;0bcbcdb2a68f16cf9c9ad7c9b944fd141646a849;M/5.0;network/wifi;ADID/;model/iPhone12,1;addressid/2377723269;appBuild/167863;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 14_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1;"
        },
        body: body
    }
}

function GetRequest(uri) {
    return {
        url: `https://brandquiz.m.jd.com/api/${uri}`,
        method: "GET",
        headers: {
            Accept: "application/json, text/plain, */*",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "zh-cn",
            Connection: "keep-alive",
            Cookie: cookie,
            "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 12_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148"
        }
    }
}
async function quiz() {
    const MyRequest = PostRequest("index/quiz", `appid=apple-jd-aggregate&functionId=brandquiz_prod&body={"quizId":3,"quizStr":"${distinct(brandlistArr)}","predictId":null,"apiMapping":"/api/index/quiz"}&t=1635840868162&loginType=2`);
    return new Promise((resolve => {
        $.post(MyRequest, (async (error, response, data) => {
            try {
                const result = JSON.parse(data);
                0, result && result.code && 200 == result.code ? (console.log("\n竞猜成功，获得" + result.data.beanNum + "豆豆\n开奖时间为:" + data.match(/\d+月\d+日/) + " 10:00 \n下轮竞猜时间为：" + result.data.nextQuizDate), await $.wait(8e3)) : $.log(result.msg + "\n")
            } catch (e) {
                $.logErr(e, response)
            } finally {
                resolve()
            }
        }))
    }))
}
async function control() {
    await first(), await getshareid()
}
async function first() {
    const MyRequest = PostRequests(`appid=apple-jd-aggregate&functionId=brandquiz_prod&body=%7B%22quizId%22:3,%22apiMapping%22:%22/api/support/getSupport%22%7D&t=${(new Date).getTime()}&loginType=2`);
    return new Promise((resolve => {
        $.post(MyRequest, (async (error, response, data) => {
            try {
                JSON.parse(data);
                0
            } catch (e) {
                $.logErr(e, response)
            } finally {
                resolve()
            }
        }))
    }))
}
async function getshareid() {
    const MyRequest = PostRequests(`appid=apple-jd-aggregate&functionId=brandquiz_prod&body={"quizId":3,"apiMapping":"/api/support/getSupport"}&t=${(new Date).getTime()}&loginType=2`);
    return new Promise((resolve => {
        $.post(MyRequest, (async (error, response, data) => {
            try {
                const result = JSON.parse(data);
                0, result && result.code && 200 == result.code ? ($.log("互助码：" + result.data.shareId + "\n"), shareidArr.push(result.data.shareId), await $.wait(8e3)) : $.log("😫" + result.msg + "\n")
            } catch (e) {
                $.logErr(e, response)
            } finally {
                resolve()
            }
        }))
    }))
}
async function Zy() {
    brandlistArr.splice(0, brandlistArr.length)
}
async function dosupport(shareid) {
    const MyRequest = PostRequests(`appid=apple-jd-aggregate&functionId=brandquiz_prod&body={"shareId":"${shareid}","apiMapping":"/api/support/doSupport"}&t=${(new Date).getTime()}&loginType=2`);
    return new Promise((resolve => {
        $.post(MyRequest, (async (error, response, data) => {
            try {
                const result = JSON.parse(data);
                $.log(data), result && result.code && 200 == result.code && 7 == result.data ? console.log("助力成功\n") : 1 == result.data ? $.log("😫助力失败,不能助力自己\n") : 3 == result.data && $.log("😫助力失败,已经助力过了\n")
            } catch (e) {
                $.logErr(e, response)
            } finally {
                resolve()
            }
        }))
    }))
}
async function zy() {
    for (let i = 0; i < distinct(shareidArr).length; i++) console.log("开始内部助力" + shareidArr[i] + "\n"), await dosupport(shareidArr[i]), await $.wait(8e3)
}
async function getlist() {
    const MyRequest = PostRequests(`appid=apple-jd-aggregate&functionId=brandquiz_prod&body={"apiMapping":"/api/index/indexInfo"}&t=${(new Date).getTime()}&loginType=2`);
    return new Promise((resolve => {
        $.post(MyRequest, (async (error, response, data) => {
            try {
                const result = JSON.parse(data);
                if (result && result.code && 200 == result.code) {
                    console.log(result.data.listName + "\n");
                    for (let i = 0; i < 5; i++) {
                        let numberid = result.data.brandWall[i].id.match(/\w+/);
                        brandlistArr.push(numberid)
                    }
                    $.log("榜单获取成功" + distinct(brandlistArr)), await $.wait(8e3)
                } else $.log("😫" + result.msg + "\n")
            } catch (e) {
                $.logErr(e, response)
            } finally {
                resolve()
            }
        }))
    }))
}
async function readShareCodes() {
    return new Promise((resolve => {
        let url = {
            url: "https://raw.githubusercontent.com/Ariszy/TGBOT/main/sjjc.js"
        };
        $.get(url, (async (error, response, data) => {
            try {
                const result = JSON.parse(data);
                var sharecodesArr = new Array;
                for (var i in result) sharecodesArr.push(result[i]);
                var sharecodeArr = new Array;
                for (let i = 0; i < sharecodesArr.length; i++)
                    for (var j in sharecodesArr[i]) sharecodeArr.push(sharecodesArr[i][j].Code);
                return CodeArr = sharecodeArr, sharecodeArr
            } catch (e) {
                $.logErr(e, response)
            } finally {
                resolve()
            }
        }))
    }))
}
async function formatcode() {
    await readShareCodes();
    for (var newsharecodes = [], arr = CodeArr, count = arr.length, i = 0; i < 5 - cookiesArr.length; i++) {
        var index = ~~(Math.random() * count) + i;
        newsharecodes[i] = arr[index], arr[index] = arr[i], count--
    }
    console.log("随机取出" + (5 - cookiesArr.length) + "个助力码,账号" + `${$.UserName}即将助力【` + newsharecodes + "】\n");
    for (let i = 0; i < newsharecodes.length; i++) console.log(`开始第${i+1}次随机助力` + newsharecodes[i] + "\n"), await dosupport(newsharecodes[i]), await $.wait(1e3 * newsharecodes.length)
}
async function showmsg() {
    1 == tz ? $.isNode() ? 12 == hour && minute <= 20 || 23 == hour && minute >= 40 ? await notify.sendNotify($.name, message) : $.log(message) : 12 == hour && minute <= 20 || 23 == hour && minute >= 40 ? $.msg(zhiyi, "", message) : $.log(message) : $.log(message)
}

function jsonParse(str) {
    if ("string" == typeof str) try {
        return JSON.parse(str)
    } catch (e) {
        return console.log(e), $.msg($.name, "", "请勿随意在BoxJs输入框修改内容\n建议通过脚本去获取cookie"), []
    }
}

function distinct(array) {
    return Array.from(new Set(array))
}

function Env(t, e) {
    class s {
        constructor(t) {
            this.env = t
        }
        send(t, e = "GET") {
            t = "string" == typeof t ? {
                url: t
            } : t;
            let s = this.get;
            return "POST" === e && (s = this.post), new Promise(((e, i) => {
                s.call(this, t, ((t, s, r) => {
                    t ? i(t) : e(s)
                }))
            }))
        }
        get(t) {
            return this.send.call(this.env, t)
        }
        post(t) {
            return this.send.call(this.env, t, "POST")
        }
    }
    return new class {
        constructor(t, e) {
            this.name = t, this.http = new s(this), this.data = null, this.dataFile = "box.dat", this.logs = [], this.isMute = !1, this.isNeedRewrite = !1, this.logSeparator = "\n", this.startTime = (new Date).getTime(), Object.assign(this, e), this.log("", `🔔${this.name}, 开始!`)
        }
        isNode() {
            return "undefined" != typeof module && !!module.exports
        }
        isQuanX() {
            return "undefined" != typeof $task
        }
        isSurge() {
            return "undefined" != typeof $httpClient && "undefined" == typeof $loon
        }
        isLoon() {
            return "undefined" != typeof $loon
        }
        toObj(t, e = null) {
            try {
                return JSON.parse(t)
            } catch {
                return e
            }
        }
        toStr(t, e = null) {
            try {
                return JSON.stringify(t)
            } catch {
                return e
            }
        }
        getjson(t, e) {
            let s = e;
            if (this.getdata(t)) try {
                s = JSON.parse(this.getdata(t))
            } catch {}
            return s
        }
        setjson(t, e) {
            try {
                return this.setdata(JSON.stringify(t), e)
            } catch {
                return !1
            }
        }
        getScript(t) {
            return new Promise((e => {
                this.get({
                    url: t
                }, ((t, s, i) => e(i)))
            }))
        }
        runScript(t, e) {
            return new Promise((s => {
                let i = this.getdata("@chavy_boxjs_userCfgs.httpapi");
                i = i ? i.replace(/\n/g, "").trim() : i;
                let r = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");
                r = r ? 1 * r : 20, r = e && e.timeout ? e.timeout : r;
                const [o, h] = i.split("@"), a = {
                    url: `http://${h}/v1/scripting/evaluate`,
                    body: {
                        script_text: t,
                        mock_type: "cron",
                        timeout: r
                    },
                    headers: {
                        "X-Key": o,
                        Accept: "*/*"
                    }
                };
                this.post(a, ((t, e, i) => s(i)))
            })).catch((t => this.logErr(t)))
        }
        loaddata() {
            if (!this.isNode()) return {}; {
                this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path");
                const t = this.path.resolve(this.dataFile),
                    e = this.path.resolve(process.cwd(), this.dataFile),
                    s = this.fs.existsSync(t),
                    i = !s && this.fs.existsSync(e);
                if (!s && !i) return {}; {
                    const i = s ? t : e;
                    try {
                        return JSON.parse(this.fs.readFileSync(i))
                    } catch (t) {
                        return {}
                    }
                }
            }
        }
        writedata() {
            if (this.isNode()) {
                this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path");
                const t = this.path.resolve(this.dataFile),
                    e = this.path.resolve(process.cwd(), this.dataFile),
                    s = this.fs.existsSync(t),
                    i = !s && this.fs.existsSync(e),
                    r = JSON.stringify(this.data);
                s ? this.fs.writeFileSync(t, r) : i ? this.fs.writeFileSync(e, r) : this.fs.writeFileSync(t, r)
            }
        }
        lodash_get(t, e, s) {
            const i = e.replace(/\[(\d+)\]/g, ".$1").split(".");
            let r = t;
            for (const t of i)
                if (r = Object(r)[t], void 0 === r) return s;
            return r
        }
        lodash_set(t, e, s) {
            return Object(t) !== t || (Array.isArray(e) || (e = e.toString().match(/[^.[\]]+/g) || []), e.slice(0, -1).reduce(((t, s, i) => Object(t[s]) === t[s] ? t[s] : t[s] = Math.abs(e[i + 1]) >> 0 == +e[i + 1] ? [] : {}), t)[e[e.length - 1]] = s), t
        }
        getdata(t) {
            let e = this.getval(t);
            if (/^@/.test(t)) {
                const [, s, i] = /^@(.*?)\.(.*?)$/.exec(t), r = s ? this.getval(s) : "";
                if (r) try {
                    const t = JSON.parse(r);
                    e = t ? this.lodash_get(t, i, "") : e
                } catch (t) {
                    e = ""
                }
            }
            return e
        }
        setdata(t, e) {
            let s = !1;
            if (/^@/.test(e)) {
                const [, i, r] = /^@(.*?)\.(.*?)$/.exec(e), o = this.getval(i), h = i ? "null" === o ? null : o || "{}" : "{}";
                try {
                    const e = JSON.parse(h);
                    this.lodash_set(e, r, t), s = this.setval(JSON.stringify(e), i)
                } catch (e) {
                    const o = {};
                    this.lodash_set(o, r, t), s = this.setval(JSON.stringify(o), i)
                }
            } else s = this.setval(t, e);
            return s
        }
        getval(t) {
            return this.isSurge() || this.isLoon() ? $persistentStore.read(t) : this.isQuanX() ? $prefs.valueForKey(t) : this.isNode() ? (this.data = this.loaddata(), this.data[t]) : this.data && this.data[t] || null
        }
        setval(t, e) {
            return this.isSurge() || this.isLoon() ? $persistentStore.write(t, e) : this.isQuanX() ? $prefs.setValueForKey(t, e) : this.isNode() ? (this.data = this.loaddata(), this.data[e] = t, this.writedata(), !0) : this.data && this.data[e] || null
        }
        initGotEnv(t) {
            this.got = this.got ? this.got : require("got"), this.cktough = this.cktough ? this.cktough : require("tough-cookie"), this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar, t && (t.headers = t.headers ? t.headers : {}, void 0 === t.headers.Cookie && void 0 === t.cookieJar && (t.cookieJar = this.ckjar))
        }
        get(t, e = (() => {})) {
            t.headers && (delete t.headers["Content-Type"], delete t.headers["Content-Length"]), this.isSurge() || this.isLoon() ? (this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, {
                "X-Surge-Skip-Scripting": !1
            })), $httpClient.get(t, ((t, s, i) => {
                !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i)
            }))) : this.isQuanX() ? (this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, {
                hints: !1
            })), $task.fetch(t).then((t => {
                const {
                    statusCode: s,
                    statusCode: i,
                    headers: r,
                    body: o
                } = t;
                e(null, {
                    status: s,
                    statusCode: i,
                    headers: r,
                    body: o
                }, o)
            }), (t => e(t)))) : this.isNode() && (this.initGotEnv(t), this.got(t).on("redirect", ((t, e) => {
                try {
                    if (t.headers["set-cookie"]) {
                        const s = t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();
                        s && this.ckjar.setCookieSync(s, null), e.cookieJar = this.ckjar
                    }
                } catch (t) {
                    this.logErr(t)
                }
            })).then((t => {
                const {
                    statusCode: s,
                    statusCode: i,
                    headers: r,
                    body: o
                } = t;
                e(null, {
                    status: s,
                    statusCode: i,
                    headers: r,
                    body: o
                }, o)
            }), (t => {
                const {
                    message: s,
                    response: i
                } = t;
                e(s, i, i && i.body)
            })))
        }
        post(t, e = (() => {})) {
            if (t.body && t.headers && !t.headers["Content-Type"] && (t.headers["Content-Type"] = "application/x-www-form-urlencoded"), t.headers && delete t.headers["Content-Length"], this.isSurge() || this.isLoon()) this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, {
                "X-Surge-Skip-Scripting": !1
            })), $httpClient.post(t, ((t, s, i) => {
                !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i)
            }));
            else if (this.isQuanX()) t.method = "POST", this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, {
                hints: !1
            })), $task.fetch(t).then((t => {
                const {
                    statusCode: s,
                    statusCode: i,
                    headers: r,
                    body: o
                } = t;
                e(null, {
                    status: s,
                    statusCode: i,
                    headers: r,
                    body: o
                }, o)
            }), (t => e(t)));
            else if (this.isNode()) {
                this.initGotEnv(t);
                const {
                    url: s,
                    ...i
                } = t;
                this.got.post(s, i).then((t => {
                    const {
                        statusCode: s,
                        statusCode: i,
                        headers: r,
                        body: o
                    } = t;
                    e(null, {
                        status: s,
                        statusCode: i,
                        headers: r,
                        body: o
                    }, o)
                }), (t => {
                    const {
                        message: s,
                        response: i
                    } = t;
                    e(s, i, i && i.body)
                }))
            }
        }
        time(t) {
            let e = {
                "M+": (new Date).getMonth() + 1,
                "d+": (new Date).getDate(),
                "H+": (new Date).getHours(),
                "m+": (new Date).getMinutes(),
                "s+": (new Date).getSeconds(),
                "q+": Math.floor(((new Date).getMonth() + 3) / 3),
                S: (new Date).getMilliseconds()
            };
            /(y+)/.test(t) && (t = t.replace(RegExp.$1, ((new Date).getFullYear() + "").substr(4 - RegExp.$1.length)));
            for (let s in e) new RegExp("(" + s + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? e[s] : ("00" + e[s]).substr(("" + e[s]).length)));
            return t
        }
        msg(e = t, s = "", i = "", r) {
            const o = t => {
                if (!t) return t;
                if ("string" == typeof t) return this.isLoon() ? t : this.isQuanX() ? {
                    "open-url": t
                } : this.isSurge() ? {
                    url: t
                } : void 0;
                if ("object" == typeof t) {
                    if (this.isLoon()) {
                        return {
                            openUrl: t.openUrl || t.url || t["open-url"],
                            mediaUrl: t.mediaUrl || t["media-url"]
                        }
                    }
                    if (this.isQuanX()) {
                        return {
                            "open-url": t["open-url"] || t.url || t.openUrl,
                            "media-url": t["media-url"] || t.mediaUrl
                        }
                    }
                    if (this.isSurge()) {
                        return {
                            url: t.url || t.openUrl || t["open-url"]
                        }
                    }
                }
            };
            if (this.isMute || (this.isSurge() || this.isLoon() ? $notification.post(e, s, i, o(r)) : this.isQuanX() && $notify(e, s, i, o(r))), !this.isMuteLog) {
                let t = ["", "==============📣系统通知📣=============="];
                t.push(e), s && t.push(s), i && t.push(i), console.log(t.join("\n")), this.logs = this.logs.concat(t)
            }
        }
        log(...t) {
            t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(t.join(this.logSeparator))
        }
        logErr(t, e) {
            !this.isSurge() && !this.isQuanX() && !this.isLoon() ? this.log("", `❗️${this.name}, 错误!`, t.stack) : this.log("", `❗️${this.name}, 错误!`, t)
        }
        wait(t) {
            return new Promise((e => setTimeout(e, t)))
        }
        done(t = {}) {
            const s = ((new Date).getTime() - this.startTime) / 1e3;
            this.log("", `🔔${this.name}, 结束! 🕛 ${s} 秒`), this.log(), (this.isSurge() || this.isQuanX() || this.isLoon()) && $done(t)
        }
    }(t, e)
}
$.isNode() ? (hour = new Date((new Date).getTime() + 288e5).getHours(), minute = new Date((new Date).getTime() + 288e5).getMinutes()) : (hour = (new Date).getHours(), minute = (new Date).getMinutes()), $.isNode() ? (Object.keys(jdCookieNode).forEach((item => {
    cookiesArr.push(jdCookieNode[item])
})), process.env.JD_DEBUG && "false" === process.env.JD_DEBUG && (console.log = () => {})) : cookiesArr = [$.getdata("CookieJD"), $.getdata("CookieJD2"), ...$.toObj($.getdata("CookiesJD") || "[]").map((item => item.cookie))].filter((item => !!item)), (async () => {
    if (cookiesArr[0]) {
        for (let i = 0; i < cookiesArr.length; i++) cookie = cookiesArr[i], $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1]), message = "", $.isLogin = !0, $.index = i + 1, console.log(`\n******开始【京东账号${$.index}】${$.nickName||$.UserName}*********\n`), $.isLogin ? (await getlist(), await quiz(), await Zy()) : ($.msg($.name, "【提示】cookie已失效", `京东账号${$.index} ${$.nickName||$.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, {
            "open-url": "https://bean.m.jd.com/bean/signIndex.action"
        }), $.isNode() && await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`));
        for (let i = 0; i < cookiesArr.length; i++) cookie = cookiesArr[i], $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1]), message = "", $.isLogin = !0, $.index = i + 1, console.log(`\n******开始【京东账号${$.index}】${$.nickName||$.UserName}助力模块*********\n`), await control(), await zy(), await formatcode()
    } else $.msg($.name, "【提示】请先获取cookie\n直接使用NobyDa的京东签到获取", "https://bean.m.jd.com/bean/signIndex.action", {
        "open-url": "https://bean.m.jd.com/bean/signIndex.action"
    })
})().catch((e => $.logErr(e))).finally((() => $.done()));