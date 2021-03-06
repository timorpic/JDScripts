const $ = new Env("限时抢京豆_Timorpic"),
    jdCookieNode = $.isNode() ? require("./jdCookie.js") : "";
let cookiesArr = [];
$.isNode() ? (Object.keys(jdCookieNode).forEach((item => {
    cookiesArr.push(jdCookieNode[item])
})), process.env.JD_DEBUG && "false" === process.env.JD_DEBUG && (console.log = () => {})) : cookiesArr = [$.getdata("CookieJD"), $.getdata("CookieJD2"), ...$.toObj($.getdata("CookiesJD") || "[]").map((item => item.cookie))].filter((item => !!item));
let ownCode = {},
    mainPin = "",
    codeList = [],
    autoCode = "";
async function help(ck) {
    let userName = decodeURIComponent(ck.match(/pt_pin=(.+?);/) && ck.match(/pt_pin=(.+?);/)[1]);
    if (userName === ownCode.user) {
        if (autoCode) {
            console.log("\n助力作者");
            let getInfo = await takeRequest("smt_newFission_taskFlag", `&body=%7B%22taskType%22%3A%222%22%2C%22operateType%22%3A%221%22%2C%22assistId%22%3A%22${autoCode}%22%7D`, ck);
            if (await $.wait(1e3), "1" === getInfo.assistFlag) {
                let doInfo = await takeRequest("smt_newFission_doAssignment", "&body=%7B%22projectId%22%3A%22jYRegTcZ8KBe7ZgK4xpgGjec9FX%22%2C%22assignmentId%22%3A%223RLQByzBcfWFeBXhpqGZWed2pvXT%22%2C%22itemId%22%3A%22Sv_VwQBwY91bUPRjxlfEMcg%22%2C%22type%22%3A%222%22%7D", ck);
                console.log(JSON.stringify(doInfo))
            } else console.log("已助力过或者无次数")
        }
    } else {
        console.log(`\n${userName} 助力 ${ownCode.user}`);
        let getInfo = await takeRequest("smt_newFission_taskFlag", `&body=%7B%22taskType%22%3A%222%22%2C%22operateType%22%3A%221%22%2C%22assistId%22%3A%22${ownCode.itemId}%22%7D`, ck);
        if (console.log(JSON.stringify(getInfo)), await $.wait(1e3), "1" === getInfo.assistFlag) {
            let doInfo = await takeRequest("smt_newFission_doAssignment", `&body=%7B%22projectId%22%3A%22${ownCode.projectId}%22%2C%22assignmentId%22%3A%22${ownCode.assignmentId}%22%2C%22itemId%22%3A%22${ownCode.itemId}%22%2C%22type%22%3A%22${ownCode.type}%22%7D`, ck);
            console.log(JSON.stringify(doInfo))
        } else console.log("已助力过或者无次数")
    }
    await $.wait(1e3)
}
async function main(ck) {
    let userName = decodeURIComponent(ck.match(/pt_pin=(.+?);/) && ck.match(/pt_pin=(.+?);/)[1]),
        mainInfo = await takeRequest("smt_newFission_index", "&body=", ck);
    if ("{}" === JSON.stringify(mainInfo)) return void console.log(`${userName},初始化失败`);
    console.log(`${userName},初始化成功`);
    let taskInfoList = mainInfo.taskInfoList,
        projectId = mainInfo.projectId,
        userBoxInfoVoList = mainInfo.userBoxInfoVoList;
    for (let i = 0; i < taskInfoList.length; i++) {
        let oneTask = taskInfoList[i];
        if (oneTask.completionFlag) console.log(`${userName},任务：${oneTask.assignmentName},已完成`);
        else {
            if ("1" === oneTask.type) {
                console.log(`${userName},任务：${oneTask.assignmentName},去执行`);
                let doInfo = await takeRequest("smt_newFission_doAssignment", `&body=%7B%22projectId%22%3A%22${projectId}%22%2C%22assignmentId%22%3A%22${oneTask.assignmentId}%22%2C%22itemId%22%3A%22%22%2C%22type%22%3A%22${oneTask.type}%22%7D`, ck);
                console.log(`${userName},任务：${oneTask.assignmentName},执行结果，${doInfo.msg||""}`), await $.wait(2e3)
            }
            if ("2" === oneTask.type && (codeList.push(oneTask.assistId), "{}" === JSON.stringify(ownCode) && mainPin === userName && (ownCode = {
                    user: userName,
                    projectId: projectId,
                    assignmentId: oneTask.assignmentId,
                    itemId: oneTask.assistId,
                    type: 2
                })), "3" === oneTask.type || "6" === oneTask.type) {
                console.log(`${userName},任务：${oneTask.assignmentName},已完成：${oneTask.completionCnt}次，需要完成：${oneTask.assignmentTimesLimit}次`);
                let subist = oneTask.ext;
                for (let j = 0; j < subist.length; j++) {
                    let oneItem = subist[j];
                    if (1 !== oneItem.status) continue;
                    console.log(`${userName},任务：${oneTask.assignmentName},${oneItem.shopName||oneItem.title}去执行`);
                    let doInfo = await takeRequest("smt_newFission_doAssignment", `&body=%7B%22projectId%22%3A%22${projectId}%22%2C%22assignmentId%22%3A%22${oneTask.assignmentId}%22%2C%22itemId%22%3A%22${oneItem.itemId}%22%2C%22type%22%3A%22${oneTask.type}%22%7D`, ck);
                    console.log(`${userName},任务：${oneTask.assignmentName},执行结果，${doInfo.msg||""}`), await $.wait(2e3)
                }
            }
        }
    }
    mainInfo = await takeRequest("smt_newFission_index", "&body=", ck), await $.wait(1e3);
    for (let i = 0; i < userBoxInfoVoList.length; i++) {
        let oneBox = userBoxInfoVoList[i];
        if (!oneBox.hadOpened && 0 === Number(oneBox.needScore)) {
            console.log(`${userName},领取：${oneBox.bean}京豆`);
            let beanInfo = await takeRequest("smt_newFission_openBox", `&body=%7B%22boxId%22%3A%22${oneBox.id}%22%7D`, ck);
            1 === beanInfo.status ? console.log(`${userName},领取：${oneBox.bean}京豆,成功`) : (console.log(`${userName},领取：${oneBox.bean}京豆,失败`), console.log(JSON.stringify(beanInfo))), await $.wait(2e3)
        }
    }
}
async function takeRequest(functionId, body, ck) {
    let myRequest = {
        url: `https://api.m.jd.com/client.action?functionId=${functionId}${body}&clientVersion=10.0.1&appid=smtTimeLimitFission`,
        headers: {
            Authority: "api.m.jd.com",
            Accept: "application/json",
            Origin: "https://h5.m.jd.com",
            Cookie: ck,
            "user-agent": $.isNode() ? process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : require("./USER_AGENTS").USER_AGENT : $.getdata("JDUA") ? $.getdata("JDUA") : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1",
            "Accept-Language": "zh-cn",
            Referer: "https://h5.m.jd.com/babelDiy/Zeus/3fCUZv7USx24U1zzhLdFV4oDQ37b/index.html"
        }
    };
    return new Promise((async resolve => {
        $.get(myRequest, ((err, resp, data) => {
            try {
                err ? console.log(err) : data = JSON.parse(data)
            } catch (e) {
                console.log(data), $.logErr(e, resp)
            } finally {
                resolve(data.result || {})
            }
        }))
    }))
}

