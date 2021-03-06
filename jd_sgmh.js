const $ = new Env("闪购盲盒_Timorpic"),
    jdCookieNode = $.isNode() ? require("./jdCookie.js") : "";
let appId = "1EFRXxg",
    homeDataFunPrefix = "interact_template",
    collectScoreFunPrefix = "harmony",
    message = "",
    lotteryResultFunPrefix = homeDataFunPrefix,
    browseTime = 6;
const inviteCodes = ["T020vfRxRBwY8VPKKRzykvMCCjVQmoaT5kRrbA@T0225KkcRE0YpgaGKRz2xfYPdQCjVQmoaT5kRrbA@T024vP5yQhwe_FTUPRP0nfUPcKGBCjVQmoaT5kRrbA@T018v_V0QB8d8lDRKROb1ACjVQmoaT5kRrbA", "T020vfRxRBwY8VPKKRzykvMCCjVQmoaT5kRrbA@T0225KkcRE0YpgaGKRz2xfYPdQCjVQmoaT5kRrbA@T024vP5yQhwe_FTUPRP0nfUPcKGBCjVQmoaT5kRrbA@T018v_V0QB8d8lDRKROb1ACjVQmoaT5kRrbA"],
    randomCount = $.isNode() ? 20 : 5,
    notify = $.isNode() ? require("./sendNotify") : "";
let merge = {},
    cookiesArr = [],
    cookie = "";
$.isNode() ? (Object.keys(jdCookieNode).forEach((item => {
    cookiesArr.push(jdCookieNode[item])
})), process.env.JD_DEBUG && "false" === process.env.JD_DEBUG && (console.log = () => {})) : cookiesArr = [$.getdata("CookieJD"), $.getdata("CookieJD2"), ...jsonParse($.getdata("CookiesJD") || "[]").map((item => item.cookie))].filter((item => !!item));
const JD_API_HOST = "https://api.m.jd.com/client.action";

function interact_template_getHomeData(timeout = 0) {
    return new Promise((resolve => {
        setTimeout((() => {
            let url = {
                url: `${JD_API_HOST}`,
                headers: {
                    Origin: "https://h5.m.jd.com",
                    Cookie: cookie,
                    Connection: "keep-alive",
                    Accept: "application/json, text/plain, */*",
                    Referer: "https://h5.m.jd.com/babelDiy/Zeus/2WBcKYkn8viyxv7MoKKgfzmu7Dss/index.html",
                    Host: "api.m.jd.com",
                    "Accept-Encoding": "gzip, deflate, br",
                    "Accept-Language": "zh-cn"
                },
                body: `functionId=${homeDataFunPrefix}_getHomeData&body={"appId":"${appId}","taskToken":""}&client=wh5&clientVersion=1.0.0`
            };
            $.post(url, (async (err, resp, data) => {
                try {
                    if (0 !== (data = JSON.parse(data)).data.bizCode) return void console.log(data.data.bizMsg);
                    scorePerLottery = data.data.result.userInfo.scorePerLottery || data.data.result.userInfo.lotteryMinusScore, data.data.result.raiseInfo && data.data.result.raiseInfo.levelList && (scorePerLottery = data.data.result.raiseInfo.levelList[data.data.result.raiseInfo.scoreLevel]);
                    for (let i = 0; i < data.data.result.taskVos.length; i++) {
                        if (console.log("\n" + data.data.result.taskVos[i].taskType + "-" + data.data.result.taskVos[i].taskName + "-" + (1 === data.data.result.taskVos[i].status ? `已完成${data.data.result.taskVos[i].times}-未完成${data.data.result.taskVos[i].maxTimes}` : "全部已完成")), "邀请好友助力" === data.data.result.taskVos[i].taskName) {
                            console.log(`\n【京东账号${$.index}（${$.UserName}）的${$.name}好友互助码】${data.data.result.taskVos[i].assistTaskDetailVo.taskToken}\n`);
                            for (let code of $.newShareCodes) code && (await harmony_collectScore(code, data.data.result.taskVos[i].taskId), await $.wait(2e3))
                        } else if (3 === data.data.result.taskVos[i].status) console.log("开始抽奖"), await interact_template_getLotteryResult(data.data.result.taskVos[i].taskId);
                        else if ([0, 13].includes(data.data.result.taskVos[i].taskType)) 1 === data.data.result.taskVos[i].status && await harmony_collectScore(data.data.result.taskVos[i].simpleRecordInfoVo.taskToken, data.data.result.taskVos[i].taskId);
                        else if ([14, 6].includes(data.data.result.taskVos[i].taskType))
                            for (let j = 0; j < (data.data.result.userInfo.lotteryNum || 0); j++) "1EFRTxQ" === appId ? await ts_smashGoldenEggs() : await interact_template_getLotteryResult(data.data.result.taskVos[i].taskId);
                        let list = data.data.result.taskVos[i].productInfoVos || data.data.result.taskVos[i].followShopVo || data.data.result.taskVos[i].shoppingActivityVos || data.data.result.taskVos[i].browseShopVo;
                        for (let k = data.data.result.taskVos[i].times; k < data.data.result.taskVos[i].maxTimes; k++)
                            for (let j in list)
                                if (1 === list[j].status) {
                                    console.log("\n" + (list[j].title || list[j].shopName || list[j].skuName)), list[j].itemId ? (await harmony_collectScore(list[j].taskToken, data.data.result.taskVos[i].taskId, list[j].itemId, 1), k === data.data.result.taskVos[i].maxTimes - 1 && await interact_template_getLotteryResult(data.data.result.taskVos[i].taskId)) : await harmony_collectScore(list[j].taskToken, data.data.result.taskVos[i].taskId), list[j].status = 2;
                                    break
                                }
                    }
                    scorePerLottery && await interact_template_getLotteryResult()
                } catch (e) {
                    $.logErr(e, resp)
                } finally {
                    resolve()
                }
            }))
        }), timeout)
    }))
}

