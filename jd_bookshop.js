const $ = new Env("口袋书店_Timorpic"),
    notify = $.isNode() ? require("./sendNotify") : "",
    jdCookieNode = $.isNode() ? require("./jdCookie.js") : "";
let message, cookiesArr = [],
    cookie = "";
const ACT_ID = "dz2010100034444201",
    shareUuid = "39242147-966648";
let ADD_CART = !1;
ADD_CART = $.isNode() ? process.env.PURCHASE_SHOPS ? process.env.PURCHASE_SHOPS : ADD_CART : $.getdata("ADD_CART") ? $.getdata("ADD_CART") : ADD_CART;
let inviteCodes = ["39242147-966648", "jd_4c1cba962a151"];
async function jdBeauty() {
    if ($.score = 0, await getIsvToken(), await getIsvToken2(), await getActCk(), await getActInfo(), await getToken(), await accessLogWithAD(), await getUserInfo(), await getActContent(!1, shareUuid), !$.exit) {
        if (await doHelpList(), await getAllBook(), await getMyBook(), await getActContent(!0), $.gold > 800)
            for (console.log("金币大于800，去抽奖"); $.gold >= 800;) await draw(), await $.wait(1e3), $.gold -= 800;
        $.userInfo.storeGold && await chargeGold(), await helpFriends(), await showMsg()
    }
}
async function helpFriends() {
    for (let code of $.newShareCodes) code && (console.log(`去助力好友${code}`), await getActContent(!0, code), await $.wait(500))
}

function getIsvToken() {
    return new Promise((resolve => {
        $.post(jdUrl("genToken", "body=%7B%22to%22%3A%22https%3A%5C%2F%5C%2Flzdz-isv.isvjcloud.com%5C%2Fdingzhi%5C%2Fbook%5C%2Fdevelop%5C%2Factivity%3FactivityId%3Ddz2010100034444201%22%2C%22action%22%3A%22to%22%7D&build=167490&client=apple&clientVersion=9.3.2&openudid=53f4d9c70c1c81f1c8769d2fe2fef0190a3f60d2&sign=f3eb9660e798c20372734baf63ab55f2&st=1610267023622&sv=111"), (async (err, resp, data) => {
            try {
                err ? console.log(`${$.name} API请求失败，请检查网路重试`) : safeGet(data) && (data = JSON.parse(data), $.isvToken = data.tokenKey)
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve(data)
            }
        }))
    }))
}

function getIsvToken2() {
    return new Promise((resolve => {
        $.post(jdUrl("isvObfuscator", "body=%7B%22url%22%3A%22https%3A%5C%2F%5C%2Flzdz-isv.isvjcloud.com%22%2C%22id%22%3A%22%22%7D&build=167490&client=apple&clientVersion=9.3.2&openudid=53f4d9c70c1c81f1c8769d2fe2fef0190a3f60d2&sign=6050f8b81f4ba562b357e49762a8f4b0&st=1610267024346&sv=121"), (async (err, resp, data) => {
            try {
                err ? console.log(`${$.name} API请求失败，请检查网路重试`) : safeGet(data) && (data = JSON.parse(data), $.token2 = data.token)
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve(data)
            }
        }))
    }))
}

function getActCk() {
    return new Promise((resolve => {
        $.get(taskUrl("dingzhi/book/develop/activity", `activityId=${ACT_ID}`), ((err, resp, data) => {
            try {
                if (err) console.log(`${$.name} API请求失败，请检查网路重试`);
                else if ($.isNode())
                    for (let ck of resp.headers["set-cookie"]) cookie = `${cookie}; ${ck.split(";")[0]};`;
                else
                    for (let ck of resp.headers["Set-Cookie"].split(",")) cookie = `${cookie}; ${ck.split(";")[0]};`
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve(data)
            }
        }))
    }))
}

function getActInfo() {
    return new Promise((resolve => {
        $.post(taskPostUrl("dz/common/getSimpleActInfoVo", `activityId=${ACT_ID}`), (async (err, resp, data) => {
            try {
                err ? console.log(`${$.name} API请求失败，请检查网路重试`) : safeGet(data) && (data = JSON.parse(data)).result && ($.shopId = data.data.shopId)
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve(data)
            }
        }))
    }))
}

