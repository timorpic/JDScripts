const $ = new Env("东东超市兑换奖品_Timorpic"),
    notify = $.isNode() ? require("./sendNotify") : "";
let allMessage = "";
const jdCookieNode = $.isNode() ? require("./jdCookie.js") : "";
let coinToBeans = $.getdata("coinToBeans") || 20,
    jdNotify = !1,
    cookiesArr = [],
    cookie = "";
$.isNode() ? (Object.keys(jdCookieNode).forEach((item => {
    cookiesArr.push(jdCookieNode[item])
})), process.env.JD_DEBUG && "false" === process.env.JD_DEBUG && (console.log = () => {})) : cookiesArr = [$.getdata("CookieJD"), $.getdata("CookieJD2"), ...jsonParse($.getdata("CookiesJD") || "[]").map((item => item.cookie))].filter((item => !!item));
const JD_API_HOST = "https://api.m.jd.com/api?appid=jdsupermarket";
async function PrizeIndex() {
    let nowtime = (new Date).Format("s.S"),
        starttime = $.isNode() ? process.env.SM_STARTTIME ? 1 * process.env.SM_STARTTIME : 60 : $.getdata("SM_STARTTIME") ? 1 * $.getdata("SM_STARTTIME") : 60;
    if (nowtime < 59) {
        let sleeptime = 1e3 * (starttime - nowtime);
        console.log("等待时间 " + sleeptime / 1e3), await sleep(sleeptime)
    }
    await smtg_queryPrize();
    const prizeList = [...$.queryPrizeData];
    if (prizeList && prizeList.length)
        if ("1000" == `${coinToBeans}`) {
            if (!prizeList[1] || 3 !== prizeList[1].type) return console.log("查询换1000京豆ID失败"), void($.beanerr = "东哥今天不给换");
            if (console.log(`查询换${prizeList[1].name}ID成功，ID:${prizeList[1].prizeId}`), $.title = prizeList[1].name, $.blueCost = prizeList[1].cost, prizeList[1] && prizeList[1].limit === prizeList[1] && prizeList[1].finished) return void($.beanerr = `${prizeList[1].name}`);
            if ($.totalBlue > $.blueCost)
                for (let j = 0; j <= 10 && (await smtg_obtainPrize(prizeList[1].prizeId), !($.errBizCodeCount >= 15)); j++);
            else console.log(`兑换失败,您目前蓝币${$.totalBlue}个,不足以兑换${$.title}所需的${$.blueCost}个`), $.beanerr = `兑换失败,您目前蓝币${$.totalBlue}个,不足以兑换${$.title}所需的${$.blueCost}个`
        } else if ("20" == `${coinToBeans}`) {
        if (!prizeList[0] || 3 !== prizeList[0].type) return console.log("查询换万能的京豆ID失败"), void($.beanerr = "东哥今天不给换");
        if (console.log(`查询换${prizeList[0].name}ID成功，ID:${prizeList[0].prizeId}`), $.title = prizeList[0].name, $.blueCost = prizeList[0].cost, (prizeList[0] && prizeList[0].limit) === (prizeList[0] && prizeList[0].finished)) return void($.beanerr = `${prizeList[0].name}`);
        if ($.totalBlue > $.blueCost)
            for (let j = 0; j <= 10 && (await smtg_obtainPrize(prizeList[0].prizeId, 1e3), !($.errBizCodeCount >= 15)); j++);
        else console.log(`兑换失败,您目前蓝币${$.totalBlue}个,不足以兑换${$.title}所需的${$.blueCost}个`), $.beanerr = `兑换失败,您目前蓝币${$.totalBlue}个,不足以兑换${$.title}所需的${$.blueCost}个`
    } else {
        console.log("\n\n温馨提示：需兑换商品的名称设置请尽量与其他商品有区分度，否则可能会兑换成其他类似商品\n\n");
        let i, prizeId = "";
        for (let index = 0; index < prizeList.length; index++) prizeList[index].name.indexOf(coinToBeans) > -1 && (prizeId = prizeList[index].prizeId, i = index, $.title = prizeList[index].name, $.blueCost = prizeList[index].cost, $.type = prizeList[index].type, $.beanType = prizeList[index].hasOwnProperty("beanType"));
        if (prizeId) {
            if (506 === prizeList[i].inStock || -1 === prizeList[i].inStock) return console.log(`失败，您输入设置的${coinToBeans}领光了，请明天再来`), void($.beanerr = `失败，您输入设置的${coinToBeans}领光了，请明天再来`);
            if (prizeList[i].targetNum && prizeList[i].targetNum === prizeList[i].finishNum) return void($.beanerr = `${prizeList[0].subTitle}`);
            if ($.totalBlue > $.blueCost)
                if (4 !== $.type || $.beanType)
                    for (let j = 0; j <= 10 && (await smtg_obtainPrize(prizeId), !($.errBizCodeCount >= 15)); j++);
                else
                    for (let j = 0; j <= 10 && (await smtg_obtainPrize(prizeId, 0, "smtg_lockMaterialPrize"), !($.errBizCodeCount >= 15)); j++);
            else console.log(`兑换失败,您目前蓝币${$.totalBlue}个,不足以兑换${$.title}所需的${$.blueCost}个`), $.beanerr = `兑换失败,您目前蓝币${$.totalBlue}个,不足以兑换${$.title}所需的${$.blueCost}个`
        } else console.log(`奖品兑换列表【${coinToBeans}】已下架，请检查活动页面是否存在此商品，如存在请检查您的输入是否正确`), $.beanerr = `奖品兑换列表【${coinToBeans}】已下架`
    }
}

