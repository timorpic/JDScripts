const $ = new Env("京东抽奖机_Timorpic"),
    STRSPLIT = "|",
    needSum = !1,
    printDetail = !1,
    appIdArr = ["1EFRRxA", "1EFRQwA", "1EFRXxg", "1EFVRxg", "1E1xVyqw"],
    shareCodeArr = ["T020vfRxRBwY8VPKKRzykvMCCjVWmIaW5kRrbA", "T020vfRxRBwY8VPKKRzykvMCCjVXnIaW5kRrbA", "T020vfRxRBwY8VPKKRzykvMCCjVQmoaT5kRrbA", "T0225KkcRE0YpgaGKRz2xfYPdQCjVWmIaW5kRrbA", "T0225KkcRE0YpgaGKRz2xfYPdQCjVQmoaT5kRrbA", "T024vP5yQhwe_FTUPRP0nfUPcKGBCjVQmoaT5kRrbA"],
    homeDataFunPrefixArr = ["interact_template", "interact_template", "harmony_template", "", "", "", "", "", "", "", "", "", "interact_template", "interact_template"],
    collectScoreFunPrefixArr = ["", "", "", "", "", "", "", "", "", "", "", "", "interact_template", "interact_template"],
    lotteryResultFunPrefixArr = ["", "", "", "", "", "", "", "", "", "", "", "", "", "interact_template", "interact_template"];
let merge = {},
    cookiesArr = [],
    cookie = "";
const JD_API_HOST = "https://api.m.jd.com/client.action";

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
                    if (0 !== (data = JSON.parse(data)).data.bizCode) return console.log(data.data.bizMsg), merge.jdBeans.fail++, void(merge.jdBeans.notify = `${data.data.bizMsg}`);
                    scorePerLottery = data.data.result.userInfo.scorePerLottery || data.data.result.userInfo.lotteryMinusScore, data.data.result.raiseInfo && data.data.result.raiseInfo.levelList && (scorePerLottery = data.data.result.raiseInfo.levelList[data.data.result.raiseInfo.scoreLevel]);
                    for (let i = 0; i < data.data.result.taskVos.length; i++) {
                        if (console.log("\n" + data.data.result.taskVos[i].taskType + "-" + data.data.result.taskVos[i].taskName + "-" + (1 === data.data.result.taskVos[i].status ? `已完成${data.data.result.taskVos[i].times}-未完成${data.data.result.taskVos[i].maxTimes}` : "全部已完成")), 3 === data.data.result.taskVos[i].status) {
                            console.log("开始抽奖"), await interact_template_getLotteryResult(data.data.result.taskVos[i].taskId);
                            continue
                        }
                        if ([0, 13, 12].includes(data.data.result.taskVos[i].taskType)) {
                            1 === data.data.result.taskVos[i].status && await harmony_collectScore(data.data.result.taskVos[i].simpleRecordInfoVo.taskToken, data.data.result.taskVos[i].taskId);
                            continue
                        }
                        if ([14, 6].includes(data.data.result.taskVos[i].taskType)) {
                            console.log(data.data.result.taskVos[i].assistTaskDetailVo.taskToken), 0 === cookiesArr.indexOf(cookie) && (shareCodeArr[appIdArr.indexOf(appId)] = data.data.result.taskVos[i].assistTaskDetailVo.taskToken), shareCode && await harmony_collectScore(shareCode, data.data.result.taskVos[i].taskId);
                            for (let j = 0; j < (data.data.result.userInfo.lotteryNum || 0); j++) "1EFRTxQ" === appId ? await ts_smashGoldenEggs() : await interact_template_getLotteryResult(data.data.result.taskVos[i].taskId);
                            continue
                        }
                        let list = data.data.result.taskVos[i].productInfoVos || data.data.result.taskVos[i].followShopVo || data.data.result.taskVos[i].shoppingActivityVos || data.data.result.taskVos[i].browseShopVo;
                        data.data.result.taskVos[i].subTitleName.match(/(\d+)(s)/) && (browseTime = parseInt(data.data.result.taskVos[i].subTitleName.match(/(\d+)(s)/)[0]));
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
                    false,
                    data = JSON.parse(data),
                    console.log(data.data.bizMsg),
                    "任务领取成功" === data.data.bizMsg && await harmony_collectScore(taskToken, taskId, itemId, 0, 1e3 * parseInt(browseTime))
                }
                catch (e) {
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
                    false,
                    timeout || console.log("\n开始抽奖"),
                    0 === (data = JSON.parse(data)).data.bizCode ? (data.data.result.userAwardsCacheDto.jBeanAwardVo && (merge.jdBeans.success++, console.log("京豆:" + data.data.result.userAwardsCacheDto.jBeanAwardVo.quantity), merge.jdBeans.prizeCount += parseInt(data.data.result.userAwardsCacheDto.jBeanAwardVo.quantity)), data.data.result.userAwardsCacheDto.redPacketVO && (merge.redPacket.show = !0, merge.redPacket.success++, console.log("红包:" + data.data.result.userAwardsCacheDto.redPacketVO.value), merge.redPacket.prizeCount += parseFloat(data.data.result.userAwardsCacheDto.redPacketVO.value)), data.data.result.raiseInfo && (scorePerLottery = parseInt(data.data.result.raiseInfo.nextLevelScore)), parseInt(data.data.result.userScore) >= scorePerLottery && scorePerLottery && await interact_template_getLotteryResult(1e3)) : (merge.jdBeans.fail++, console.log(data.data.bizMsg), 111 === data.data.bizCode && (data.data.bizMsg = "无机会"), merge.jdBeans.notify = `${data.data.bizMsg}`)
                }
                catch (e) {
                    $.logErr(e, resp)
                } finally {
                    resolve()
                }
            }))
        }), timeout)
    }))
}

