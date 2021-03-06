const $ = new Env("京东小魔方_Timorpic"),
    notify = $.isNode() ? require("./sendNotify") : "",
    jdCookieNode = $.isNode() ? require("./jdCookie.js") : "";
let message, uuid, jdNotify = !0,
    cookiesArr = [],
    cookie = "";
$.shareCodes = [];
let hotInfo = {};
$.isNode() ? (Object.keys(jdCookieNode).forEach((item => {
    cookiesArr.push(jdCookieNode[item])
})), process.env.JD_DEBUG && "false" === process.env.JD_DEBUG && (console.log = () => {})) : cookiesArr = [$.getdata("CookieJD"), $.getdata("CookieJD2"), ...jsonParse($.getdata("CookiesJD") || "[]").map((item => item.cookie))].filter((item => !!item));
const JD_API_HOST = "https://api.m.jd.com/client.action";
let allMessage = "";
async function jdMofang() {
    console.log("集魔方 赢大奖"), await getInteractionHomeInfo(), console.log("\n集魔方 抽京豆 赢新品"), await getInteractionInfo()
}
async function getInteractionHomeInfo() {
    return new Promise((async resolve => {
        $.post(taskUrl("getInteractionHomeInfo", {
            sign: "u6vtLQ7ztxgykLEr"
        }), (async (err, resp, data) => {
            try {
                err ? (console.log(`${JSON.stringify(err)}`), console.log(`${$.name} getInteractionHomeInfo API请求失败，请检查网路重试`)) : safeGet(data) && (data = JSON.parse(data), await queryInteractiveInfo(data.result.taskConfig.projectId, "acexinpin0823"))
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve(data)
            }
        }))
    }))
}
async function queryInteractiveInfo(encryptProjectId, sourceCode) {
    return new Promise((async resolve => {
        $.post(taskUrl("queryInteractiveInfo", {
            encryptProjectId: encryptProjectId,
            sourceCode: sourceCode,
            ext: {}
        }), (async (err, resp, data) => {
            try {
                if (err) console.log(`${JSON.stringify(err)}`), console.log(`${$.name} queryInteractiveInfo API请求失败，请检查网路重试`);
                else if (safeGet(data)) {
                    data = JSON.parse(data);
                    for (let key of Object.keys(data.assignmentList)) {
                        let vo = data.assignmentList[key];
                        if ("sign1" === vo.ext.extraType)
                            if (console.log(`去做【${vo.assignmentName}】`), 2 !== vo.ext[vo.ext.extraType].status) {
                                let signDay = vo.ext[vo.ext.extraType].signList && vo.ext[vo.ext.extraType].signList.length || 0;
                                if ($.type = vo.rewards[signDay].rewardType, await doInteractiveAssignment(vo.ext.extraType, encryptProjectId, sourceCode, vo.encryptAssignmentId, vo.ext[vo.ext.extraType].itemId), $.hot) return
                            } else console.log("今日已签到");
                        else if ("assistTaskDetail" === vo.ext.extraType) console.log(`【京东账号${$.index}（${$.UserName}）的京东小魔方好友互助码】${vo.ext[vo.ext.extraType].itemId}`), $.encryptProjectId = encryptProjectId, $.encryptAssignmentId = vo.encryptAssignmentId, $.sourceCode = sourceCode, vo.completionCnt < vo.assignmentTimesLimit ? $.shareCodes.push({
                            code: vo.ext[vo.ext.extraType].itemId,
                            use: $.UserName
                        }) : console.log("助力已满");
                        else if ("brandMemberList" !== vo.ext.extraType && Object.keys(vo.ext).length && Object.keys(vo.ext[vo.ext.extraType]).length)
                            if (console.log(`去做【${vo.assignmentName}】`), vo.completionCnt < vo.assignmentTimesLimit) {
                                $.type = vo.rewards[0].rewardType;
                                for (let key of Object.keys(vo.ext[vo.ext.extraType])) {
                                    let task = vo.ext[vo.ext.extraType][key];
                                    if (2 !== task.status)
                                        if ("productsInfo" !== vo.ext.extraType && "addCart" !== vo.ext.extraType && (await doInteractiveAssignment(vo.ext.extraType, encryptProjectId, sourceCode, vo.encryptAssignmentId, task.itemId, "1"), await $.wait(1e3 * vo.ext.waitDuration || 2e3)), "browseShop" === vo.ext.extraType) $.rewardmsg = `完成成功：获得${vo.rewards[0].rewardValue}${vo.rewards[0].rewardName}`, await qryViewkitCallbackResult(encryptProjectId, vo.encryptAssignmentId, task.itemId);
                                        else if ($.complete = !1, await doInteractiveAssignment(vo.ext.extraType, encryptProjectId, sourceCode, vo.encryptAssignmentId, task.itemId, "0"), $.complete) break
                                }
                            } else console.log("任务已完成")
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
async function qryViewkitCallbackResult(encryptProjectId, encryptAssignmentId, itemId) {
    let body = JSON.stringify({
            dataSource: "babelInteractive",
            method: "customDoInteractiveAssignmentForBabel",
            reqParams: `{"itemId":"${itemId}","encryptProjectId":"${encryptProjectId}","encryptAssignmentId":"${encryptAssignmentId}"}`
        }),
        uuid = randomString(16),
        sign = await getSign("qryViewkitCallbackResult", body, uuid),
        url = `${JD_API_HOST}client.action?functionId=qryViewkitCallbackResult&client=apple&clientVersion=10.1.0&uuid=${uuid}&${sign}`;
    return new Promise((resolve => {
        $.post(taskSignUrl(url, body), ((err, resp, data) => {
            try {
                err ? (console.log(`${JSON.stringify(err)}`), console.log(`${$.name} qryViewkitCallbackResult API请求失败，请检查网路重试`)) : data && ("0" !== (data = JSON.parse(data)).code && "query success!" !== data.msg || console.log($.rewardmsg))
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve()
            }
        }))
    }))
}

function doInteractiveAssignment(extraType, encryptProjectId, sourceCode, encryptAssignmentId, itemId, actionType = "") {
    return new Promise((resolve => {
        $.post(taskUrl("doInteractiveAssignment", {
            encryptProjectId: encryptProjectId,
            encryptAssignmentId: encryptAssignmentId,
            sourceCode: sourceCode,
            itemId: itemId,
            actionType: actionType,
            completionFlag: "",
            ext: {}
        }), ((err, resp, data) => {
            try {
                if (err) console.log(`${JSON.stringify(err)}`), console.log(`${$.name} doInteractiveAssignment API请求失败，请检查网路重试`);
                else if (safeGet(data)) {
                    if ("1403" === (data = JSON.parse(data)).subCode) return $.hot = !0, void console.log("活动太火爆了，还是去买买买吧！！！");
                    "assistTaskDetail" === extraType ? "已达助力上限" === data.msg || "108" === data.subCode ? ($.canHelp = !1, console.log(`助力失败：${data.msg}`)) : "任务已完成" === data.msg || "103" === data.subCode ? ($.delcode = !0, console.log("助力失败：您的好友助力已满")) : "任务完成" !== data.msg && "0" !== data.subCode || console.log("助力成功") : "sign1" === extraType ? console.log("签到成功：获得" + (data.rewardsInfo.successRewards[$.type][0] ? `${data.rewardsInfo.successRewards[$.type][0].quantity}${data.rewardsInfo.successRewards[$.type][0].rewardName}` : `${data.rewardsInfo.successRewards[$.type].quantityDetails[0].quantity}${data.rewardsInfo.successRewards[$.type].quantityDetails[0].rewardName}`)) : "0" === actionType && data.assignmentInfo.completionCnt === data.assignmentInfo.maxTimes && ($.complete = !0, console.log("完成成功：获得" + (data.rewardsInfo.successRewards[$.type][0] ? `${data.rewardsInfo.successRewards[$.type][0].quantity}${data.rewardsInfo.successRewards[$.type][0].rewardName}` : `${data.rewardsInfo.successRewards[$.type].quantityDetails[0].quantity}${data.rewardsInfo.successRewards[$.type].quantityDetails[0].rewardName}`)))
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve(data)
            }
        }))
    }))
}
async function getInteractionInfo(type = !0) {
    return new Promise((async resolve => {
        $.post(taskPostUrl("getInteractionInfo", {
            sign: 3
        }), (async (err, resp, data) => {
            try {
                if (err) console.log(`${JSON.stringify(err)}`), console.log(`${$.name} getInteractionInfo API请求失败，请检查网路重试`);
                else if (safeGet(data) && (data = JSON.parse(data), type)) {
                    $.interactionId = data.result.interactionId, $.taskPoolId = data.result.taskPoolInfo.taskPoolId;
                    for (let key of Object.keys(data.result.taskPoolInfo.taskList)) {
                        let vo = data.result.taskPoolInfo.taskList[key];
                        if (0 === vo.taskStatus) {
                            if (2002 === vo.taskId) {
                                await queryPanamaPage(vo.groupId);
                                for (let id of $.sku)
                                    if ($.complete = !1, await executeNewInteractionTask(vo.taskId, vo.groupId, id), await $.wait(2e3), $.complete) break
                            } else
                                for (let id of vo.taskGroupList)
                                    if ($.complete = !1, await executeNewInteractionTask(vo.taskId, id), await $.wait(2e3), $.complete) break
                        } else console.log("已找到当前魔方")
                    }
                    if (0 === (data = await getInteractionInfo(!1)).result.hasFinalLottery) {
                        let num = 0;
                        for (let key of Object.keys(data.result.taskPoolInfo.taskRecord)) {
                            num += data.result.taskPoolInfo.taskRecord[key]
                        }
                        num >= 9 ? (console.log(`共找到${num}个魔方，可开启礼盒`), await getNewFinalLotteryInfo()) : console.log(`共找到${num}个魔方，不可开启礼盒`)
                    } else console.log("已开启礼盒")
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve(data)
            }
        }))
    }))
}

function queryPanamaPage(groupId) {
    return new Promise((resolve => {
        $.post(taskPostUrl("queryPanamaPage", {
            activityId: "3v2Wu9KsgwzW92931wj7sYCRjueP",
            dynamicParam: {},
            geo: {
                lng: "",
                lat: ""
            },
            previewTime: ""
        }), ((err, resp, data) => {
            try {
                if (err) console.log(`${JSON.stringify(err)}`), console.log(`${$.name} queryPanamaPage API请求失败，请检查网路重试`);
                else if (safeGet(data)) {
                    data = JSON.parse(data);
                    for (let key of Object.keys(data.floorList)) {
                        let vo = data.floorList[key];
                        if (vo.data && vo.data.head && vo.data.head.groupId === groupId) {
                            for (let key of Object.keys(vo.data.head.list)) {
                                let skuVo = vo.data.head.list[key];
                                $.sku.push(skuVo.skuId)
                            }
                            break
                        }
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

function executeNewInteractionTask(taskType, advertId, sku = "") {
    let body = {
        sign: 3,
        interactionId: $.interactionId,
        taskPoolId: $.taskPoolId,
        taskType: taskType,
        advertId: advertId
    };
    return 2002 === taskType && (body.sku = sku), new Promise((resolve => {
        $.post(taskPostUrl("executeNewInteractionTask", body), ((err, resp, data) => {
            try {
                err ? (console.log(`${JSON.stringify(err)}`), console.log(`${$.name} executeNewInteractionTask API请求失败，请检查网路重试`)) : safeGet(data) && 1 === (data = JSON.parse(data)).result.hasDown && (console.log(1 === data.result.isLottery ? `找到了一个魔方，获得${data.result.lotteryInfoList[0].quantity||""}${data.result.lotteryInfoList[0].name}` : "找到了一个魔方"), $.complete = !0)
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve(data)
            }
        }))
    }))
}

function getNewFinalLotteryInfo() {
    return new Promise((resolve => {
        $.post(taskPostUrl("getNewFinalLotteryInfo", {
            sign: 3,
            interactionId: $.interactionId
        }), ((err, resp, data) => {
            try {
                err ? (console.log(`${JSON.stringify(err)}`), console.log(`${$.name} getNewFinalLotteryInfo API请求失败，请检查网路重试`)) : safeGet(data) && (1 === (data = JSON.parse(data)).result.lotteryStatus ? console.log(`开启礼盒成功：获得${data.result.lotteryInfoList[0].quantity}${data.result.lotteryInfoList[0].name}`) : console.log(`开启礼盒成功：${data.result.toast}`))
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve(data)
            }
        }))
    }))
}

function taskUrl(functionId, body = {}) {
    return {
        url: `${JD_API_HOST}?functionId=${functionId}&body=${escape(JSON.stringify(body))}&appid=content_ecology&client=wh5&clientVersion=1.0.0`,
        headers: {
            Host: "api.m.jd.com",
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/x-www-form-urlencoded",
            Origin: "https://h5.m.jd.com",
            "Accept-Language": "zh-cn",
            "User-Agent": $.isNode() ? process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : require("./USER_AGENTS").USER_AGENT : $.getdata("JDUA") ? $.getdata("JDUA") : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1",
            Referer: "https://h5.m.jd.com/babelDiy/Zeus/2bf3XEEyWG11pQzPGkKpKX2GxJz2/index.html",
            "Accept-Encoding": "gzip, deflate, br",
            Cookie: cookie
        }
    }
}

function taskPostUrl(functionId, body = {}) {
    return body = JSON.stringify(body), "queryPanamaPage" === functionId && (body = escape(body)), {
        url: `${JD_API_HOST}?functionId=${functionId}&body=${body}&client=wh5&clientVersion=10.1.4&appid=content_ecology&eufv=false&uuid=${uuid}&t=${Date.now()}`,
        headers: {
            Host: "api.m.jd.com",
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/x-www-form-urlencoded",
            Origin: "https://h5.m.jd.com",
            "Accept-Language": "zh-cn",
            "User-Agent": $.isNode() ? process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : require("./USER_AGENTS").USER_AGENT : $.getdata("JDUA") ? $.getdata("JDUA") : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1",
            Referer: "https://h5.m.jd.com/babelDiy/Zeus/2umkvbpZCUtyN6gcymN88ew8WLeU/index.html",
            "Accept-Encoding": "gzip, deflate, br",
            Cookie: cookie
        }
    }
}

function taskSignUrl(url, body) {
    return {
        url: url,
        body: `body=${escape(body)}`,
        headers: {
            Cookie: cookie,
            Host: "api.m.jd.com",
            Connection: "keep-alive",
            "Content-Type": "application/x-www-form-urlencoded",
            Referer: "",
            "User-Agent": "JD4iPhone/167774 (iPhone; iOS 14.7.1; Scale/3.00)",
            "Accept-Language": "zh-Hans-CN;q=1",
            "Accept-Encoding": "gzip, deflate, br"
        }
    }
}

function randomString(e) {
    let t = "abcdef0123456789";
    16 === e && (t = "abcdefghijklmnopqrstuvwxyz0123456789"), e = e || 32;
    let a = t.length,
        n = "";
    for (let i = 0; i < e; i++) n += t.charAt(Math.floor(Math.random() * a));
    return n
}

function getSign(functionid, body, uuid) {
    return new Promise((async resolve => {
        let data = {
                functionId: functionid,
                body: body,
                uuid: uuid,
                client: "apple",
                clientVersion: "10.1.0"
            },
            HostArr = ["jdsign.cf", "signer.nz.lu"],
            Host = HostArr[Math.floor(Math.random() * HostArr.length)],
            options = {
                url: "https://cdn.nz.lu/ddo",
                body: JSON.stringify(data),
                headers: {
                    Host: Host,
                    "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1 Edg/87.0.4280.88"
                },
                timeout: 3e4
            };
        $.post(options, ((err, resp, data) => {
            try {
                err && (console.log(`${JSON.stringify(err)}`), console.log(`${$.name} getSign API请求失败，请检查网路重试`))
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve(data)
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

function showMsg() {
    return new Promise((resolve => {
        jdNotify ? $.log(`京东账号${$.index}${$.nickName}\n${message}`) : $.msg($.name, "", `${message}`), resolve()
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
}(async () => {
    if (cookiesArr[0]) {
        for (let i = 0; i < cookiesArr.length; i++)
            if (cookiesArr[i]) {
                if (cookie = cookiesArr[i], $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1]), $.index = i + 1, $.isLogin = !0, $.nickName = "", message = "", await TotalBean(), console.log(`\n******开始【京东账号${$.index}】${$.nickName||$.UserName}*********\n`), !$.isLogin) {
                    $.msg($.name, "【提示】cookie已失效", `京东账号${$.index} ${$.nickName||$.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, {
                        "open-url": "https://bean.m.jd.com/bean/signIndex.action"
                    }), $.isNode() && await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
                    continue
                }
                $.sku = [], $.hot = !1, uuid = randomString(40), await jdMofang(), hotInfo[$.UserName] = $.hot
            } for (let i = 0; i < cookiesArr.length; i++)
            if (cookie = cookiesArr[i], $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1]), $.canHelp = !0, !hotInfo[$.UserName] && $.shareCodes && $.shareCodes.length) {
                console.log("\n开始内部助力");
                for (let j = 0; j < $.shareCodes.length && $.canHelp; j++) console.log(`\n账号${$.UserName} 去助力 ${$.shareCodes[j].use} 的助力码 ${$.shareCodes[j].code}`), $.UserName !== $.shareCodes[j].use ? ($.delcode = !1, await doInteractiveAssignment("assistTaskDetail", $.encryptProjectId, $.sourceCode, $.encryptAssignmentId, $.shareCodes[j].code), await $.wait(2e3), $.delcode && ($.shareCodes.splice(j, 1), j--)) : console.log("助力失败：不能助力自己")
            }
    } else $.msg($.name, "【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取", "https://bean.m.jd.com/bean/signIndex.action", {
        "open-url": "https://bean.m.jd.com/bean/signIndex.action"
    })
})().catch((e => {
    $.log("", `❌ ${$.name}, 失败! 原因: ${e}!`, "")
})).finally((() => {
    $.done()
}));