function getToken() {
    return new Promise((resolve => {
        let body = `userId=${$.shopId}&token=${$.token2}&fromType=APP`;
        $.post(taskPostUrl("customer/getMyPing", body), (async (err, resp, data) => {
            try {
                err ? console.log(`${$.name} API请求失败，请检查网路重试`) : safeGet(data) && (data = JSON.parse(data), $.token = data.data.secretPin)
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve(data)
            }
        }))
    }))
}

function getUserInfo() {
    return new Promise((resolve => {
        let body = `pin=${encodeURIComponent($.token)}`;
        $.post(taskPostUrl("wxActionCommon/getUserInfo", body), (async (err, resp, data) => {
            try {
                err ? console.log(`${$.name} API请求失败，请检查网路重试`) : safeGet(data) && (data = JSON.parse(data)).data && (console.log(`用户【${data.data.nickname}】信息获取成功`), $.userId = data.data.id, $.pinImg = data.data.yunMidImageUrl, $.nick = data.data.nickname)
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve(data)
            }
        }))
    }))
}

function accessLogWithAD() {
    return new Promise((resolve => {
        let body = `venderId=${$.shopId}&code=99&pin=${encodeURIComponent($.token)}&activityId=${ACT_ID}&pageUrl=https%3A%2F%2Flzdz-isv.isvjcloud.com%2Fdingzhi%2Fbook%2Fdevelop%2Factivity%3FactivityId%3Ddz2010100034444201%26lng%3D107.146945%26lat%3D33.255267%26sid%3Dcad74d1c843bd47422ae20cadf6fe5aw%26un_area%3D27_2442_2444_31912&subType=app&adSource=`;
        $.post(taskPostUrl("common/accessLogWithAD", body), (async (err, resp, data) => {
            try {
                if (err) console.log(`${$.name} API请求失败，请检查网路重试`);
                else if ($.isNode())
                    for (let ck of resp.headers["set-cookie"]) cookie = `${cookie}; ${ck.split(";")[0]};`;
                else
                    for (let ck of resp.headers["Set-Cookie"].split(",")) cookie = `${cookie}; ${ck.split(";")[0]};`
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve(data)
            }
        }))
    }))
}

