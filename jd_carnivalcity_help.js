const $ = new Env("京东手机狂欢城_Timorpic"),
    notify = $.isNode() ? require("./sendNotify") : "",
    jdCookieNode = $.isNode() ? require("./jdCookie.js") : "";
let cookiesArr = [],
    cookie = "",
    message = "",
    allMessage = "";
$.isNode() ? (Object.keys(jdCookieNode).forEach((item => {
    cookiesArr.push(jdCookieNode[item])
})), process.env.JD_DEBUG && "false" === process.env.JD_DEBUG && (console.log = () => {}), JSON.stringify(process.env).indexOf("GITHUB") > -1 && process.exit(0)) : cookiesArr = [$.getdata("CookieJD"), $.getdata("CookieJD2"), ...jsonParse($.getdata("CookiesJD") || "[]").map((item => item.cookie))].filter((item => !!item));
let inviteCodes = [];
$.shareCodesArr = [];
const JD_API_HOST = "https://api.m.jd.com/api",
    activeEndTime = "2021/08/28 00:00:00+08:00";
let nowTime = (new Date).getTime() + 60 * (new Date).getTimezoneOffset() * 1e3 + 288e5;
async function JD818() {
    try {
        if (await indexInfo(), await supportList(), await getHelp(), $.blockAccount) return;
        await doHotProducttask(), await doBrandTask(), await doBrowseshopTask(), await myRank(), await getListRank(), await getListIntegral(), await getListJbean(), await check(), await showMsg()
    } catch (e) {
        $.logErr(e)
    }
}
async function doHotProducttask() {
    $.hotProductList = $.hotProductList.filter((v => !!v && "1" === v.status)), $.hotProductList && $.hotProductList.length && console.log("开始 【浏览热销手机产品】任务,需等待6秒");
    for (let item of $.hotProductList) await doBrowse(item.id, "", "hot", "browse", "browseHotSku"), await $.wait(6e3), $.browseId && await getBrowsePrize($.browseId)
}

function doBrowse(id = "", brandId = "", taskMark = "hot", type = "browse", logMark = "browseHotSku") {
    return $.browseId = "", new Promise((resolve => {
        const options = taskPostUrl("/khc/task/doBrowse", {
            brandId: `${brandId}`,
            id: `${id}`,
            taskMark: `${taskMark}`,
            type: `${type}`,
            logMark: `${logMark}`
        });
        $.post(options, ((err, resp, data) => {
            try {
                err ? (console.log(`${JSON.stringify(err)}`), console.log(`${$.name} API请求失败，请检查网路重试`)) : (console.log(`doBrowse 做${taskMark}任务:${data}`), (data = JSON.parse(data)) && 200 === data.code ? $.browseId = data.data.browseId || "" : console.log("doBrowse异常"))
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve()
            }
        }))
    }))
}

function getBrowsePrize(browseId, brandId = "") {
    return new Promise((resolve => {
        const options = taskPostUrl("/khc/task/getBrowsePrize", {
            browseId: browseId,
            brandId: `${brandId}`
        });
        $.post(options, ((err, resp, data) => {
            try {
                err ? (console.log(`${JSON.stringify(err)}`), console.log(`${$.name} API请求失败，请检查网路重试`)) : (console.log(`getBrowsePrize 领取奖励 结果:${data}`), (data = JSON.parse(data)) && 200 === data.code && data.data.jingBean && ($.beans += data.data.jingBean))
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve(data)
            }
        }))
    }))
}

function followShop(browseId, brandId = "") {
    return new Promise((resolve => {
        const options = taskPostUrl("/khc/task/followShop", {
            id: `${browseId}`,
            brandId: `${brandId}`
        });
        $.post(options, ((err, resp, data) => {
            try {
                err ? (console.log(`${JSON.stringify(err)}`), console.log(`${$.name} API请求失败，请检查网路重试`)) : (console.log(`followShop 领取奖励 结果:${data}`), (data = JSON.parse(data)) && 200 === data.code && data.data.jingBean && ($.beans += data.data.jingBean))
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve(data)
            }
        }))
    }))
}
async function doBrandTask() {
    for (let brand of $.brandList) await brandTaskInfo(brand.brandId)
}

