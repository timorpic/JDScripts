const $ = new Env("京东种豆得豆_Timorpic");
let notify, newShareCodes, option, message, subTitle, jdNotify = !0,
    cookiesArr = [],
    cookie = "",
    jdPlantBeanShareArr = [],
    isBox = !1;
const JD_API_HOST = "https://api.m.jd.com/client.action";
let num, shareCodes = ["5bxg4676evw6qdusjhiv5c4xikp7rpxmxkyibqa@e7lhibzb3zek2dngmsqazpy7yqe5uszc3vwyrxi@qfxorx3ir6l52hvsosdrs2ms4y3h7wlwy7o5jii@iky3wi5aars3hkppuochkcikggbi2wtsf4cbyja", "5bxg4676evw6qdusjhiv5c4xikp7rpxmxkyibqa@e7lhibzb3zek2dngmsqazpy7yqe5uszc3vwyrxi@qfxorx3ir6l52hvsosdrs2ms4y3h7wlwy7o5jii@iky3wi5aars3hkppuochkcikggbi2wtsf4cbyja"],
    allMessage = "",
    currentRoundId = null,
    lastRoundId = null,
    roundList = [],
    awardState = "",
    randomCount = $.isNode() ? 20 : 5;
async function jdPlantBean() {
    try {
        if (console.log("获取任务及基本信息"), await plantBeanIndex(), "PB101" === $.plantBeanIndexResult.errorCode) return void console.log("\n活动太火爆了，还是去买买买吧！\n");
        for (let i = 0; i < $.plantBeanIndexResult.data.roundList.length; i++)
            if ("2" === $.plantBeanIndexResult.data.roundList[i].roundState) {
                num = i;
                break
            } if ($.plantBeanIndexResult && "0" === $.plantBeanIndexResult.code && $.plantBeanIndexResult.data) {
            const shareUrl = $.plantBeanIndexResult.data.jwordShareInfo.shareUrl;
            $.myPlantUuid = getParam(shareUrl, "plantUuid"), console.log(`\n【京东账号${$.index}（${$.UserName}）的${$.name}好友互助码】${$.myPlantUuid}\n`), roundList = $.plantBeanIndexResult.data.roundList, currentRoundId = roundList[num].roundId, lastRoundId = roundList[num - 1].roundId, awardState = roundList[num - 1].awardState, $.taskList = $.plantBeanIndexResult.data.taskList, subTitle = `【京东昵称】${$.plantBeanIndexResult.data.plantUserInfo.plantNickName}`, message += `【上期时间】${roundList[num-1].dateDesc.replace("上期 ","")}\n`, message += `【上期成长值】${roundList[num-1].growth}\n`, await receiveNutrients(), await doHelp(), await doTask(), await stealFriendWater(), await doCultureBean(), await doGetReward(), await showTaskProcess(), await plantShareSupportList()
        } else console.log(`种豆得豆-初始失败:  ${JSON.stringify($.plantBeanIndexResult)}`)
    } catch (e) {
        $.logErr(e);
        const errMsg = `京东账号${$.index} ${$.nickName||$.UserName}\n任务执行异常，请检查执行日志 ‼️‼️`;
        $.isNode() && await notify.sendNotify(`${$.name}`, errMsg), $.msg($.name, "", `${errMsg}`)
    }
}
async function doGetReward() {
    console.log("【上轮京豆】" + ("4" === awardState ? "采摘中" : "5" === awardState ? "可收获了" : "已领取")), "4" === awardState ? message += `【上期状态】${roundList[num-1].tipBeanEndTitle}\n` : "5" === awardState ? (await getReward(), console.log("开始领取京豆"), $.getReward && "0" === $.getReward.code ? (console.log("京豆领取成功"), message += `【上期兑换京豆】${$.getReward.data.awardBean}个\n`, $.msg($.name, subTitle, message), allMessage += `京东账号${$.index} ${$.nickName}\n${message}${$.index!==cookiesArr.length?"\n\n":""}`) : console.log(`$.getReward 异常：${JSON.stringify($.getReward)}`)) : "6" === awardState && (message += `【上期兑换京豆】${roundList[num-1].awardBeans}个\n`), roundList[num].dateDesc.indexOf("本期 ") > -1 && (roundList[num].dateDesc = roundList[num].dateDesc.substr(roundList[num].dateDesc.indexOf("本期 ") + 3, roundList[num].dateDesc.length)), message += `【本期时间】${roundList[num].dateDesc}\n`, message += `【本期成长值】${roundList[num].growth}\n`
}
async function doCultureBean() {
    if (await plantBeanIndex(), $.plantBeanIndexResult && "0" === $.plantBeanIndexResult.code) {
        const plantBeanRound = $.plantBeanIndexResult.data.roundList[num];
        if ("2" === plantBeanRound.roundState) {
            plantBeanRound.bubbleInfos && plantBeanRound.bubbleInfos.length && console.log("开始收取营养液");
            for (let bubbleInfo of plantBeanRound.bubbleInfos) console.log(`收取-${bubbleInfo.name}-的营养液`), await cultureBean(plantBeanRound.roundId, bubbleInfo.nutrientsType), console.log(`收取营养液结果:${JSON.stringify($.cultureBeanRes)}`)
        }
    } else console.log(`plantBeanIndexResult:${JSON.stringify($.plantBeanIndexResult)}`)
}
async function stealFriendWater() {
    if (await stealFriendList(), $.stealFriendList && "0" === $.stealFriendList.code) {
        if ($.stealFriendList.data && $.stealFriendList.data.tips) return void console.log("\n\n今日偷取好友营养液已达上限\n\n");
        if ($.stealFriendList.data && $.stealFriendList.data.friendInfoList && $.stealFriendList.data.friendInfoList.length > 0) {
            let nowTimes = new Date((new Date).getTime() + 60 * (new Date).getTimezoneOffset() * 1e3 + 288e5);
            for (let item of $.stealFriendList.data.friendInfoList) 20 === new Date(nowTimes).getHours() ? item.nutrCount >= 2 && (console.log(`可以偷的好友的信息paradiseUuid::${JSON.stringify(item.paradiseUuid)}`), await collectUserNutr(item.paradiseUuid), console.log(`偷取好友营养液情况:${JSON.stringify($.stealFriendRes)}`), $.stealFriendRes && "0" === $.stealFriendRes.code && console.log("偷取好友营养液成功")) : item.nutrCount >= 3 && (console.log(`可以偷的好友的信息paradiseUuid::${JSON.stringify(item.paradiseUuid)}`), await collectUserNutr(item.paradiseUuid), console.log(`偷取好友营养液情况:${JSON.stringify($.stealFriendRes)}`), $.stealFriendRes && "0" === $.stealFriendRes.code && console.log("偷取好友营养液成功"))
        }
    } else console.log(`$.stealFriendList 异常： ${JSON.stringify($.stealFriendList)}`)
}
async function doEgg() {
    if (await egg(), $.plantEggLotteryRes && "0" === $.plantEggLotteryRes.code)
        if ($.plantEggLotteryRes.data.restLotteryNum > 0) {
            const eggL = new Array($.plantEggLotteryRes.data.restLotteryNum).fill("");
            console.log(`目前共有${eggL.length}次扭蛋的机会`);
            for (let i = 0; i < eggL.length; i++) console.log(`开始第${i+1}次扭蛋`), await plantEggDoLottery(), console.log(`天天扭蛋成功：${JSON.stringify($.plantEggDoLotteryResult)}`)
        } else console.log("暂无扭蛋机会");
    else console.log("查询天天扭蛋的机会失败" + JSON.stringify($.plantEggLotteryRes))
}
async function doTask() {
    if ($.taskList && $.taskList.length > 0)
        for (let item of $.taskList)
            if (1 !== item.isFinished) {
                if (8 === item.taskType ? console.log(`\n【${item.taskName}】任务未完成,需自行手动去京东APP完成，${item.desc}营养液\n`) : console.log(`\n【${item.taskName}】任务未完成,${item.desc}营养液\n`), 1 === item.dailyTimes && 8 !== item.taskType && (console.log(`\n开始做 ${item.taskName}任务`), await receiveNutrientsTask(item.taskType), console.log(`做 ${item.taskName}任务结果:${JSON.stringify($.receiveNutrientsTaskRes)}\n`)), 3 === item.taskType) {
                    console.log(`开始做 ${item.taskName}任务`);
                    let unFinishedShopNum = item.totalNum - item.gainedNum;
                    if (0 === unFinishedShopNum) continue;
                    await shopTaskList();
                    const {
                        data: data
                    } = $.shopTaskListRes;
                    let goodShopListARR = [],
                        moreShopListARR = [],
                        shopList = [];
                    const {
                        goodShopList: goodShopList,
                        moreShopList: moreShopList
                    } = data;
                    for (let i of goodShopList) "2" === i.taskState && goodShopListARR.push(i);
                    for (let j of moreShopList) "2" === j.taskState && moreShopListARR.push(j);
                    shopList = goodShopListARR.concat(moreShopListARR);
                    for (let shop of shopList) {
                        const {
                            shopId: shopId,
                            shopTaskId: shopTaskId
                        } = shop, body = {
                            monitor_refer: "plant_shopNutrientsTask",
                            shopId: shopId,
                            shopTaskId: shopTaskId
                        }, shopRes = await requestGet("shopNutrientsTask", body);
                        if (console.log(`shopRes结果:${JSON.stringify(shopRes)}`), shopRes && "0" === shopRes.code && shopRes.data && shopRes.data.nutrState && "1" === shopRes.data.nutrState && unFinishedShopNum--, unFinishedShopNum <= 0) {
                            console.log(`${item.taskName}任务已做完\n`);
                            break
                        }
                    }
                }
                if (5 === item.taskType) {
                    console.log(`开始做 ${item.taskName}任务`);
                    let unFinishedProductNum = item.totalNum - item.gainedNum;
                    if (0 === unFinishedProductNum) continue;
                    await productTaskList();
                    const {
                        data: data
                    } = $.productTaskList;
                    let productListARR = [],
                        productList = [];
                    const {
                        productInfoList: productInfoList
                    } = data;
                    for (let i = 0; i < productInfoList.length; i++)
                        for (let j = 0; j < productInfoList[i].length; j++) productListARR.push(productInfoList[i][j]);
                    for (let i of productListARR) "2" === i.taskState && productList.push(i);
                    for (let product of productList) {
                        const {
                            skuId: skuId,
                            productTaskId: productTaskId
                        } = product, body = {
                            monitor_refer: "plant_productNutrientsTask",
                            productTaskId: productTaskId,
                            skuId: skuId
                        }, productRes = await requestGet("productNutrientsTask", body);
                        if (productRes && "0" === productRes.code && productRes.data && productRes.data.nutrState && "1" === productRes.data.nutrState && unFinishedProductNum--, unFinishedProductNum <= 0) {
                            console.log(`${item.taskName}任务已做完\n`);
                            break
                        }
                    }
                }
                if (10 === item.taskType) {
                    console.log(`开始做 ${item.taskName}任务`);
                    let unFinishedChannelNum = item.totalNum - item.gainedNum;
                    if (0 === unFinishedChannelNum) continue;
                    await plantChannelTaskList();
                    const {
                        data: data
                    } = $.plantChannelTaskList;
                    let goodChannelListARR = [],
                        normalChannelListARR = [],
                        channelList = [];
                    const {
                        goodChannelList: goodChannelList,
                        normalChannelList: normalChannelList
                    } = data;
                    for (let i of goodChannelList) "2" === i.taskState && goodChannelListARR.push(i);
                    for (let j of normalChannelList) "2" === j.taskState && normalChannelListARR.push(j);
                    channelList = goodChannelListARR.concat(normalChannelListARR);
                    for (let channelItem of channelList) {
                        const {
                            channelId: channelId,
                            channelTaskId: channelTaskId
                        } = channelItem, body = {
                            channelId: channelId,
                            channelTaskId: channelTaskId
                        }, channelRes = await requestGet("plantChannelNutrientsTask", body);
                        if (console.log(`channelRes结果:${JSON.stringify(channelRes)}`), channelRes && "0" === channelRes.code && channelRes.data && channelRes.data.nutrState && "1" === channelRes.data.nutrState && unFinishedChannelNum--, unFinishedChannelNum <= 0) {
                            console.log(`${item.taskName}任务已做完\n`);
                            break
                        }
                    }
                }
            } else console.log(`${item.taskName} 任务已完成\n`)
}