function smtg_materialPrizeIndex(timeout = 0) {
    return $.materialPrizeIndex = [], new Promise((resolve => {
        setTimeout((() => {
            let url = {
                url: `${JD_API_HOST}&functionId=smtg_materialPrizeIndex&clientVersion=8.0.0&client=m&body=%7B%22channel%22:%221%22%7D&t=${Date.now()}`,
                headers: {
                    Origin: "https://jdsupermarket.jd.com",
                    Cookie: cookie,
                    Connection: "keep-alive",
                    Accept: "application/json, text/plain, */*",
                    Referer: "https://jdsupermarket.jd.com/game/?tt=1597540727225",
                    Host: "api.m.jd.com",
                    "Accept-Encoding": "gzip, deflate, br",
                    "Accept-Language": "zh-cn"
                }
            };
            $.post(url, (async (err, resp, data) => {
                try {
                    if (safeGet(data)) {
                        if (0 !== (data = JSON.parse(data)).data.bizCode) return void($.beanerr = `${data.data.bizMsg}`);
                        $.materialPrizeIndex = data.data.result.prizes || []
                    }
                } catch (e) {
                    $.logErr(e, resp)
                } finally {
                    resolve()
                }
            }))
        }), timeout)
    }))
}

function smtg_queryPrize(timeout = 0) {
    return $.queryPrizeData = [], new Promise((resolve => {
        setTimeout((() => {
            let url = {
                url: `${JD_API_HOST}&functionId=smt_queryPrizeAreas&clientVersion=8.0.0&client=m&body=%7B%22channel%22%3A%2218%22%7D&t=${Date.now()}`,
                headers: {
                    Origin: "https://jdsupermarket.jd.com",
                    Cookie: cookie,
                    Connection: "keep-alive",
                    Accept: "application/json, text/plain, */*",
                    Referer: "https://jdsupermarket.jd.com/game/?tt=1597540727225",
                    Host: "api.m.jd.com",
                    "Accept-Encoding": "gzip, deflate, br",
                    "Accept-Language": "zh-cn"
                }
            };
            $.post(url, (async (err, resp, data) => {
                try {
                    if (safeGet(data)) {
                        if (0 !== (data = JSON.parse(data)).data.bizCode) return console.log(`${data.data.bizMsg}\n`), void($.beanerr = `${data.data.bizMsg}`);
                        if (0 === data.data.bizCode) {
                            const {
                                areas: areas
                            } = data.data.result, prizes = areas.filter((vo => 4 === vo.type));
                            prizes && prizes[0] && ($.areaId = prizes[0].areaId, $.periodId = prizes[0].periodId, $.queryPrizeData = prizes[0].prizes || [])
                        }
                    }
                } catch (e) {
                    $.logErr(e, resp)
                } finally {
                    resolve()
                }
            }))
        }), timeout)
    }))
}

