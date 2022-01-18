const $ = new Env("摇京豆_Timorpic"),
    notify = $.isNode() ? require("./sendNotify") : "",
    jdCookieNode = $.isNode() ? require("./jdCookie.js") : "";
let cookiesArr = [],
    cookie = "",
    message = "",
    allMessage = "";
$.isNode() ? (Object.keys(jdCookieNode).forEach((item => {
    cookiesArr.push(jdCookieNode[item])
})), process.env.JD_DEBUG && "false" === process.env.JD_DEBUG && (console.log = () => {})) : cookiesArr = [$.getdata("CookieJD"), $.getdata("CookieJD2"), ...jsonParse($.getdata("CookiesJD") || "[]").map((item => item.cookie))].filter((item => !!item));
let superShakeBeanConfig = {
    superShakeUlr: "",
    superShakeBeanFlag: !1,
    superShakeTitle: "",
    taskVipName: ""
};
$.assigFirends = [], $.brandActivityId = "", $.brandActivityId2 = "2vSNXCeVuBy8mXTL2hhG3mwSysoL";
const JD_API_HOST = "https://api.m.jd.com/client.action";
async function clubLottery() {
    try {
        await doTasks(), await getFreeTimes(), await vvipclub_receive_lottery_times(), await vvipclub_shaking_info(), await shaking(), await shakeSign(), await superShakeBean(), await superbrandShakeBean()
    } catch (e) {
        $.logErr(e)
    }
}
async function doTasks() {
    const browseTaskRes = await getTask("browseTask");
    if (browseTaskRes.success) {
        const {
            totalPrizeTimes: totalPrizeTimes,
            currentFinishTimes: currentFinishTimes,
            taskItems: taskItems
        } = browseTaskRes.data[0], taskTime = totalPrizeTimes - currentFinishTimes;
        if (taskTime > 0) {
            let taskID = [];
            taskItems.map((item => {
                item.finish || taskID.push(item.id)
            })), taskID.length > 0 && console.log("开始做浏览页面任务");
            for (let i = 0; i < new Array(taskTime).fill("").length; i++) await $.wait(1e3), await doTask("browseTask", taskID[i])
        }
    } else console.log(`${JSON.stringify(browseTaskRes)}`);
    const attentionTaskRes = await getTask("attentionTask");
    if (attentionTaskRes.success) {
        const {
            totalPrizeTimes: totalPrizeTimes,
            currentFinishTimes: currentFinishTimes,
            taskItems: taskItems
        } = attentionTaskRes.data[0], taskTime = totalPrizeTimes - currentFinishTimes;
        if (taskTime > 0) {
            let taskID = [];
            taskItems.map((item => {
                item.finish || taskID.push(item.id)
            })), console.log("开始做关注店铺任务");
            for (let i = 0; i < new Array(taskTime).fill("").length; i++) await $.wait(1e3), await doTask("attentionTask", taskID[i].toString())
        }
    }
}
async function shaking() {
    for (let i = 0; i < new Array($.leftShakingTimes).fill("").length; i++) {
        console.log("开始 【京东会员】 摇奖"), await $.wait(1e3);
        const newShakeBeanRes = await vvipclub_shaking_lottery();
        newShakeBeanRes.success && (console.log(`京东会员-剩余摇奖次数：${newShakeBeanRes.data.remainLotteryTimes}`), newShakeBeanRes.data && newShakeBeanRes.data.rewardBeanAmount ? ($.prizeBeanCount += newShakeBeanRes.data.rewardBeanAmount, console.log(`恭喜你，京东会员中奖了，获得${newShakeBeanRes.data.rewardBeanAmount}京豆\n`)) : console.log("未中奖\n"))
    }
    for (let i = 0; i < new Array($.freeTimes).fill("").length; i++) {
        console.log("开始 【摇京豆】 摇奖"), await $.wait(1e3);
        const shakeBeanRes = await shakeBean();
        shakeBeanRes.success && (console.log(`剩余摇奖次数：${shakeBeanRes.data.luckyBox.freeTimes}`), shakeBeanRes.data && shakeBeanRes.data.prizeBean ? (console.log(`恭喜你，中奖了，获得${shakeBeanRes.data.prizeBean.count}京豆\n`), $.prizeBeanCount += shakeBeanRes.data.prizeBean.count, $.totalBeanCount = shakeBeanRes.data.luckyBox.totalBeanCount) : shakeBeanRes.data && shakeBeanRes.data.prizeCoupon ? console.log(`获得优惠券：${shakeBeanRes.data.prizeCoupon.limitStr}\n`) : console.log(`摇奖其他未知结果：${JSON.stringify(shakeBeanRes)}\n`))
    }
    $.prizeBeanCount > 0 && (message += `摇京豆：获得${$.prizeBeanCount}京豆`)
}

function showMsg() {
    return new Promise((resolve => {
        message && $.msg(`${$.name}`, `京东账号${$.index} ${$.nickName}`, message), resolve()
    }))
}

function vvipclub_shaking_info() {
    return new Promise((resolve => {
        const options = {
            url: `https://api.m.jd.com/?t=${Date.now()}&appid=sharkBean&functionId=vvipclub_shaking_info`,
            headers: {
                accept: "application/json",
                "accept-encoding": "gzip, deflate, br",
                "accept-language": "zh-CN,zh;q=0.9",
                cookie: cookie,
                origin: "https://skuivip.jd.com",
                referer: "https://skuivip.jd.com/",
                "User-Agent": $.isNode() ? process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : require("./USER_AGENTS").USER_AGENT : $.getdata("JDUA") ? $.getdata("JDUA") : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"
            }
        };
        $.get(options, ((err, resp, data) => {
            try {
                err ? (console.log(`\n${$.name}: API查询请求失败 ‼️‼️`), $.logErr(err)) : (data = JSON.parse(data)).success && ($.leftShakingTimes = data.data.leftShakingTimes, console.log(`京东会员——摇奖次数${$.leftShakingTimes}`))
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve(data)
            }
        }))
    }))
}

