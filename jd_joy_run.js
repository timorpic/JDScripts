const $ = new Env("宠汪汪赛跑_Timorpic"),
    zooFaker = require("./JDJRValidator_Pure");
$.get = zooFaker.injectToRequest2($.get.bind($)), $.post = zooFaker.injectToRequest2($.post.bind($));
let jdJoyRunToken = "";
const isRequest = "undefined" != typeof $request,
    JD_BASE_API = "https://draw.jdfcloud.com//pet",
    jdCookieNode = $.isNode() ? require("./jdCookie.js") : {};
let invite_pins = ["39242147-966648,jd_4c1cba962a151,231227903-90925406"],
    run_pins = ["39242147-966648,jd_4c1cba962a151,231227903-90925406"],
    friendsArr = ["jd_4685b2157f874", "jd_7399bee01a89e", "shingolll", "13536765947_p"],
    cookiesArr = [],
    cookie = "",
    nowTimes = new Date((new Date).getTime() + 60 * (new Date).getTimezoneOffset() * 1e3 + 288e5);
const headers = {
    Connection: "keep-alive",
    "Accept-Encoding": "gzip, deflate, br",
    "App-Id": "",
    "Lottery-Access-Signature": "",
    "Content-Type": "application/json",
    reqSource: "weapp",
    "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1",
    Cookie: "",
    openId: "",
    Host: "draw.jdfcloud.com",
    Referer: "https://servicewechat.com/wxccb5c536b0ecd1bf/633/page-frame.html",
    "Accept-Language": "zh-cn",
    Accept: "*/*",
    LKYLToken: ""
};
async function main() {
    if (!cookiesArr[0]) return void $.msg($.name, "【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取", "https://bean.m.jd.com/bean/signIndex.action", {
        "open-url": "https://bean.m.jd.com/bean/signIndex.action"
    });
    const readTokenRes = await readToken();
    readTokenRes && 200 === readTokenRes.code ? $.LKYLToken = readTokenRes.data[0] || ($.isNode() ? process.env.JOY_RUN_TOKEN ? process.env.JOY_RUN_TOKEN : jdJoyRunToken : $.getdata("jdJoyRunToken") || jdJoyRunToken) : $.LKYLToken = $.isNode() ? process.env.JOY_RUN_TOKEN ? process.env.JOY_RUN_TOKEN : jdJoyRunToken : $.getdata("jdJoyRunToken") || jdJoyRunToken, console.log(`打印token：${$.LKYLToken?$.LKYLToken:"暂无token"}\n`), $.LKYLToken || $.msg($.name, "【提示】请先获取来客有礼宠汪汪token", "iOS用户微信搜索'来客有礼'小程序\n点击底部的'发现'Tab\n即可获取Token");
    for (let i = 0; i < cookiesArr.length; i++)
        if (cookiesArr[i]) {
            if ($.validate = "", $.isNode())
                if (process.env.JOY_RUN_HELP_MYSELF) {
                    console.log("\n赛跑会先给账号内部助力,如您当前账户有剩下助力机会则为lx0301作者助力\n");
                    let my_run_pins = [];
                    Object.values(jdCookieNode).filter((item => item.match(/pt_pin=([^; ]+)(?=;?)/))).map((item => my_run_pins.push(decodeURIComponent(item.match(/pt_pin=([^; ]+)(?=;?)/)[1])))), run_pins = [...new Set(my_run_pins), [...getRandomArrayElements([...run_pins[0].split(",")], [...run_pins[0].split(",")].length)]], run_pins = [
                        [...run_pins].join(",")
                    ], invite_pins = run_pins
                } else {
                    console.log("\n赛跑先给作者两个固定的pin进行助力,然后从账号内部与剩下的固定位置合并后随机抽取进行助力\n如需自己账号内部互助,设置环境变量 JOY_RUN_HELP_MYSELF 为true,则开启账号内部互助\n"), run_pins = run_pins[0].split(","), Object.values(jdCookieNode).filter((item => item.match(/pt_pin=([^; ]+)(?=;?)/))).map((item => run_pins.push(decodeURIComponent(item.match(/pt_pin=([^; ]+)(?=;?)/)[1])))), run_pins = [...new Set(run_pins)];
                    let fixPins = run_pins.splice(run_pins.indexOf("zhaosen2580"), 1);
                    const randomPins = getRandomArrayElements(run_pins, run_pins.length);
                    run_pins = [
                        [...fixPins, ...randomPins].join(",")
                    ], invite_pins = run_pins
                } cookie = cookiesArr[i], UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1]), $.index = i + 1, $.inviteReward = 0, $.runReward = 0, console.log(`\n开始【京东账号${$.index}】${UserName}\n`), $.jdLogin = !0, $.LKYLLogin = !0, console.log("=============【开始邀请助力】===============");
            const inviteIndex = $.index > invite_pins.length ? invite_pins.length - 1 : $.index - 1;
            let new_invite_pins = invite_pins[inviteIndex].split(",");
            if (new_invite_pins = [...new_invite_pins, ...getRandomArrayElements(friendsArr, friendsArr.length >= 18 ? 18 : friendsArr.length)], await invite(new_invite_pins), $.jdLogin && $.LKYLLogin)
                if (nowTimes.getHours() >= 9 && nowTimes.getHours() < 21) {
                    console.log("===========【开始助力好友赛跑】===========");
                    const runIndex = $.index > run_pins.length ? run_pins.length - 1 : $.index - 1;
                    let new_run_pins = run_pins[runIndex].split(",");
                    await run(new_run_pins)
                } else console.log("非赛跑时间\n");
            await showMsg()
        } $.done()
}
$.isNode() ? Object.keys(jdCookieNode).forEach((item => {
    cookiesArr.push(jdCookieNode[item])
})) : (cookiesArr = [$.getdata("CookieJD"), $.getdata("CookieJD2"), ...jsonParse($.getdata("CookiesJD") || "[]").map((item => item.cookie))].filter((item => !!item)), $.getdata("jd_joy_invite_pin") && (invite_pins = [], invite_pins.push($.getdata("jd_joy_invite_pin"))), $.getdata("jd2_joy_invite_pin") && (invite_pins.length > 0 || (invite_pins = []), invite_pins.push($.getdata("jd2_joy_invite_pin"))), $.getdata("jd_joy_run_pin") && (run_pins = [], run_pins.push($.getdata("jd_joy_run_pin"))), $.getdata("jd2_joy_run_pin") && (run_pins.length > 0 || (run_pins = []), run_pins.push($.getdata("jd2_joy_run_pin"))));
let count = 0;
async function getToken() {
    const url = $request.url;
    if ($.log(`${$.name}url\n${url}\n`), isURL(url, /^https:\/\/draw\.jdfcloud\.com(\/mirror)?\/\/api\/user\/addUser\?code=/)) {
        const body = JSON.parse($response.body),
            LKYLToken = body.data && body.data.token;
        LKYLToken && ($.log(`${$.name} token\n${LKYLToken}\n`), $.msg($.name, "更新Token: 成功🎉", ""), console.log(`\nToken，${LKYLToken}\n`), $.http.post({
            url: "http://share.turinglabs.net/api/v3/create/sharecode/",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                activity_name: "joy",
                share_code: LKYLToken
            }),
            timeout: 3e4
        }).then((resp => {
            if (200 === resp.statusCode) try {
                let {
                    body: body
                } = resp;
                console.log(`Token提交结果:${body}\n`), body = JSON.parse(body), console.log(`${body.message}`)
            } catch (e) {
                console.log(`提交Token异常:${e}`)
            }
        })).catch((e => console.log(`catch 宠汪汪TOKEN提交异常:${e}`))), $.setdata(LKYLToken, "jdJoyRunToken")), $.done({
            body: JSON.stringify(body)
        })
    } else if (isURL(url, /^https:\/\/draw\.jdfcloud\.com(\/mirror)?\/\/api\/user\/user\/detail\?openId=/)) {
        if ($request && "OPTIONS" !== $request.method) {
            const LKYLToken = $request.headers.LKYLToken;
            $.setdata(LKYLToken, "jdJoyRunToken"), $.msg($.name, "获取Token: 成功🎉", ""), $.done({
                url: url
            })
        }
    } else $.done()
}