function showTaskProcess() {
    return new Promise((async resolve => {
        if (await plantBeanIndex(), $.taskList = $.plantBeanIndexResult.data.taskList, $.taskList && $.taskList.length > 0) {
            console.log("     任务   进度");
            for (let item of $.taskList) console.log(`[${item.taskName}]  ${item.gainedNum}/${item.totalNum}   ${item.isFinished}`)
        }
        resolve()
    }))
}
async function doHelp() {
    for (let plantUuid of newShareCodes)
        if (console.log(`开始助力京东账号${$.index} - ${$.nickName}的好友: ${plantUuid}`), plantUuid)
            if (plantUuid !== $.myPlantUuid)
                if (await helpShare(plantUuid), $.helpResult && "0" === $.helpResult.code) {
                    if ($.helpResult.data.helpShareRes)
                        if ("1" === $.helpResult.data.helpShareRes.state) console.log(`助力好友${plantUuid}成功`), console.log(`${$.helpResult.data.helpShareRes.promptText}\n`);
                        else {
                            if ("2" === $.helpResult.data.helpShareRes.state) {
                                console.log("您今日助力的机会已耗尽，已不能再帮助好友助力了\n");
                                break
                            }
                            "3" === $.helpResult.data.helpShareRes.state ? console.log("该好友今日已满9人助力/20瓶营养液,明天再来为Ta助力吧\n") : "4" === $.helpResult.data.helpShareRes.state ? console.log(`${$.helpResult.data.helpShareRes.promptText}\n`) : console.log(`助力其他情况：${JSON.stringify($.helpResult.data.helpShareRes)}`)
                        }
                } else console.log(`助力好友失败: ${JSON.stringify($.helpResult)}`);
    else console.log("\n跳过自己的plantUuid\n")
}

