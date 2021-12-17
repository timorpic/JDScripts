const $ = new Env("进店领豆_Timorpic"),
    notify = $.isNode() ? require("./sendNotify") : "",
    jdCookieNode = $.isNode() ? require("./jdCookie.js") : "";
let cookiesArr = [],
    cookie = "";
$.isNode() ? (Object.keys(jdCookieNode).forEach((item => {
    cookiesArr.push(jdCookieNode[item])
})), process.env.JD_DEBUG && "false" === process.env.JD_DEBUG && (console.log = () => {})) : cookiesArr = [$.getdata("CookieJD"), $.getdata("CookieJD2"), ...jsonParse($.getdata("CookiesJD") || "[]").map((item => item.cookie))].filter((item => !!item));
let message = "",
    subTitle = "";
const JD_API_HOST = "https://api.m.jd.com/client.action";
async function jdShop() {
    const taskData = await getTask();
    if ("0" === taskData.code)
        if (taskData.data.taskList) {
            const {
                taskList: taskList
            } = taskData.data;
            let beanCount = 0;
            for (let item of taskList)
                if (3 === item.taskStatus) console.log(`${item.shopName} 已拿到2京豆\n`);
                else {
                    console.log(`taskId::${item.taskId}`);
                    "0" === (await doTask(item.taskId)).code && (beanCount += 2)
                } console.log(`beanCount::${beanCount}`)
        } else console.log(`${taskData.data.taskErrorTips}\n`)
}

function doTask(taskId) {
    return console.log(`doTask-taskId::${taskId}`), new Promise((resolve => {
        const body = {
                taskId: `${taskId}`
            },
            options = {
                url: `${JD_API_HOST}`,
                body: `functionId=takeTask&body=${escape(JSON.stringify(body))}&appid=ld`,
                headers: {
                    "User-Agent": $.isNode() ? process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : require("./USER_AGENTS").USER_AGENT : $.getdata("JDUA") ? $.getdata("JDUA") : "jdapp;iPhone;9.2.2;14.2;%E4%BA%AC%E4%B8%9C/9.2.2 CFNetwork/1206 Darwin/20.1.0",
                    Host: "api.m.jd.com",
                    "Content-Type": "application/x-www-form-urlencoded",
                    Cookie: cookie
                }
            };
        $.post(options, ((err, resp, data) => {
            try {
                err ? (console.log("\n进店领豆: API查询请求失败 ‼️‼️"), $.logErr(err)) : data = JSON.parse(data)
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve(data)
            }
        }))
    }))
}

function getTask(body = {}) {
    return new Promise((resolve => {
        const options = {
            url: `${JD_API_HOST}`,
            body: `functionId=queryTaskIndex&body=${escape(JSON.stringify(body))}&appid=ld`,
            headers: {
                "User-Agent": $.isNode() ? process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : require("./USER_AGENTS").USER_AGENT : $.getdata("JDUA") ? $.getdata("JDUA") : "jdapp;iPhone;9.2.2;14.2;%E4%BA%AC%E4%B8%9C/9.2.2 CFNetwork/1206 Darwin/20.1.0",
                Host: "api.m.jd.com",
                "Content-Type": "application/x-www-form-urlencoded",
                Cookie: cookie
            }
        };
        $.post(options, ((err, resp, data) => {
            try {
                err ? (console.log("\n进店领豆: API查询请求失败 ‼️‼️"), $.logErr(err)) : data = JSON.parse(data)
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve(data)
            }
        }))
    }))
}

function TotalBean() {
    return new Promise((async resolve => {
        const options = {
            url: "https://wq.jd.com/user/info/QueryJDUserInfo?sceneval=2",
            headers: {
                Accept: "application/json,text/plain, */*",
                "Content-Type": "application/x-www-form-urlencoded",
                "Accept-Encoding": "gzip, deflate, br",
                "Accept-Language": "zh-cn",
                Connection: "keep-alive",
                Cookie: cookie,
                Referer: "https://wqs.jd.com/my/jingdou/my.shtml?sceneval=2",
                "User-Agent": $.isNode() ? process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : require("./USER_AGENTS").USER_AGENT : $.getdata("JDUA") ? $.getdata("JDUA") : "jdapp;iPhone;9.2.2;14.2;%E4%BA%AC%E4%B8%9C/9.2.2 CFNetwork/1206 Darwin/20.1.0"
            }
        };
        $.post(options, ((err, resp, data) => {
            try {
                if (err) console.log(`${JSON.stringify(err)}`), console.log(`${$.name} API请求失败，请检查网路重试`);
                else if (data) {
                    if (13 === (data = JSON.parse(data)).retcode) return void($.isLogin = !1);
                    0 === data.retcode ? $.nickName = data.base && data.base.nickname || $.UserName : $.nickName = $.UserName
                } else console.log("京东服务器返回空数据")
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve()
            }
        }))
    }))
}

