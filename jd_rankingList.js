const $ = new Env("京东排行榜_Timorpic"),
    jdCookieNode = $.isNode() ? require("./jdCookie.js") : "",
    needSum = !1,
    STRSPLIT = "|";
let merge = {},
    cookiesArr = [],
    cookie = "";
$.isNode() ? Object.keys(jdCookieNode).forEach((item => {
    cookiesArr.push(jdCookieNode[item])
})) : cookiesArr = [$.getdata("CookieJD"), $.getdata("CookieJD2"), ...jsonParse($.getdata("CookiesJD") || "[]").map((item => item.cookie))].filter((item => !!item));
const JD_API_HOST = "https://api.m.jd.com/client.action?functionId=";

function QueryJDUserInfo(timeout = 0) {
    return new Promise((resolve => {
        setTimeout((() => {
            let url = {
                url: "https://wq.jd.com/user/info/QueryJDUserInfo?sceneval=2",
                headers: {
                    Referer: "https://wqs.jd.com/my/iserinfo.html",
                    Cookie: cookie
                }
            };
            $.get(url, ((err, resp, data) => {
                try {
                    if (13 === (data = JSON.parse(data)).retcode) return void(merge.enabled = !1);
                    merge.nickname = data.base.nickname
                } catch (e) {
                    $.logErr(e, resp)
                } finally {
                    resolve()
                }
            }))
        }), timeout)
    }))
}

function queryTrumpTask(timeout = 0) {
    return new Promise((resolve => {
        setTimeout((() => {
            let url = {
                url: `${JD_API_HOST}queryTrumpTask&body=%7B%22sign%22%3A2%7D&appid=content_ecology&clientVersion=9.2.0&client=wh5`,
                headers: {
                    Cookie: cookie,
                    Connection: "keep-alive",
                    Accept: "application/json, text/plain, */*",
                    Referer: "https://h5.m.jd.com/babelDiy/Zeus/3wtN2MjeQgjmxYTLB3YFcHjKiUJj/index.html",
                    Host: "api.m.jd.com",
                    "Accept-Encoding": "gzip, deflate, br",
                    "Accept-Language": "zh-cn"
                }
            };
            $.post(url, (async (err, resp, data) => {
                try {
                    data = JSON.parse(data);
                    let now = $.time("yyyy-MM-dd");
                    for (let i in data.result.signTask.taskItemInfo.signList)
                        if (data.result.signTask.taskItemInfo.signList[i].match(now)) return merge.jdBeans.fail++, merge.jdBeans.notify = `${now}已签过`, void console.log(now + "已签过");
                    for (let i in data.result.taskList) console.log(data.result.taskList[i].taskName), 0 === data.result.taskList[i].taskItemInfo.status ? await doTrumpTask(data.result.taskList[i].taskId, data.result.taskList[i].taskItemInfo.itemId, 1e3) : console.log("已完成");
                    console.log("开始签到"), await doTrumpTask(4, "1", 1e3)
                } catch (e) {
                    $.logErr(e, resp)
                } finally {
                    resolve()
                }
            }))
        }), timeout)
    }))
}

function doTrumpTask(taskId, itemId, timeout = 0) {
    return new Promise((resolve => {
        setTimeout((() => {
            let url = {
                url: `${JD_API_HOST}doTrumpTask&body=%7B%22taskId%22%3A${taskId}%2C%22itemId%22%3A%22${itemId}%22%2C%22sign%22%3A2%7D&appid=content_ecology&clientVersion=9.2.0&client=wh5`,
                headers: {
                    Cookie: cookie,
                    Connection: "keep-alive",
                    Accept: "application/json, text/plain, */*",
                    Referer: "https://h5.m.jd.com/babelDiy/Zeus/3wtN2MjeQgjmxYTLB3YFcHjKiUJj/index.html",
                    Host: "api.m.jd.com",
                    "Accept-Encoding": "gzip, deflate, br",
                    "Accept-Language": "zh-cn"
                }
            };
            $.post(url, (async (err, resp, data) => {
                try {
                    if (data = JSON.parse(data), console.log(data.msg), "0" !== data.code) return merge.jdBeans.fail++, void(merge.jdBeans.notify = `${data.msg}`);
                    merge.jdBeans.success++, merge.jdBeans.prizeCount += parseInt(data.result.lotteryScore)
                } catch (e) {
                    $.logErr(e, resp)
                } finally {
                    resolve()
                }
            }))
        }), timeout)
    }))
}