function brandTaskInfo(brandId) {
    const options = taskPostUrl("/khc/index/brandTaskInfo", {
        brandId: `${brandId}`
    });
    return $.skuTask = [], $.shopTask = [], $.meetingTask = [], $.questionTask = {}, new Promise((resolve => {
        $.post(options, (async (err, resp, data) => {
            try {
                if (err) console.log(`${JSON.stringify(err)}`), console.log(`${$.name} API请求失败，请检查网路重试`);
                else if (200 === (data = $.toObj(data)).code) {
                    let brandId = data.data.brandId;
                    $.skuTask = data.data.skuTask || [], $.shopTask = data.data.shopTask || [], $.meetingTask = data.data.meetingTask || [], $.questionTask = data.data.questionTask || [];
                    let flag = !0;
                    for (let sku of $.shopTask.filter((vo => !!vo && "4" !== vo.status))) flag && console.log(`\n开始做 品牌手机 【${data.data.brandName}】 任务`), flag && (flag = !1), console.log(`开始浏览 1-F 关注 任务 ${sku.name}`), 3 == sku.status ? await followShop(sku.id, brandId) : 8 == sku.status ? (await doBrowse(sku.id, brandId, "brand", "follow", "browseShop"), await $.wait(6e3), $.browseId && await getBrowsePrize($.browseId, brandId)) : console.log(`未知任务状态 ${sku.status}`);
                    flag = !0;
                    for (let sku of $.skuTask.filter((vo => !!vo && "4" !== vo.status))) flag && console.log(`\n开始做 品牌手机 【${data.data.brandName}】 任务`), flag && (flag = !1), console.log(`开始浏览 2-F 单品区 任务 ${sku.name}`), await doBrowse(sku.id, brandId, "brand", "presell", "browseSku"), await $.wait(6e3), $.browseId && await getBrowsePrize($.browseId, brandId);
                    flag = !0;
                    for (let sku of $.meetingTask.filter((vo => !!vo && "4" !== vo.status))) flag && console.log(`\n开始做 品牌手机 【${data.data.brandName}】 任务`), flag && (flag = !1), console.log(`开始浏览 3-F 综合区 任务 ${sku.name}，需等待10秒`), await doBrowse(sku.id, brandId, "brand", "meeting", "browseVenue"), await $.wait(10500), $.browseId && await getBrowsePrize($.browseId, brandId);
                    if (flag = !0, $.questionTask.hasOwnProperty("id") && "0" === $.questionTask.result) {
                        flag && console.log(`\n开始做 品牌手机 【${data.data.brandName}】 任务`), flag && (flag = !1), console.log(`开始做答题任务 ${$.questionTask.question}`);
                        let result = 0;
                        for (let i = 0; i < $.questionTask.answers.length; i++) $.questionTask.answers[i].right && (result = i + 1);
                        0 !== result && await doQuestion(brandId, $.questionTask.id, result)
                    }
                } else console.log(`失败：${JSON.stringify(data)}`)
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve(data)
            }
        }))
    }))
}

function doQuestion(brandId, questionId, result) {
    return new Promise((resolve => {
        const options = taskPostUrl("/khc/task/doQuestion", {
            brandId: `${brandId}`,
            questionId: `${questionId}`,
            result: result
        });
        $.post(options, ((err, resp, data) => {
            try {
                err ? (console.log(`${JSON.stringify(err)}`), console.log(`${$.name} API请求失败，请检查网路重试`)) : (console.log(`doQuestion 领取答题任务奖励 结果:${data}`), (data = JSON.parse(data)) && 200 === data.code && data.data.jingBean && ($.beans += data.data.jingBean))
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve(data)
            }
        }))
    }))
}
async function doBrowseshopTask() {
    $.browseshopList = $.browseshopList.filter((v => !!v && "6" === v.status)), $.browseshopList && $.browseshopList.length && console.log("\n开始 【逛好货街，做任务】，需等待10秒");
    for (let shop of $.browseshopList) await doBrowse(shop.id, "", "browseShop", "browse", "browseShop"), await $.wait(1e4), $.browseId && await getBrowsePrize($.browseId)
}

function indexInfo(flag = !1) {
    const options = taskPostUrl("/khc/index/indexInfo", {});
    return $.hotProductList = [], $.brandList = [], $.browseshopList = [], new Promise((resolve => {
        $.post(options, (async (err, resp, data) => {
            try {
                err ? (console.log(`${JSON.stringify(err)}`), console.log(`${$.name} API请求失败，请检查网路重试`)) : 200 === (data = $.toObj(data)).code ? ($.hotProductList = data.data.hotProductList, $.brandList = data.data.brandList, $.browseshopList = data.data.browseshopList) : console.log(`异常：${JSON.stringify(data)}`)
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve()
            }
        }))
    }))
}