function jsonParse(str) {
    if ("string" == typeof str) try {
        return JSON.parse(str)
    } catch (e) {
        return console.log(e), $.msg($.name, "", "请勿随意在BoxJs输入框修改内容\n建议通过脚本去获取cookie"), []
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
                s.call(this, t, ((t, s, o) => {
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
            this.name = t, this.http = new s(this), this.data = null, this.dataFile = "box.dat", this.logs = [], this.isMute = !1, this.logSeparator = "\n", this.startTime = (new Date).getTime(), Object.assign(this, e), this.log("", `🔔${this.name}, 开始!`)
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
                let o = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");
                o = o ? 1 * o : 20, o = e && e.timeout ? e.timeout : o;
                const [r, h] = i.split("@"), a = {
                    url: `http://${h}/v1/scripting/evaluate`,
                    body: {
                        script_text: t,
                        mock_type: "cron",
                        timeout: o
                    },
                    headers: {
                        "X-Key": r,
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
                    o = JSON.stringify(this.data);
                s ? this.fs.writeFileSync(t, o) : i ? this.fs.writeFileSync(e, o) : this.fs.writeFileSync(t, o)
            }
        }
        lodash_get(t, e, s) {
            const i = e.replace(/\[(\d+)\]/g, ".$1").split(".");
            let o = t;
            for (const t of i)
                if (o = Object(o)[t], void 0 === o) return s;
            return o
        }
        lodash_set(t, e, s) {
            return Object(t) !== t || (Array.isArray(e) || (e = e.toString().match(/[^.[\]]+/g) || []), e.slice(0, -1).reduce(((t, s, i) => Object(t[s]) === t[s] ? t[s] : t[s] = Math.abs(e[i + 1]) >> 0 == +e[i + 1] ? [] : {}), t)[e[e.length - 1]] = s), t
        }
        getdata(t) {
            let e = this.getval(t);
            if (/^@/.test(t)) {
                const [, s, i] = /^@(.*?)\.(.*?)$/.exec(t), o = s ? this.getval(s) : "";
                if (o) try {
                    const t = JSON.parse(o);
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
                const [, i, o] = /^@(.*?)\.(.*?)$/.exec(e), r = this.getval(i), h = i ? "null" === r ? null : r || "{}" : "{}";
                try {
                    const e = JSON.parse(h);
                    this.lodash_set(e, o, t), s = this.setval(JSON.stringify(e), i)
                } catch (e) {
                    const r = {};
                    this.lodash_set(r, o, t), s = this.setval(JSON.stringify(r), i)
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
            t.headers && (delete t.headers["Content-Type"], delete t.headers["Content-Length"]), this.isSurge() || this.isLoon() ? $httpClient.get(t, ((t, s, i) => {
                !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i)
            })) : this.isQuanX() ? $task.fetch(t).then((t => {
                const {
                    statusCode: s,
                    statusCode: i,
                    headers: o,
                    body: r
                } = t;
                e(null, {
                    status: s,
                    statusCode: i,
                    headers: o,
                    body: r
                }, r)
            }), (t => e(t))) : this.isNode() && (this.initGotEnv(t), this.got(t).on("redirect", ((t, e) => {
                try {
                    const s = t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();
                    this.ckjar.setCookieSync(s, null), e.cookieJar = this.ckjar
                } catch (t) {
                    this.logErr(t)
                }
            })).then((t => {
                const {
                    statusCode: s,
                    statusCode: i,
                    headers: o,
                    body: r
                } = t;
                e(null, {
                    status: s,
                    statusCode: i,
                    headers: o,
                    body: r
                }, r)
            }), (t => e(t))))
        }
        post(t, e = (() => {})) {
            if (t.body && t.headers && !t.headers["Content-Type"] && (t.headers["Content-Type"] = "application/x-www-form-urlencoded"), t.headers && delete t.headers["Content-Length"], this.isSurge() || this.isLoon()) $httpClient.post(t, ((t, s, i) => {
                !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i)
            }));
            else if (this.isQuanX()) t.method = "POST", $task.fetch(t).then((t => {
                const {
                    statusCode: s,
                    statusCode: i,
                    headers: o,
                    body: r
                } = t;
                e(null, {
                    status: s,
                    statusCode: i,
                    headers: o,
                    body: r
                }, r)
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
                        headers: o,
                        body: r
                    } = t;
                    e(null, {
                        status: s,
                        statusCode: i,
                        headers: o,
                        body: r
                    }, r)
                }), (t => e(t)))
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
        msg(e = t, s = "", i = "", o) {
            const r = t => {
                if (!t || !this.isLoon() && this.isSurge()) return t;
                if ("string" == typeof t) return this.isLoon() ? t : this.isQuanX() ? {
                    "open-url": t
                } : void 0;
                if ("object" == typeof t) {
                    if (this.isLoon()) {
                        return {
                            openUrl: t.openUrl || t["open-url"],
                            mediaUrl: t.mediaUrl || t["media-url"]
                        }
                    }
                    if (this.isQuanX()) {
                        return {
                            "open-url": t["open-url"] || t.openUrl,
                            "media-url": t["media-url"] || t.mediaUrl
                        }
                    }
                }
            };
            this.isMute || (this.isSurge() || this.isLoon() ? $notification.post(e, s, i, r(o)) : this.isQuanX() && $notify(e, s, i, r(o)));
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
            if (cookiesArr[i]) {
                if (cookie = cookiesArr[i], $.UserName = decodeURIComponent(cookie.match(/pt_pin=(.+?);/) && cookie.match(/pt_pin=(.+?);/)[1]), $.index = i + 1, $.isLogin = !0, $.nickName = "", await TotalBean(), console.log(`\n开始【京东账号${$.index}】${$.nickName||$.UserName}\n`), !$.isLogin) {
                    $.msg($.name, "【提示】cookie已失效", `京东账号${$.index} ${$.nickName||$.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, {
                        "open-url": "https://bean.m.jd.com/bean/signIndex.action"
                    }), $.isNode() && await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
                    continue
                }
                message = "", subTitle = "", await jdShop()
            }
    } else $.msg($.name, "【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取", "https://bean.m.jd.com/bean/signIndex.action", {
        "open-url": "https://bean.m.jd.com/bean/signIndex.action"
    })
})().catch((e => {
    $.log("", `❌ ${$.name}, 失败! 原因: ${e}!`, "")
})).finally((() => {
    $.done()
}));