function smtg_obtainPrize(prizeId, timeout = 0, functionId = "smt_exchangePrize") {
    const body = {
        connectId: prizeId,
        areaId: $.areaId,
        periodId: $.periodId,
        informationParam: {
            eid: "",
            referUrl: -1,
            shshshfp: "",
            openId: -1,
            isRvc: 0,
            fp: -1,
            shshshfpa: "",
            shshshfpb: "",
            userAgent: -1
        },
        channel: "18"
    };
    return new Promise((resolve => {
        setTimeout((() => {
            let url = {
                url: `${JD_API_HOST}&functionId=${functionId}&clientVersion=8.0.0&client=m&body=${encodeURIComponent(JSON.stringify(body))}&t=${Date.now()}`,
                headers: {
                    Origin: "https://jdsupermarket.jd.com",
                    Cookie: cookie,
                    Connection: "keep-alive",
                    Accept: "application/json, text/plain, */*",
                    Referer: "https://jdsupermarket.jd.com/game/?tt=1597540727225",
                    Host: "api.m.jd.com",
                    "Accept-Encoding": "gzip, deflate, br",
                    "Accept-Language": "zh-cn"
                }
            };
            $.post(url, (async (err, resp, data) => {
                try {
                    if (console.log(`兑换结果:${data}`), safeGet(data)) {
                        if (data = JSON.parse(data), $.data = data, 0 !== $.data.data.bizCode && 400 !== $.data.data.bizCode) return void($.beanerr = `${$.data.data.bizMsg}`);
                        if (400 === $.data.data.bizCode) return $.errBizCodeCount++, void console.log(`debug 兑换京豆活动火爆次数:${$.errBizCodeCount}`);
                        if (0 === $.data.data.bizCode)
                            if ("1000" == `${coinToBeans}`) {
                                if ($.beanscount++, console.log(`【京东账号${$.index}】${$.nickName||$.UserName} 第${$.data.data.result.count}次换${$.title}成功`), 1 === $.beanscount) return
                            } else if ("20" == `${coinToBeans}`) {
                            if ($.beanscount++, console.log(`【京东账号${$.index}】${$.nickName||$.UserName} 第${$.data.data.result.count}次换${$.title}成功`), 20 === $.data.data.result.count || $.beanscount === coinToBeans || $.data.data.result.blue < $.blueCost) return
                        } else if ($.beanscount++, console.log(`【京东账号${$.index}】${$.nickName||$.UserName} 第${$.data.data.result.count}次换${$.title}成功`), 1 === $.beanscount) return
                    }
                    await smtg_obtainPrize(prizeId, 3e3)
                } catch (e) {
                    $.logErr(e, resp)
                } finally {
                    resolve()
                }
            }))
        }), timeout)
    }))
}

