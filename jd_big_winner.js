const $ = new Env("省钱大赢家之翻翻乐_Timorpic"),
    notify = $.isNode() ? require("./sendNotify") : "",
    jdCookieNode = $.isNode() ? require("./jdCookie.js") : "";
let cookiesArr = [],
    cookie = "",
    message = "",
    linkId = "yMVR-_QKRd2Mq27xguJG-w",
    fflLinkId = "YhCkrVusBVa_O2K-7xE6hA";
const money = $.isNode() ? process.env.BIGWINNER_MONEY ? 1 * process.env.BIGWINNER_MONEY : .3 : $.getdata("BIGWINNER_MONEY") ? 1 * $.getdata("BIGWINNER_MONEY") : .3,
    JD_API_HOST = "https://api.m.jd.com/api";
$.isNode() ? (Object.keys(jdCookieNode).forEach((item => {
    cookiesArr.push(jdCookieNode[item])
})), process.env.JD_DEBUG && "false" === process.env.JD_DEBUG && (console.log = () => {})) : cookiesArr = [$.getdata("CookieJD"), $.getdata("CookieJD2"), ...$.toObj($.getdata("CookiesJD") || "[]").map((item => item.cookie))].filter((item => !!item));
const len = cookiesArr.length;
async function main() {
    try {
        if ($.canApCashWithDraw = !1, $.changeReward = !0, $.canOpenRed = !0, await gambleHomePage(), !$.time && (console.log("开始进行翻翻乐拿红包\n"), await gambleOpenReward(), $.canOpenRed)) {
            for (; !$.canApCashWithDraw && $.changeReward;) await openRedReward(), await $.wait(500);
            $.canApCashWithDraw && (await openRedReward("gambleObtainReward", $.rewardData.rewardType), await apCashWithDraw($.rewardData.id, $.rewardData.poolBaseId, $.rewardData.prizeGroupId, $.rewardData.prizeBaseId, $.rewardData.prizeType))
        }
    } catch (e) {
        $.logErr(e)
    }
}

function gambleHomePage() {
    const headers = {
            Host: "api.m.jd.com",
            Origin: "https://openredpacket-jdlite.jd.com",
            Accept: "application/json, text/plain, */*",
            "User-Agent": "jdltapp;iPhone;3.3.2;14.4.1;network/wifi;Mozilla/5.0 (iPhone; CPU iPhone OS 14_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1",
            Referer: `https://618redpacket.jd.com/withdraw?activityId=${linkId}&channel=wjicon&lng=&lat=&sid=&un_area=`,
            "Accept-Language": "zh-cn",
            Cookie: cookie
        },
        body = {
            linkId: fflLinkId
        },
        options = {
            url: `https://api.m.jd.com/?functionId=gambleHomePage&body=${encodeURIComponent(JSON.stringify(body))}&appid=activities_platform&clientVersion=3.5.0`,
            headers: headers
        };
    return new Promise((resolve => {
        $.get(options, ((err, resp, data) => {
            try {
                err ? (console.log(`${JSON.stringify(err)}`), console.log(`${$.name} API请求失败，请检查网路重试`)) : data && (0 === (data = JSON.parse(data)).code ? (0 === data.data.leftTime ? $.time = data.data.leftTime : $.time = (data.data.leftTime / 6e4).toFixed(2), console.log(`\n查询下次翻翻乐剩余时间成功：\n京东账号【${$.UserName}】距开始剩 ${$.time} 分钟`)) : console.log(`查询下次翻翻乐剩余时间失败：${JSON.stringify(data)}\n`))
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve()
            }
        }))
    }))
}

function gambleOpenReward() {
    const body = {
            linkId: fflLinkId
        },
        options = {
            url: "https://api.m.jd.com/",
            headers: {
                Host: "api.m.jd.com",
                Origin: "https://openredpacket-jdlite.jd.com",
                Accept: "application/json, text/plain, */*",
                "User-Agent": "jdltapp;iPhone;3.3.2;14.4.1;network/wifi;Mozilla/5.0 (iPhone; CPU iPhone OS 14_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1",
                Referer: `https://618redpacket.jd.com/withdraw?activityId=${linkId}&channel=wjicon&lng=&lat=&sid=&un_area=`,
                "Accept-Language": "zh-cn",
                "Content-Type": "application/x-www-form-urlencoded",
                Cookie: cookie
            },
            body: `functionId=gambleOpenReward&body=${encodeURIComponent(JSON.stringify(body))}&t=${+new Date}&appid=activities_platform&clientVersion=3.5.0`
        };
    return new Promise((resolve => {
        $.post(options, ((err, resp, data) => {
            try {
                err ? (console.log(`${JSON.stringify(err)}`), console.log(`${$.name} API请求失败，请检查网路重试`)) : data && (0 === (data = JSON.parse(data)).code ? console.log(`翻翻乐打开红包 成功，获得：${data.data.rewardValue}元红包\n`) : (console.log(`翻翻乐打开红包 失败：${JSON.stringify(data)}\n`), 20007 === data.code && ($.canOpenRed = !1, console.log("翻翻乐打开红包 失败，今日活动参与次数已达上限"))))
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve()
            }
        }))
    }))
}