function harmony_collectScore(taskToken, taskId, itemId = "", actionType = 0, timeout = 0) {
    return new Promise((resolve => {
        setTimeout((() => {
            let url = {
                url: `${JD_API_HOST}`,
                headers: {
                    Origin: "https://h5.m.jd.com",
                    Cookie: cookie,
                    Connection: "keep-alive",
                    Accept: "application/json, text/plain, */*",
                    Referer: "https://h5.m.jd.com/babelDiy/Zeus/2WBcKYkn8viyxv7MoKKgfzmu7Dss/index.html",
                    Host: "api.m.jd.com",
                    "Accept-Encoding": "gzip, deflate, br",
                    "Accept-Language": "zh-cn"
                },
                body: `functionId=${collectScoreFunPrefix}_collectScore&body={"appId":"${appId}","taskToken":"${taskToken}","taskId":${taskId}${itemId?',"itemId":"'+itemId+'"':""},"actionType":${actionType}&client=wh5&clientVersion=1.0.0`
            };
            $.post(url, (async (err, resp, data) => {
                try {
                    "任务领取成功" === (data = JSON.parse(data)).data.bizMsg ? await harmony_collectScore(taskToken, taskId, itemId, 0, 1e3 * parseInt(browseTime)) : console.log(data.data.bizMsg)
                } catch (e) {
                    $.logErr(e, resp)
                } finally {
                    resolve()
                }
            }))
        }), timeout)
    }))
}

function interact_template_getLotteryResult(taskId, timeout = 0) {
    return new Promise((resolve => {
        setTimeout((() => {
            let url = {
                url: `${JD_API_HOST}`,
                headers: {
                    Origin: "https://h5.m.jd.com",
                    Cookie: cookie,
                    Connection: "keep-alive",
                    Accept: "application/json, text/plain, */*",
                    Referer: "https://h5.m.jd.com/babelDiy/Zeus/2WBcKYkn8viyxv7MoKKgfzmu7Dss/index.html?inviteId=P04z54XCjVXmYaW5m9cZ2f433tIlGBj3JnLHD0",
                    Host: "api.m.jd.com",
                    "Accept-Encoding": "gzip, deflate, br",
                    "Accept-Language": "zh-cn"
                },
                body: `functionId=${lotteryResultFunPrefix}_getLotteryResult&body={"appId":"${appId}"${taskId?',"taskId":"'+taskId+'"':""}}&client=wh5&clientVersion=1.0.0`
            };
            $.post(url, (async (err, resp, data) => {
                try {
                    timeout || console.log("\n开始抽奖"), 0 === (data = JSON.parse(data)).data.bizCode && (data.data.result.userAwardsCacheDto.jBeanAwardVo && (console.log("京豆:" + data.data.result.userAwardsCacheDto.jBeanAwardVo.quantity), $.beans += parseInt(data.data.result.userAwardsCacheDto.jBeanAwardVo.quantity)), data.data.result.raiseInfo && (scorePerLottery = parseInt(data.data.result.raiseInfo.nextLevelScore)), parseInt(data.data.result.userScore) >= scorePerLottery && scorePerLottery && await interact_template_getLotteryResult(1e3))
                } catch (e) {
                    $.logErr(e, resp)
                } finally {
                    resolve()
                }
            }))
        }), timeout)
    }))
}

