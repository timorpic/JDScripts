const $ = new Env("零食街_Timorpic"),
    notify = $.isNode() ? require("./sendNotify") : "",
    jdCookieNode = $.isNode() ? require("./jdCookie.js") : "";
$.CryptoJS = $.isNode() ? require("crypto-js") : CryptoJS, $.helpCodes = [], $.useInfo = {};
let cookiesArr = [];
async function main() {
    if ($.token = "", await getToken(), $.token)
        if (console.log(`Token:${$.token}`), await $.wait(500), $.thisNick = "", await takePostRequest("setMixNick"), await $.wait(500), $.missionType = "pv", await takePostRequest("foodRunningStats"), await $.wait(2e3), $.thisNick) {
            if (console.log(`助力码：${$.thisNick}`), $.useInfo[$.UserName] = $.thisNick, await $.wait(3e3), $.taskList = [], await takePostRequest("DailyTask"), await doTask(), await $.wait(3e3), $.sendCoinInfo = {}, await takePostRequest("SendCoinNum"), "{}" === JSON.stringify($.sendCoinInfo)) console.log("获取首页树数据失败");
            else if ($.getWhich = $.sendCoinInfo.which, 3 === $.getWhich.length) console.log("首页树金币已全领取");
            else
                for (let i = 0; i < 3; i++) $.treeNumber = i, $.getWhich.includes(i) ? console.log(`首页树金币，第${i+1}次，已领取`) : (console.log(`首页树金币，开始第${i+1}次，领取`), await takePostRequest("dotree"), await $.wait(500), $.missionType = "treeCoin", await takePostRequest("foodRunningStats"), await $.wait(5e3));
            console.log("开始玩一次游戏,等待10S"), await $.wait(1e4), await takePostRequest("SendCoin"), $.missionType = "finishGame", await takePostRequest("foodRunningStats"), await $.wait(2e3), $.boxStatusList = [], await takePostRequest("ThreeBoxStatus"), await $.wait(3e3), await openBox()
        } else console.log("获取活动详情失败");
    else console.log("获取Token失败")
}
async function openBox() {
    for (let i = 0; i < $.boxStatusList.length; i++) $.oneBoxInfo = $.boxStatusList[i], $.oneBoxInfo.openStatus && !$.oneBoxInfo.sendStatus ? (console.log(`打开第${i+1}个宝箱；`), await takePostRequest("OpenBox"), await $.wait(5e3)) : console.log(`第${i+1}个宝箱,已经打开`)
}
async function doTask() {
    for (let i = 0; i < $.taskList.length; i++)
        if ($.oneTaskInfo = $.taskList[i], "1" === $.oneTaskInfo.id || "2" === $.oneTaskInfo.id || "3" === $.oneTaskInfo.id)
            if ($.oneTaskInfo.dayTop === $.oneTaskInfo.hasGotNum) console.log(`任务：${$.oneTaskInfo.missionName},已完成`);
            else {
                let start = 0;
                $.oneTaskInfo.hasGotNum && (start = $.oneTaskInfo.hasGotNum);
                for (let j = start; j < $.oneTaskInfo.dayTop; j++) console.log(`执行任务，第${j+1}次，${$.oneTaskInfo.missionName}`), $.runId = "", await takePostRequest($.oneTaskInfo.type.replace(/( |^)[a-z]/g, (L => L.toUpperCase()))), await $.wait(2e3), $.runId && (await takePostRequest("complete/mission"), await $.wait(5e3))
            }
    else console.log(`任务：${$.oneTaskInfo.missionName},不执行`)
}
async function takePostRequest(type) {
    let url = "",
        body = "";
    switch (type) {
        case "setMixNick":
        case "DailyTask":
        case "ViewShop":
        case "ViewBanner":
        case "ViewGoods":
            url = `https://jinggengjcq-isv.isvjcloud.com/dm/front/foodRunning/${type}?open_id=&mix_nick=&bizExtString=&user_id=10299171`, body = {
                source: "01",
                strTMMixNick: $.token,
                method: "/foodRunning/" + type,
                actId: "jd_food_running",
                buyerNick: $.thisNick,
                pushWay: 1,
                userId: "10299171"
            };
            break;
        case "complete/mission":
            url = `https://jinggengjcq-isv.isvjcloud.com/dm/front/foodRunning/${type}?open_id=&mix_nick=&bizExtString=&user_id=10299171`, body = {
                goodsNumId: $.runId,
                missionType: $.oneTaskInfo.type,
                method: "/foodRunning/" + type,
                actId: "jd_food_running",
                buyerNick: $.thisNick,
                pushWay: 1,
                userId: "10299171"
            };
            break;
        case "HotGoodsList":
        case "SendCoinNum":
        case "ThreeBoxStatus":
            url = `https://jinggengjcq-isv.isvjcloud.com/dm/front/foodRunning/${type}?open_id=&mix_nick=&bizExtString=&user_id=10299171`, body = {
                method: "/foodRunning/" + type,
                actId: "jd_food_running",
                buyerNick: $.thisNick,
                pushWay: 1,
                userId: "10299171"
            };
            break;
        case "dotree":
            url = "https://jinggengjcq-isv.isvjcloud.com/dm/front/foodRunning/complete/mission?open_id=&mix_nick=&bizExtString=&user_id=10299171", body = {
                which: $.treeNumber,
                missionType: "treeCoin",
                method: "/foodRunning/complete/mission",
                actId: "jd_food_running",
                buyerNick: $.thisNick,
                pushWay: 1,
                userId: "10299171"
            };
            break;
        case "foodRunningStats":
            url = `https://jinggengjcq-isv.isvjcloud.com/dm/front/foodRunning/${type}?open_id=&mix_nick=&bizExtString=&user_id=10299171`, body = {
                missionType: $.missionType,
                method: "/foodRunning/" + type,
                actId: "jd_food_running",
                buyerNick: $.thisNick,
                pushWay: 1,
                userId: "10299171"
            };
            break;
        case "SendCoin":
            url = `https://jinggengjcq-isv.isvjcloud.com/dm/front/foodRunning/${type}?open_id=&mix_nick=&bizExtString=&user_id=10299171`, body = {
                coin: randomNum(5e3, 6e3),
                point: randomNum(1e4, 15e3),
                method: "/foodRunning/" + type,
                actId: "jd_food_running",
                buyerNick: $.thisNick,
                pushWay: 1,
                userId: "10299171"
            };
            break;
        case "OpenBox":
            url = `https://jinggengjcq-isv.isvjcloud.com/dm/front/foodRunning/${type}?open_id=&mix_nick=&bizExtString=&user_id=10299171`, body = {
                awardId: $.oneBoxInfo.id,
                method: "/foodRunning/" + type,
                actId: "jd_food_running",
                buyerNick: $.thisNick,
                pushWay: 1,
                userId: 10299171
            };
            break;
        case "help":
            url = "https://jinggengjcq-isv.isvjcloud.com/dm/front/foodRunning/complete/mission?open_id=&mix_nick=&bizExtString=&user_id=10299171", body = {
                inviterNick: $.oneCodeInfo.code,
                missionType: "inviteFriend",
                method: "/foodRunning/complete/mission",
                actId: "jd_food_running",
                buyerNick: $.thisNick,
                pushWay: 1,
                userId: 10299171
            };
            break;
        case "MyInviteList":
            url = `https://jinggengjcq-isv.isvjcloud.com/dm/front/foodRunning/${type}?open_id=&mix_nick=&bizExtString=&user_id=10299171`, body = {
                pageNo: 1,
                pageSize: 5,
                method: "/foodRunning/" + type,
                actId: "jd_food_running",
                buyerNick: $.thisNick,
                pushWay: 1,
                userId: 10299171
            };
            break;
        default:
            console.log(`错误${type}`)
    }
    let myRequest = getPostRequest(url, body);
    return new Promise((async resolve => {
        $.post(myRequest, ((err, resp, data) => {
            try {
                dealReturn(type, data)
            } catch (e) {
                console.log(data), $.logErr(e, resp)
            } finally {
                resolve()
            }
        }))
    }))
}