function vvipclub_shaking_lottery() {
    return new Promise((resolve => {
        const options = {
            url: `https://api.m.jd.com/?t=${Date.now()}&appid=sharkBean&functionId=vvipclub_shaking_lottery&body=%7B%7D`,
            headers: {
                accept: "application/json",
                "accept-encoding": "gzip, deflate, br",
                "accept-language": "zh-CN,zh;q=0.9",
                cookie: cookie,
                origin: "https://skuivip.jd.com",
                referer: "https://skuivip.jd.com/",
                "User-Agent": $.isNode() ? process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : require("./USER_AGENTS").USER_AGENT : $.getdata("JDUA") ? $.getdata("JDUA") : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"
            }
        };
        $.get(options, ((err, resp, data) => {
            try {
                err ? (console.log(`\n${$.name}: API查询请求失败 ‼️‼️`), $.logErr(err)) : data = JSON.parse(data)
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve(data)
            }
        }))
    }))
}

function vvipclub_receive_lottery_times() {
    return new Promise((resolve => {
        const options = {
            url: `https://api.m.jd.com/?t=${Date.now()}&appid=sharkBean&functionId=vvipclub_receive_lottery_times`,
            headers: {
                accept: "application/json",
                "accept-encoding": "gzip, deflate, br",
                "accept-language": "zh-CN,zh;q=0.9",
                cookie: cookie,
                origin: "https://skuivip.jd.com",
                referer: "https://skuivip.jd.com/",
                "User-Agent": $.isNode() ? process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : require("./USER_AGENTS").USER_AGENT : $.getdata("JDUA") ? $.getdata("JDUA") : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"
            }
        };
        $.get(options, ((err, resp, data) => {
            try {
                err ? (console.log(`\n${$.name}: API查询请求失败 ‼️‼️`), $.logErr(err)) : data = JSON.parse(data)
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve(data)
            }
        }))
    }))
}

function getFreeTimes() {
    return new Promise((resolve => {
        $.get(taskUrl("vvipclub_luckyBox", {
            info: "freeTimes"
        }), ((err, resp, data) => {
            try {
                err ? (console.log(`\n${$.name}: API查询请求失败 ‼️‼️`), $.logErr(err)) : (data = JSON.parse(data)).success && ($.freeTimes = data.data.freeTimes, console.log(`摇京豆——摇奖次数${$.freeTimes}`))
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve()
            }
        }))
    }))
}

function getTask(info) {
    return new Promise((resolve => {
        $.get(taskUrl("vvipclub_lotteryTask", {
            info: info,
            withItem: !0
        }), ((err, resp, data) => {
            try {
                err ? (console.log(`\n${$.name}: API查询请求失败 ‼️‼️`), $.logErr(err)) : data = JSON.parse(data)
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve(data)
            }
        }))
    }))
}

function doTask(taskName, taskItemId) {
    return new Promise((resolve => {
        $.get(taskUrl("vvipclub_doTask", {
            taskName: taskName,
            taskItemId: taskItemId
        }), ((err, resp, data) => {
            try {
                err ? (console.log(`\n${$.name}: API查询请求失败 ‼️‼️`), $.logErr(err)) : data = JSON.parse(data)
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve(data)
            }
        }))
    }))
}

function shakeBean() {
    return new Promise((resolve => {
        $.get(taskUrl("vvipclub_shaking", {
            type: "0"
        }), ((err, resp, data) => {
            try {
                err ? (console.log(`\n${$.name}: API查询请求失败 ‼️‼️`), $.logErr(err)) : data = JSON.parse(data)
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve(data)
            }
        }))
    }))
}
async function superShakeBean() {
    await superBrandMainPage(), $.activityId && $.encryptProjectId && (await superBrandTaskList(), await superBrandDoTaskFun(), await superBrandMainPage(), await lo()), $.ActInfo ? (await fc_getHomeData($.ActInfo), await doShakeTask($.ActInfo), await fc_getHomeData($.ActInfo, !0), await superShakeLottery($.ActInfo)) : console.log("\n\n京东APP首页超级摇一摇：目前暂无活动\n\n")
}