function showMsg() {
    $.log(`\n${message}\n`), jdNotify = $.getdata("jdPlantBeanNotify") ? $.getdata("jdPlantBeanNotify") : jdNotify, jdNotify && "false" !== jdNotify || $.msg($.name, subTitle, message)
}
async function getReward() {
    const body = {
        roundId: lastRoundId
    };
    $.getReward = await request("receivedBean", body)
}
async function cultureBean(currentRoundId, nutrientsType) {
    let functionId = arguments.callee.name.toString(),
        body = {
            roundId: currentRoundId,
            nutrientsType: nutrientsType
        };
    $.cultureBeanRes = await request(functionId, body)
}
async function stealFriendList() {
    $.stealFriendList = await request("plantFriendList", {
        pageNum: "1"
    })
}
async function collectUserNutr(paradiseUuid) {
    console.log("开始偷好友");
    let functionId = arguments.callee.name.toString();
    const body = {
        paradiseUuid: paradiseUuid,
        roundId: currentRoundId
    };
    $.stealFriendRes = await request(functionId, body)
}
async function receiveNutrients() {
    $.receiveNutrientsRes = await request("receiveNutrients", {
        roundId: currentRoundId,
        monitor_refer: "plant_receiveNutrients"
    })
}
async function plantEggDoLottery() {
    $.plantEggDoLotteryResult = await requestGet("plantEggDoLottery")
}
async function egg() {
    $.plantEggLotteryRes = await requestGet("plantEggLotteryIndex")
}
async function productTaskList() {
    let functionId = arguments.callee.name.toString();
    $.productTaskList = await requestGet(functionId, {
        monitor_refer: "plant_productTaskList"
    })
}
async function plantChannelTaskList() {
    let functionId = arguments.callee.name.toString();
    $.plantChannelTaskList = await requestGet(functionId)
}
async function shopTaskList() {
    let functionId = arguments.callee.name.toString();
    $.shopTaskListRes = await requestGet(functionId, {
        monitor_refer: "plant_receiveNutrients"
    })
}
async function receiveNutrientsTask(awardType) {
    const functionId = arguments.callee.name.toString(),
        body = {
            monitor_refer: "receiveNutrientsTask",
            awardType: `${awardType}`
        };
    $.receiveNutrientsTaskRes = await requestGet(functionId, body)
}
async function plantShareSupportList() {
    if ($.shareSupportList = await requestGet("plantShareSupportList", {
            roundId: ""
        }), $.shareSupportList && "0" === $.shareSupportList.code) {
        const {
            data: data
        } = $.shareSupportList, UTC8_Zero_Time = 864e5 * parseInt((Date.now() + 288e5) / 864e5) - 288e5, UTC8_End_Time = 864e5 * parseInt((Date.now() + 288e5) / 864e5) - 288e5 + 864e5;
        let friendList = [];
        data.map((item => {
            UTC8_Zero_Time <= item.createTime && item.createTime < UTC8_End_Time && friendList.push(item)
        })), message += `【助力您的好友】共${friendList.length}人`
    } else console.log(`异常情况：${JSON.stringify($.shareSupportList)}`)
}
async function helpShare(plantUuid) {
    console.log(`\n开始助力好友: ${plantUuid}`);
    const body = {
        plantUuid: plantUuid,
        wxHeadImgUrl: "",
        shareUuid: "",
        followType: "1"
    };
    $.helpResult = await request("plantBeanIndex", body), console.log(`助力结果的code:${$.helpResult&&$.helpResult.code}`)
}
async function plantBeanIndex() {
    $.plantBeanIndexResult = await request("plantBeanIndex")
}