function openRedReward(functionId = "gambleChangeReward", type) {
    const headers = {
            Host: "api.m.jd.com",
            Origin: "https://openredpacket-jdlite.jd.com",
            Accept: "application/json, text/plain, */*",
            "User-Agent": "jdltapp;iPhone;3.3.2;14.4.1;network/wifi;Mozilla/5.0 (iPhone; CPU iPhone OS 14_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1",
            Referer: `https://618redpacket.jd.com/withdraw?activityId=${linkId}&channel=wjicon&lng=&lat=&sid=&un_area=`,
            "Accept-Language": "zh-cn",
            "Content-Type": "application/x-www-form-urlencoded",
            Cookie: cookie
        },
        body = {
            linkId: fflLinkId
        };
    type && (body.rewardType = type);
    const options = {
        url: "https://api.m.jd.com/",
        headers: headers,
        body: `functionId=${functionId}&body=${encodeURIComponent(JSON.stringify(body))}&t=${+new Date}&appid=activities_platform&clientVersion=3.5.0`
    };
    return new Promise((resolve => {
        $.post(options, ((err, resp, data) => {
            try {
                err ? (console.log(`${JSON.stringify(err)}`), console.log(`${$.name} API请求失败，请检查网路重试`)) : data && (console.log(`翻翻乐结果：${data}\n`), 0 === (data = JSON.parse(data)).code ? ($.rewardData = data.data, 1 === data.data.rewardState ? (data.data.rewardValue >= money && ($.canApCashWithDraw = !0, $.changeReward = !1), 1 === data.data.rewardType ? console.log(`翻翻乐 第${data.data.changeTimes}次翻倍 成功，获得：${data.data.rewardValue}元红包\n`) : 2 === data.data.rewardType ? console.log(`翻翻乐 第${data.data.changeTimes}次翻倍 成功，获得：${data.data.rewardValue}元现金\n`) : console.log(`翻翻乐 第${data.data.changeTimes}次翻倍 成功，获得：${JSON.stringify(data)}\n`)) : 3 === data.data.rewardState ? (console.log(`翻翻乐 第${data.data.changeTimes}次翻倍 失败，奖品溜走了/(ㄒoㄒ)/~~\n`), $.changeReward = !1) : type ? (console.log(`翻翻乐领取成功：${data.data.amount}现金\n`), message += `【京东账号${$.index}】${$.nickName||$.UserName}\n${(new Date).getHours()}点：${data.data.amount}现金\n`) : console.log(`翻翻乐 翻倍 成功，获得：${JSON.stringify(data)}\n`)) : ($.canApCashWithDraw = !0, $.changeReward = !1, console.log(`翻翻乐 翻倍 失败：${JSON.stringify(data)}\n`)))
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve()
            }
        }))
    }))
}

function apCashWithDraw(id, poolBaseId, prizeGroupId, prizeBaseId, prizeType) {
    const body = {
            businessSource: "GAMBLE",
            base: {
                id: id,
                business: "redEnvelopeDouble",
                poolBaseId: poolBaseId,
                prizeGroupId: prizeGroupId,
                prizeBaseId: prizeBaseId,
                prizeType: prizeType
            },
            linkId: fflLinkId
        },
        options = {
            url: "https://api.m.jd.com/",
            headers: {
                Host: "api.m.jd.com",
                Origin: "https://openredpacket-jdlite.jd.com",
                Accept: "application/json, text/plain, */*",
                "User-Agent": "jdltapp;iPhone;3.3.2;14.4.1;network/wifi;Mozilla/5.0 (iPhone; CPU iPhone OS 14_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1",
                Referer: `https://618redpacket.jd.com/withdraw?activityId=${linkId}&channel=wjicon&lng=&lat=&sid=&un_area=`,
                "Accept-Language": "zh-cn",
                "Content-Type": "application/x-www-form-urlencoded",
                Cookie: cookie
            },
            body: `functionId=apCashWithDraw&body=${encodeURIComponent(JSON.stringify(body))}&t=${+new Date}&appid=activities_platform&clientVersion=3.5.0`
        };
    return new Promise((resolve => {
        $.post(options, ((err, resp, data) => {
            try {
                err ? (console.log(`${JSON.stringify(err)}`), console.log(`${$.name} API请求失败，请检查网路重试`)) : data && (0 === (data = JSON.parse(data)).code ? "310" === data.data.status ? (console.log(`翻翻乐提现 成功🎉，详情：${JSON.stringify(data)}\n`), message += "提现至微信钱包成功🎉\n\n") : (console.log(`翻翻乐提现 失败，详情：${JSON.stringify(data)}\n`), message += `提现至微信钱包失败\n详情：${JSON.stringify(data)}\n\n`) : (console.log(`翻翻乐提现 失败：${JSON.stringify(data)}\n`), message += `提现至微信钱包失败\n详情：${JSON.stringify(data)}\n\n`))
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve()
            }
        }))
    }))
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
    if ($.redPacketId = [], cookiesArr[0]) {
        for (let i = 0; i < len; i++) cookiesArr[i] && (cookie = cookiesArr[i], $.UserName = decodeURIComponent(cookie.match(/pt_pin=(.+?);/) && cookie.match(/pt_pin=(.+?);/)[1]), $.index = i + 1, $.isLogin = !0, $.nickName = "", console.log(`\n******开始【京东账号${$.index}】${$.nickName||$.UserName}*********\n`), await main());
        message && ($.msg($.name, "", message), $.isNode() && await notify.sendNotify($.name, message))
    } else $.msg($.name, "【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取", "https://bean.m.jd.com/", {
        "open-url": "https://bean.m.jd.com/"
    })
})().catch((e => {
    $.log("", `❌ ${$.name}, 失败! 原因: ${e}!`, "")
})).finally((() => {
    $.done()
}));