function requireConfig() {
    return new Promise((resolve => {
        const jdCookieNode = $.isNode() ? require("./jdCookie.js") : "";
        if ($.isNode()) Object.keys(jdCookieNode).forEach((item => {
            jdCookieNode[item] && cookiesArr.push(jdCookieNode[item])
        }));
        else {
            let cookiesData = $.getdata("CookiesJD") || "[]";
            cookiesData = jsonParse(cookiesData), cookiesArr = cookiesData.map((item => item.cookie)), cookiesArr.reverse(), cookiesArr.push($.getdata("CookieJD2"), $.getdata("CookieJD")), cookiesArr.reverse(), cookiesArr = cookiesArr.filter((item => "" !== item && null != item))
        }
        console.log(`共${cookiesArr.length}个京东账号\n`), resolve()
    }))
}

function jsonParse(str) {
    if ("string" == typeof str) try {
        return JSON.parse(str)
    } catch (e) {
        return console.log(e), $.msg($.name, "", "请勿随意在BoxJs输入框修改内容\n建议通过脚本去获取cookie"), []
    }
}

function initial() {
    merge = {
        nickname: "",
        enabled: !0,
        redPacket: {
            prizeDesc: "抽得|红包|元",
            number: !0,
            fixed: 2
        },
        jdBeans: {
            prizeDesc: "抽得|京豆|个",
            number: !0,
            fixed: 0
        }
    };
    for (let i in merge) merge[i].success = 0, merge[i].fail = 0, merge[i].prizeCount = 0, merge[i].notify = "", merge[i].show = !0;
    merge.redPacket.show = !1
}

function msgShow() {
    let message = "",
        url = {
            "open-url": "openapp.jdmobile://virtual?params=%7B%22category%22%3A%22jump%22%2C%22des%22%3A%22m%22%2C%22url%22%3A%22https%3A%2F%2Fbean.m.jd.com%2FbeanDetail%2Findex.action%3FresourceValue%3Dbean%22%7D"
        },
        title = `京东账号：${merge.nickname}`;
    for (let i in merge) "object" == typeof merge[i] && merge[i].show && ("\n" === merge[i].notify.split("").reverse()[0] && (merge[i].notify = merge[i].notify.substr(0, merge[i].notify.length - 1)), message += `${merge[i].prizeDesc.split("|")[0]}${merge[i].prizeDesc.split("|")[1]}：` + (merge[i].success ? `${merge[i].prizeCount.toFixed(merge[i].fixed)}${merge[i].prizeDesc.split("|")[2]}\n` : `失败：${merge[i].notify}\n`));
    message += "请点击通知跳转至APP查看", $.msg($.name, title, message, url)
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
    if (await requireConfig(), cookiesArr[0]) {
        for (let i = 0; i < cookiesArr.length; i++)
            if (cookie = cookiesArr[i], cookie) {
                if (i && console.log(`\n***************开始京东账号${i+1}***************`), initial(), await QueryJDUserInfo(), !merge.enabled) {
                    $.setdata("", `CookieJD${i?i+1:""}`), $.msg($.name, `【提示】京东账号${i+1} cookie已过期！请先获取cookie\n直接使用NobyDa的京东签到获取`, "https://bean.m.jd.com/", {
                        "open-url": "https://bean.m.jd.com/"
                    });
                    continue
                }
                for (let j in appIdArr) appId = appIdArr[j], shareCode = shareCodeArr[j], homeDataFunPrefix = homeDataFunPrefixArr[j] || "healthyDay", collectScoreFunPrefix = collectScoreFunPrefixArr[j] || "harmony", lotteryResultFunPrefix = lotteryResultFunPrefixArr[j] || "interact_template", browseTime = 6, parseInt(j) && console.log(`\n开始第${parseInt(j)+1}个抽奖活动`), await interact_template_getHomeData();
                await msgShow()
            }
    } else $.msg($.name, "【提示】请先获取cookie\n直接使用NobyDa的京东签到获取", "https://bean.m.jd.com/", {
        "open-url": "https://bean.m.jd.com/"
    })
})().catch((e => $.logErr(e))).finally((() => $.done()));