function readShareCode() {
    return new Promise((async resolve => {
        $.get({
            url: `http://share.turinglabs.net/api/v3/bean/query/${randomCount}/`,
            timeout: 1e4
        }, ((err, resp, data) => {
            try {
                err ? (console.log(`${JSON.stringify(err)}`), console.log(`${$.name} API请求失败，请检查网路重试`)) : data && (console.log(`随机取个${randomCount}码放到您固定的互助码后面(不影响已有固定互助)`), data = JSON.parse(data))
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve(data)
            }
        })), await $.wait(15e3), resolve()
    }))
}

function shareCodesFormat() {
    return new Promise((async resolve => {
        if (newShareCodes = [], $.shareCodesArr[$.index - 1]) newShareCodes = $.shareCodesArr[$.index - 1].split("@");
        else {
            console.log(`由于您第${$.index}个京东账号未提供shareCode,将采纳本脚本自带的助力码\n`);
            const tempIndex = $.index > shareCodes.length ? shareCodes.length - 1 : $.index - 1;
            newShareCodes = shareCodes[tempIndex].split("@")
        }
        console.log(`第${$.index}个京东账号将要助力的好友${JSON.stringify(newShareCodes)}`), resolve()
    }))
}

function requireConfig() {
    return new Promise((resolve => {
        console.log("开始获取种豆得豆配置文件\n"), notify = $.isNode() ? require("./sendNotify") : "";
        const jdCookieNode = $.isNode() ? require("./jdCookie.js") : "",
            jdPlantBeanShareCodes = $.isNode() ? require("./jdPlantBeanShareCodes.js") : "";
        $.isNode() ? (Object.keys(jdCookieNode).forEach((item => {
            jdCookieNode[item] && cookiesArr.push(jdCookieNode[item])
        })), process.env.JD_DEBUG && "false" === process.env.JD_DEBUG && (console.log = () => {})) : cookiesArr = [$.getdata("CookieJD"), $.getdata("CookieJD2"), ...jsonParse($.getdata("CookiesJD") || "[]").map((item => item.cookie))].filter((item => !!item)), console.log(`共${cookiesArr.length}个京东账号\n`), $.shareCodesArr = [], $.isNode() ? Object.keys(jdPlantBeanShareCodes).forEach((item => {
            jdPlantBeanShareCodes[item] && $.shareCodesArr.push(jdPlantBeanShareCodes[item])
        })) : ($.getdata("jd_plantbean_inviter") && ($.shareCodesArr = $.getdata("jd_plantbean_inviter").split("\n").filter((item => !!item))), console.log(`\nBoxJs设置的${$.name}好友邀请码:${$.getdata("jd_plantbean_inviter")?$.getdata("jd_plantbean_inviter"):"暂无"}\n`)), console.log(`您提供了${$.shareCodesArr.length}个账号的种豆得豆助力码\n`), resolve()
    }))
}

