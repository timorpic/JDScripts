const $ = new Env("金榜创造营_Timorpic"),
    notify = $.isNode() ? require("./sendNotify") : "",
    jdCookieNode = $.isNode() ? require("./jdCookie.js") : "";
let message, cookiesArr = [],
    cookie = "";
$.isNode() ? (Object.keys(jdCookieNode).forEach((item => {
    cookiesArr.push(jdCookieNode[item])
})), process.env.JD_DEBUG && "false" === process.env.JD_DEBUG && (console.log = () => {}), JSON.stringify(process.env).indexOf("GITHUB") > -1 && process.exit(0)) : cookiesArr = [$.getdata("CookieJD"), $.getdata("CookieJD2"), ...$.toObj($.getdata("CookiesJD") || "[]").map((item => item.cookie))].filter((item => !!item));
const JD_API_HOST = "https://api.m.jd.com/client.action";
async function main() {
    try {
        await goldCreatorTab(), await getDetail(), await goldCreatorPublish(), await showMsg()
    } catch (e) {
        $.logErr(e)
    }
}

function showMsg() {
    return new Promise((resolve => {
        $.beans && (message += `本次运行获得${$.beans}京豆`, $.msg($.name, "", `【京东账号${$.index}】${$.UserName||$.nickName}\n${message}`)), resolve()
    }))
}
async function getDetail() {
    $.subTitleInfos = $.subTitleInfos.filter((vo => !!vo && "0" === vo.hasVoted));
    for (let item of $.subTitleInfos) console.log(`\n开始给【${item.longTitle}】主题下的商品进行投票`), await goldCreatorDetail(item.matGrpId, item.subTitleId, item.taskId, item.batchId), await $.wait(2e3)
}

function goldCreatorTab() {
    return $.subTitleInfos = [], new Promise((resolve => {
        const options = taskUrl("goldCreatorTab", {
            subTitleId: "",
            isPrivateVote: "0"
        });
        $.get(options, (async (err, resp, data) => {
            try {
                if (err) console.log(`${JSON.stringify(err)}`), console.log(`${$.name} goldCreatorDetail API请求失败，请检查网路重试`);
                else if (safeGet(data))
                    if ("0" === (data = JSON.parse(data)).code) {
                        $.subTitleInfos = data.result.subTitleInfos || [];
                        let unVoted = $.subTitleInfos.length;
                        console.log(`共有${$.subTitleInfos.length}个主题`), $.stageId = data.result.mainTitleHeadInfo.stageId, $.advGrpId = data.result.mainTitleHeadInfo.advGrpId, await goldCreatorDetail($.subTitleInfos[0].matGrpId, $.subTitleInfos[0].subTitleId, $.subTitleInfos[0].taskId, $.subTitleInfos[0].batchId, !0), $.subTitleInfos = $.subTitleInfos.filter((vo => !!vo && "0" === vo.hasVoted)), console.log(`已投票${unVoted-$.subTitleInfos.length}主题\n`)
                    } else console.log(`goldCreatorTab 异常：${JSON.stringify(data)}`)
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve()
            }
        }))
    }))
}

function goldCreatorDetail(groupId, subTitleId, taskId, batchId, flag = !1) {
    return $.skuList = [], $.taskList = [], $.remainVotes = 0, new Promise((resolve => {
        const options = taskUrl("goldCreatorDetail", {
            groupId: groupId,
            stageId: $.stageId,
            subTitleId: subTitleId,
            batchId: batchId,
            skuId: "",
            taskId: Number(taskId)
        });
        $.get(options, (async (err, resp, data) => {
            try {
                err ? (console.log(`${JSON.stringify(err)}`), console.log(`${$.name} goldCreatorDetail API请求失败，请检查网路重试`)) : safeGet(data) && ("0" === (data = JSON.parse(data)).code ? ($.remainVotes = data.result.remainVotes || 0, $.skuList = data.result.skuList || [], $.taskList = data.result.taskList || [], $.signTask = data.result.signTask, flag ? await doTask2(batchId) : (console.log(`当前剩余投票次数：${$.remainVotes}`), await doTask(subTitleId, taskId, batchId))) : console.log(`goldCreatorDetail 异常：${JSON.stringify(data)}`))
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve()
            }
        }))
    }))
}
async function doTask(subTitleId, taskId, batchId) {
    $.skuList = $.skuList.filter((vo => !!vo && 0 === vo.isVoted));
    let randIndex = Math.floor(Math.random() * $.skuList.length);
    console.log(`给 【${$.skuList[randIndex].name}】 商品投票`);
    const body = {
        stageId: $.stageId,
        subTitleId: subTitleId,
        skuId: $.skuList[randIndex].skuId,
        taskId: Number(taskId),
        itemId: "1",
        rankId: $.skuList[randIndex].rankId,
        type: 1,
        batchId: batchId
    };
    await goldCreatorDoTask(body)
}
async function doTask2(batchId) {
    for (let task of $.taskList) {
        task = task.filter((vo => !!vo && 1 === vo.taskStatus));
        for (let item of task) {
            console.log(`\n做额外任务：${item.taskName}`);
            const body = {
                taskId: item.taskId,
                itemId: item.taskItemInfo.itemId,
                type: item.taskType,
                batchId: batchId
            };
            1 === item.taskType && (body.type = 2), await goldCreatorDoTask(body), await $.wait(2e3)
        }
    }
    if (1 === $.signTask.taskStatus) {
        const body = {
            taskId: $.signTask.taskId,
            itemId: $.signTask.taskItemInfo.itemId,
            type: $.signTask.taskType,
            batchId: batchId
        };
        await goldCreatorDoTask(body)
    }
}