function smtgHome() {
    return new Promise((resolve => {
        $.get(taskUrl("smtg_newHome"), ((err, resp, data) => {
            try {
                if (err) console.log("\n东东超市兑换奖品: API查询请求失败 ‼️‼️"), console.log(JSON.stringify(err));
                else if (safeGet(data) && 0 === (data = JSON.parse(data)).data.bizCode) {
                    const {
                        result: result
                    } = data.data;
                    $.totalBlue = result.totalBlue, console.log(`【总蓝币】${$.totalBlue}个\n`)
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve()
            }
        }))
    }))
}

function sleep(timeout) {
    return new Promise((resolve => setTimeout(resolve, timeout)))
}

function msgShow() {
    return new Promise((async resolve => {
        $.log(`\n【京东账号${$.index}】${$.nickName||$.UserName}\n${coinToBeans?`【兑换${$.title}】${$.beanscount?"成功":$.beanerr}`:"您设置的是不兑换奖品"}\n`), $.isNode() && process.env.MARKET_REWARD_NOTIFY ? $.ctrTemp = "false" == `${process.env.MARKET_REWARD_NOTIFY}` : $.getdata("jdSuperMarketRewardNotify") ? $.ctrTemp = "false" === $.getdata("jdSuperMarketRewardNotify") : $.ctrTemp = "false" == `${jdNotify}`, $.beanscount && $.ctrTemp && ($.msg($.name, "", `【京东账号${$.index}】${$.nickName||$.UserName}\n${coinToBeans?`【兑换${$.title}】${$.beanscount?`成功，数量：${$.beanscount}个`:$.beanerr}`:"您设置的是不兑换奖品"}`), allMessage += `【京东账号${$.index}】${$.nickName||$.UserName}\n${coinToBeans?`【兑换${$.title}】${$.beanscount?`成功，数量：${$.beanscount}个`:$.beanerr}`:"您设置的是不兑换奖品"}${$.index!==cookiesArr.length?"\n\n":""}`), resolve()
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

function safeGet(data) {
    try {
        if ("object" == typeof JSON.parse(data)) return !0
    } catch (e) {
        return console.log(e), console.log("京东服务器访问数据为空，请检查自身设备网络情况"), !1
    }
}

function taskUrl(function_id, body = {}) {
    return {
        url: `${JD_API_HOST}&functionId=${function_id}&clientVersion=8.0.0&client=m&body=${escape(JSON.stringify(body))}&t=${Date.now()}`,
        headers: {
            "User-Agent": $.isNode() ? process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : require("./USER_AGENTS").USER_AGENT : $.getdata("JDUA") ? $.getdata("JDUA") : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1",
            Host: "api.m.jd.com",
            Cookie: cookie,
            Referer: "https://jdsupermarket.jd.com/game",
            Origin: "https://jdsupermarket.jd.com"
        }
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
}
Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        S: this.getMilliseconds()
    };
    for (var k in /(y+)/.test(fmt) && (fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length))), o) new RegExp("(" + k + ")").test(fmt) && (fmt = fmt.replace(RegExp.$1, 1 == RegExp.$1.length ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)));
    return fmt
}, (async () => {
    if (cookiesArr[0]) {
        for (let i = 0; i < cookiesArr.length; i++)
            if (cookie = cookiesArr[i], cookie) {
                if ($.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1]), $.index = i + 1, $.data = {}, $.coincount = 0, $.beanscount = 0, $.blueCost = 0, $.errBizCodeCount = 0, $.coinerr = "", $.beanerr = "", $.title = "", $.isLogin = !0, $.nickName = "", await TotalBean(), console.log(`\n****开始【京东账号${$.index}】${$.nickName||$.UserName}****\n`), !$.isLogin) {
                    $.msg($.name, "【提示】cookie已失效", `京东账号${$.index} ${$.nickName||$.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, {
                        "open-url": "https://bean.m.jd.com/bean/signIndex.action"
                    }), $.isNode() && await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName||$.UserName}\n请重新登录获取cookie`);
                    continue
                }
                $.isNode() && process.env.MARKET_COIN_TO_BEANS && (coinToBeans = process.env.MARKET_COIN_TO_BEANS);
                try {
                    "0" != `${coinToBeans}` ? (await smtgHome(), await PrizeIndex()) : console.log("查询到您设置的是不兑换京豆选项，现在为您跳过兑换京豆。如需兑换，请去BoxJs设置或者修改脚本coinToBeans或设置环境变量MARKET_COIN_TO_BEANS\n"), await msgShow()
                } catch (e) {
                    $.logErr(e)
                }
            } $.isNode() && allMessage && $.ctrTemp && await notify.sendNotify(`${$.name}`, `${allMessage}`)
    } else $.msg($.name, "【提示】请先获取cookie\n直接使用NobyDa的京东签到获取", "https://bean.m.jd.com/bean/signIndex.action", {
        "open-url": "https://bean.m.jd.com/bean/signIndex.action"
    })
})().catch((e => $.logErr(e))).finally((() => $.done()));