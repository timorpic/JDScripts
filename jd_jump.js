const $ = new Env("跳跳乐瓜分京豆_Timorpic"),
    notify = $.isNode() ? require("./sendNotify") : "",
    jdCookieNode = $.isNode() ? require("./jdCookie.js") : "";
let cookiesArr = [],
    cookie = "";
async function jump() {
    if ($.nowTime = (new Date).getTime() + 60 * (new Date).getTimezoneOffset() * 1e3 + 288e5, $.jumpList = [], await getGameList(), 0 !== $.jumpList.length) {
        await $.wait(1e3);
        for (let i = 0; i < $.jumpList.length; i++) {
            $.jumpId = $.jumpList[i].id, $.oneJumpInfo = {}, $.rewardList = [];
            let oldReward = 0,
                newReward = 0;
            if (await getOneJumpInfo(), "{}" === JSON.stringify($.oneJumpInfo)) {
                console.log(`获取ID为${$.jumpId}的活动详情失败`);
                continue
            }
            if ($.jumpName = $.oneJumpInfo.jumpActivityDetail.name, "received" === $.oneJumpInfo.userInfo.userState) {
                console.log(`${$.jumpName},活动已结束，已参与瓜分`), console.log("\n");
                continue
            }
            if ("unreceive" === $.oneJumpInfo.userInfo.userState) {
                $.shareBean = 0, console.log(`${$.jumpName},瓜分京豆`), await receive(), await $.wait(2e3), await rewards(), console.log(`瓜分获得${$.shareBean}京豆\n`);
                continue
            }
            if ($.nowTime > $.oneJumpInfo.jumpActivityDetail.endTime) {
                console.log(`${$.jumpName},活动已结束`), console.log("\n");
                continue
            }
            if ("complete" === $.oneJumpInfo.userInfo.userState) {
                console.log(`${$.jumpName},已到达终点，等待瓜分，瓜分时间：${new Date($.oneJumpInfo.jumpActivityDetail.endTime)} 之后`), console.log("\n");
                break
            }
            if ("playing" !== $.oneJumpInfo.userInfo.userState) {
                console.log("异常");
                continue
            }
            console.log(`开始执行活动：${$.jumpName}，活动时间：${new Date($.oneJumpInfo.jumpActivityDetail.startTime).toLocaleString()}至${new Date($.oneJumpInfo.jumpActivityDetail.endTime).toLocaleString()}`), await $.wait(1e3), await getBeanRewards(), oldReward = await getReward(), console.log(`已获得京豆：${oldReward}`), await $.wait(1e3), $.taskList = [], await getTaskList(), await $.wait(1e3), await doTask(), !1 === $.oneJumpInfo.userInfo.gridTaskDone && await domission(), await $.wait(1e3), await getOneJumpInfo();
            let flag = !0;
            0 === $.oneJumpInfo.userInfo.diceLeft && console.log("骰子数量为0");
            let runTime = 0;
            for (; $.oneJumpInfo.userInfo.diceLeft > 0 && flag && runTime < 10 && (await throwDice(), !$.gridType || "boom" !== $.gridType && "road_block" !== $.gridType && "join_member" !== $.gridType && "add_cart" !== $.gridType);) {
                switch (await $.wait(3e3), $.gridType) {
                    case "give_dice":
                    case "empty":
                    case "lose_dice":
                    case "cart_bean":
                    case "arrow":
                        break;
                    case "go_back":
                    case "go_ahead":
                        await throwDice(), await $.wait(2e3), await getOneJumpInfo(), !1 === $.oneJumpInfo.userInfo.gridTaskDone && await domission();
                        break;
                    case "follow_channel":
                    case "scan_good":
                    case "add_cart":
                    case "join_member":
                    case "boom":
                    case "road_block":
                    case "follow_shop":
                        await domission();
                        break;
                    case "destination":
                        flag = !1, console.log("到达终点");
                        break;
                    default:
                        flag = !1, console.log("未判断情况")
                }
                await $.wait(2e3), await getOneJumpInfo(), runTime++
            }
            newReward = await getReward(), console.log(`执行结束,本次执行获得${newReward-oldReward}京豆,共获得${newReward}京豆`), console.log("\n"), await $.wait(2e3)
        }
    } else console.log("获取活动列表失败，请等待下一期活动\n")
}
async function rewards() {
    const myRequest = getGetRequest("rewards", `activityId=${$.jumpId}`);
    return new Promise((async resolve => {
        $.get(myRequest, ((err, resp, data) => {
            try {
                if (data && !0 === (data = JSON.parse(data)).success) {
                    let rewardList = data.datas;
                    for (let i = 0; i < rewardList.length; i++) rewardList[i].activityId === $.jumpId && ($.shareBean = rewardList[i].shareBean)
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve()
            }
        }))
    }))
}
async function getReward() {
    await getBeanRewards();
    let reward = 0;
    for (let j = 0; j < $.rewardList.length; j++) reward += Number($.rewardList[j].value);
    return reward
}
async function domission() {
    console.log("执行骰子任务");
    const myRequest = getGetRequest("doTask", `activityId=${$.jumpId}`);
    return new Promise((async resolve => {
        $.get(myRequest, ((err, resp, data) => {
            resolve()
        }))
    }))
}
async function throwDice() {
    console.log("丢骰子");
    const myRequest = getGetRequest("throwDice", `activityId=${$.jumpId}&fp=&eid=`);
    return new Promise((async resolve => {
        $.get(myRequest, ((err, resp, data) => {
            try {
                data && (data = JSON.parse(data), $.gridType = data.data.gridInfo && data.data.gridInfo.gridType, console.log(`丢骰子结果：${$.gridType}`))
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve($.gridType)
            }
        }))
    }))
}
async function getBeanRewards() {
    const myRequest = getGetRequest("getBeanRewards", `activityId=${$.jumpId}`);
    return new Promise((async resolve => {
        $.get(myRequest, ((err, resp, data) => {
            try {
                data && (data = JSON.parse(data), $.rewardList = data.datas)
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve()
            }
        }))
    }))
}
async function doTask() {
    let addFlag = !0;
    for (let i = 0; i < $.taskList.length; i++) {
        let oneTask = $.taskList[i];
        if ("finished" !== oneTask.state) {
            if ("add_cart" === oneTask.gridTask && "unfinish" === oneTask.state && addFlag) {
                if ("add_cart" === oneTask.gridTask) {
                    console.log(`不做：【${oneTask.content}】 任务`);
                    continue
                }
                console.log(`开始执行任务：${oneTask.content}`);
                let skuList = [];
                for (let j = 0; j < oneTask.goodsInfo.length; j++) skuList.push(oneTask.goodsInfo[j].sku);
                skuList.sort(sortNumber), await addCart(skuList), addFlag = !1
            }
        } else console.log(`${oneTask.content},已完成`)
    }
}
async function addCart(skuList) {
    const myRequest = getPostRequest("addCart", `{"activityId":"${$.jumpId}","skuList":${JSON.stringify(skuList)}}`);
    return new Promise((async resolve => {
        $.post(myRequest, ((err, resp, data) => {
            try {
                data && !0 === (data = JSON.parse(data)).success && console.log("任务执行成功")
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve()
            }
        }))
    }))
}
async function getTaskList() {
    const myRequest = getGetRequest("getTools", `activityId=${$.jumpId}&reqSource=h5`);
    return new Promise((async resolve => {
        $.get(myRequest, ((err, resp, data) => {
            try {
                data && !0 === (data = JSON.parse(data)).success && ($.taskList = data.datas)
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve()
            }
        }))
    }))
}
async function receive() {
    const myRequest = getGetRequest("receive", `activityId=${$.jumpId}`);
    return new Promise((async resolve => {
        $.get(myRequest, ((err, resp, data) => {
            try {
                data && !0 === (data = JSON.parse(data)).success && console.log("瓜分成功")
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve()
            }
        }))
    }))
}
async function getOneJumpInfo() {
    const myRequest = getGetRequest("getHomeInfo", `activityId=${$.jumpId}`);
    return new Promise((async resolve => {
        $.get(myRequest, ((err, resp, data) => {
            try {
                data && !0 === (data = JSON.parse(data)).success && ($.oneJumpInfo = data.data)
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve()
            }
        }))
    }))
}
async function getGameList() {
    const myRequest = getGetRequest("getGameList", "pageSize=8&pageNum=1");
    return new Promise((async resolve => {
        $.get(myRequest, ((err, resp, data) => {
            try {
                data && !0 === (data = JSON.parse(data)).success && ($.jumpList = data.datas)
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve()
            }
        }))
    }))
}

function getGetRequest(type, body) {
    return {
        url: `https://jdjoy.jd.com/jump/${type}?${body}`,
        method: "GET",
        headers: {
            Cookie: cookie,
            Accept: "*/*",
            Connection: "keep-alive",
            Referer: "https://jdjoy.jd.com/dist/taro/index.html/",
            "Accept-Encoding": "gzip, deflate, br",
            Host: "jdjoy.jd.com",
            "User-Agent": $.isNode() ? process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : require("./USER_AGENTS").USER_AGENT : $.getdata("JDUA") ? $.getdata("JDUA") : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1",
            "Accept-Language": "zh-cn"
        }
    }
}

function getPostRequest(type, body) {
    const url = `https://jdjoy.jd.com/jump/${type}`,
        headers = {
            Accept: "*/*",
            Origin: "https://jdjoy.jd.com",
            "Accept-Encoding": "gzip, deflate, br",
            Cookie: cookie,
            "Content-Type": "application/json",
            Host: "jdjoy.jd.com",
            Connection: "keep-alive",
            "User-Agent": $.isNode() ? process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : require("./USER_AGENTS").USER_AGENT : $.getdata("JDUA") ? $.getdata("JDUA") : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1",
            Referer: "https://jdjoy.jd.com/dist/taro/index.html/",
            "Accept-Language": "zh-cn"
        };
    return myRequest = {
        url: url,
        method: "POST",
        headers: headers,
        body: body
    }
}

function sortNumber(a, b) {
    return a - b
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
}
$.isNode() ? (Object.keys(jdCookieNode).forEach((item => {
    cookiesArr.push(jdCookieNode[item])
})), process.env.JD_DEBUG && "false" === process.env.JD_DEBUG && (console.log = () => {})) : cookiesArr = [$.getdata("CookieJD"), $.getdata("CookieJD2"), ...$.toObj($.getdata("CookiesJD") || "[]").map((item => item.cookie))].filter((item => !!item)), (async () => {
    if (cookiesArr[0]) {
        console.log("注：脚本好像还是会加商品到购物车，慎使用。\n");
        for (let i = 0; i < cookiesArr.length; i++)
            if (cookiesArr[i]) {
                if (cookie = cookiesArr[i], $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1]), $.index = i + 1, $.isLogin = !0, $.nickName = "", await TotalBean(), console.log(`\n*****开始【京东账号${$.index}】${$.nickName||$.UserName}*****\n`), !$.isLogin) {
                    $.msg($.name, "【提示】cookie已失效", `京东账号${$.index} ${$.nickName||$.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, {
                        "open-url": "https://bean.m.jd.com/bean/signIndex.action"
                    }), $.isNode() && await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
                    continue
                }
                await jump()
            }
    } else $.msg($.name, "【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取", "https://bean.m.jd.com/bean/signIndex.action", {
        "open-url": "https://bean.m.jd.com/bean/signIndex.action"
    })
})().catch((e => {
    $.log("", `❌ ${$.name}, 失败! 原因: ${e}!`, "")
})).finally((() => {
    $.done()
}));