function getActContent(info = !1, shareUuid = "") {
    return new Promise((resolve => {
        let body = `activityId=${ACT_ID}&pin=${encodeURIComponent($.token)}&pinImg=${$.pinImg}&nick=${$.nick}&cjyxPin=&cjhyPin=&shareUuid=${shareUuid}`;
        $.post(taskPostUrl("dingzhi/book/develop/activityContent", body), (async (err, resp, data) => {
            try {
                if (err) console.log(`${$.name} API请求失败，请检查网路重试`);
                else if (data && safeGet(data) && (data = JSON.parse(data)).data) {
                    if ($.userInfo = data.data, !$.userInfo.bookStore) return $.exit = !0, console.log(`京东账号${$.index}尚未开启口袋书店，请手动开启`), void console.log("\n提示：从五月份开始，需要手动进入一下活动页面。不然即使是开启了这个活动。跑脚本也提示未开启活动\n");
                    if ($.actorUuid = $.userInfo.actorUuid, info || console.log(`\n【京东账号${$.index}（${$.UserName}）的${$.name}好友互助码】${$.actorUuid}\n`), $.gold = $.userInfo.bookStore.hasStoreGold, !info) {
                        const tasks = data.data.settingVo;
                        for (let task of tasks)
                            if (["关注店铺"].includes(task.title)) task.okNum < task.dayMaxNum && (console.log(`去做${task.title}任务`), await doTask(task.settings[0].type, task.settings[0].value));
                            else if (["逛会场", "浏览店铺", "浏览商品"].includes(task.title)) {
                            if (task.okNum < task.dayMaxNum) {
                                console.log(`去做${task.title}任务`);
                                for (let set of task.settings.filter((vo => 0 === vo.status))) await doTask(set.type, set.value), await $.wait(500)
                            }
                        } else if ("每日签到" === task.title) {
                            const hour = (new Date).getUTCHours() + 8;
                            if (8 <= hour && hour < 10 || 12 <= hour && hour < 14 || 18 <= hour && hour < 20) {
                                console.log(`去做${task.title}任务`);
                                for (let set of task.settings.filter((vo => 0 === vo.status))) {
                                    if ((await doTask(set.type, set.value)).result) break;
                                    await $.wait(500)
                                }
                            }
                        } else ADD_CART && ["加购商品"].includes(task.title) && task.okNum < task.dayMaxNum && (console.log(`去做${task.title}任务`), await doTask(task.settings[0].type, task.settings[0].value))
                    }
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve(data)
            }
        }))
    }))
}

function doHelpList(taskType, value) {
    let body = `activityId=${ACT_ID}&actorUuid=${$.actorUuid}&num=0&sortStatus=1`;
    return new Promise((resolve => {
        $.post(taskPostUrl("dingzhi/taskact/common/getDayShareRecord", body), (async (err, resp, data) => {
            try {
                err ? console.log(`${$.name} API请求失败，请检查网路重试`) : safeGet(data) && (data = JSON.parse(data), console.log(`今日助力情况${data.data.length}/10`))
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve(data)
            }
        }))
    }))
}

function doTask(taskType, value) {
    let body = `activityId=${ACT_ID}&pin=${encodeURIComponent($.token)}&actorUuid=${$.actorUuid}&taskType=${taskType}&taskValue=${value}`;
    return new Promise((resolve => {
        $.post(taskPostUrl("dingzhi/book/develop/saveTask", body), (async (err, resp, data) => {
            try {
                err ? console.log(`${$.name} API请求失败，请检查网路重试`) : safeGet(data) && ((data = JSON.parse(data)).result && data.data ? (console.log(`任务完成成功，获得${data.data.addScore}积分`), $.score += data.data.addScore) : console.log(`任务完成失败，错误信息：${data.errorMessage}`))
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve(data)
            }
        }))
    }))
}

function draw() {
    let body = `activityId=${ACT_ID}&pin=${encodeURIComponent($.token)}&actorUuid=${$.actorUuid}`;
    return new Promise((resolve => {
        $.post(taskPostUrl("dingzhi/book/develop/startDraw", body), (async (err, resp, data) => {
            try {
                err ? console.log(`${$.name} API请求失败，请检查网路重试`) : data && safeGet(data) && (data = JSON.parse(data)).result && data.data && (data.data.name ? (console.log(`抽奖成功，获得奖品：${data.data.name}`), message += `抽奖成功，获得奖品：${data.data.name}\n`) : (console.log("抽奖成功，获得空气"), message += "抽奖成功，获得空气"))
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve(data)
            }
        }))
    }))
}

function getAllBook() {
    let body = `activityId=${ACT_ID}&actorUuid=${$.actorUuid}&pin=${encodeURIComponent($.token)}`;
    return new Promise((resolve => {
        $.post(taskPostUrl("dingzhi/book/develop/getAllBook", body), (async (err, resp, data) => {
            try {
                if (err) console.log(`${$.name} API请求失败，请检查网路重试`);
                else if (safeGet(data) && (data = JSON.parse(data)).result && data.data) {
                    const book = data.data.bookConfigList[0];
                    let num = Math.trunc(data.data.haveScore / book.buyBookScore);
                    console.log(`拥有${data.data.haveScore}积分，可购买${num}本`), num > 0 && await buyBook(book.uuid, num)
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve(data)
            }
        }))
    }))
}

function buyBook(bookUuid, num) {
    let body = `activityId=${ACT_ID}&actorUuid=${$.actorUuid}&pin=${encodeURIComponent($.token)}&bookUuid=${bookUuid}&buyNum=${num}`;
    return new Promise((resolve => {
        $.post(taskPostUrl("dingzhi/book/develop/buyBook", body), (async (err, resp, data) => {
            try {
                err ? console.log(`${$.name} API请求失败，请检查网路重试`) : safeGet(data) && (data = JSON.parse(data)).result && data.data && console.log(`购买【${data.data.BookIncome.bookName}】成功`)
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve(data)
            }
        }))
    }))
}

function getMyBook() {
    let body = `activityId=${ACT_ID}&actorUuid=${$.actorUuid}&pin=${encodeURIComponent($.token)}&type1=1&type2=1&type3=1&type=1`;
    return new Promise((resolve => {
        $.post(taskPostUrl("dingzhi/book/develop/getMyBook", body), (async (err, resp, data) => {
            try {
                if (err) console.log(`${$.name} API请求失败，请检查网路重试`);
                else if (safeGet(data) && (data = JSON.parse(data)).result && data.data)
                    for (let book of data.data.myBookList) 1 !== book.isPutOn && book.inventory > 0 && (console.log(`去上架【${book.bookName}】`), await upBook(book.bookUuid))
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve(data)
            }
        }))
    }))
}

function upBook(bookUuid) {
    let body = `activityId=${ACT_ID}&actorUuid=${$.actorUuid}&pin=${encodeURIComponent($.token)}&bookUuid=${bookUuid}&isPutOn=1&position=1`;
    return new Promise((resolve => {
        $.post(taskPostUrl("dingzhi/book/develop/upBook", body), (async (err, resp, data) => {
            try {
                err ? console.log(`${$.name} API请求失败，请检查网路重试`) : safeGet(data) && ((data = JSON.parse(data)).result && data.data ? console.log("上架成功") : console.log(data))
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve(data)
            }
        }))
    }))
}

function chargeGold() {
    let body = `activityId=${ACT_ID}&actorUuid=${$.actorUuid}&pin=${encodeURIComponent($.token)}`;
    return new Promise((resolve => {
        $.post(taskPostUrl("dingzhi/book/develop/chargeGold", body), (async (err, resp, data) => {
            try {
                err ? console.log(`${$.name} API请求失败，请检查网路重试`) : safeGet(data) && ((data = JSON.parse(data)).result && data.data ? console.log(`金币收获成功，获得${data.data.chargeGold}`) : console.log(data.errorMessage))
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve(data)
            }
        }))
    }))
}

function showMsg() {
    return new Promise((resolve => {
        $.score && (message += `本次运行获得积分${$.score}`, $.msg($.name, "", `京东账号${$.index}${$.nickName}\n${message}`)), resolve()
    }))
}

function jdUrl(functionId, body) {
    return {
        url: `https://api.m.jd.com/client.action?functionId=${functionId}`,
        body: body,
        headers: {
            Host: "api.m.jd.com",
            accept: "*/*",
            "user-agent": "JD4iPhone/167490 (iPhone; iOS 14.2; Scale/3.00)",
            "accept-language": "zh-Hans-JP;q=1, en-JP;q=0.9, zh-Hant-TW;q=0.8, ja-JP;q=0.7, en-US;q=0.6",
            "content-type": "application/x-www-form-urlencoded",
            Cookie: cookie
        }
    }
}

function taskUrl(function_id, body) {
    return {
        url: `https://lzdz-isv.isvjcloud.com/${function_id}?${body}`,
        headers: {
            Host: "lzdz-isv.isvjcloud.com",
            Accept: "application/x.jd-school-island.v1+json",
            Source: "02",
            "Accept-Language": "zh-cn",
            "Content-Type": "application/json;charset=utf-8",
            Origin: "https://lzdz-isv.isvjcloud.com",
            "User-Agent": "JD4iPhone/167490 (iPhone; iOS 14.2; Scale/3.00)",
            Referer: `https://lzdz-isv.isvjcloud.com/dingzhi/book/develop/activity?activityId=${ACT_ID}`,
            Cookie: `${cookie} IsvToken=${$.isvToken};`
        }
    }
}

function taskPostUrl(function_id, body) {
    return {
        url: `https://lzdz-isv.isvjcloud.com/${function_id}`,
        body: body,
        headers: {
            Host: "lzdz-isv.isvjcloud.com",
            Accept: "application/json",
            "Accept-Language": "zh-cn",
            "Content-Type": "application/x-www-form-urlencoded",
            Origin: "https://lzdz-isv.isvjcloud.com",
            "User-Agent": "JD4iPhone/167490 (iPhone; iOS 14.2; Scale/3.00)",
            Referer: `https://lzdz-isv.isvjcloud.com/dingzhi/book/develop/activity?activityId=${ACT_ID}`,
            Cookie: `${cookie} isvToken=${$.isvToken};`
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
                "User-Agent": $.isNode() ? process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : require("./USER_AGENTS").USER_AGENT : $.getdata("JDUA") ? $.getdata("JDUA") : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"
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

function shareCodesFormat() {
    return new Promise((async resolve => {
        if ($.newShareCodes = [], $.shareCodesArr[$.index - 1]) $.newShareCodes = $.shareCodesArr[$.index - 1].split("@");
        else {
            console.log(`由于您第${$.index}个京东账号未提供shareCode,将采纳本脚本自带的助力码\n`);
            const tempIndex = $.index > inviteCodes.length ? inviteCodes.length - 1 : $.index - 1;
            $.newShareCodes = inviteCodes[tempIndex].split("@")
        }
        console.log(`第${$.index}个京东账号将要助力的好友${JSON.stringify($.newShareCodes)}`), resolve()
    }))
}

function requireConfig() {
    return new Promise((resolve => {
        console.log(`开始获取${$.name}配置文件\n`);
        let shareCodes = [];
        console.log(`共${cookiesArr.length}个京东账号\n`), $.shareCodesArr = [], $.isNode() && (process.env.BOOKSHOP_SHARECODES && (shareCodes = process.env.BOOKSHOP_SHARECODES.indexOf("\n") > -1 ? process.env.BOOKSHOP_SHARECODES.split("\n") : process.env.BOOKSHOP_SHARECODES.split("&")), Object.keys(shareCodes).forEach((item => {
            shareCodes[item] && $.shareCodesArr.push(shareCodes[item])
        }))), console.log(`您提供了${$.shareCodesArr.length}个账号的${$.name}助力码\n`), resolve()
    }))
}

function safeGet(data) {
    try {
        if ("object" == typeof JSON.parse(data)) return !0
    } catch (e) {
        return console.log(e), console.log("京东服务器访问数据为空，请检查自身设备网络情况"), !1
    }
}

function jsonParse(str) {
    if ("string" == typeof str) try {
        return JSON.parse(str)
    } catch (e) {
        return console.log(e), $.msg($.name, "", "不要在BoxJS手动复制粘贴修改cookie"), []
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
$.isNode() ? (Object.keys(jdCookieNode).forEach((item => {
    cookiesArr.push(jdCookieNode[item])
})), process.env.JD_DEBUG && "false" === process.env.JD_DEBUG && (console.log = () => {})) : cookiesArr = [$.getdata("CookieJD"), $.getdata("CookieJD2"), ...jsonParse($.getdata("CookiesJD") || "[]").map((item => item.cookie))].filter((item => !!item)), (async () => {
    if (cookiesArr[0]) {
        $.shareCodesArr = [], await requireConfig();
        for (let i = 0; i < cookiesArr.length; i++)
            if (cookiesArr[i]) {
                if (cookie = cookiesArr[i], $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1]), $.index = i + 1, $.isLogin = !0, $.nickName = "", message = "", $.exit = !1, await TotalBean(), console.log(`\n******开始【京东账号${$.index}】${$.nickName||$.UserName}*********\n`), !$.isLogin) {
                    $.msg($.name, "【提示】cookie已失效", `京东账号${$.index} ${$.nickName||$.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/`, {
                        "open-url": "https://bean.m.jd.com/"
                    }), $.isNode() && await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
                    continue
                }
                await shareCodesFormat(), await jdBeauty()
            }
    } else $.msg($.name, "【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取", "https://bean.m.jd.com/", {
        "open-url": "https://bean.m.jd.com/"
    })
})().catch((e => {
    $.log("", `❌ ${$.name}, 失败! 原因: ${e}!`, "")
})).finally((() => {
    $.done()
}));