function randomNum(minNum, maxNum) {
    switch (arguments.length) {
        case 1:
            return parseInt(Math.random() * minNum + 1, 10);
        case 2:
            return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
        default:
            return 0
    }
}

function dealReturn(type, data) {
    switch (data = JSON.parse(data), type) {
        case "setMixNick":
            data.success && "200" === data.errorCode && data.data && data.data.status && 200 === data.data.status ? $.thisNick = data.data.data.msg : console.log(JSON.stringify(data));
            break;
        case "DailyTask":
            data.success && "200" === data.errorCode && data.data && data.data.status && 200 === data.data.status ? $.taskList = data.data.data : console.log(JSON.stringify(data));
            break;
        case "ViewShop":
        case "ViewBanner":
        case "ViewGoods":
            data.success && "200" === data.errorCode && data.data && data.data.status && 200 === data.data.status ? $.runId = data.data.data.id : console.log(JSON.stringify(data));
            break;
        case "complete/mission":
            data.success && "200" === data.errorCode && data.data && data.data.status && 200 === data.data.status ? console.log("任务完成") : console.log(JSON.stringify(data));
        case "SendCoinNum":
            data.success && "200" === data.errorCode && data.data && data.data.status && 200 === data.data.status ? $.sendCoinInfo = data.data.data : console.log(JSON.stringify(data));
            break;
        case "HotGoodsList":
            data.success && "200" === data.errorCode && data.data && data.data.status && 200 === data.data.status ? $.hotGoodsList = data.data.data : console.log(JSON.stringify(data));
            break;
        case "dotree":
            data.success && "200" === data.errorCode && data.data && data.data.status && 200 === data.data.status ? console.log(`任务完成,获得${data.data.data.sendNum}`) : console.log(JSON.stringify(data));
            break;
        case "foodRunningStats":
            console.log(JSON.stringify(data));
            break;
        case "SendCoin":
            data.success && "200" === data.errorCode && data.data && data.data.status && 200 === data.data.status ? console.log("游戏完成") : console.log(JSON.stringify(data));
            break;
        case "ThreeBoxStatus":
            data.success && "200" === data.errorCode && data.data && data.data.status && 200 === data.data.status ? $.boxStatusList = data.data.data : console.log(JSON.stringify(data));
            break;
        case "OpenBox":
            data.success && "200" === data.errorCode && data.data && data.data.status && 200 === data.data.status ? console.log(`打开宝箱获得：${data.data.data.msg}`) : console.log(JSON.stringify(data));
            break;
        case "MyInviteList":
            data.success && "200" === data.errorCode && data.data && data.data.status && 200 === data.data.status ? $.myInviteList = data.data.data : console.log(JSON.stringify(data));
            break;
        case "help":
            console.log(JSON.stringify(data)), data.success && "200" === data.errorCode ? ("好友助力数量已达上限，无法为好友助力！" === data.data.data.remark ? $.oneCodeInfo.max = !0 : "已经助力，不能再次助力哦！" === data.data.data.remark || ($.canHelp = !1), console.log(`${data.data.data.remark}`)) : "500" === data.errorCode && console.log(data.errorMessage);
            break;
        default:
            console.log(JSON.stringify(data))
    }
}

