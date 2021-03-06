const $ = new Env("汪汪乐园养joy_Timorpic"),
    jdCookieNode = $.isNode() ? require("./jdCookie.js") : "",
    notify = $.isNode() ? require("./sendNotify") : "";
let cookiesArr = [],
    cookie = "";
$.isNode() ? (Object.keys(jdCookieNode).forEach((item => {
    cookiesArr.push(jdCookieNode[item])
})), process.env.JD_DEBUG && "false" === process.env.JD_DEBUG && (console.log = () => {})) : cookiesArr = [$.getdata("CookieJD"), $.getdata("CookieJD2"), ...jsonParse($.getdata("CookiesJD") || "[]").map((item => item.cookie))].filter((item => !!item)), $.JOY_COIN_MAXIMIZE = "1" === process.env.JOY_COIN_MAXIMIZE, $.log(`最大化收益模式: 已${$.JOY_COIN_MAXIMIZE?"默认已开启":"关闭"}  `);
const JD_API_HOST = "https://api.m.jd.com/client.action";
async function getJoyBaseInfo(taskId = "", inviteType = "", inviterPin = "", printLog = !1) {
    return new Promise((resolve => {
        $.post(taskPostClientActionUrl(`body={"taskId":"${taskId}","inviteType":"${inviteType}","inviterPin":"${inviterPin}","linkId":"LsQNxL7iWDlXUs6cFl-AAg"}&appid=activities_platform`, "joyBaseInfo"), (async (err, resp, data) => {
            try {
                err ? (console.log(`${JSON.stringify(err)}`), console.log(`${$.name} getJoyBaseInfo API请求失败，请检查网路重试`)) : (data = JSON.parse(data), printLog && ($.log(`等级: ${data.data.level}|金币: ${data.data.joyCoin}`), data.data.level >= 30 && $.isNode() && (await notify.sendNotify(`${$.name} - 账号${$.index} - ${$.nickName}`, `【京东账号${$.index}】${$.nickName||$.UserName}\n当前等级: ${data.data.level}\n已达到单次最高等级奖励\n请尽快前往活动查看领取\n活动入口：京东极速版APP->汪汪乐园\n更多脚本->"https://github.com/timorpic/JDScripts"`), $.log("\n开始解锁新场景...\n"), await doJoyRestart())), $.joyBaseInfo = data.data)
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve($.joyBaseInfo)
            }
        }))
    }))
}