function readToken() {
    return new Promise((resolve => {
        $.get({
            url: "https://cdn.nz.lu/gettoken",
            headers: {
                Host: "jdsign.cf",
                "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1 Edg/87.0.4280.88"
            },
            timeout: 3e4
        }, ((err, resp, data) => {
            try {
                err ? (console.log(`${JSON.stringify(err)}`), console.log(`${$.name} API请求失败，请检查网路重试`)) : data && (console.log("\n\n搬运我脚本修改我内置互助码的，请不要盗取我服务器token\n\n\n"), data = JSON.parse(data))
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve(data)
            }
        }))
    }))
}

function showMsg() {
    return new Promise((async resolve => {
        if ($.inviteReward || $.runReward) {
            let message = "";
            $.inviteReward > 0 && (message += `给${$.inviteReward/30}人邀请助力成功,获得${$.inviteReward}积分\n`), $.runReward > 0 && (message += `给${$.runReward/5}人赛跑助力成功,获得狗粮${$.runReward}g`), message && $.msg($.name, "", `京东账号${$.index} ${UserName}\n${message}`)
        }
        resolve()
    }))
}
async function invite(invite_pins) {
    console.log(`账号${$.index} [${UserName}] 给下面名单的人进行邀请助力\n${invite_pins.map((item=>item.trim()))}\n`);
    for (let item of invite_pins.map((item => item.trim()))) {
        if (console.log(`\n账号${$.index} [${UserName}] 开始给好友 [${item}] 进行邀请助力`), UserName === item) {
            console.log("自己账号，跳过");
            continue
        }
        const data = await enterRoom(item);
        if (data)
            if (data.success) {
                const {
                    helpStatus: helpStatus
                } = data.data;
                if (console.log(`helpStatus ${helpStatus}`), "help_full" === helpStatus) {
                    console.log("您的邀请助力机会已耗尽\n");
                    break
                }
                if ("cannot_help" === helpStatus) console.log(`已给该好友 ${item} 助力过或者此friendPin是你自己\n`);
                else if ("invite_full" === helpStatus) console.log(`助力失败，该好友 ${item} 已经满3人给他助力了,无需您再次助力\n`);
                else if ("can_help" === helpStatus) {
                    console.log(`开始给好友 ${item} 助力\n`);
                    const LKYL_DATA = await helpInviteFriend(item);
                    if ("L0001" === LKYL_DATA.errorCode && !LKYL_DATA.success) {
                        console.log("来客有礼宠汪汪token失效"), $.setdata("", "jdJoyRunToken"), $.msg($.name, "【提示】来客有礼token失效，请重新获取", "iOS用户微信搜索'来客有礼'小程序\n点击底部的'发现'Tab\n即可获取Token"), $.LKYLLogin = !1;
                        break
                    }
                    $.LKYLLogin = !0
                }
                $.jdLogin = !0
            } else if ("B0001" === data.errorCode) {
            console.log("京东Cookie失效"), $.msg($.name, "【提示】京东cookie已失效", `京东账号${$.index} ${UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, {
                "open-url": "https://bean.m.jd.com/bean/signIndex.action"
            }), $.jdLogin = !1;
            break
        }
    }
}

function enterRoom(invitePin) {
    return new Promise((resolve => {
        let lkt = (new Date).getTime(),
            lks = $.md5("q8DNJdpcfRQ69gIx" + lkt).toString();
        headers.lkt = lkt, headers.lks = lks, headers.Cookie = cookie, headers.LKYLToken = $.LKYLToken, headers["Content-Type"] = "application/json";
        const options = {
            url: `https://draw.jdfcloud.com//common/pet/enterRoom/h5?reqSource=weapp&invitePin=${encodeURIComponent(invitePin)}&inviteSource=task_invite&shareSource=weapp&inviteTimeStamp=${Date.now()}&invokeKey=q8DNJdpcfRQ69gIx` + $.validate,
            body: JSON.stringify({}),
            headers: headers
        };
        $.post(options, ((err, resp, data) => {
            try {
                err ? ($.log(`${$.name} API请求失败`), $.log(JSON.stringify(err))) : data = JSON.parse(data)
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve(data)
            }
        }))
    }))
}