function getPostRequest(url, body) {
    let signInfo = getSign(body);
    body = `{"jsonRpc":"2.0","params":{"commonParameter":{"appkey":"${$.appkey}","m":"POST","sign":"${signInfo.sign}","timestamp":${signInfo.timeStamp},"userId":"10299171"},"admJson":${JSON.stringify(body)}}}`;
    return {
        url: url,
        method: "POST",
        headers: {
            "X-Requested-With": "XMLHttpRequest",
            Connection: "keep-alive",
            "Accept-Encoding": "gzip, deflate, br",
            "Content-Type": "application/json; charset=utf-8",
            Origin: "https://jinggengjcq-isv.isvjcloud.com",
            "User-Agent": $.isNode() ? process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : require("./USER_AGENTS").USER_AGENT : $.getdata("JDUA") ? $.getdata("JDUA") : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1",
            Cookie: $.cookie,
            Host: "jinggengjcq-isv.isvjcloud.com",
            Referer: "https://jinggengjcq-isv.isvjcloud.com/paoku/index.html",
            "Accept-Language": "zh-cn",
            Accept: "application/json"
        },
        body: body
    }
}
async function getToken() {
    return new Promise((async resolve => {
        let options = {
            url: "https://api.m.jd.com/client.action?functionId=isvObfuscator&clientVersion=10.0.4&build=88641&client=android&d_brand=OPPO&d_model=PCAM00&osVersion=10&screen=2208*1080&partner=oppo&oaid=&openudid=7049442d7e41523&eid=eidAfb0d81231cs3I4yd3GgLRjqcx9qFEcJEmyOMn1BwD8wvLt%2FpM7ENipVIQXuRiDyQ0FYw2aud9%20AhtGqo1Zhp0TsLEgoKZvAWkaXhApgim9hlEyRB&sdkVersion=29&lang=zh_CN&uuid=7049442d7e415232&aid=7049442d7e415232&area=4_48201_54794_0&networkType=4g&wifiBssid=unknown&uts=0f31TVRjBSsqndu4%2FjgUPz6uymy50MQJs2X%2FHz8dwQrKfrmFvPGJYcIhgT3KrbJ2slvZoaufp78QzL4RqQVUgaKH%2Fq7EntlwV7J5l6acE2Wlj2%2Bu6Thwe90cWmtV80fH0yhpOV%2FhYIwvD5N6W1zo3LCVXTcuOw%2BARC%2F6K3bndzn3KzMw%2FpkYzhE2JcXeXiD44r%2BkUMawpn%2Bk7XqSVytdBg%3D%3D&uemps=0-0&st=1624988916642&sign=6a25b389996897b263c70516fc3c71e1&sv=122",
            body: "body=%7B%22id%22%3A%22%22%2C%22url%22%3A%22https%3A%2F%2Fjinggengjcq-isv.isvjcloud.com%2Fpaoku%2Findex.html%3Fsid%3D75b413510cb227103e928769818a74ew%26un_area%3D4_48201_54794_0%22%7D&",
            headers: {
                Host: "api.m.jd.com",
                "User-Agent": $.isNode() ? process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : require("./USER_AGENTS").USER_AGENT : $.getdata("JDUA") ? $.getdata("JDUA") : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1",
                Cookie: $.cookie
            }
        };
        $.post(options, (async (err, resp, data) => {
            try {
                const reust = JSON.parse(data);
                0 === reust.errcode ? $.token = reust.token : $.log(data)
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve()
            }
        }))
    }))
}