function goldCreatorDoTask(body) {
    return new Promise((resolve => {
        const options = taskUrl("goldCreatorDoTask", body);
        $.get(options, (async (err, resp, data) => {
            try {
                err ? (console.log(`${JSON.stringify(err)}`), console.log(`${$.name} goldCreatorDetail API请求失败，请检查网路重试`)) : safeGet(data) && ("0" === (data = JSON.parse(data)).code ? "0" === data.result.taskCode ? (console.log(`成功，获得 ${data.result.lotteryScore}京豆\n`), data.result.lotteryScore && ($.beans += parseInt(data.result.lotteryScore))) : console.log(`失败：${data.result.taskMsg}\n`) : console.log(`失败：${JSON.stringify(data)}\n`))
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve()
            }
        }))
    }))
}

function goldCreatorPublish() {
    return new Promise((resolve => {
        $.get(taskUrl("goldCreatorPublish"), (async (err, resp, data) => {
            try {
                err ? (console.log(`${JSON.stringify(err)}`), console.log(`${$.name} goldCreatorPublish API请求失败，请检查网路重试`)) : safeGet(data) && ("0" === (data = JSON.parse(data)).code ? "0" === data.result.subCode && console.log("0" === data.result.lotteryResult.lotteryCode ? `揭榜成功：获得${data.result.lotteryResult.lotteryScore}京豆` : "揭榜成功：获得空气~") : console.log(`揭榜失败：${JSON.stringify(data)}`))
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve()
            }
        }))
    }))
}

function taskUrl(function_id, body = {}) {
    return {
        url: `${JD_API_HOST}?functionId=${function_id}&body=${escape(JSON.stringify(body))}&appid=content_ecology&clientVersion=10.0.0&client=wh5&eufv=false&uuid=`,
        headers: {
            Accept: "*/*",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "zh-cn",
            Connection: "keep-alive",
            "Content-Type": "application/x-www-form-urlencoded",
            Host: "api.m.jd.com",
            Referer: "https://h5.m.jd.com/",
            Cookie: cookie,
            "User-Agent": $.isNode() ? process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : require("./USER_AGENTS").USER_AGENT : $.getdata("JDUA") ? $.getdata("JDUA") : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"
        }
    }
}

function TotalBean() {
    return new Promise((async resolve => {
        const options = {
            url: "https://wq.jd.com/user_new/info/GetJDUserInfoUnion?sceneval=2",
            headers: {
                Host: "wq.jd.com",
                Accept: "*/*",
                Connection: "keep-alive",
                Cookie: cookie,
                "User-Agent": $.isNode() ? process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : require("./USER_AGENTS").USER_AGENT : $.getdata("JDUA") ? $.getdata("JDUA") : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1",
                "Accept-Language": "zh-cn",
                Referer: "https://home.m.jd.com/myJd/newhome.action?sceneval=2&ufc=&",
                "Accept-Encoding": "gzip, deflate, br"
            }
        };
        $.get(options, ((err, resp, data) => {
            try {
                if (err) $.logErr(err);
                else if (data) {
                    if (1001 === (data = JSON.parse(data)).retcode) return void($.isLogin = !1);
                    0 === data.retcode && data.data && data.data.hasOwnProperty("userInfo") && ($.nickName = data.data.userInfo.baseInfo.nickname)
                } else console.log("京东服务器返回空数据")
            } catch (e) {
                $.logErr(e)
            } finally {
                resolve()
            }
        }))
    }))
}

function safeGet(data) {
    try {
        if ("object" == typeof JSON.parse(data)) return !0
    } catch (e) {
        return console.log(e), console.log("京东服务器访问数据为空，请检查自身设备网络情况"), !1
    }
}

function Env(t, e) {
    "undefined" != typeof process && JSON.stringify(process.env).indexOf("GITHUB") > -1 && process.exit(0);
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
                const [o, h] = i.split("@"), n = {
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
                this.post(n, ((t, e, i) => s(i)))
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
        time(t, e = null) {
            const s = e ? new Date(e) : new Date;
            let i = {
                "M+": s.getMonth() + 1,
                "d+": s.getDate(),
                "H+": s.getHours(),
                "m+": s.getMinutes(),
                "s+": s.getSeconds(),
                "q+": Math.floor((s.getMonth() + 3) / 3),
                S: s.getMilliseconds()
            };
            /(y+)/.test(t) && (t = t.replace(RegExp.$1, (s.getFullYear() + "").substr(4 - RegExp.$1.length)));
            for (let e in i) new RegExp("(" + e + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? i[e] : ("00" + i[e]).substr(("" + i[e]).length)));
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
}(async () => {
    if (cookiesArr[0]) {
        for (let i = 0; i < cookiesArr.length; i++)
            if (cookiesArr[i]) {
                if (cookie = cookiesArr[i], $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1]), $.index = i + 1, $.isLogin = !0, $.beans = 0, $.nickName = "", message = "", await TotalBean(), console.log(`\n******开始【京东账号${$.index}】${$.nickName||$.UserName}*********\n`), !$.isLogin) {
                    $.msg($.name, "【提示】cookie已失效", `京东账号${$.index} ${$.nickName||$.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/`, {
                        "open-url": "https://bean.m.jd.com/"
                    }), $.isNode() ? await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`) : $.setdata("", `CookieJD${i?i+1:""}`);
                    continue
                }
                await main()
            }
    } else $.msg($.name, "【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取", "https://bean.m.jd.com/", {
        "open-url": "https://bean.m.jd.com/"
    })
})().catch((e => {
    $.log("", `❌ ${$.name}, 失败! 原因: ${e}!`, "")
})).finally((() => {
    $.done()
}));