function helpInviteFriend(friendPin) {
    return new Promise((resolve => {
        let lkt = (new Date).getTime(),
            lks = $.md5("q8DNJdpcfRQ69gIx" + lkt).toString();
        headers.lkt = lkt, headers.lks = lks, headers.Cookie = cookie, headers.LKYLToken = $.LKYLToken;
        const options = {
            url: `https://draw.jdfcloud.com//common/pet/helpFriend?friendPin=${encodeURIComponent(friendPin)}&reqSource=weapp&invokeKey=q8DNJdpcfRQ69gIx` + $.validate,
            headers: headers
        };
        $.get(options, ((err, resp, data) => {
            try {
                err ? ($.log("API请求失败"), $.logErr(JSON.stringify(err))) : ($.log(`邀请助力结果：${data}`), (data = JSON.parse(data)).success && "help_ok" === data.errorCode && ($.inviteReward += 30))
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve(data)
            }
        }))
    }))
}
async function run(run_pins) {
    console.log(`账号${$.index} [${UserName}] 给下面名单的人进行赛跑助力\n${run_pins.map((item=>item.trim()))}\n`);
    for (let item of run_pins.map((item => item.trim()))) {
        if (console.log(`\n账号${$.index} [${UserName}] 开始给好友 [${item}] 进行赛跑助力`), UserName === item) {
            console.log("自己账号，跳过");
            continue
        }
        const combatDetailRes = await combatDetail(item),
            {
                petRaceResult: petRaceResult
            } = combatDetailRes.data;
        if (console.log(`petRaceResult ${petRaceResult}`), "help_full" === petRaceResult) {
            console.log("您的赛跑助力机会已耗尽");
            break
        }
        if ("can_help" === petRaceResult) {
            console.log(`开始赛跑助力好友 ${item}`);
            const LKYL_DATA = await combatHelp(item);
            if ("L0001" === LKYL_DATA.errorCode && !LKYL_DATA.success) {
                console.log("来客有礼宠汪汪token失效"), $.setdata("", "jdJoyRunToken"), $.msg($.name, "【提示】来客有礼token失效，请重新获取", "iOS用户微信搜索'来客有礼'小程序\n点击底部的'发现'Tab\n即可获取Token"), $.LKYLLogin = !1;
                break
            }
            $.LKYLLogin = !0
        }
    }
}