function getSign(t) {
    var e = Date.now(),
        i = "0282266f9a794112a0ab4ab6c78f8a09",
        o = $.appkey,
        s = JSON.stringify(t),
        c = encodeURIComponent(s),
        r = new RegExp("'", "g"),
        d = new RegExp("~", "g"),
        h = i + "admjson" + (c = (c = c.replace(r, "%27")).replace(d, "%7E")) + "appkey" + o + "m" + t.method + "timestamp" + e + i;
    return {
        sign: $.CryptoJS.MD5(h.toLowerCase()),
        timeStamp: e
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
                Cookie: $.cookie,
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
$.appkey = "51B59BB805903DA4CE513D29EC448375", $.isNode() ? (Object.keys(jdCookieNode).forEach((item => {
    cookiesArr.push(jdCookieNode[item])
})), process.env.JD_DEBUG && "false" === process.env.JD_DEBUG && (console.log = () => {})) : cookiesArr = [$.getdata("CookieJD"), $.getdata("CookieJD2"), ...$.toObj($.getdata("CookiesJD") || "[]").map((item => item.cookie))].filter((item => !!item)), (async () => {
    if (cookiesArr[0])
        for (let i = 0; i < cookiesArr.length; i++) $.index = i + 1, $.cookie = cookiesArr[i], $.isLogin = !0, $.nickName = "", await TotalBean(), $.UserName = decodeURIComponent($.cookie.match(/pt_pin=([^; ]+)(?=;?)/) && $.cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1]), console.log(`\n*****开始【京东账号${$.index}】${$.nickName||$.UserName}*****\n`), $.isLogin ? (await main(), await $.wait(2e3)) : ($.msg($.name, "【提示】cookie已失效", `京东账号${$.index} ${$.nickName||$.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, {
            "open-url": "https://bean.m.jd.com/bean/signIndex.action"
        }), $.isNode() && await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`));
    else $.msg($.name, "【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取", "https://bean.m.jd.com/bean/signIndex.action", {
        "open-url": "https://bean.m.jd.com/bean/signIndex.action"
    })
})().catch((e => {
    $.log("", `❌ ${$.name}, 失败! 原因: ${e}!`, "")
})).finally((() => {
    $.done()
}));