function welcomeHome() {
    return new Promise((resolve => {
        const options = {
            url: "https://api.m.jd.com/client.action?functionId=welcomeHome",
            body: "body=%7B%22homeAreaCode%22%3A%220%22%2C%22identity%22%3A%2288732f840b77821b345bf07fd71f609e6ff12f43%22%2C%22cycNum%22%3A1%2C%22fQueryStamp%22%3A%221619741900009%22%2C%22globalUIStyle%22%3A%229.0.0%22%2C%22showCate%22%3A%221%22%2C%22tSTimes%22%3A%220%22%2C%22geoLast%22%3A%22K3%252BcQaJxm9FzAm8%252BYHBwQKEMnguxItJAtNhFQOgUkktO5Vmidb%252BfKedLYq%252Fjlnc%252BK0ZsoA8jI8yXkYA6M2L5NYrGdBxZPbV%252FzT%252BU%252BHaCeNg%253D%22%2C%22geo%22%3A%22CZQirfKpZqpcvvBN0KadX76P55F3UdFoB2C3P0ZyHOXZWjeifB1aM0xH3BWx0YRlyu4eaUsfA3KpuoAraiffcw%253D%253D%22%2C%22cycFirstTimeStamp%22%3A%221619740961090%22%2C%22displayVersion%22%3A%229.0.0%22%2C%22geoReal%22%3A%22CZQirfKpZqpcvvBN0KadX76P55F3UdFoB2C3P0ZyHOXtnAGs7wzWHMkTSTIEj7qi%22%2C%22controlMaterials%22%3A%22null%22%2C%22xviewGuideFloor%22%3A%22index%2Ccategory%2Cfind%2Ccart%2Chome%22%2C%22fringe%22%3A%221%22%2C%22receiverGeo%22%3A%22mTBeEjk2Q83Kb3%252Fylt2Amm7iguwnhvKDgDnR18TktRpedJcPIHjALOIwGuNKAgau%22%7D&client=apple&clientVersion=9.4.6&d_brand=apple&isBackground=N&joycious=104&lang=zh_CN&networkType=4g&networklibtype=JDNetworkBaseAF&openudid=88732f840b77821b345bf07fd71f609e6ff12f43&osVersion=14.3&partner=apple&rfs=0000&scope=11&screen=828%2A1792&sign=69cc68677ae63b0a8737602766a0a340&st=1619741900013&sv=111&uts=0f31TVRjBSujckcdxhii7gq9cidRV4uxtCNZpaQs9IOuG5PD2oGme36aUnsUBSyCtrnCzcJjRQzsekOXnNu9XyW4W2UAsnnZ06POovikHhGabI9pwW8ZeJ2vmOBTWqWjA66DWDvRHGVeJeXzsm5xolz7r%2FX0APYfhg8I5QBwgKJfD3hzoXkHcnsGfMhHncRzuC4iOtgVG8L%2FnQyyNwXAJQ%3D%3D&uuid=hjudwgohxzVu96krv%2FT6Hg%3D%3D&wifiBssid=unknown",
            headers: {
                Accept: "*/*",
                "Accept-Encoding": "gzip, deflate, br",
                "Accept-Language": "zh-Hans-CN;q=1, zh-Hant-CN;q=0.9",
                Connection: "keep-alive",
                "Content-Length": "1761",
                "Content-Type": "application/x-www-form-urlencoded",
                Host: "api.m.jd.com",
                "User-Agent": "JD4iPhone/167588 (iPhone; iOS 14.3; Scale/2.00)"
            }
        };
        $.post(options, (async (err, resp, data) => {
            try {
                if (err) console.log(`${JSON.stringify(err)}`), console.log(`${$.name} welcomeHome API请求失败，请检查网路重试`);
                else if (data && (data = JSON.parse(data)).floorList && data.floorList.length) {
                    const shakeFloorNew = data.floorList.filter((vo => !!vo && "shakeFloorNew" === vo.type))[0],
                        shakeFloorNew2 = data.floorList.filter((vo => !!vo && "float" === vo.type))[0];
                    if (shakeFloorNew) {
                        const jump = shakeFloorNew.jump;
                        jump && jump.params && jump.params.url && ($.superShakeUrl = jump.params.url, console.log(`【超级摇一摇】活动链接：${jump.params.url}`))
                    }
                    if (shakeFloorNew2) {
                        const jump = shakeFloorNew2.jump;
                        jump && jump.params && jump.params.url.includes("https://h5.m.jd.com/babelDiy/Zeus/2PTXhrEmiMEL3mD419b8Gn9bUBiJ/index.html") && (console.log(`【超级品牌日】活动链接：${jump.params.url}`), $.superbrandUrl = jump.params.url)
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

function getActInfo(url) {
    return new Promise((resolve => {
        $.get({
            url: url,
            headers: {
                "User-Agent": $.isNode() ? process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : require("./USER_AGENTS").USER_AGENT : $.getdata("JDUA") ? $.getdata("JDUA") : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"
            },
            timeout: 1e4
        }, (async (err, resp, data) => {
            try {
                err ? (console.log(`${JSON.stringify(err)}`), console.log(`${$.name} API请求失败，请检查网路重试`)) : (data = data && data.match(/window\.__FACTORY__TAOYIYAO__STATIC_DATA__ = (.*)}/)) && ((data = JSON.parse(data[1] + "}")).pageConfig && (superShakeBeanConfig.superShakeTitle = data.pageConfig.htmlTitle), data.taskConfig && ($.ActInfo = data.taskConfig.taskAppId, console.log(`\n获取【${superShakeBeanConfig.superShakeTitle}】活动ID成功：${$.ActInfo}\n`)))
            } catch (e) {
                console.log(e)
            } finally {
                resolve()
            }
        }))
    }))
}

function fc_getHomeData(appId, flag = !1) {
    return new Promise((resolve => {
        const options = taskPostUrl("fc_getHomeData", {
            appId: appId
        });
        $.taskVos = [], $.lotteryNum = 0, $.post(options, (async (err, resp, data) => {
            try {
                if (err) console.log(`${JSON.stringify(err)}`), console.log(`${$.name} fc_getHomeData API请求失败，请检查网路重试`);
                else if (data)
                    if (0 === (data = JSON.parse(data)).code)
                        if (0 === data.data.bizCode) {
                            const taskVos = data.data.result.taskVos || [];
                            flag && 1 === $.index && (superShakeBeanConfig.superShakeBeanFlag = !0, superShakeBeanConfig.taskVipName = taskVos.filter((vo => !!vo && 21 === vo.taskType))[0].taskName), superShakeBeanConfig.superShakeUlr = $.superShakeUrl, $.taskVos = taskVos.filter((item => !!item && 1 === item.status)) || [], $.lotteryNum = parseInt(data.data.result.lotteryNum), $.lotTaskId = parseInt(data.data.result.lotTaskId)
                        } else 101 === data.data.bizCode && console.log(`京东APP首页超级摇一摇： ${data.data.bizMsg}`);
                else console.log(`获取超级摇一摇任务数据异常： ${JSON.stringify(data)}`)
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve()
            }
        }))
    }))
}
async function doShakeTask(appId) {
    for (let vo of $.taskVos)
        if (21 !== vo.taskType) {
            if (9 === vo.taskType) {
                console.log(`开始做 ${vo.taskName}，等10秒`);
                const shoppingActivityVos = vo.shoppingActivityVos;
                for (let task of shoppingActivityVos) await fc_collectScore({
                    appId: appId,
                    taskToken: task.taskToken,
                    taskId: vo.taskId,
                    itemId: task.itemId,
                    actionType: 1
                }), await $.wait(1e4), await fc_collectScore({
                    appId: appId,
                    taskToken: task.taskToken,
                    taskId: vo.taskId,
                    itemId: task.itemId,
                    actionType: 0
                })
            }
            if (1 === vo.taskType) {
                console.log(`开始做 ${vo.taskName}， 等8秒`);
                const followShopVo = vo.followShopVo;
                for (let task of followShopVo) await fc_collectScore({
                    appId: appId,
                    taskToken: task.taskToken,
                    taskId: vo.taskId,
                    itemId: task.itemId,
                    actionType: 1
                }), await $.wait(9e3), await fc_collectScore({
                    appId: appId,
                    taskToken: task.taskToken,
                    taskId: vo.taskId,
                    itemId: task.itemId,
                    actionType: 0
                })
            }
        } else console.log(`超级摇一摇 ${vo.taskName} 跳过`)
}

function fc_collectScore(body) {
    return new Promise((resolve => {
        const options = taskPostUrl("fc_collectScore", body);
        $.post(options, ((err, resp, data) => {
            try {
                err ? (console.log(`${JSON.stringify(err)}`), console.log(`${$.name} fc_collectScore API请求失败，请检查网路重试`)) : data && (data = JSON.parse(data), console.log(`${JSON.stringify(data)}`))
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve()
            }
        }))
    }))
}
async function superShakeLottery(appId) {
    $.lotteryNum && console.log("\n\n开始京东APP首页超级摇一摇 摇奖");
    for (let i = 0; i < new Array($.lotteryNum).fill("").length; i++) await fc_getLottery(appId), await $.wait(1e3);
    $.superShakeBeanNum > 0 && (message += `${message?"\n":""}${superShakeBeanConfig.superShakeTitle}：获得${$.superShakeBeanNum}京豆`, allMessage += `京东账号${$.index}${$.nickName||$.UserName}\n${superShakeBeanConfig.superShakeTitle}：获得${$.superShakeBeanNum}京豆${$.index!==cookiesArr.length?"\n\n":""}`)
}

function fc_getLottery(appId) {
    return new Promise((resolve => {
        const options = taskPostUrl("fc_getLotteryResult", {
            appId: appId,
            taskId: $.lotTaskId
        });
        $.post(options, ((err, resp, data) => {
            try {
                err ? (console.log(`${JSON.stringify(err)}`), console.log(`${$.name} fc_collectScore API请求失败，请检查网路重试`)) : data && ((data = JSON.parse(data)) && 0 === data.data.bizCode ? ($.myAwardVo = data.data.result.myAwardVo, $.myAwardVo && (console.log(`超级摇一摇 抽奖结果:${JSON.stringify($.myAwardVo)}`), 2 === $.myAwardVo.type && ($.superShakeBeanNum = $.superShakeBeanNum + parseInt($.myAwardVo.jBeanAwardVo.quantity)))) : console.log(`超级摇一摇 抽奖异常： ${JSON.stringify(data)}`))
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve()
            }
        }))
    }))
}

function superBrandMainPage() {
    return new Promise((resolve => {
        const options = superShakePostUrl("superBrandMainPage", {
            source: "main"
        });
        $.post(options, ((err, resp, data) => {
            try {
                err ? (console.log(`${JSON.stringify(err)}`), console.log(`${$.name} superBrandTaskList API请求失败，请检查网路重试`)) : data && ("0" === (data = JSON.parse(data)).code ? "0" === data.data.bizCode ? (superShakeBeanConfig.superShakeUlr = $.superShakeUrl, $.activityId = data.data.result.activityBaseInfo.activityId, $.encryptProjectId = data.data.result.activityBaseInfo.encryptProjectId, $.activityName = data.data.result.activityBaseInfo.activityName, $.userStarNum = Number(data.data.result.activityUserInfo.userStarNum) || 0, superShakeBeanConfig.superShakeTitle = $.activityName, console.log(`${$.activityName} 当前共有积分：${$.userStarNum}，可抽奖：${parseInt($.userStarNum/100)}次(最多4次摇奖机会)\n`)) : console.log(`\n【新版本 超级摇一摇】获取信息失败：${data.data.bizMsg}\n`) : console.log(`获取超级摇一摇信息异常：${JSON.stringify(data)}\n`))
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve()
            }
        }))
    }))
}

function superBrandTaskList() {
    return new Promise((resolve => {
        $.taskList = [];
        const options = superShakePostUrl("superBrandTaskList", {
            activityId: $.activityId,
            assistInfoFlag: 4,
            source: "main"
        });
        $.post(options, ((err, resp, data) => {
            try {
                err ? (console.log(`${JSON.stringify(err)}`), console.log(`${$.name} superBrandTaskList API请求失败，请检查网路重试`)) : data && ("0" === (data = JSON.parse(data)).code && "0" === data.data.bizCode ? ($.taskList = data.data.result.taskList, $.canLottery = $.taskList.filter((vo => !!vo && 4 === vo.assignmentTimesLimit))[0].completionFlag) : console.log(`获取超级摇一摇任务异常：${JSON.stringify(data)}`))
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve()
            }
        }))
    }))
}
async function superBrandDoTaskFun() {
    $.taskList = $.taskList.filter((vo => !!vo && !vo.completionFlag && 6 !== vo.assignmentType && 7 !== vo.assignmentType && 0 !== vo.assignmentType && 30 !== vo.assignmentType));
    for (let item of $.taskList) {
        if (1 === item.assignmentType) {
            const {
                ext: ext
            } = item;
            console.log(`开始做 ${item.assignmentName}，需等待${ext.waitDuration}秒`);
            const shoppingActivity = ext.shoppingActivity;
            for (let task of shoppingActivity) await superBrandDoTask({
                activityId: $.activityId,
                encryptProjectId: $.encryptProjectId,
                encryptAssignmentId: item.encryptAssignmentId,
                assignmentType: item.assignmentType,
                itemId: task.itemId,
                actionType: 1,
                source: "main"
            }), await $.wait(1e3 * ext.waitDuration), await superBrandDoTask({
                activityId: $.activityId,
                encryptProjectId: $.encryptProjectId,
                encryptAssignmentId: item.encryptAssignmentId,
                assignmentType: item.assignmentType,
                itemId: task.itemId,
                actionType: 0,
                source: "main"
            })
        }
        if (3 === item.assignmentType) {
            const {
                ext: ext
            } = item;
            console.log(`开始做 ${item.assignmentName}`);
            const followShop = ext.followShop;
            for (let task of followShop) await superBrandDoTask({
                activityId: $.activityId,
                encryptProjectId: $.encryptProjectId,
                encryptAssignmentId: item.encryptAssignmentId,
                assignmentType: item.assignmentType,
                itemId: task.itemId,
                actionType: 0,
                source: "main"
            })
        }
        if (2 === item.assignmentType) {
            const {
                ext: ext
            } = item, assistTaskDetail = ext.assistTaskDetail;
            console.log(`${item.assignmentName}好友邀请码： ${assistTaskDetail.itemId}`), assistTaskDetail.itemId && $.assigFirends.push({
                itemId: assistTaskDetail.itemId,
                encryptAssignmentId: item.encryptAssignmentId,
                assignmentType: item.assignmentType
            })
        }
    }
}

function superBrandDoTask(body) {
    return new Promise((resolve => {
        const options = superShakePostUrl("superBrandDoTask", body);
        $.post(options, ((err, resp, data) => {
            try {
                err ? (console.log(`${JSON.stringify(err)}`), console.log(`${$.name} superBrandTaskList API请求失败，请检查网路重试`)) : data && (2 === body.assignmentType ? console.log(`助力好友 ${body.itemId}结果 ${data}`) : console.log("做任务结果", data), (data = JSON.parse(data)) && "0" === data.code && "108" === data.data.bizCode && ($.canHelp = !1))
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve()
            }
        }))
    }))
}
async function lo() {
    const num = parseInt(($.userStarNum || 0) / 100);
    if (!$.canLottery)
        for (let i = 0; i < new Array(num).fill("").length; i++) await $.wait(1e3), await superBrandTaskLottery();
    $.superShakeBeanNum > 0 && (message += `${message?"\n":""}${$.activityName||"超级摇一摇"}：获得${$.superShakeBeanNum}京豆\n`, allMessage += `京东账号${$.index}${$.nickName||$.UserName}\n${superShakeBeanConfig.superShakeTitle}：获得${$.superShakeBeanNum}京豆${$.index!==cookiesArr.length?"\n\n":""}`)
}

function superBrandTaskLottery() {
    return new Promise((resolve => {
        const options = superShakePostUrl("superBrandTaskLottery", {
            activityId: $.activityId,
            source: "main"
        });
        $.post(options, ((err, resp, data) => {
            try {
                err ? (console.log(`${JSON.stringify(err)}`), console.log(`${$.name} superBrandDoTaskLottery API请求失败，请检查网路重试`)) : data && ((data = JSON.parse(data)) && "0" === data.code ? "TK000" === data.data.bizCode ? ($.rewardComponent = data.data.result.rewardComponent, $.rewardComponent && (console.log(`超级摇一摇 抽奖结果:${JSON.stringify($.rewardComponent)}`), $.rewardComponent.beanList && $.rewardComponent.beanList.length && (console.log(`获得${$.rewardComponent.beanList[0].quantity}京豆`), $.superShakeBeanNum += parseInt($.rewardComponent.beanList[0].quantity)))) : (data.data.bizCode, console.log(`超级摇一摇 抽奖失败：${data.data.bizMsg}`)) : console.log(`超级摇一摇 抽奖异常： ${JSON.stringify(data)}`))
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve()
            }
        }))
    }))
}
async function superbrandShakeBean() {
    $.bradCanLottery = !0, $.bradHasLottery = !1, await qryCompositeMaterials("advertGroup", "04405074", "Brands"), await superbrand_getHomeData(), $.bradCanLottery ? $.bradHasLottery ? console.log(`【${$.stageName} 超级品牌日】：已完成抽奖`) : (await superbrand_getMaterial(), await qryCompositeMaterials(), await superbrand_getGift()) : console.log(`【${$.stageName} 超级品牌日】：活动不在进行中`)
}

function superbrand_getMaterial() {
    return new Promise((resolve => {
        const options = superShakePostUrl("superbrand_getMaterial", {
            brandActivityId: $.brandActivityId
        });
        $.post(options, ((err, resp, data) => {
            try {
                if (err) console.log(`${JSON.stringify(err)}`), console.log(`${$.name} superbrand_getMaterial API请求失败，请检查网路重试`);
                else if (data)
                    if (0 === (data = JSON.parse(data)).code)
                        if (0 === data.data.bizCode) {
                            const {
                                result: result
                            } = data.data;
                            $.cmsTaskShopId = result.cmsTaskShopId, $.cmsTaskLink = result.cmsTaskLink, $.cmsTaskGroupId = result.cmsTaskGroupId, console.log(`【cmsTaskGroupId】：${result.cmsTaskGroupId}`)
                        } else console.log(`超级超级品牌日 ${data.data.bizMsg}`);
                else console.log(`超级超级品牌日 异常： ${JSON.stringify(data)}`)
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve()
            }
        }))
    }))
}

function qryCompositeMaterials(type = "productGroup", id = $.cmsTaskGroupId, mapTo = "Tasks0") {
    return new Promise((resolve => {
        const t1 = {
                type: type,
                id: id,
                mapTo: mapTo
            },
            options = taskPostUrl("qryCompositeMaterials", {
                qryParam: JSON.stringify([t1]),
                activityId: $.brandActivityId2,
                pageId: "1411763",
                reqSrc: "jmfe",
                geo: {
                    lng: "",
                    lat: ""
                }
            });
        $.post(options, (async (err, resp, data) => {
            try {
                if (err) console.log(`${JSON.stringify(err)}`), console.log(`${$.name} qryCompositeMaterials API请求失败，请检查网路重试`);
                else if (data)
                    if ("0" === (data = JSON.parse(data)).code)
                        if ("Brands" === mapTo) $.stageName = data.data.Brands.stageName, console.log(`\n\n【${$.stageName} brandActivityId】：${data.data.Brands.list[0].extension.copy1}`), $.brandActivityId = data.data.Brands.list[0].extension.copy1 || $.brandActivityId;
                        else {
                            const {
                                list: list
                            } = data.data.Tasks0;
                            console.log("超级品牌日，做关注店铺 任务");
                            let body = {
                                brandActivityId: $.brandActivityId,
                                taskType: "1",
                                taskId: $.cmsTaskShopId
                            };
                            await superbrand_doMyTask(body), console.log("超级品牌日，逛品牌会场 任务"), body = {
                                brandActivityId: $.brandActivityId,
                                taskType: "2",
                                taskId: $.cmsTaskLink
                            }, await superbrand_doMyTask(body), console.log("超级品牌日，浏览下方指定商品 任务");
                            for (let item of list.slice(0, 3)) body = {
                                brandActivityId: $.brandActivityId,
                                taskType: "3",
                                taskId: item.skuId
                            }, await superbrand_doMyTask(body)
                        }
                else console.log(`qryCompositeMaterials异常： ${JSON.stringify(data)}`)
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve()
            }
        }))
    }))
}

function superbrand_doMyTask(body) {
    return new Promise((resolve => {
        const options = superShakePostUrl("superbrand_doMyTask", body);
        $.post(options, ((err, resp, data) => {
            try {
                err ? (console.log(`${JSON.stringify(err)}`), console.log(`${$.name} superbrand_doMyTask API请求失败，请检查网路重试`)) : data && console.log(`超级品牌日活动做任务结果：${data}\n`)
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve()
            }
        }))
    }))
}

function superbrand_getGift() {
    return new Promise((resolve => {
        const options = superShakePostUrl("superbrand_getGift", {
            brandActivityId: $.brandActivityId
        });
        $.post(options, ((err, resp, data) => {
            try {
                if (err) console.log(`${JSON.stringify(err)}`), console.log(`${$.name} superbrand_getGift API请求失败，请检查网路重试`);
                else if (data)
                    if (0 === (data = JSON.parse(data)).code)
                        if (0 === data.data.bizCode) {
                            const {
                                result: result
                            } = data.data;
                            if ($.jpeasList = result.jpeasList, $.jpeasList && $.jpeasList.length)
                                for (let item of $.jpeasList) console.log(`超级品牌日 抽奖 获得：${item.quantity}京豆🐶`), message += `【超级品牌日】获得：${item.quantity}京豆🐶\n`, 0 === $.superShakeBeanNum ? allMessage += `京东账号${$.index}${$.nickName||$.UserName}\n【超级品牌日】获得：${item.quantity}京豆🐶\n` : allMessage += `【超级品牌日】获得：${item.quantity}京豆🐶\n`
                        } else console.log(`超级超级品牌日 抽奖失败： ${data.data.bizMsg}`);
                else console.log(`超级超级品牌日 抽奖 异常： ${JSON.stringify(data)}`)
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve()
            }
        }))
    }))
}

function superbrand_getHomeData() {
    return new Promise((resolve => {
        const options = superShakePostUrl("superbrand_getHomeData", {
            brandActivityIds: $.brandActivityId
        });
        $.get(options, ((err, resp, data) => {
            try {
                if (err) console.log(`${JSON.stringify(err)}`), console.log(`${$.name} superbrand_getHomeData API请求失败，请检查网路重试`);
                else if (data)
                    if (0 === (data = JSON.parse(data)).code)
                        if (0 === data.data.bizCode) {
                            const {
                                result: result
                            } = data.data;
                            result && result.length && "2" === result[0].activityStatus && result[0].taskVos.length && ($.bradHasLottery = !0)
                        } else console.log(`超级超级品牌日 getHomeData 失败： ${data.data.bizMsg}`), 101 === data.data.bizCode && ($.bradCanLottery = !1);
                else console.log(`超级超级品牌日 getHomeData 异常： ${JSON.stringify(data)}`)
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve()
            }
        }))
    }))
}
async function mofang() {
    try {
        await getInteractionInfo(), await executeNewInteractionTaskFun(), await getInteractionInfo(!1);
        for (let i = 0; i < new Array($.lotteryNum).fill("").length; i++) await getNewLotteryInfo(), await $.wait(200);
        $.moFangBeanNum > 0 && (message += `${message?"\n":""}京东小魔方：获得${$.moFangBeanNum}京豆\n`, allMessage += `京东账号${$.index}${$.nickName||$.UserName}\n京东小魔方：获得${$.moFangBeanNum}京豆${$.index!==cookiesArr.length?"\n\n":""}`)
    } catch (e) {
        $.logErr(e)
    }
}

function getInteractionInfo(info = !0) {
    return $.taskSkuInfo = [], $.taskList = [], $.shopInfoList = [], $.lotteryNum = 0, new Promise((resolve => {
        const options = superShakePostUrl("getInteractionInfo", {});
        $.get(options, ((err, resp, data) => {
            try {
                if (err) console.log(`${JSON.stringify(err)}`), console.log(`${$.name} 小魔方 getInteractionInfo API请求失败，请检查网路重试`);
                else if (data)
                    if ((data = JSON.parse(data)).result && 0 === data.result.code) {
                        const {
                            result: result
                        } = data;
                        info && console.log(`\n\n京东小魔方：${result.brandName}`), $.taskSkuInfo = result.taskSkuInfo || [], $.taskList = result.taskPoolInfo.taskList || [], $.taskPoolId = result.taskPoolInfo.taskPoolId, $.taskSkuNum = result.taskSkuNum, $.interactionId = result.interactionId, $.shopInfoList = result.shopInfoList || [], $.lotteryNum = result.lotteryInfo.lotteryNum || 0, info || console.log(`京东小魔方当前抽奖次数：${$.lotteryNum}\n`)
                    } else console.log(`小魔方 getInteractionInfo 异常： ${JSON.stringify(data)}`)
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve()
            }
        }))
    }))
}
async function executeNewInteractionTaskFun() {
    $.taskList = $.taskList.filter((vo => !!vo && 0 === vo.taskStatus));
    for (let item of $.taskList)
        if (9 === item.taskId) {
            console.log(`开始做：【${item.taskTitle}】任务`);
            const body = {
                interactionId: $.interactionId,
                taskPoolId: $.taskPoolId,
                taskType: item.taskId
            };
            await executeNewInteractionTask(body)
        } else if (4 === item.taskId) {
        $.taskSkuInfo = $.taskSkuInfo.filter((vo => !!vo && 0 === vo.browseStatus)), console.log(`开始做：【${item.taskTitle}】任务`);
        for (let v of $.taskSkuInfo) {
            const body = {
                sku: v.skuId,
                interactionId: $.interactionId,
                taskPoolId: $.taskPoolId,
                taskType: item.taskId
            };
            await executeNewInteractionTask(body), await $.wait(100)
        }
    } else {
        $.shopInfoList = $.shopInfoList.filter((vo => !!vo && 0 === vo.browseStatus));
        for (let v of $.shopInfoList) {
            console.log(`开始做：【${item.taskTitle}】任务，需等待${v.browseTime}秒`);
            let body = {
                shopId: v.shopId,
                interactionId: $.interactionId,
                taskPoolId: $.taskPoolId,
                taskType: item.taskId,
                action: 1
            };
            await executeNewInteractionTask(body), await $.wait(1e3 * v.browseTime), body = {
                shopId: v.shopId,
                interactionId: $.interactionId,
                taskPoolId: $.taskPoolId,
                taskType: item.taskId
            }, await executeNewInteractionTask(body)
        }
    }
}

function executeNewInteractionTask(body) {
    return new Promise((resolve => {
        const options = superShakePostUrl("executeNewInteractionTask", body);
        $.get(options, ((err, resp, data) => {
            try {
                if (err) console.log(`${JSON.stringify(err)}`), console.log(`${$.name} 小魔方 executeNewInteractionTask API请求失败，请检查网路重试`);
                else if (data)
                    if ((data = JSON.parse(data)).result && 0 === data.result.code) {
                        const {
                            result: result
                        } = data;
                        result.toast && result.lotteryNum && console.log(`${result.toast}，当前抽奖次数：${result.lotteryNum}\n`)
                    } else console.log(`小魔方 executeNewInteractionTask 异常： ${JSON.stringify(data)}`)
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve()
            }
        }))
    }))
}

function getNewLotteryInfo() {
    return new Promise((resolve => {
        const options = superShakePostUrl("getNewLotteryInfo", {
            interactionId: $.interactionId
        });
        $.get(options, ((err, resp, data) => {
            try {
                if (err) console.log(`${JSON.stringify(err)}`), console.log(`${$.name} 小魔方 getNewLotteryInfo API请求失败，请检查网路重试`);
                else if (data)
                    if ((data = JSON.parse(data)).result && 0 === data.result.code) {
                        const {
                            result: result
                        } = data;
                        0 === result.isLottery ? console.log(`京东小魔方抽奖：${result.toast}`) : 1 === result.isLottery ? (console.log(`京东小魔方抽奖：${result.lotteryInfo.quantity}京豆`), $.moFangBeanNum += parseInt(result.lotteryInfo.quantity)) : console.log(`京东小魔方抽奖：${JSON.stringify(data)}`)
                    } else console.log(`小魔方 getNewLotteryInfo 异常： ${JSON.stringify(data)}`)
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve()
            }
        }))
    }))
}
async function shakeSign() {
    if (await pg_channel_page_data(), $.token && $.currSignCursor && -1 === $.signStatus) {
        const body = {
                floorToken: $.token,
                dataSourceCode: "signIn",
                argMap: {
                    currSignCursor: $.currSignCursor
                }
            },
            signRes = await pg_interact_interface_invoke(body);
        console.log(`京东会员第${$.currSignCursor}天签到结果；${JSON.stringify(signRes)}`);
        let beanNum = 0;
        signRes.success && signRes.data && (console.log(`京东会员第${$.currSignCursor}天签到成功。获得${signRes.data.rewardVos&&signRes.data.rewardVos[0].jingBeanVo&&signRes.data.rewardVos[0].jingBeanVo.beanNum}京豆\n`), beanNum = signRes.data.rewardVos && signRes.data.rewardVos[0].jingBeanVo && signRes.data.rewardVos[0].jingBeanVo.beanNum), beanNum && (message += `\n京东会员签到：获得${beanNum}京豆\n`)
    } else console.log(`京东会员第${$.currSignCursor}天已签到`)
}

function pg_channel_page_data() {
    const body = {
        paramData: {
            token: "dd2fb032-9fa3-493b-8cd0-0d57cd51812d"
        }
    };
    return new Promise((resolve => {
        const options = {
            url: `https://api.m.jd.com/?t=${Date.now()}&appid=sharkBean&functionId=pg_channel_page_data&body=${escape(JSON.stringify(body))}`,
            headers: {
                Accept: "application/json",
                "Accept-Encoding": "gzip, deflate, br",
                "Accept-Language": "zh-cn",
                Connection: "keep-alive",
                Host: "api.m.jd.com",
                Cookie: cookie,
                Origin: "https://spa.jd.com",
                Referer: "https://spa.jd.com/home",
                "User-Agent": $.isNode() ? process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : require("./USER_AGENTS").USER_AGENT : $.getdata("JDUA") ? $.getdata("JDUA") : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"
            }
        };
        $.get(options, ((err, resp, data) => {
            try {
                if (err) console.log(`\n${$.name}: API查询请求失败 ‼️‼️`), $.logErr(err);
                else if ((data = JSON.parse(data)).success) {
                    const SIGN_ACT_INFO = data.data.floorInfoList.filter((vo => !!vo && "SIGN_ACT_INFO" === vo.code))[0];
                    $.token = SIGN_ACT_INFO.token, SIGN_ACT_INFO.floorData && ($.currSignCursor = SIGN_ACT_INFO.floorData.signActInfo.currSignCursor, $.signStatus = SIGN_ACT_INFO.floorData.signActInfo.signActCycles.filter((item => !!item && item.signCursor === $.currSignCursor))[0].signStatus)
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve(data || {})
            }
        }))
    }))
}

function pg_interact_interface_invoke(body) {
    return new Promise((resolve => {
        const options = {
            url: `https://api.m.jd.com/?appid=sharkBean&functionId=pg_interact_interface_invoke&body=${escape(JSON.stringify(body))}`,
            headers: {
                "User-Agent": $.isNode() ? process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : require("./USER_AGENTS").USER_AGENT : $.getdata("JDUA") ? $.getdata("JDUA") : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1",
                Cookie: cookie,
                Accept: "application/json",
                "Accept-Encoding": "gzip, deflate, br",
                "Accept-Language": "zh-cn",
                Connection: "keep-alive",
                "Content-Length": "0",
                Host: "api.m.jd.com",
                Origin: "https://spa.jd.com",
                Referer: "https://spa.jd.com/home"
            }
        };
        $.post(options, ((err, resp, data) => {
            try {
                err ? (console.log(`\n${$.name}: API查询请求失败 ‼️‼️`), $.logErr(err)) : data = JSON.parse(data)
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve(data || {})
            }
        }))
    }))
}

function TotalBean() {
    return new Promise((async resolve => {
        const options = {
            url: "https://me-api.jd.com/user_new/info/GetJDUserInfoUnion",
            headers: {
                Host: "me-api.jd.com",
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
                    if ("1001" === (data = JSON.parse(data)).retcode) return void($.isLogin = !1);
                    "0" === data.retcode && data.data && data.data.hasOwnProperty("userInfo") && ($.nickName = data.data.userInfo.baseInfo.nickname)
                } else $.log("京东服务器返回空数据")
            } catch (e) {
                $.logErr(e)
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

function taskUrl(function_id, body = {}, appId = "vip_h5") {
    return {
        url: `${JD_API_HOST}?functionId=${function_id}&appid=${appId}&body=${escape(JSON.stringify(body))}&_=${Date.now()}`,
        headers: {
            Cookie: cookie,
            Host: "api.m.jd.com",
            "User-Agent": $.isNode() ? process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : require("./USER_AGENTS").USER_AGENT : $.getdata("JDUA") ? $.getdata("JDUA") : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1",
            Referer: "https://vip.m.jd.com/newPage/reward/123dd/slideContent?page=focus"
        }
    }
}

function taskPostUrl(function_id, body) {
    return {
        url: `https://api.m.jd.com/client.action?functionId=${function_id}&body=${escape(JSON.stringify(body))}&client=wh5&clientVersion=1.0.0`,
        headers: {
            Cookie: cookie,
            Host: "api.m.jd.com",
            "User-Agent": $.isNode() ? process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : require("./USER_AGENTS").USER_AGENT : $.getdata("JDUA") ? $.getdata("JDUA") : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1",
            Referer: "https://h5.m.jd.com/babelDiy/Zeus/4SXuJSqKganGpDSEMEkJWyBrBHcM/index.html"
        }
    }
}

function superShakePostUrl(function_id, body) {
    return {
        url: `https://api.m.jd.com/client.action?functionId=${function_id}&appid=content_ecology&body=${escape(JSON.stringify(body))}&client=wh5&clientVersion=9.3.0&uuid=8888888&t=${Date.now()}`,
        headers: {
            Cookie: cookie,
            Host: "api.m.jd.com",
            "User-Agent": $.isNode() ? process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : require("./USER_AGENTS").USER_AGENT : $.getdata("JDUA") ? $.getdata("JDUA") : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1",
            Referer: "https://h5.m.jd.com/babelDiy/Zeus/4SXuJSqKganGpDSEMEkJWyBrBHcM/index.html"
        }
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
        await welcomeHome(), $.superShakeUrl && await getActInfo($.superShakeUrl);
        for (let i = 0; i < cookiesArr.length; i++)
            if (cookiesArr[i]) {
                if (cookie = cookiesArr[i], $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1]), $.index = i + 1, $.freeTimes = 0, $.prizeBeanCount = 0, $.totalBeanCount = 0, $.superShakeBeanNum = 0, $.moFangBeanNum = 0, $.isLogin = !0, $.nickName = "", message = "", await TotalBean(), console.log(`\n********开始【京东账号${$.index}】${$.nickName||$.UserName}*****\n`), !$.isLogin) {
                    $.msg($.name, "【提示】cookie已失效", `京东账号${$.index} ${$.nickName||$.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, {
                        "open-url": "https://bean.m.jd.com/bean/signIndex.action"
                    }), $.isNode() && await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
                    continue
                }
                await clubLottery()
            } for (let v = 0; v < cookiesArr.length; v++)
            if (cookie = cookiesArr[v], $.index = v + 1, $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1]), $.canHelp = !0, $.canHelp && $.activityId) {
                $.assigFirends = $.assigFirends.concat({
                    encryptAssignmentId: $.assigFirends[0] && $.assigFirends[0].encryptAssignmentId,
                    assignmentType: 2,
                    itemId: "SZm_olqSxIOtH97BATGmKoWraLaw"
                });
                for (let item of $.assigFirends || [])
                    if (item.encryptAssignmentId && item.assignmentType && item.itemId && (console.log(`\n账号 ${$.index} ${$.UserName} 开始给 ${item.itemId} 进行助力`), await superBrandDoTask({
                            activityId: $.activityId,
                            encryptProjectId: $.encryptProjectId,
                            encryptAssignmentId: item.encryptAssignmentId,
                            assignmentType: item.assignmentType,
                            itemId: item.itemId,
                            actionType: 0,
                            source: "main"
                        }), !$.canHelp)) {
                        console.log("次数已用完，跳出助力");
                        break
                    } for (let i = 0; i < new Array(4).fill("").length; i++) await superBrandTaskLottery(), await $.wait(400)
            } if (allMessage && $.isNode() && await notify.sendNotify($.name, allMessage), superShakeBeanConfig.superShakeUlr) {
            const scaleUl = {
                    category: "jump",
                    des: "m",
                    url: superShakeBeanConfig.superShakeUlr
                },
                openjd = `openjd://virtual?params=${encodeURIComponent(JSON.stringify(scaleUl))}`;
            $.msg($.name, "", `【${superShakeBeanConfig.superShakeTitle||"超级摇一摇"}】活动再次开启\n【${superShakeBeanConfig.taskVipName||"开通品牌会员"}】请点击弹窗直达活动页面\n${superShakeBeanConfig.superShakeUlr}`, {
                "open-url": openjd
            }), $.isNode() && await notify.sendNotify($.name, `【${superShakeBeanConfig.superShakeTitle}】活动再次开启\n【${superShakeBeanConfig.taskVipName||"开通品牌会员"}】请点击链接直达活动页面\n${superShakeBeanConfig.superShakeUlr}`, {
                url: openjd
            })
        }
    } else $.msg($.name, "【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取", "https://bean.m.jd.com/bean/signIndex.action", {
        "open-url": "https://bean.m.jd.com/bean/signIndex.action"
    })
})().catch((e => {
    $.log("", `❌ ${$.name}, 失败! 原因: ${e}!`, "")
})).finally((() => {
    $.done()
}));