function showMsg() {
    return message += `任务已完成，本次运行获得京豆${$.beans}`, new Promise((resolve => {
        $.beans && $.msg($.name, "", `【京东账号${$.index}】${$.nickName}\n${message}`), $.log(`【京东账号${$.index}】${$.nickName}\n${message}`), resolve()
    }))
}

function requireConfig() {
    return new Promise((async resolve => {
        console.log(`开始获取${$.name}配置文件\n`);
        let shareCodes = [];
        console.log(`共${cookiesArr.length}个京东账号\n`), $.isNode() && process.env.JDSGMH_SHARECODES && (shareCodes = process.env.JDSGMH_SHARECODES.indexOf("\n") > -1 ? process.env.JDSGMH_SHARECODES.split("\n") : process.env.JDSGMH_SHARECODES.split("&")), $.shareCodesArr = [], $.isNode() && Object.keys(shareCodes).forEach((item => {
            shareCodes[item] && $.shareCodesArr.push(shareCodes[item])
        })), console.log(`您提供了${$.shareCodesArr.length}个账号的${$.name}助力码\n`), resolve()
    }))
}

function shareCodesFormat() {
    return new Promise((async resolve => {
        if ($.newShareCodes = [], $.shareCodesArr[$.index - 1]) $.newShareCodes = $.shareCodesArr[$.index - 1].split("@");
        else {
            console.log(`由于您第${$.index}个京东账号未提供shareCode,将采纳本脚本自带的助力码\n`);
            const tempIndex = $.index > inviteCodes.length ? inviteCodes.length - 1 : $.index - 1;
            $.newShareCodes = inviteCodes[tempIndex].split("@")
        }
        const readShareCodeRes = await readShareCode();
        readShareCodeRes && 200 === readShareCodeRes.code && ($.newShareCodes = [...new Set([...$.newShareCodes, ...readShareCodeRes.data || []])]), console.log(`第${$.index}个京东账号将要助力的好友${JSON.stringify($.newShareCodes)}`), resolve()
    }))
}

function readShareCode() {
    return console.log("开始"), new Promise((async resolve => {
        $.get({
            url: `http://share.turinglabs.net/api/v3/sgmh/query/${randomCount}/`,
            timeout: 1e4
        }, ((err, resp, data) => {
            try {
                err ? (console.log(`${JSON.stringify(err)}`), console.log(`${$.name} API请求失败，请检查网路重试`)) : data && (console.log(`随机取${randomCount}个码放到您固定的互助码后面(不影响已有固定互助)`), data = JSON.parse(data))
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve(data)
            }
        })), await $.wait(2e3), resolve()
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
                "User-Agent": $.isNode() ? process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1" : $.getdata("JDUA") ? $.getdata("JDUA") : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"
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
    if (cookiesArr[0]) {
        await requireConfig();
        for (let i = 0; i < cookiesArr.length; i++)
            if (cookie = cookiesArr[i], cookie) {
                if ($.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1]), $.index = i + 1, $.isLogin = !0, $.nickName = "", $.beans = 0, message = "", await TotalBean(), await shareCodesFormat(), console.log(`\n******开始【京东账号${$.index}】${$.nickName||$.UserName}*********\n`), !$.isLogin) {
                    $.msg($.name, "【提示】cookie已失效", `京东账号${$.index} ${$.nickName||$.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, {
                        "open-url": "https://bean.m.jd.com/bean/signIndex.action"
                    }), $.isNode() && await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
                    continue
                }
                await interact_template_getHomeData(), await showMsg()
            }
    } else $.msg($.name, "【提示】请先获取cookie\n直接使用NobyDa的京东签到获取", "https://bean.m.jd.com/", {
        "open-url": "https://bean.m.jd.com/"
    })
})().catch((e => $.logErr(e))).finally((() => $.done()));