function getAuthorShareCode(url) {
    return new Promise((resolve => {
        const options = {
            url: `${url}?${new Date}`,
            timeout: 1e4,
            headers: {
                "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1 Edg/87.0.4280.88"
            }
        };
        if ($.isNode() && process.env.TG_PROXY_HOST && process.env.TG_PROXY_PORT) {
            const agent = {
                https: require("tunnel").httpsOverHttp({
                    proxy: {
                        host: process.env.TG_PROXY_HOST,
                        port: 1 * process.env.TG_PROXY_PORT
                    }
                })
            };
            Object.assign(options, {
                agent: agent
            })
        }
        $.get(options, (async (err, resp, data) => {
            try {
                err || data && (data = JSON.parse(data))
            } catch (e) {} finally {
                resolve(data)
            }
        }))
    }))
}

function getRandomArrayElements(arr, count) {
    for (var temp, index, shuffled = arr.slice(0), i = arr.length, min = i - count; i-- > min;) temp = shuffled[index = Math.floor((i + 1) * Math.random())], shuffled[index] = shuffled[i], shuffled[i] = temp;
    return shuffled.slice(min)
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
    if (!cookiesArr[0]) return void $.msg($.name, "【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取", "https://bean.m.jd.com/bean/signIndex.action", {
        "open-url": "https://bean.m.jd.com/bean/signIndex.action"
    });
    if (Date.now() > 1634832e6) return void console.log("活动结束");
    let res = [];
    try {
        res = await getAuthorShareCode("https://raw.githubusercontent.com/asd920/updateTeam/main/shareCodes/shop.json")
    } catch (e) {}
    if (!res) {
        try {
            res = await getAuthorShareCode("https://raw.fastgit.org/asd920/updateTeam/main/shareCodes/shop.json")
        } catch (e) {}
        res || (res = [])
    }
    if (res.length > 0 && (autoCode = getRandomArrayElements(res, 1)[0]), mainPin = decodeURIComponent(cookiesArr[0].match(/pt_pin=(.+?);/) && cookiesArr[0].match(/pt_pin=(.+?);/)[1]), cookiesArr.length > 0) {
        const promiseArr = cookiesArr.map(((ck, index) => main(ck)));
        await Promise.all(promiseArr)
    }
    "{}" !== JSON.stringify(ownCode) && console.log(JSON.stringify(codeList))
})().catch((e => {
    $.log("", `❌ ${$.name}, 失败! 原因: ${e}!`, "")
})).finally((() => {
    $.done()
}));