function supportList() {
    const options = taskPostUrl("/khc/index/supportList", {});
    return new Promise((resolve => {
        $.post(options, (async (err, resp, data) => {
            try {
                err ? (console.log(`${JSON.stringify(err)}`), console.log(`${$.name} API请求失败，请检查网路重试`)) : 200 === (data = JSON.parse(data)).code && (console.log(`助力情况：${data.data.supportedNums}/${data.data.supportNeedNums}`), message += `邀请好友助力：${data.data.supportedNums}/${data.data.supportNeedNums}\n`)
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve()
            }
        }))
    }))
}

function lottery() {
    const options = taskPostUrl("/khc/record/lottery", {});
    return new Promise((resolve => {
        $.post(options, (async (err, resp, data) => {
            try {
                if (err) console.log(`${JSON.stringify(err)}`), console.log(`${$.name} API请求失败，请检查网路重试`);
                else if (200 === (data = JSON.parse(data)).code)
                    if (8 !== data.data.prizeId) {
                        const url = "https://carnivalcity.m.jd.com/#/integralDetail";
                        console.log(`积分抽奖获得:${data.data.prizeName}`), message += `积分抽奖获得：${data.data.prizeName}\n`, $.msg($.name, "", `京东账号 ${$.index} ${$.nickName||$.UserName}\n积分抽奖获得：${data.data.prizeName}\n兑换地址：${url}`, {
                            "open-url": url
                        }), $.isNode() && await notify.sendNotify($.name, `京东账号 ${$.index} ${$.nickName||$.UserName}\n积分抽奖获得：${data.data.prizeName}\n兑换地址：${url}`)
                    } else console.log(`积分抽奖结果:${data.data.prizeName}}`)
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve()
            }
        }))
    }))
}