function requestGet(function_id, body = {}) {
    return body.version || (body.version = "9.0.0.1"), body.monitor_source = "plant_app_plant_index", body.monitor_refer = "", new Promise((async resolve => {
        await $.wait(2e3);
        const option = {
            url: `${JD_API_HOST}?functionId=${function_id}&body=${escape(JSON.stringify(body))}&appid=ld`,
            headers: {
                Cookie: cookie,
                Host: "api.m.jd.com",
                Accept: "*/*",
                Connection: "keep-alive",
                "User-Agent": "JD4iPhone/167283 (iPhone;iOS 13.6.1;Scale/3.00)",
                "Accept-Language": "zh-Hans-CN;q=1,en-CN;q=0.9",
                "Accept-Encoding": "gzip, deflate, br",
                "Content-Type": "application/x-www-form-urlencoded"
            },
            timeout: 1e4
        };
        $.get(option, ((err, resp, data) => {
            try {
                err ? (console.log("\n种豆得豆: API查询请求失败 ‼️‼️"), $.logErr(err)) : data = JSON.parse(data)
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve(data)
            }
        }))
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
            },
            timeout: 1e4
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

function request(function_id, body = {}) {
    return new Promise((async resolve => {
        await $.wait(2e3), $.post(taskUrl(function_id, body), ((err, resp, data) => {
            try {
                err ? (console.log("\n种豆得豆: API查询请求失败 ‼️‼️"), console.log(`function_id:${function_id}`), $.logErr(err)) : data = JSON.parse(data)
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve(data)
            }
        }))
    }))
}

function taskUrl(function_id, body) {
    return body.version = "9.2.4.0", body.monitor_source = "plant_app_plant_index", body.monitor_refer = "", {
        url: JD_API_HOST,
        body: `functionId=${function_id}&body=${escape(JSON.stringify(body))}&appid=ld&client=apple&area=19_1601_50258_51885&build=167490&clientVersion=9.3.2`,
        headers: {
            Cookie: cookie,
            Host: "api.m.jd.com",
            Accept: "*/*",
            Connection: "keep-alive",
            "User-Agent": $.isNode() ? process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : require("./USER_AGENTS").USER_AGENT : $.getdata("JDUA") ? $.getdata("JDUA") : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1",
            "Accept-Language": "zh-Hans-CN;q=1,en-CN;q=0.9",
            "Accept-Encoding": "gzip, deflate, br",
            "Content-Type": "application/x-www-form-urlencoded"
        },
        timeout: 1e4
    }
}

function getParam(url, name) {
    const reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"),
        r = url.match(reg);
    return null != r ? unescape(r[2]) : null
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
    if (await requireConfig(), cookiesArr[0]) {
        for (let i = 0; i < cookiesArr.length; i++)
            if (cookiesArr[i]) {
                if (cookie = cookiesArr[i], $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1]), $.index = i + 1, $.isLogin = !0, $.nickName = "", await TotalBean(), console.log(`\n开始【京东账号${$.index}】${$.nickName||$.UserName}\n`), !$.isLogin) {
                    $.msg($.name, "【提示】cookie已失效", `京东账号${$.index} ${$.nickName||$.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, {
                        "open-url": "https://bean.m.jd.com/bean/signIndex.action"
                    }), $.isNode() && await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
                    continue
                }
                message = "", subTitle = "", option = {}, await shareCodesFormat(), await jdPlantBean(), await showMsg()
            } $.isNode() && allMessage && await notify.sendNotify(`${$.name}`, `${allMessage}`)
    } else $.msg($.name, "【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取", "https://bean.m.jd.com/bean/signIndex.action", {
        "open-url": "https://bean.m.jd.com/bean/signIndex.action"
    })
})().catch((e => {
    $.log("", `❌ ${$.name}, 失败! 原因: ${e}!`, "")
})).finally((() => {
    $.done()
}));