function getJoyList(printLog = !1) {
    return new Promise((resolve => {
        $.get(taskGetClientActionUrl('appid=activities_platform&body={"linkId":"LsQNxL7iWDlXUs6cFl-AAg"}', "joyList"), (async (err, resp, data) => {
            try {
                if (err) console.log(`${JSON.stringify(err)}`), console.log(`${$.name} API请求失败，请检查网路重试`);
                else {
                    if (data = JSON.parse(data), printLog) {
                        $.log(`\n===== 【京东账号${$.index}】${$.nickName||$.UserName} joy 状态 start =====`), $.log("在逛街的joy⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️");
                        for (let i = 0; i < data.data.activityJoyList.length; i++) $.log(`id:${data.data.activityJoyList[i].id}|name: ${data.data.activityJoyList[i].name}|level: ${data.data.activityJoyList[i].level}`), data.data.activityJoyList[i].level >= 30 && $.isNode() && (await notify.sendNotify(`${$.name} - 账号${$.index} - ${$.nickName}`, `【京东账号${$.index}】${$.nickName||$.UserName}\n当前等级: ${data.data.level}\n已达到单次最高等级奖励\n请尽快前往活动查看领取\n活动入口：京东极速版APP->汪汪乐园\n更多脚本->"https://github.com/timorpic/JDScripts"`), $.log("\n开始解锁新场景...\n"), await doJoyRestart());
                        $.log("\n在铲土的joy⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️");
                        for (let i = 0; i < data.data.workJoyInfoList.length; i++) $.log(`工位: ${data.data.workJoyInfoList[i].location} [${data.data.workJoyInfoList[i].unlock?"已开":"未开"}]|joy= ${data.data.workJoyInfoList[i].joyDTO?`id:${data.data.workJoyInfoList[i].joyDTO.id}|name: ${data.data.workJoyInfoList[i].joyDTO.name}|level: ${data.data.workJoyInfoList[i].joyDTO.level}`:"毛都没有"}`);
                        $.log(`===== 【京东账号${$.index}】${$.nickName||$.UserName} joy 状态  end  =====\n`)
                    }
                    $.activityJoyList = data.data.activityJoyList, $.workJoyInfoList = data.data.workJoyInfoList
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve(data.data)
            }
        }))
    }))
}

function getGameShopList() {
    return new Promise((resolve => {
        $.get(taskGetClientActionUrl('appid=activities_platform&body={"linkId":"LsQNxL7iWDlXUs6cFl-AAg"}', "gameShopList"), (async (err, resp, data) => {
            try {
                err ? (console.log(`${JSON.stringify(err)}`), console.log(`${$.name} API请求失败，请检查网路重试`)) : data = JSON.parse(data).data.filter((row => 1 === row.shopStatus))
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve(data)
            }
        }))
    }))
}
async function doJoyMoveUpAll(activityJoyList, workJoyInfoList) {
    let workJoyInfoUnlockList = workJoyInfoList.filter((row => row.unlock && null === row.joyDTO));
    if (0 !== activityJoyList.length && 0 !== workJoyInfoUnlockList.length) {
        let maxLevelJoy = Math.max.apply(Math, activityJoyList.map((o => o.level))),
            maxLevelJoyList = activityJoyList.filter((row => row.level === maxLevelJoy));
        $.log(`下地干活！ joyId= ${maxLevelJoyList[0].id} location= ${workJoyInfoUnlockList[0].location}`), await doJoyMove(maxLevelJoyList[0].id, workJoyInfoUnlockList[0].location), await getJoyList(), await doJoyMoveUpAll($.activityJoyList, $.workJoyInfoList)
    }
}
async function joyCoinMaximize(workJoyInfoUnlockList) {
    if (0 !== workJoyInfoUnlockList.length && $.hasJoyCoin) {
        $.log("竟然还有工位挖土？开启瞎买瞎下地模式！");
        let joyCoin = (await getJoyBaseInfo()).joyCoin;
        $.log(`还有${joyCoin}金币,看看还能买啥下地`);
        let shopList = await getGameShopList(),
            newBuyCount = !1;
        for (let i = shopList.length - 1; i >= 0 && i - 3 >= 0; i--)
            if (joyCoin > shopList[i].consume) {
                if ($.log(`买一只 ${shopList[i].userLevel}级的！`), joyCoin -= shopList[i].consume, !(await doJoyBuy(shopList[i].userLevel)).success) break;
                newBuyCount = !0, $.hasJoyCoin = !1, i++
            } $.hasJoyCoin = !1, newBuyCount && (await getJoyList(), await doJoyMoveUpAll($.activityJoyList, $.workJoyInfoList), await getJoyBaseInfo())
    }
}
async function doJoyMoveDownAll(workJoyInfoList) {
    if (0 === workJoyInfoList.filter((row => row.joyDTO)).length) return $.log("工位清理完成！"), !0;
    for (let i = 0; i < workJoyInfoList.length; i++) workJoyInfoList[i].unlock && workJoyInfoList[i].joyDTO && ($.log(`从工位移除 => id:${workJoyInfoList[i].joyDTO.id}|name: ${workJoyInfoList[i].joyDTO.name}|level: ${workJoyInfoList[i].joyDTO.level}`), await doJoyMove(workJoyInfoList[i].joyDTO.id, 0));
    await getJoyList(), await doJoyMoveDownAll($.workJoyInfoList)
}
async function doJoyMergeAll(activityJoyList) {
    let minLevel = Math.min.apply(Math, activityJoyList.map((o => o.level))),
        joyMinLevelArr = activityJoyList.filter((row => row.level === minLevel)),
        joyBaseInfo = await getJoyBaseInfo(),
        fastBuyLevel = joyBaseInfo.fastBuyLevel;
    if (joyMinLevelArr.length >= 2) $.log(`开始合成 ${minLevel} ${joyMinLevelArr[0].id} <=> ${joyMinLevelArr[1].id} 【限流严重，5秒后合成！如失败会重试】`), await $.wait(5e3), await doJoyMerge(joyMinLevelArr[0].id, joyMinLevelArr[1].id), await getJoyList(), await doJoyMergeAll($.activityJoyList);
    else if (1 === joyMinLevelArr.length && joyMinLevelArr[0].level < fastBuyLevel) {
        (await doJoyBuy(joyMinLevelArr[0].level, $.activityJoyList)).success ? (await getJoyList(), await doJoyMergeAll($.activityJoyList)) : ($.log("完成！"), await doJoyMoveUpAll($.activityJoyList, $.workJoyInfoList))
    } else {
        $.log("没有需要合成的joy 开始买买买🛒🛒🛒🛒🛒🛒🛒🛒"), $.log(`现在最高可以购买: ${fastBuyLevel}  购买 ${fastBuyLevel} 的joy   你还有${joyBaseInfo.joyCoin}金币`), (await doJoyBuy(fastBuyLevel, $.activityJoyList)).success ? (await getJoyList(), await doJoyMergeAll($.activityJoyList)) : ($.log("完成！"), await doJoyMoveUpAll($.activityJoyList, $.workJoyInfoList))
    }
}

function doJoyMove(joyId, location) {
    return new Promise((resolve => {
        $.post(taskGetClientActionUrl(`body={"joyId":${joyId},"location":${location},"linkId":"LsQNxL7iWDlXUs6cFl-AAg"}&appid=activities_platform`, "joyMove"), (async (err, resp, data) => {
            try {
                err ? (console.log(`${JSON.stringify(err)}`), console.log(`${$.name} API请求失败，请检查网路重试`)) : (0 !== location && $.log("下地完成了！"), data = JSON.parse(data))
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve(data.data)
            }
        }))
    }))
}

function doJoyMerge(joyId1, joyId2) {
    return new Promise((resolve => {
        $.get(taskGetClientActionUrl(`body={"joyOneId":${joyId1},"joyTwoId":${joyId2},"linkId":"LsQNxL7iWDlXUs6cFl-AAg"}&appid=activities_platform`, "joyMergeGet"), (async (err, resp, data) => {
            try {
                err ? (console.log(`${JSON.stringify(err)}`), console.log(`${$.name} API请求失败，请检查网路重试`), data = {}) : (data = JSON.parse(data), $.log(`合成 ${joyId1} <=> ${joyId2} ${data.success?"成功！":`失败！【${data.errMsg}】 code=${data.code}`}`))
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve(data.data)
            }
        }))
    }))
}
async function doJoyBuy(level, activityJoyList) {
    return new Promise((resolve => {
        $.post(taskPostClientActionUrl(`body={"level":${level},"linkId":"LsQNxL7iWDlXUs6cFl-AAg"}&appid=activities_platform`, "joyBuy"), (async (err, resp, data) => {
            try {
                if (err) console.log(`${JSON.stringify(err)}`), console.log(`${$.name} API请求失败，请检查网路重试`);
                else {
                    data = JSON.parse(data);
                    let codeMsg = "【不知道啥意思】";
                    switch (data.code) {
                        case 519:
                            codeMsg = "【没钱了】";
                            break;
                        case 518:
                            if (codeMsg = "【没空位】", activityJoyList) {
                                $.log(`因为购买 ${level}级🐶 没空位 所以我要删掉比低级的狗了`);
                                let minLevel = Math.min.apply(Math, activityJoyList.map((o => o.level)));
                                await doJoyRecovery(activityJoyList.filter((row => row.level === minLevel))[0].id)
                            }
                            break;
                        case 0:
                            codeMsg = "【OK】"
                    }
                    $.log(`购买joy level: ${level} ${data.success?"成功！":`失败！${data.errMsg} code=${data.code}`}  code的意思是=${codeMsg}`)
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve(data)
            }
        }))
    }))
}

function doJoyRecovery(joyId) {
    return new Promise((resolve => {
        $.post(taskPostClientActionUrl(`body={"joyId":${joyId},"linkId":"LsQNxL7iWDlXUs6cFl-AAg"}&appid=activities_platform`, "joyRecovery"), (async (err, resp, data) => {
            try {
                err ? (console.log(`${JSON.stringify(err)}`), console.log(`${$.name} API请求失败，请检查网路重试`), data = {}) : (data = JSON.parse(data), $.log("回收🐶 " + (data.success ? "成功！" : `失败！【${data.errMsg}】 code=${data.code}`)))
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve(data)
            }
        }))
    }))
}

function doJoyRestart() {
    return new Promise((resolve => {
        $.post(taskPostClientActionUrl('body={"linkId":"LsQNxL7iWDlXUs6cFl-AAg"}&appid=activities_platform', "joyRestart"), (async (err, resp, data) => {
            try {
                err ? (console.log(`${JSON.stringify(err)}`), console.log(`${$.name} API请求失败，请检查网路重试`)) : (data = JSON.parse(data), $.log("新场景解锁 " + (data.success ? "成功！" : `失败！【${data.errMsg}】 code=${data.code}`)))
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve(data)
            }
        }))
    }))
}

function getShareCode() {
    return new Promise((resolve => {
        $.get({
            url: "https://sub.timor.icu/JDscripts/joypark.json",
            headers: {
                "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1 Edg/87.0.4280.88"
            }
        }, (async (err, resp, data) => {
            try {
                err ? (console.log(`${JSON.stringify(err)}`), console.log(`${$.name} API请求失败，请检查网路重试`)) : $.kgw_invitePin = JSON.parse(data)
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve()
            }
        }))
    }))
}

function taskPostClientActionUrl(body, functionId) {
    return {
        url: "https://api.m.jd.com/client.action?" + (functionId ? `functionId=${functionId}` : ""),
        body: body,
        headers: {
            "User-Agent": $.user_agent,
            "Content-Type": "application/x-www-form-urlencoded",
            Host: "api.m.jd.com",
            Origin: "https://joypark.jd.com",
            Referer: "https://joypark.jd.com/?activityId=LsQNxL7iWDlXUs6cFl-AAg&lng=113.387899&lat=22.512678&sid=4d76080a9da10fbb31f5cd43396ed6cw&un_area=19_1657_52093_0",
            Cookie: cookie
        }
    }
}

function taskGetClientActionUrl(body, functionId) {
    return {
        url: `https://api.m.jd.com/client.action?functionId=${functionId}${body?`&${body}`:""}`,
        headers: {
            "User-Agent": $.user_agent,
            "Content-Type": "application/x-www-form-urlencoded",
            Host: "api.m.jd.com",
            Origin: "https://joypark.jd.com",
            Referer: "https://joypark.jd.com/?activityId=LsQNxL7iWDlXUs6cFl-AAg&lng=113.388006&lat=22.512549&sid=4d76080a9da10fbb31f5cd43396ed6cw&un_area=19_1657_52093_0",
            Cookie: cookie
        }
    }
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
                "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.2 Mobile/15E148 Safari/604.1"
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
message = "", (async () => {
    if ($.user_agent = require("./USER_AGENTS").USER_AGENT, cookiesArr[0]) {
        if (process.env.JD_JOY_PARK && "false" === process.env.JD_JOY_PARK) console.log("\n******检测到您设置了不运行汪汪乐园，停止运行此脚本******\n");
        else
            for (let i = 0; i < cookiesArr.length; i++)
                if (cookie = cookiesArr[i], cookie) {
                    if ($.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1]), $.index = i + 1, $.isLogin = !0, $.nickName = "", $.maxJoyCount = 10, await TotalBean(), !$.isLogin) {
                        $.msg($.name, "【提示】cookie已失效", `京东账号${$.index} ${$.nickName||$.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, {
                            "open-url": "https://bean.m.jd.com/bean/signIndex.action"
                        }), $.isNode() && await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
                        continue
                    }
                    if (console.log(`\n\n******开始【京东账号${$.index}】${$.nickName||$.UserName}*********\n`), $.isNode())
                        if (process.env.HELP_JOYPARK && "false" == process.env.HELP_JOYPARK);
                        else if (await getShareCode(), $.kgw_invitePin && $.kgw_invitePin.length) {
                        $.log("开始帮【timorpic】助力开工位\n"), $.kgw_invitePin = [...$.kgw_invitePin || []][Math.floor(Math.random() * $.kgw_invitePin.length)];
                        let resp = await getJoyBaseInfo(void 0, 2, $.kgw_invitePin);
                        resp.helpState && 1 === resp.helpState ? $.log("帮【timorpic】开工位成功，感谢！\n") : resp.helpState && 3 === resp.helpState ? $.log("你不是新用户！跳过开工位助力\n") : resp.helpState && 2 === resp.helpState ? $.log("他的工位已全部开完啦！\n") : ($.log("开工位失败！\n"), console.log(`${JSON.stringify(resp)}`))
                    }
                    $.hasJoyCoin = !0, await getJoyBaseInfo(void 0, void 0, void 0, !0), $.activityJoyList = [], $.workJoyInfoList = [], await getJoyList(!0), await getGameShopList(), await doJoyMoveDownAll($.workJoyInfoList), await doJoyMergeAll($.activityJoyList), await getJoyList(!0)
                }
    } else $.msg($.name, "【提示】请先获取cookie\n直接使用NobyDa的京东签到获取", "https://bean.m.jd.com/", {
        "open-url": "https://bean.m.jd.com/"
    })
})().catch((e => $.logErr(e))).finally((() => $.done()));