function combatHelp(friendPin) {
    return new Promise((resolve => {
        let lkt = (new Date).getTime(),
            lks = $.md5("q8DNJdpcfRQ69gIx" + lkt).toString();
        headers.lkt = lkt, headers.lks = lks, headers.Cookie = cookie, headers.LKYLToken = $.LKYLToken;
        const options = {
            url: `https://draw.jdfcloud.com//common/pet/combat/help?friendPin=${encodeURIComponent(friendPin)}&reqSource=weapp&invokeKey=q8DNJdpcfRQ69gIx` + $.validate,
            headers: headers
        };
        $.get(options, ((err, resp, data) => {
            try {
                err ? ($.log("API请求失败"), $.logErr(JSON.stringify(err))) : ($.log(`赛跑助力结果${data}`), "help_ok" === (data = JSON.parse(data)).errorCode && "help_ok" === data.data.helpStatus && (console.log(`助力${friendPin}成功\n获得狗粮${data.data.rewardNum}g\n`), $.runReward += data.data.rewardNum))
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve(data)
            }
        }))
    }))
}

function combatDetail(invitePin) {
    return new Promise((resolve => {
        let lkt = (new Date).getTime(),
            lks = $.md5("q8DNJdpcfRQ69gIx" + lkt).toString();
        headers.lkt = lkt, headers.lks = lks, headers.Cookie = cookie, headers.LKYLToken = $.LKYLToken;
        const options = {
            url: `https://draw.jdfcloud.com//common/pet/combat/detail/v2?help=true&inviterPin=${encodeURIComponent(invitePin)}&reqSource=weapp&invokeKey=q8DNJdpcfRQ69gIx` + $.validate,
            headers: headers
        };
        $.get(options, ((err, resp, data) => {
            try {
                err ? ($.log("API请求失败"), $.logErr(JSON.stringify(err))) : data = JSON.parse(data)
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve(data)
            }
        }))
    }))
}

function isURL(domain, reg) {
    return reg.test(domain)
}