function check() {
    const options = taskPostUrl("/khc/record/convertRecord", {
        pageNum: 1
    });
    return new Promise((resolve => {
        $.post(options, (async (err, resp, data) => {
            try {
                if (err) console.log(`${JSON.stringify(err)}`), console.log(`${$.name} API请求失败，请检查网路重试`);
                else {
                    data = JSON.parse(data);
                    let str = "";
                    if (200 === data.code)
                        for (let obj of data.data) obj.hasOwnProperty("fillStatus") && !0 !== obj.fillStatus && (str += JSON.stringify(obj));
                    if (str.length > 0) {
                        const url = "https://carnivalcity.m.jd.com/#/integralDetail";
                        $.msg($.name, "", `京东账号 ${$.index} ${$.nickName||$.UserName}\n积分抽奖获得：${str}\n兑换地址：${url}`, {
                            "open-url": url
                        }), $.isNode() && await notify.sendNotify($.name, `京东账号 ${$.index} ${$.nickName||$.UserName}\n积分抽奖获得：${str}\n兑换地址：${url}`)
                    }
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve()
            }
        }))
    }))
}

function myRank() {
    return new Promise((resolve => {
        const options = taskPostUrl("/khc/rank/myPastRanks", {});
        $.post(options, (async (err, resp, data) => {
            try {
                if (err) console.log(`${JSON.stringify(err)}`), console.log(`${$.name} API请求失败，请检查网路重试`);
                else if (200 === (data = JSON.parse(data)).code && data.data && data.data.length)
                    for (let i = 0; i < data.data.length; i++)
                        if ($.date = data.data[i].date, "1" === data.data[i].status) {
                            console.log(`开始领取往期奖励【${data.data[i].prizeName}】`);
                            let res = await saveJbean($.date);
                            res && 200 === res.code ? ($.beans += Number(res.data), console.log(`${data.data[i].date}日 【${res.data}】京豆奖励领取成功`)) : console.log(`往期奖励领取失败：${JSON.stringify(res)}`), await $.wait(500)
                        } else "3" === data.data[i].status ? console.log(`${data.data[i].date}日 【${data.data[i].prizeName}】往期京豆奖励已领取~`) : console.log(`${data.data[i].date}日 【${data.data[i].status}】往期京豆奖励，今日争取进入前30000名哦~`)
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve(data)
            }
        }))
    }))
}

function saveJbean(date) {
    return new Promise((resolve => {
        const options = taskPostUrl("/khc/rank/getRankJingBean", {
            date: `${date}`
        });
        $.post(options, ((err, resp, data) => {
            try {
                err ? (console.log(`${JSON.stringify(err)}`), console.log(`${$.name} API请求失败，请检查网路重试`)) : data = JSON.parse(data)
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve(data)
            }
        }))
    }))
}
async function doHelp() {
    console.log("\n开始助力好友");
    for (let i in $.newShareCodes) {
        let item = $.newShareCodes[i];
        if (!item) continue;
        const helpRes = await toHelp(item.trim());
        if (5 === helpRes.data.status) {
            console.log("助力机会已耗尽，跳出助力");
            break
        }
        4 === helpRes.data.status && (console.log(`该助力码[${item}]已达上限`), $.newShareCodes[i] = "")
    }
}

function toHelp(code = "07f03d3d-a4f5-4bc9-9801-714b0ddf72d1") {
    return new Promise((resolve => {
        const options = taskPostUrl("/khc/task/doSupport", {
            shareId: `${code}`
        });
        $.post(options, ((err, resp, data) => {
            try {
                err ? (console.log(`${JSON.stringify(err)}`), console.log(`${$.name} API请求失败，请检查网路重试`)) : (console.log(`助力结果:${data}`), (data = JSON.parse(data)) && 200 === data.code && (6 === data.data.status && console.log("助力成功\n"), data.data.jdNums && ($.beans += data.data.jdNums)))
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve(data)
            }
        }))
    }))
}

function getHelp() {
    return new Promise((resolve => {
        const options = taskPostUrl("/khc/task/getSupport", {});
        $.post(options, (async (err, resp, data) => {
            try {
                err ? (console.log(`${JSON.stringify(err)}`), console.log(`${$.name} API请求失败，请检查网路重试`)) : 200 === (data = JSON.parse(data)).code ? (console.log(`\n\n${$.name}互助码每天都变化,旧的不可继续使用`), $.log(`【京东账号${$.index}（${$.UserName}）的${$.name}好友互助码】${data.data.shareId}\n\n`), $.temp.push(data.data.shareId)) : (console.log(`获取邀请码失败：${JSON.stringify(data)}`), 1002 !== data.code && 1001 !== data.code || ($.blockAccount = !0))
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve(data)
            }
        }))
    }))
}

function getListJbean() {
    return new Promise((resolve => {
        const options = taskPostUrl("/khc/record/jingBeanRecord", {
            pageNum: ""
        });
        $.post(options, (async (err, resp, data) => {
            try {
                err ? (console.log(`${JSON.stringify(err)}`), console.log(`${$.name} API请求失败，请检查网路重试`)) : 200 === (data = JSON.parse(data)).code ? ($.jingBeanNum = data.data.jingBeanNum || 0, message += `累计获得京豆：${$.jingBeanNum}🐶\n`) : console.log(`jingBeanRecord失败：${JSON.stringify(data)}`)
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve(data)
            }
        }))
    }))
}

function getListIntegral() {
    return new Promise((resolve => {
        const options = taskPostUrl("/khc/record/integralRecord", {
            pageNum: ""
        });
        $.post(options, (async (err, resp, data) => {
            try {
                if (err) console.log(`${JSON.stringify(err)}`), console.log(`${$.name} API请求失败，请检查网路重试`);
                else if (200 === (data = JSON.parse(data)).code) {
                    $.integralCount = data.data.integralNum || 0, message += `累计获得积分：${$.integralCount}\n`, console.log(`开始抽奖，当前积分可抽奖${parseInt($.integralCount/50)}次\n`);
                    for (let i = 0; i < parseInt($.integralCount / 50); i++) await lottery(), await $.wait(500)
                } else console.log(`integralRecord失败：${JSON.stringify(data)}`)
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve(data)
            }
        }))
    }))
}

function getListRank() {
    return new Promise((resolve => {
        const options = taskPostUrl("/khc/rank/dayRank", {});
        $.post(options, (async (err, resp, data) => {
            try {
                err ? (console.log(`${JSON.stringify(err)}`), console.log(`${$.name} API请求失败，请检查网路重试`)) : 200 === (data = JSON.parse(data)).code && (data.data.myRank && ($.integer = data.data.myRank.integral, $.num = data.data.myRank.rank, message += `当前获得积分：${$.integer}\n`, message += `当前获得排名：${$.num}\n`), data.data.lastRank && ($.lasNum = data.data.lastRank.rank, message += `当前参赛人数：${$.lasNum}\n`))
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve(data)
            }
        }))
    }))
}

function updateShareCodesCDN(url = "https://sub.timor.icu/JDscripts/jd_cityShareCodes.json") {
    return new Promise((resolve => {
        $.get({
            url: url,
            headers: {
                "User-Agent": $.isNode() ? process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : require("./USER_AGENTS").USER_AGENT : $.getdata("JDUA") ? $.getdata("JDUA") : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"
            },
            timeout: 2e5
        }, (async (err, resp, data) => {
            try {
                err ? (console.log(`${JSON.stringify(err)}`), console.log(`${$.name} API请求失败，请检查网路重试`)) : $.updatePkActivityIdRes = JSON.parse(data)
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
            const tempIndex = $.index > inviteCodes.length ? inviteCodes.length - 1 : $.index - 1;
            $.newShareCodes = inviteCodes[tempIndex] && inviteCodes[tempIndex].split("@") || [], $.updatePkActivityIdRes && $.updatePkActivityIdRes.length && ($.newShareCodes = [...$.updatePkActivityIdRes, ...$.newShareCodes])
        }
        resolve()
    }))
}

function taskPostUrl(a, t = {}) {
    const body = $.toStr({
        ...t,
        apiMapping: `${a}`
    });
    return {
        url: `${JD_API_HOST}`,
        body: `appid=guardian-starjd&functionId=carnivalcity_jd_prod&body=${body}&t=${Date.now()}&loginType=2`,
        headers: {
            Accept: "application/json, text/plain, */*",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "zh-cn",
            Connection: "keep-alive",
            "Content-Type": "application/x-www-form-urlencoded",
            Origin: "https://carnivalcity.m.jd.com",
            Referer: "https://carnivalcity.m.jd.com/",
            Cookie: cookie,
            "User-Agent": $.UA
        }
    }
}
async function showMsg() {
    $.beans && (allMessage += `京东账号${$.index} ${$.nickName||$.UserName}\n本次运行获得：${$.beans}京豆\n${message}活动地址：https://carnivalcity.m.jd.com${$.index!==cookiesArr.length?"\n\n":""}`), $.msg($.name, `京东账号${$.index} ${$.nickName||$.UserName}`, `${message}具体详情点击弹窗跳转后即可查看`, {
        "open-url": "https://carnivalcity.m.jd.com"
    })
}

function getUA() {
    $.UA = `jdapp;iPhone;10.0.10;14.3;${randomString(40)};network/wifi;model/iPhone12,1;addressid/4199175193;appBuild/167741;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1`
}

function randomString(e) {
    e = e || 32;
    let t = "abcdef0123456789",
        a = t.length,
        n = "";
    for (i = 0; i < e; i++) n += t.charAt(Math.floor(Math.random() * a));
    return n
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
        if ($.temp = [], nowTime > new Date(activeEndTime).getTime()) return $.msg($.name, "活动已结束", `该活动累计获得京豆：${$.jingBeanNum}个\n请删除此脚本\n咱江湖再见`), void($.isNode() && await notify.sendNotify($.name + "活动已结束", "请删除此脚本\n咱江湖再见"));
        $.http.get({
            url: "https://sub.timor.icu/JDscripts/jd_cityShareCodes.json"
        }).then((resp => {})).catch((e => $.log("刷新CDN异常", e))), await $.wait(1e3), await updateShareCodesCDN();
        for (let i = 0; i < cookiesArr.length; i++) cookiesArr[i] && (cookie = cookiesArr[i], $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1]), $.index = i + 1, $.isLogin = !0, $.nickName = "", $.jingBeanNum = 0, $.integralCount = 0, $.integer = 0, $.lasNum = 0, $.num = 0, $.beans = 0, $.blockAccount = !1, message = "", console.log(`\n开始【京东账号${$.index}】${$.nickName||$.UserName}\n`), getUA(), await shareCodesFormat(), await JD818());
        for (let i = 0; i < cookiesArr.length; i++)
            if (cookiesArr[i]) {
                if (cookie = cookiesArr[i], $.canHelp = !0, $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1]), cookiesArr && cookiesArr.length >= 1 && $.canHelp) {
                    console.log("\n先自己账号内部相互邀请助力\n");
                    for (let item of $.temp) {
                        console.log(`\n${$.UserName} 去参助力 ${item}`);
                        if (5 === (await toHelp(item.trim())).data.status) {
                            console.log("助力机会已耗尽，跳出助力"), $.canHelp = !1;
                            break
                        }
                    }
                }
                $.canHelp && (console.log("\n\n如果有剩余助力机会，则给作者以及随机码助力"), await doHelp())
            } allMessage && $.isNode() && (await notify.sendNotify($.name, allMessage, {
            url: "https://carnivalcity.m.jd.com"
        }), $.msg($.name, "", allMessage))
    } else $.msg($.name, "【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取", "https://bean.m.jd.com/bean/signIndex.action", {
        "open-url": "https://bean.m.jd.com/bean/signIndex.action"
    })
})().catch((e => {
    $.log("", `❌ ${$.name}, 失败! 原因: ${e}!`, "")
})).finally((() => {
    $.done()
}));