function initial() {
    merge = {
        nickname: "",
        enabled: !0,
        jdBeans: {
            prizeDesc: "获得|京豆|个",
            number: !0,
            fixed: 0
        }
    };
    for (let i in merge) merge[i].success = 0, merge[i].fail = 0, merge[i].prizeCount = 0, merge[i].notify = "", merge[i].show = !0
}

function msgShow() {
    let message = "";
    merge.nickname;
    for (let i in merge) "object" == typeof merge[i] && merge[i].show && ("\n" === merge[i].notify.split("").reverse()[0] && (merge[i].notify = merge[i].notify.substr(0, merge[i].notify.length - 1)), message += `${merge[i].prizeDesc.split("|")[0]}${merge[i].prizeDesc.split("|")[1]}：` + (merge[i].success ? `${merge[i].prizeCount.toFixed(merge[i].fixed)}${merge[i].prizeDesc.split("|")[2]}\n` : `失败：${merge[i].notify}\n`));
    message += "请点击通知跳转至APP查看"
}

function jsonParse(str) {
    if ("string" == typeof str) try {
        return JSON.parse(str)
    } catch (e) {
        return console.log(e), $.msg($.name, "", "不要在BoxJS手动复制粘贴修改cookie"), []
    }
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
                        this.ckjar.setCookieSync(s, null), e.cookieJar = this.ckjar
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
        time(t, g = -8) {
            let f = (new Date).getTimezoneOffset(),
                d = (new Date).getTime() + 60 * f * 1e3 - 60 * g * 60 * 1e3,
                n = new Date(d),
                e = {
                    "M+": n.getMonth() + 1,
                    "d+": n.getDate(),
                    "H+": n.getHours(),
                    "m+": n.getMinutes(),
                    "s+": n.getSeconds(),
                    "q+": Math.floor((n.getMonth() + 3) / 3),
                    S: n.getMilliseconds()
                };
            /(y+)/.test(t) && (t = t.replace(RegExp.$1, (n.getFullYear() + "").substr(4 - RegExp.$1.length)));
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
            this.isMute || (this.isSurge() || this.isLoon() ? $notification.post(e, s, i, o(r)) : this.isQuanX() && $notify(e, s, i, o(r)));
            let h = ["", "==============📣系统通知📣=============="];
            h.push(e), s && h.push(s), i && h.push(i), console.log(h.join("\n")), this.logs = this.logs.concat(h)
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
}(async () => {
    if (cookiesArr[0]) {
        for (let i = 0; i < cookiesArr.length; i++)
            if (cookie = cookiesArr[i], cookie) {
                if (i && console.log(`\n***************开始京东账号${i+1}***************`), initial(), await QueryJDUserInfo(), !merge.enabled) {
                    $.setdata("", `CookieJD${i?i+1:""}`), $.msg($.name, `【提示】京东账号${i+1} cookie已过期！请先获取cookie\n直接使用NobyDa的京东签到获取`, "https://bean.m.jd.com/", {
                        "open-url": "https://bean.m.jd.com/"
                    });
                    continue
                }
                await queryTrumpTask(), await msgShow()
            }
    } else $.msg($.name, "【提示】请先获取cookie\n直接使用NobyDa的京东签到获取", "https://bean.m.jd.com/", {
        "open-url": "https://bean.m.jd.com/"
    })
})().catch((e => $.logErr(e))).finally((() => $.done()));