function jsonParse(str) {
    if ("string" == typeof str) try {
        return JSON.parse(str)
    } catch (e) {
        return console.log(e), $.msg($.name, "", "请勿随意在BoxJs输入框修改内容\n建议通过脚本去获取cookie"), []
    }
}

function getRandomArrayElements(arr, count) {
    let temp, index, shuffled = arr.slice(0),
        i = arr.length,
        min = i - count;
    for (; i-- > min;) index = Math.floor((i + 1) * Math.random()), temp = shuffled[index], shuffled[index] = shuffled[i], shuffled[i] = temp;
    return shuffled.slice(min)
}

function getFriendPins() {
    return new Promise((resolve => {
        $.get({
            url: "https://cdn.jsdelivr.net/gh/Aaron-lv/updateTeam@master/friendPins.json",
            headers: {
                "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1 Edg/87.0.4280.88"
            },
            timeout: 1e5
        }, (async (err, resp, data) => {
            try {
                err ? console.log(`getFriendPins::${JSON.stringify(err)}`) : ($.friendPins = data && JSON.parse(data), $.friendPins && $.friendPins.friendsArr && (friendsArr = $.friendPins.friendsArr, console.log(`\n共提供 ${friendsArr.length}个好友供来进行邀请助力\n`)))
            } catch (e) {
                $.logErr(e, resp)
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
isRequest ? getToken() : main(),
    function (n) {
        function t(n, t) {
            var r = (65535 & n) + (65535 & t);
            return (n >> 16) + (t >> 16) + (r >> 16) << 16 | 65535 & r
        }

        function e(n, e, o, u, c, f) {
            return t(function r(n, t) {
                return n << t | n >>> 32 - t
            }(t(t(e, n), t(u, f)), c), o)
        }

        function o(n, t, r, o, u, c, f) {
            return e(t & r | ~t & o, n, t, u, c, f)
        }

        function u(n, t, r, o, u, c, f) {
            return e(t & o | r & ~o, n, t, u, c, f)
        }

        function c(n, t, r, o, u, c, f) {
            return e(t ^ r ^ o, n, t, u, c, f)
        }

        function f(n, t, r, o, u, c, f) {
            return e(r ^ (t | ~o), n, t, u, c, f)
        }

        function i(n, r) {
            n[r >> 5] |= 128 << r % 32, n[14 + (r + 64 >>> 9 << 4)] = r;
            var e, i, a, d, h, l = 1732584193,
                g = -271733879,
                v = -1732584194,
                m = 271733878;
            for (e = 0; e < n.length; e += 16) i = l, a = g, d = v, h = m, g = f(g = f(g = f(g = f(g = c(g = c(g = c(g = c(g = u(g = u(g = u(g = u(g = o(g = o(g = o(g = o(g, v = o(v, m = o(m, l = o(l, g, v, m, n[e], 7, -680876936), g, v, n[e + 1], 12, -389564586), l, g, n[e + 2], 17, 606105819), m, l, n[e + 3], 22, -1044525330), v = o(v, m = o(m, l = o(l, g, v, m, n[e + 4], 7, -176418897), g, v, n[e + 5], 12, 1200080426), l, g, n[e + 6], 17, -1473231341), m, l, n[e + 7], 22, -45705983), v = o(v, m = o(m, l = o(l, g, v, m, n[e + 8], 7, 1770035416), g, v, n[e + 9], 12, -1958414417), l, g, n[e + 10], 17, -42063), m, l, n[e + 11], 22, -1990404162), v = o(v, m = o(m, l = o(l, g, v, m, n[e + 12], 7, 1804603682), g, v, n[e + 13], 12, -40341101), l, g, n[e + 14], 17, -1502002290), m, l, n[e + 15], 22, 1236535329), v = u(v, m = u(m, l = u(l, g, v, m, n[e + 1], 5, -165796510), g, v, n[e + 6], 9, -1069501632), l, g, n[e + 11], 14, 643717713), m, l, n[e], 20, -373897302), v = u(v, m = u(m, l = u(l, g, v, m, n[e + 5], 5, -701558691), g, v, n[e + 10], 9, 38016083), l, g, n[e + 15], 14, -660478335), m, l, n[e + 4], 20, -405537848), v = u(v, m = u(m, l = u(l, g, v, m, n[e + 9], 5, 568446438), g, v, n[e + 14], 9, -1019803690), l, g, n[e + 3], 14, -187363961), m, l, n[e + 8], 20, 1163531501), v = u(v, m = u(m, l = u(l, g, v, m, n[e + 13], 5, -1444681467), g, v, n[e + 2], 9, -51403784), l, g, n[e + 7], 14, 1735328473), m, l, n[e + 12], 20, -1926607734), v = c(v, m = c(m, l = c(l, g, v, m, n[e + 5], 4, -378558), g, v, n[e + 8], 11, -2022574463), l, g, n[e + 11], 16, 1839030562), m, l, n[e + 14], 23, -35309556), v = c(v, m = c(m, l = c(l, g, v, m, n[e + 1], 4, -1530992060), g, v, n[e + 4], 11, 1272893353), l, g, n[e + 7], 16, -155497632), m, l, n[e + 10], 23, -1094730640), v = c(v, m = c(m, l = c(l, g, v, m, n[e + 13], 4, 681279174), g, v, n[e], 11, -358537222), l, g, n[e + 3], 16, -722521979), m, l, n[e + 6], 23, 76029189), v = c(v, m = c(m, l = c(l, g, v, m, n[e + 9], 4, -640364487), g, v, n[e + 12], 11, -421815835), l, g, n[e + 15], 16, 530742520), m, l, n[e + 2], 23, -995338651), v = f(v, m = f(m, l = f(l, g, v, m, n[e], 6, -198630844), g, v, n[e + 7], 10, 1126891415), l, g, n[e + 14], 15, -1416354905), m, l, n[e + 5], 21, -57434055), v = f(v, m = f(m, l = f(l, g, v, m, n[e + 12], 6, 1700485571), g, v, n[e + 3], 10, -1894986606), l, g, n[e + 10], 15, -1051523), m, l, n[e + 1], 21, -2054922799), v = f(v, m = f(m, l = f(l, g, v, m, n[e + 8], 6, 1873313359), g, v, n[e + 15], 10, -30611744), l, g, n[e + 6], 15, -1560198380), m, l, n[e + 13], 21, 1309151649), v = f(v, m = f(m, l = f(l, g, v, m, n[e + 4], 6, -145523070), g, v, n[e + 11], 10, -1120210379), l, g, n[e + 2], 15, 718787259), m, l, n[e + 9], 21, -343485551), l = t(l, i), g = t(g, a), v = t(v, d), m = t(m, h);
            return [l, g, v, m]
        }

        function a(n) {
            var t, r = "",
                e = 32 * n.length;
            for (t = 0; t < e; t += 8) r += String.fromCharCode(n[t >> 5] >>> t % 32 & 255);
            return r
        }

        function d(n) {
            var t, r = [];
            for (r[(n.length >> 2) - 1] = void 0, t = 0; t < r.length; t += 1) r[t] = 0;
            var e = 8 * n.length;
            for (t = 0; t < e; t += 8) r[t >> 5] |= (255 & n.charCodeAt(t / 8)) << t % 32;
            return r
        }

        function g(n) {
            var t, r, e = "";
            for (r = 0; r < n.length; r += 1) t = n.charCodeAt(r), e += "0123456789abcdef".charAt(t >>> 4 & 15) + "0123456789abcdef".charAt(15 & t);
            return e
        }

        function v(n) {
            return unescape(encodeURIComponent(n))
        }

        function m(n) {
            return function h(n) {
                return a(i(d(n), 8 * n.length))
            }(v(n))
        }

        function s(n, t) {
            return function l(n, t) {
                var r, e, o = d(n),
                    u = [],
                    c = [];
                for (u[15] = c[15] = void 0, o.length > 16 && (o = i(o, 8 * n.length)), r = 0; r < 16; r += 1) u[r] = 909522486 ^ o[r], c[r] = 1549556828 ^ o[r];
                return e = i(u.concat(d(t)), 512 + 8 * t.length), a(i(c.concat(e), 640))
            }(v(n), v(t))
        }
        $.md5 = function A(n, t, r) {
            return t ? r ? s(t, n) : function C(n, t) {
                return g(s(n, t))
            }(t, n) : r ? m(n) : function p(n) {
                return g(m(n))
            }(n)
        }
    }();