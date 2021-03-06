const $ = new Env("东东农场_Timorpic");
let notify, newShareCodes, cookiesArr = [],
    cookie = "",
    jdFruitShareArr = [],
    isBox = !1,
    allMessage = "",
    shareCodes = ["debfd7bcf944428caab3fe4c2ac629a2@fd222c20cb654e7c933eeb38a4072841@qfxorx3ir6l52hvsosdrs2ms4y3h7wlwy7o5jii@28aa304ed0124451b9af2b38a23f3cb8", "debfd7bcf944428caab3fe4c2ac629a2@fd222c20cb654e7c933eeb38a4072841@qfxorx3ir6l52hvsosdrs2ms4y3h7wlwy7o5jii@28aa304ed0124451b9af2b38a23f3cb8", "debfd7bcf944428caab3fe4c2ac629a2@fd222c20cb654e7c933eeb38a4072841@qfxorx3ir6l52hvsosdrs2ms4y3h7wlwy7o5jii@28aa304ed0124451b9af2b38a23f3cb8", "debfd7bcf944428caab3fe4c2ac629a2@fd222c20cb654e7c933eeb38a4072841@qfxorx3ir6l52hvsosdrs2ms4y3h7wlwy7o5jii@28aa304ed0124451b9af2b38a23f3cb8", "debfd7bcf944428caab3fe4c2ac629a2@fd222c20cb654e7c933eeb38a4072841@qfxorx3ir6l52hvsosdrs2ms4y3h7wlwy7o5jii@28aa304ed0124451b9af2b38a23f3cb8"],
    message = "",
    subTitle = "",
    option = {},
    isFruitFinished = !1;
const retainWater = 100;
let jdNotify = !1,
    jdFruitBeanCard = !0,
    randomCount = ($.isNode(), 0);
const JD_API_HOST = "https://api.m.jd.com/client.action",
    urlSchema = "openjd://virtual?params=%7B%20%22category%22:%20%22jump%22,%20%22des%22:%20%22m%22,%20%22url%22:%20%22https://h5.m.jd.com/babelDiy/Zeus/3KSjXqQabiTuD1cJ28QskrpWoBKT/index.html%22%20%7D";
async function jdFruit() {
    subTitle = `【京东账号${$.index}】${$.nickName}`;
    try {
        if (await initForFarm(), $.farmInfo.farmUserPro) {
            if (message = `【水果名称】${$.farmInfo.farmUserPro.name}\n`, console.log(`\n【京东账号${$.index}（${$.UserName}）的${$.name}好友互助码】${$.farmInfo.farmUserPro.shareCode}\n`), console.log(`\n【已成功兑换水果】${$.farmInfo.farmUserPro.winTimes}次\n`), message += `【已兑换水果】${$.farmInfo.farmUserPro.winTimes}次\n`, await masterHelpShare(), 2 === $.farmInfo.treeState || 3 === $.farmInfo.treeState) return option["open-url"] = urlSchema, $.msg($.name, "", `【京东账号${$.index}】${$.nickName||$.UserName}\n【提醒⏰】${$.farmInfo.farmUserPro.name}已可领取\n请去京东APP或微信小程序查看\n点击弹窗即达`, option), void($.isNode() && await notify.sendNotify(`${$.name} - 账号${$.index} - ${$.nickName}水果已可领取`, `【京东账号${$.index}】${$.nickName||$.UserName}\n【提醒⏰】${$.farmInfo.farmUserPro.name}已可领取\n请去京东APP或微信小程序查看`));
            if (1 === $.farmInfo.treeState) console.log(`\n${$.farmInfo.farmUserPro.name}种植中...\n`);
            else if (0 === $.farmInfo.treeState) return option["open-url"] = urlSchema, $.msg($.name, "", `【京东账号${$.index}】 ${$.nickName||$.UserName}\n【提醒⏰】您忘了种植新的水果\n请去京东APP或微信小程序选购并种植新的水果\n点击弹窗即达`, option), void($.isNode() && await notify.sendNotify(`${$.name} - 您忘了种植新的水果`, `京东账号${$.index} ${$.nickName}\n【提醒⏰】您忘了种植新的水果\n请去京东APP或微信小程序选购并种植新的水果`));
            await doDailyTask(), await doTenWater(), await getFirstWaterAward(), await getTenWaterAward(), await getWaterFriendGotAward(), await duck(), await doTenWaterAgain(), await predictionFruit()
        } else console.log(`初始化农场数据异常, 请登录京东 app查看农场0元水果功能是否正常,农场初始化数据: ${JSON.stringify($.farmInfo)}`), console.log("等待10秒后重试"), await $.wait(1e4), await jdFruit()
    } catch (e) {
        console.log("任务执行异常，请检查执行日志 ‼️‼️"), $.logErr(e)
    }
    await showMsg()
}
async function doDailyTask() {
    if (await taskInitForFarm(), console.log("开始签到"), $.farmTask.signInit.todaySigned ? console.log(`今天已签到,连续签到${$.farmTask.signInit.totalSigned},下次签到可得${$.farmTask.signInit.signEnergyEachAmount}g\n`) : (await signForFarm(), "0" === $.signResult.code ? console.log(`【签到成功】获得${$.signResult.amount}g💧\\n`) : console.log(`签到结果:  ${JSON.stringify($.signResult)}`)), console.log("被水滴砸中： " + ($.farmInfo.todayGotWaterGoalTask.canPop ? "是" : "否")), $.farmInfo.todayGotWaterGoalTask.canPop && (await gotWaterGoalTaskForFarm(), "0" === $.goalResult.code && console.log(`【被水滴砸中】获得${$.goalResult.addEnergy}g💧\\n`)), console.log("签到结束,开始广告浏览任务"), $.farmTask.gotBrowseTaskAdInit.f) console.log("今天已经做过浏览广告任务\n");
    else {
        let adverts = $.farmTask.gotBrowseTaskAdInit.userBrowseTaskAds,
            browseReward = 0,
            browseSuccess = 0,
            browseFail = 0;
        for (let advert of adverts) advert.limit <= advert.hadFinishedTimes ? console.log(`${advert.mainTitle}+ ' 已完成`) : (console.log("正在进行广告浏览任务: " + advert.mainTitle), await browseAdTaskForFarm(advert.advertId, 0), "0" === $.browseResult.code ? (console.log(`${advert.mainTitle}浏览任务完成`), await browseAdTaskForFarm(advert.advertId, 1), "0" === $.browseRwardResult.code ? (console.log(`领取浏览${advert.mainTitle}广告奖励成功,获得${$.browseRwardResult.amount}g`), browseReward += $.browseRwardResult.amount, browseSuccess++) : (browseFail++, console.log(`领取浏览广告奖励结果:  ${JSON.stringify($.browseRwardResult)}`))) : (browseFail++, console.log(`广告浏览任务结果:   ${JSON.stringify($.browseResult)}`)));
        browseFail > 0 ? console.log(`【广告浏览】完成${browseSuccess}个,失败${browseFail},获得${browseReward}g💧\\n`) : console.log(`【广告浏览】完成${browseSuccess}个,获得${browseReward}g💧\n`)
    }
    $.farmTask.gotThreeMealInit.f ? console.log("当前不在定时领水时间断或者已经领过\n") : (await gotThreeMealForFarm(), "0" === $.threeMeal.code ? console.log(`【定时领水】获得${$.threeMeal.amount}g💧\n`) : console.log(`定时领水成功结果:  ${JSON.stringify($.threeMeal)}`)), $.farmTask.waterFriendTaskInit.f ? console.log(`给${$.farmTask.waterFriendTaskInit.waterFriendMax}个好友浇水任务已完成\n`) : $.farmTask.waterFriendTaskInit.waterFriendCountKey < $.farmTask.waterFriendTaskInit.waterFriendMax && await doFriendsWater(), await getAwardInviteFriend(), await clockInIn(), await executeWaterRains(), await getExtraAward(), await turntableFarm()
}
async function predictionFruit() {
    console.log("开始预测水果成熟时间\n"), await initForFarm(), await taskInitForFarm();
    let waterEveryDayT = $.farmTask.totalWaterTaskInit.totalWaterTaskTimes;
    message += `【今日共浇水】${waterEveryDayT}次\n`, message += `【剩余 水滴】${$.farmInfo.farmUserPro.totalEnergy}g💧\n`, message += `【水果🍉进度】${($.farmInfo.farmUserPro.treeEnergy/$.farmInfo.farmUserPro.treeTotalEnergy*100).toFixed(2)}%，已浇水${$.farmInfo.farmUserPro.treeEnergy/10}次,还需${($.farmInfo.farmUserPro.treeTotalEnergy-$.farmInfo.farmUserPro.treeEnergy)/10}次\n`, $.farmInfo.toFlowTimes > $.farmInfo.farmUserPro.treeEnergy / 10 ? message += `【开花进度】再浇水${$.farmInfo.toFlowTimes-$.farmInfo.farmUserPro.treeEnergy/10}次开花\n` : $.farmInfo.toFruitTimes > $.farmInfo.farmUserPro.treeEnergy / 10 && (message += `【结果进度】再浇水${$.farmInfo.toFruitTimes-$.farmInfo.farmUserPro.treeEnergy/10}次结果\n`);
    let waterTotalT = ($.farmInfo.farmUserPro.treeTotalEnergy - $.farmInfo.farmUserPro.treeEnergy - $.farmInfo.farmUserPro.totalEnergy) / 10,
        waterD = Math.ceil(waterTotalT / waterEveryDayT);
    message += `【预测】${1===waterD?"明天":2===waterD?"后天":waterD+"天之后"}(${timeFormat(864e5*waterD+Date.now())}日)可兑换水果🍉`
}
async function doTenWater() {
    jdFruitBeanCard = $.getdata("jdFruitBeanCard") ? $.getdata("jdFruitBeanCard") : jdFruitBeanCard, $.isNode() && process.env.FRUIT_BEAN_CARD && (jdFruitBeanCard = process.env.FRUIT_BEAN_CARD), await myCardInfoForFarm();
    const {
        fastCard: fastCard,
        doubleCard: doubleCard,
        beanCard: beanCard,
        signCard: signCard
    } = $.myCardInfoRes;
    if ("true" == `${jdFruitBeanCard}` && JSON.stringify($.myCardInfoRes).match("限时翻倍") && beanCard > 0) console.log(`您设置的是使用水滴换豆卡，且背包有水滴换豆卡${beanCard}张, 跳过10次浇水任务`);
    else if ($.farmTask.totalWaterTaskInit.totalWaterTaskTimes < $.farmTask.totalWaterTaskInit.totalWaterTaskLimit) {
        console.log("\n准备浇水十次");
        let waterCount = 0;
        for (isFruitFinished = !1; waterCount < $.farmTask.totalWaterTaskInit.totalWaterTaskLimit - $.farmTask.totalWaterTaskInit.totalWaterTaskTimes; waterCount++) {
            if (console.log(`第${waterCount+1}次浇水`), await waterGoodForFarm(), console.log(`本次浇水结果:   ${JSON.stringify($.waterResult)}`), "0" !== $.waterResult.code) {
                console.log("浇水出现失败异常,跳出不在继续浇水");
                break
            }
            if (console.log(`剩余水滴${$.waterResult.totalEnergy}g`), $.waterResult.finished) {
                isFruitFinished = !0;
                break
            }
            if ($.waterResult.totalEnergy < 10) {
                console.log("水滴不够，结束浇水");
                break
            }
            await gotStageAward()
        }
        isFruitFinished && (option["open-url"] = urlSchema, $.msg($.name, "", `【京东账号${$.index}】${$.nickName||$.UserName}\n【提醒⏰】${$.farmInfo.farmUserPro.name}已可领取\n请去京东APP或微信小程序查看\n点击弹窗即达`, option), $.done(), $.isNode() && await notify.sendNotify(`${$.name} - 账号${$.index} - ${$.nickName||$.UserName}水果已可领取`, `京东账号${$.index} ${$.nickName}\n${$.farmInfo.farmUserPro.name}已可领取`))
    } else console.log("\n今日已完成10次浇水任务\n")
}
async function getFirstWaterAward() {
    await taskInitForFarm(), !$.farmTask.firstWaterInit.f && $.farmTask.firstWaterInit.totalWaterTimes > 0 ? (await firstWaterTaskForFarm(), "0" === $.firstWaterReward.code ? console.log(`【首次浇水奖励】获得${$.firstWaterReward.amount}g💧\n`) : console.log(`领取首次浇水奖励结果:  ${JSON.stringify($.firstWaterReward)}`)) : console.log("首次浇水奖励已领取\n")
}
async function getTenWaterAward() {
    !$.farmTask.totalWaterTaskInit.f && $.farmTask.totalWaterTaskInit.totalWaterTaskTimes >= $.farmTask.totalWaterTaskInit.totalWaterTaskLimit ? (await totalWaterTaskForFarm(), "0" === $.totalWaterReward.code ? console.log(`【十次浇水奖励】获得${$.totalWaterReward.totalWaterTaskEnergy}g💧\n`) : console.log(`领取10次浇水奖励结果:  ${JSON.stringify($.totalWaterReward)}`)) : $.farmTask.totalWaterTaskInit.totalWaterTaskTimes < $.farmTask.totalWaterTaskInit.totalWaterTaskLimit && console.log(`【十次浇水奖励】任务未完成，今日浇水${$.farmTask.totalWaterTaskInit.totalWaterTaskTimes}次\n`), console.log("finished 水果任务完成!")
}
async function doTenWaterAgain() {
    console.log("开始检查剩余水滴能否再次浇水再次浇水\n"), await initForFarm();
    let totalEnergy = $.farmInfo.farmUserPro.totalEnergy;
    console.log(`剩余水滴${totalEnergy}g\n`), await myCardInfoForFarm();
    const {
        fastCard: fastCard,
        doubleCard: doubleCard,
        beanCard: beanCard,
        signCard: signCard
    } = $.myCardInfoRes;
    if (console.log(`背包已有道具:\n快速浇水卡:${-1===fastCard?"未解锁":fastCard+"张"}\n水滴翻倍卡:${-1===doubleCard?"未解锁":doubleCard+"张"}\n水滴换京豆卡:${-1===beanCard?"未解锁":beanCard+"张"}\n加签卡:${-1===signCard?"未解锁":signCard+"张"}\n`), totalEnergy >= 100 && doubleCard > 0) {
        for (let i = 0; i < new Array(doubleCard).fill("").length; i++) await userMyCardForFarm("doubleCard"), console.log(`使用翻倍水滴卡结果:${JSON.stringify($.userMyCardRes)}`);
        await initForFarm(), totalEnergy = $.farmInfo.farmUserPro.totalEnergy
    }
    if (signCard > 0) {
        for (let i = 0; i < new Array(signCard).fill("").length; i++) await userMyCardForFarm("signCard"), console.log(`使用加签卡结果:${JSON.stringify($.userMyCardRes)}`);
        await initForFarm(), totalEnergy = $.farmInfo.farmUserPro.totalEnergy
    }
    if (jdFruitBeanCard = $.getdata("jdFruitBeanCard") ? $.getdata("jdFruitBeanCard") : jdFruitBeanCard, $.isNode() && process.env.FRUIT_BEAN_CARD && (jdFruitBeanCard = process.env.FRUIT_BEAN_CARD), "true" == `${jdFruitBeanCard}` && JSON.stringify($.myCardInfoRes).match("限时翻倍"))
        if (console.log("\n您设置的是水滴换豆功能,现在为您换豆"), totalEnergy >= 100 && $.myCardInfoRes.beanCard > 0) {
            if (await userMyCardForFarm("beanCard"), console.log(`使用水滴换豆卡结果:${JSON.stringify($.userMyCardRes)}`), "0" === $.userMyCardRes.code) return void(message += `【水滴换豆卡】获得${$.userMyCardRes.beanCount}个京豆\n`)
        } else console.log(`您目前水滴:${totalEnergy}g,水滴换豆卡${$.myCardInfoRes.beanCard}张,暂不满足水滴换豆的条件,为您继续浇水`);
    let overageEnergy = totalEnergy - 100;
    if (totalEnergy >= $.farmInfo.farmUserPro.treeTotalEnergy - $.farmInfo.farmUserPro.treeEnergy) {
        isFruitFinished = !1;
        for (let i = 0; i < ($.farmInfo.farmUserPro.treeTotalEnergy - $.farmInfo.farmUserPro.treeEnergy) / 10; i++) {
            if (await waterGoodForFarm(), console.log(`本次浇水结果(水果马上就可兑换了):   ${JSON.stringify($.waterResult)}`), "0" !== $.waterResult.code) {
                console.log("浇水出现失败异常,跳出不在继续浇水");
                break
            }
            if (console.log("\n浇水10g成功\n"), $.waterResult.finished) {
                isFruitFinished = !0;
                break
            }
            console.log(`目前水滴【${$.waterResult.totalEnergy}】g,继续浇水，水果马上就可以兑换了`)
        }
        isFruitFinished && (option["open-url"] = urlSchema, $.msg($.name, "", `【京东账号${$.index}】${$.nickName||$.UserName}\n【提醒⏰】${$.farmInfo.farmUserPro.name}已可领取\n请去京东APP或微信小程序查看\n点击弹窗即达`, option), $.done(), $.isNode() && await notify.sendNotify(`${$.name} - 账号${$.index} - ${$.nickName}水果已可领取`, `京东账号${$.index} ${$.nickName}\n${$.farmInfo.farmUserPro.name}已可领取`))
    } else if (overageEnergy >= 10) {
        console.log("目前剩余水滴：【" + totalEnergy + "】g，可继续浇水"), isFruitFinished = !1;
        for (let i = 0; i < parseInt(overageEnergy / 10); i++) {
            if (await waterGoodForFarm(), console.log(`本次浇水结果:   ${JSON.stringify($.waterResult)}`), "0" !== $.waterResult.code) {
                console.log("浇水出现失败异常,跳出不在继续浇水");
                break
            }
            if (console.log(`\n浇水10g成功,剩余${$.waterResult.totalEnergy}\n`), $.waterResult.finished) {
                isFruitFinished = !0;
                break
            }
            await gotStageAward()
        }
        isFruitFinished && (option["open-url"] = urlSchema, $.msg($.name, "", `【京东账号${$.index}】${$.nickName||$.UserName}\n【提醒⏰】${$.farmInfo.farmUserPro.name}已可领取\n请去京东APP或微信小程序查看\n点击弹窗即达`, option), $.done(), $.isNode() && await notify.sendNotify(`${$.name} - 账号${$.index} - ${$.nickName}水果已可领取`, `京东账号${$.index} ${$.nickName}\n${$.farmInfo.farmUserPro.name}已可领取`))
    } else console.log("目前剩余水滴：【" + totalEnergy + "】g,不再继续浇水,保留部分水滴用于完成第二天【十次浇水得水滴】任务")
}

function gotStageAward() {
    return new Promise((async resolve => {
        0 === $.waterResult.waterStatus && 10 === $.waterResult.treeEnergy ? (console.log("果树发芽了,奖励30g水滴"), await gotStageAwardForFarm("1"), console.log(`浇水阶段奖励1领取结果 ${JSON.stringify($.gotStageAwardForFarmRes)}`), "0" === $.gotStageAwardForFarmRes.code && console.log(`【果树发芽了】奖励${$.gotStageAwardForFarmRes.addEnergy}\n`)) : 1 === $.waterResult.waterStatus ? (console.log("果树开花了,奖励40g水滴"), await gotStageAwardForFarm("2"), console.log(`浇水阶段奖励2领取结果 ${JSON.stringify($.gotStageAwardForFarmRes)}`), "0" === $.gotStageAwardForFarmRes.code && console.log(`【果树开花了】奖励${$.gotStageAwardForFarmRes.addEnergy}g💧\n`)) : 2 === $.waterResult.waterStatus && (console.log("果树长出小果子啦, 奖励50g水滴"), await gotStageAwardForFarm("3"), console.log(`浇水阶段奖励3领取结果 ${JSON.stringify($.gotStageAwardForFarmRes)}`), "0" === $.gotStageAwardForFarmRes.code && console.log(`【果树结果了】奖励${$.gotStageAwardForFarmRes.addEnergy}g💧\n`)), resolve()
    }))
}
async function turntableFarm() {
    if (await initForTurntableFarm(), "0" === $.initForTurntableFarmRes.code) {
        let {
            timingIntervalHours: timingIntervalHours,
            timingLastSysTime: timingLastSysTime,
            sysTime: sysTime,
            timingGotStatus: timingGotStatus,
            remainLotteryTimes: remainLotteryTimes,
            turntableInfos: turntableInfos
        } = $.initForTurntableFarmRes;
        if (timingGotStatus ? console.log("4小时候免费赠送的抽奖机会已领取") : (console.log(`是否到了领取免费赠送的抽奖机会----${sysTime>timingLastSysTime+3600*timingIntervalHours*1e3}`), sysTime > timingLastSysTime + 3600 * timingIntervalHours * 1e3 ? (await timingAwardForTurntableFarm(), console.log(`领取定时奖励结果${JSON.stringify($.timingAwardRes)}`), await initForTurntableFarm(), remainLotteryTimes = $.initForTurntableFarmRes.remainLotteryTimes) : console.log("免费赠送的抽奖机会未到时间")), $.initForTurntableFarmRes.turntableBrowserAds && $.initForTurntableFarmRes.turntableBrowserAds.length > 0)
            for (let index = 0; index < $.initForTurntableFarmRes.turntableBrowserAds.length; index++) $.initForTurntableFarmRes.turntableBrowserAds[index].status ? console.log(`浏览天天抽奖的第${index+1}个逛会场任务已完成`) : (console.log(`开始浏览天天抽奖的第${index+1}个逛会场任务`), await browserForTurntableFarm(1, $.initForTurntableFarmRes.turntableBrowserAds[index].adId), "0" === $.browserForTurntableFarmRes.code && $.browserForTurntableFarmRes.status && (console.log(`第${index+1}个逛会场任务完成，开始领取水滴奖励\n`), await browserForTurntableFarm(2, $.initForTurntableFarmRes.turntableBrowserAds[index].adId), "0" === $.browserForTurntableFarmRes.code && (console.log(`第${index+1}个逛会场任务领取水滴奖励完成\n`), await initForTurntableFarm(), remainLotteryTimes = $.initForTurntableFarmRes.remainLotteryTimes)));
        console.log("开始天天抽奖--好友助力--每人每天只有三次助力机会.");
        for (let code of newShareCodes)
            if (code !== $.farmInfo.farmUserPro.shareCode) {
                if (await lotteryMasterHelp(code), "0" === $.lotteryMasterHelpRes.helpResult.code) console.log(`天天抽奖-助力${$.lotteryMasterHelpRes.helpResult.masterUserInfo.nickName}成功\n`);
                else if ("11" === $.lotteryMasterHelpRes.helpResult.code) console.log(`天天抽奖-不要重复助力${$.lotteryMasterHelpRes.helpResult.masterUserInfo.nickName}\n`);
                else if ("13" === $.lotteryMasterHelpRes.helpResult.code) {
                    console.log(`天天抽奖-助力${$.lotteryMasterHelpRes.helpResult.masterUserInfo.nickName}失败,助力次数耗尽\n`);
                    break
                }
            } else console.log("天天抽奖-不能自己给自己助力\n");
        if (console.log(`---天天抽奖次数remainLotteryTimes----${remainLotteryTimes}次`), remainLotteryTimes > 0) {
            console.log("开始抽奖");
            let lotteryResult = "";
            for (let i = 0; i < new Array(remainLotteryTimes).fill("").length && (await lotteryForTurntableFarm(), console.log(`第${i+1}次抽奖结果${JSON.stringify($.lotteryRes)}`), "0" !== $.lotteryRes.code || (turntableInfos.map((item => {
                    item.type === $.lotteryRes.type && (console.log(`lotteryRes.type${$.lotteryRes.type}`), $.lotteryRes.type.match(/bean/g) && "bean" === $.lotteryRes.type.match(/bean/g)[0] ? lotteryResult += `${item.name}个，` : ($.lotteryRes.type.match(/water/g) && $.lotteryRes.type.match(/water/g)[0], lotteryResult += `${item.name}，`))
                })), 0 !== $.lotteryRes.remainLotteryTimes)); i++);
            lotteryResult && console.log(`【天天抽奖】${lotteryResult.substr(0,lotteryResult.length-1)}\n`)
        } else console.log("天天抽奖--抽奖机会为0次")
    } else console.log("初始化天天抽奖得好礼失败")
}
async function getExtraAward() {
    if (await masterHelpTaskInitForFarm(), "0" === $.masterHelpResult.code) {
        if ($.masterHelpResult.masterHelpPeoples && $.masterHelpResult.masterHelpPeoples.length >= 5 ? $.masterHelpResult.masterGotFinal ? (console.log("已经领取过5好友助力额外奖励"), message += "【额外奖励】已被领取过\n") : (await masterGotFinishedTaskForFarm(), "0" === $.masterGotFinished.code && (console.log(`已成功领取好友助力奖励：【${$.masterGotFinished.amount}】g水`), message += `【额外奖励】${$.masterGotFinished.amount}g水领取成功\n`)) : (console.log("助力好友未达到5个"), message += "【额外奖励】领取失败,原因：给您助力的人未达5个\n"), $.masterHelpResult.masterHelpPeoples && $.masterHelpResult.masterHelpPeoples.length > 0) {
            let str = "";
            $.masterHelpResult.masterHelpPeoples.map(((item, index) => {
                index === $.masterHelpResult.masterHelpPeoples.length - 1 ? str += item.nickName || "匿名用户" : str += (item.nickName || "匿名用户") + ",";
                let date = new Date(item.time),
                    time = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getMinutes();
                console.log(`\n京东昵称【${item.nickName||"匿名用户"}】 在 ${time} 给您助过力\n`)
            })), message += `【助力您的好友】${str}\n`
        }
        console.log("领取额外奖励水滴结束\n")
    }
}
async function masterHelpShare() {
    console.log("开始助力好友");
    let salveHelpAddWater = 0,
        remainTimes = 3,
        helpSuccessPeoples = "";
    console.log(`格式化后的助力码::${JSON.stringify(newShareCodes)}\n`);
    for (let code of newShareCodes)
        if (console.log(`开始助力京东账号${$.index} - ${$.nickName}的好友: ${code}`), code)
            if (code !== $.farmInfo.farmUserPro.shareCode)
                if (await masterHelp(code), "0" === $.helpResult.code) {
                    if ("0" === $.helpResult.helpResult.code ? (salveHelpAddWater += $.helpResult.helpResult.salveHelpAddWater, console.log(`【助力好友结果】: 已成功给【${$.helpResult.helpResult.masterUserInfo.nickName}】助力`), console.log(`给好友【${$.helpResult.helpResult.masterUserInfo.nickName}】助力获得${$.helpResult.helpResult.salveHelpAddWater}g水滴`), helpSuccessPeoples += ($.helpResult.helpResult.masterUserInfo.nickName || "匿名用户") + ",") : "8" === $.helpResult.helpResult.code ? console.log(`【助力好友结果】: 助力【${$.helpResult.helpResult.masterUserInfo.nickName}】失败，您今天助力次数已耗尽`) : "9" === $.helpResult.helpResult.code ? console.log(`【助力好友结果】: 之前给【${$.helpResult.helpResult.masterUserInfo.nickName}】助力过了`) : "10" === $.helpResult.helpResult.code ? console.log(`【助力好友结果】: 好友【${$.helpResult.helpResult.masterUserInfo.nickName}】已满五人助力`) : console.log(`助力其他情况：${JSON.stringify($.helpResult.helpResult)}`), console.log(`【今日助力次数还剩】${$.helpResult.helpResult.remainTimes}次\n`), remainTimes = $.helpResult.helpResult.remainTimes, 0 === $.helpResult.helpResult.remainTimes) {
                        console.log("您当前助力次数已耗尽，跳出助力");
                        break
                    }
                } else console.log(`助力失败::${JSON.stringify($.helpResult)}`);
    else console.log("不能为自己助力哦，跳过自己的shareCode\n");
    if ($.isLoon() || $.isQuanX() || $.isSurge()) {
        let helpSuccessPeoplesKey = timeFormat() + $.farmInfo.farmUserPro.shareCode;
        $.getdata(helpSuccessPeoplesKey) || ($.setdata("", timeFormat(Date.now() - 864e5) + $.farmInfo.farmUserPro.shareCode), $.setdata("", helpSuccessPeoplesKey)), helpSuccessPeoples && ($.getdata(helpSuccessPeoplesKey) ? $.setdata($.getdata(helpSuccessPeoplesKey) + "," + helpSuccessPeoples, helpSuccessPeoplesKey) : $.setdata(helpSuccessPeoples, helpSuccessPeoplesKey)), helpSuccessPeoples = $.getdata(helpSuccessPeoplesKey)
    }
    helpSuccessPeoples && helpSuccessPeoples.length > 0 && (message += `【您助力的好友👬】${helpSuccessPeoples.substr(0,helpSuccessPeoples.length-1)}\n`), salveHelpAddWater > 0 && console.log(`【助力好友👬】获得${salveHelpAddWater}g💧\n`), message += `【今日剩余助力👬】${remainTimes}次\n`, console.log("助力好友结束，即将开始领取额外水滴奖励\n")
}
async function executeWaterRains() {
    let executeWaterRain = !$.farmTask.waterRainInit.f;
    executeWaterRain && (console.log("水滴雨任务，每天两次，最多可得10g水滴"), console.log("两次水滴雨任务是否全部完成：" + ($.farmTask.waterRainInit.f ? "是" : "否")), $.farmTask.waterRainInit.lastTime && Date.now() < $.farmTask.waterRainInit.lastTime + 108e5 && (executeWaterRain = !1, console.log(`\`【第${$.farmTask.waterRainInit.winTimes+1}次水滴雨】未到时间，请${new Date($.farmTask.waterRainInit.lastTime+108e5).toLocaleTimeString()}再试\n`)), executeWaterRain && (console.log(`开始水滴雨任务,这是第${$.farmTask.waterRainInit.winTimes+1}次，剩余${2-($.farmTask.waterRainInit.winTimes+1)}次`), await waterRainForFarm(), console.log("水滴雨waterRain"), "0" === $.waterRain.code && (console.log("水滴雨任务执行成功，获得水滴：" + $.waterRain.addEnergy + "g"), console.log(`【第${$.farmTask.waterRainInit.winTimes+1}次水滴雨】获得${$.waterRain.addEnergy}g水滴\n`))))
}
async function clockInIn() {
    if (console.log("开始打卡领水活动（签到，关注，领券）"), await clockInInitForFarm(), "0" === $.clockInInit.code) {
        if ($.clockInInit.todaySigned || (console.log("开始今日签到"), await clockInForFarm(), console.log(`打卡结果${JSON.stringify($.clockInForFarmRes)}`), "0" === $.clockInForFarmRes.code && (console.log(`【第${$.clockInForFarmRes.signDay}天签到】获得${$.clockInForFarmRes.amount}g💧\n`), 7 === $.clockInForFarmRes.signDay && (console.log("开始领取--惊喜礼包38g水滴"), await gotClockInGift(), "0" === $.gotClockInGiftRes.code && console.log(`【惊喜礼包】获得${$.gotClockInGiftRes.amount}g💧\n`)))), $.clockInInit.todaySigned && 7 === $.clockInInit.totalSigned && (console.log("开始领取--惊喜礼包38g水滴"), await gotClockInGift(), "0" === $.gotClockInGiftRes.code && console.log(`【惊喜礼包】获得${$.gotClockInGiftRes.amount}g💧\n`)), $.clockInInit.themes && $.clockInInit.themes.length > 0)
            for (let item of $.clockInInit.themes) item.hadGot || (console.log(`关注ID${item.id}`), await clockInFollowForFarm(item.id, "theme", "1"), console.log(`themeStep1--结果${JSON.stringify($.themeStep1)}`), "0" === $.themeStep1.code && (await clockInFollowForFarm(item.id, "theme", "2"), console.log(`themeStep2--结果${JSON.stringify($.themeStep2)}`), "0" === $.themeStep2.code && console.log(`关注${item.name}，获得水滴${$.themeStep2.amount}g`)));
        if ($.clockInInit.venderCoupons && $.clockInInit.venderCoupons.length > 0)
            for (let item of $.clockInInit.venderCoupons) item.hadGot || (console.log(`领券的ID${item.id}`), await clockInFollowForFarm(item.id, "venderCoupon", "1"), console.log(`venderCouponStep1--结果${JSON.stringify($.venderCouponStep1)}`), "0" === $.venderCouponStep1.code && (await clockInFollowForFarm(item.id, "venderCoupon", "2"), "0" === $.venderCouponStep2.code && (console.log(`venderCouponStep2--结果${JSON.stringify($.venderCouponStep2)}`), console.log(`从${item.name}领券，获得水滴${$.venderCouponStep2.amount}g`))))
    }
    console.log("开始打卡领水活动（签到，关注，领券）结束\n")
}
async function getAwardInviteFriend() {
    if (await friendListInitForFarm(), $.friendList) {
        if (console.log(`\n今日已邀请好友${$.friendList.inviteFriendCount}个 / 每日邀请上限${$.friendList.inviteFriendMax}个`), console.log(`开始删除${$.friendList.friends&&$.friendList.friends.length}个好友,可拿每天的邀请奖励`), $.friendList.friends && $.friendList.friends.length > 0)
            for (let friend of $.friendList.friends) {
                console.log(`\n开始删除好友 [${friend.shareCode}]`);
                const deleteFriendForFarm = await request("deleteFriendForFarm", {
                    shareCode: `${friend.shareCode}`,
                    version: 8,
                    channel: 1
                });
                deleteFriendForFarm && "0" === deleteFriendForFarm.code && console.log(`删除好友 [${friend.shareCode}] 成功\n`)
            }
        await receiveFriendInvite(), $.friendList.inviteFriendCount > 0 ? $.friendList.inviteFriendCount > $.friendList.inviteFriendGotAwardCount && (console.log("开始领取邀请好友的奖励"), await awardInviteFriendForFarm(), console.log(`领取邀请好友的奖励结果：：${JSON.stringify($.awardInviteFriendRes)}`)) : console.log("今日未邀请过好友")
    } else console.log("查询好友列表失败\n")
}
async function doFriendsWater() {
    await friendListInitForFarm(), console.log("开始给好友浇水..."), await taskInitForFarm();
    const {
        waterFriendCountKey: waterFriendCountKey,
        waterFriendMax: waterFriendMax
    } = $.farmTask.waterFriendTaskInit;
    if (console.log(`今日已给${waterFriendCountKey}个好友浇水`), waterFriendCountKey < waterFriendMax) {
        let needWaterFriends = [];
        if ($.friendList.friends && $.friendList.friends.length > 0) {
            $.friendList.friends.map(((item, index) => {
                1 === item.friendState && needWaterFriends.length < waterFriendMax - waterFriendCountKey && needWaterFriends.push(item.shareCode)
            })), console.log(`需要浇水的好友列表shareCodes:${JSON.stringify(needWaterFriends)}`);
            let waterFriendsCount = 0,
                cardInfoStr = "";
            for (let index = 0; index < needWaterFriends.length; index++) await waterFriendForFarm(needWaterFriends[index]), console.log(`为第${index+1}个好友浇水结果:${JSON.stringify($.waterFriendForFarmRes)}\n`), "0" === $.waterFriendForFarmRes.code ? (waterFriendsCount++, $.waterFriendForFarmRes.cardInfo && (console.log("为好友浇水获得道具了"), "beanCard" === $.waterFriendForFarmRes.cardInfo.type ? (console.log(`获取道具卡:${$.waterFriendForFarmRes.cardInfo.rule}`), cardInfoStr += "水滴换豆卡,") : "fastCard" === $.waterFriendForFarmRes.cardInfo.type ? (console.log(`获取道具卡:${$.waterFriendForFarmRes.cardInfo.rule}`), cardInfoStr += "快速浇水卡,") : "doubleCard" === $.waterFriendForFarmRes.cardInfo.type ? (console.log(`获取道具卡:${$.waterFriendForFarmRes.cardInfo.rule}`), cardInfoStr += "水滴翻倍卡,") : "signCard" === $.waterFriendForFarmRes.cardInfo.type && (console.log(`获取道具卡:${$.waterFriendForFarmRes.cardInfo.rule}`), cardInfoStr += "加签卡,"))) : "11" === $.waterFriendForFarmRes.code && console.log("水滴不够,跳出浇水");
            console.log(`【好友浇水】已给${waterFriendsCount}个好友浇水,消耗${10*waterFriendsCount}g水\n`), cardInfoStr && cardInfoStr.length > 0 && console.log(`【好友浇水奖励】${cardInfoStr.substr(0,cardInfoStr.length-1)}\n`)
        } else console.log("您的好友列表暂无好友,快去邀请您的好友吧!")
    } else console.log(`今日已为好友浇水量已达${waterFriendMax}个`)
}
async function getWaterFriendGotAward() {
    await taskInitForFarm();
    const {
        waterFriendCountKey: waterFriendCountKey,
        waterFriendMax: waterFriendMax,
        waterFriendSendWater: waterFriendSendWater,
        waterFriendGotAward: waterFriendGotAward
    } = $.farmTask.waterFriendTaskInit;
    waterFriendCountKey >= waterFriendMax ? waterFriendGotAward ? console.log(`给好友浇水的${waterFriendSendWater}g水滴奖励已领取\n`) : (await waterFriendGotAwardForFarm(), console.log(`领取给${waterFriendMax}个好友浇水后的奖励水滴::${JSON.stringify($.waterFriendGotAwardRes)}`), "0" === $.waterFriendGotAwardRes.code && console.log(`【给${waterFriendMax}好友浇水】奖励${$.waterFriendGotAwardRes.addWater}g水滴\n`)) : console.log(`暂未给${waterFriendMax}个好友浇水\n`)
}
async function receiveFriendInvite() {
    for (let code of newShareCodes) code !== $.farmInfo.farmUserPro.shareCode ? (await inviteFriend(code), $.inviteFriendRes && $.inviteFriendRes.helpResult && "0" === $.inviteFriendRes.helpResult.code ? console.log(`接收邀请成为好友结果成功,您已成为${$.inviteFriendRes.helpResult.masterUserInfo.nickName}的好友`) : $.inviteFriendRes && $.inviteFriendRes.helpResult && "17" === $.inviteFriendRes.helpResult.code && console.log("接收邀请成为好友结果失败,对方已是您的好友")) : console.log("自己不能邀请自己成为好友噢\n")
}
async function duck() {
    for (let i = 0; i < 10; i++)
        if (await getFullCollectionReward(), "0" === $.duckRes.code) {
            if ($.duckRes.hasLimit) {
                console.log(`${$.duckRes.title}`);
                break
            }
            console.log(`小鸭子游戏:${$.duckRes.title}`)
        } else if ("10" === $.duckRes.code) {
        console.log("小鸭子游戏达到上限");
        break
    }
}
async function getFullCollectionReward() {
    return new Promise((resolve => {
        $.post(taskUrl("getFullCollectionReward", {
            type: 2,
            version: 6,
            channel: 2
        }), ((err, resp, data) => {
            try {
                err ? (console.log("\n东东农场: API查询请求失败 ‼️‼️"), console.log(JSON.stringify(err)), $.logErr(err)) : safeGet(data) && ($.duckRes = JSON.parse(data))
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve()
            }
        }))
    }))
}
async function totalWaterTaskForFarm() {
    const functionId = arguments.callee.name.toString();
    $.totalWaterReward = await request(functionId)
}
async function firstWaterTaskForFarm() {
    const functionId = arguments.callee.name.toString();
    $.firstWaterReward = await request(functionId)
}
async function waterFriendGotAwardForFarm() {
    const functionId = arguments.callee.name.toString();
    $.waterFriendGotAwardRes = await request(functionId, {
        version: 4,
        channel: 1
    })
}
async function myCardInfoForFarm() {
    const functionId = arguments.callee.name.toString();
    $.myCardInfoRes = await request(functionId, {
        version: 5,
        channel: 1
    })
}
async function userMyCardForFarm(cardType) {
    const functionId = arguments.callee.name.toString();
    $.userMyCardRes = await request(functionId, {
        cardType: cardType
    })
}
async function gotStageAwardForFarm(type) {
    $.gotStageAwardForFarmRes = await request(arguments.callee.name.toString(), {
        type: type
    })
}
async function waterGoodForFarm() {
    await $.wait(1e3), console.log("等待了1秒");
    const functionId = arguments.callee.name.toString();
    $.waterResult = await request(functionId)
}
async function initForTurntableFarm() {
    $.initForTurntableFarmRes = await request(arguments.callee.name.toString(), {
        version: 4,
        channel: 1
    })
}
async function lotteryForTurntableFarm() {
    await $.wait(2e3), console.log("等待了2秒"), $.lotteryRes = await request(arguments.callee.name.toString(), {
        type: 1,
        version: 4,
        channel: 1
    })
}
async function timingAwardForTurntableFarm() {
    $.timingAwardRes = await request(arguments.callee.name.toString(), {
        version: 4,
        channel: 1
    })
}
async function browserForTurntableFarm(type, adId) {
    1 === type && console.log("浏览爆品会场"), 2 === type && console.log("天天抽奖浏览任务领取水滴");
    const body = {
        type: type,
        adId: adId,
        version: 4,
        channel: 1
    };
    $.browserForTurntableFarmRes = await request(arguments.callee.name.toString(), body)
}
async function browserForTurntableFarm2(type) {
    const body = {
        type: 2,
        adId: type,
        version: 4,
        channel: 1
    };
    $.browserForTurntableFarm2Res = await request("browserForTurntableFarm", body)
}
async function lotteryMasterHelp() {
    $.lotteryMasterHelpRes = await request("initForFarm", {
        imageUrl: "",
        nickName: "",
        shareCode: arguments[0] + "-3",
        babelChannel: "3",
        version: 4,
        channel: 1
    })
}
async function masterGotFinishedTaskForFarm() {
    const functionId = arguments.callee.name.toString();
    $.masterGotFinished = await request(functionId)
}
async function masterHelpTaskInitForFarm() {
    const functionId = arguments.callee.name.toString();
    $.masterHelpResult = await request(functionId)
}
async function inviteFriend() {
    $.inviteFriendRes = await request("initForFarm", {
        imageUrl: "",
        nickName: "",
        shareCode: arguments[0] + "-inviteFriend",
        version: 4,
        channel: 2
    })
}
async function masterHelp() {
    $.helpResult = await request("initForFarm", {
        imageUrl: "",
        nickName: "",
        shareCode: arguments[0],
        babelChannel: "3",
        version: 2,
        channel: 1
    })
}
async function waterRainForFarm() {
    const functionId = arguments.callee.name.toString(),
        body = {
            type: 1,
            hongBaoTimes: 100,
            version: 3
        };
    $.waterRain = await request(functionId, body)
}
async function clockInInitForFarm() {
    const functionId = arguments.callee.name.toString();
    $.clockInInit = await request(functionId)
}
async function clockInForFarm() {
    const functionId = arguments.callee.name.toString();
    $.clockInForFarmRes = await request(functionId, {
        type: 1
    })
}
async function clockInFollowForFarm(id, type, step) {
    const functionId = arguments.callee.name.toString();
    let body = {
        id: id,
        type: type,
        step: step
    };
    "theme" === type ? "1" === step ? $.themeStep1 = await request(functionId, body) : "2" === step && ($.themeStep2 = await request(functionId, body)) : "venderCoupon" === type && ("1" === step ? $.venderCouponStep1 = await request(functionId, body) : "2" === step && ($.venderCouponStep2 = await request(functionId, body)))
}
async function gotClockInGift() {
    $.gotClockInGiftRes = await request("clockInForFarm", {
        type: 2
    })
}
async function gotThreeMealForFarm() {
    const functionId = arguments.callee.name.toString();
    $.threeMeal = await request(functionId)
}
async function browseAdTaskForFarm(advertId, type) {
    const functionId = arguments.callee.name.toString();
    0 === type ? $.browseResult = await request(functionId, {
        advertId: advertId,
        type: type,
        version: 14,
        channel: 1,
        babelChannel: "45"
    }) : 1 === type && ($.browseRwardResult = await request(functionId, {
        advertId: advertId,
        type: type,
        version: 14,
        channel: 1,
        babelChannel: "45"
    }))
}
async function gotWaterGoalTaskForFarm() {
    $.goalResult = await request(arguments.callee.name.toString(), {
        type: 3
    })
}
async function signForFarm() {
    const functionId = arguments.callee.name.toString();
    $.signResult = await request(functionId)
}
async function initForFarm() {
    return new Promise((resolve => {
        const option = {
            url: `${JD_API_HOST}?functionId=initForFarm`,
            body: `body=${escape(JSON.stringify({version:14}))}&appid=wh5&clientVersion=9.1.0`,
            headers: {
                accept: "*/*",
                "accept-encoding": "gzip, deflate, br",
                "accept-language": "zh-CN,zh;q=0.9",
                "cache-control": "no-cache",
                cookie: cookie,
                origin: "https://home.m.jd.com",
                pragma: "no-cache",
                referer: "https://home.m.jd.com/myJd/newhome.action",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-site",
                "User-Agent": $.isNode() ? process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : require("./USER_AGENTS").USER_AGENT : $.getdata("JDUA") ? $.getdata("JDUA") : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1",
                "Content-Type": "application/x-www-form-urlencoded"
            },
            timeout: 1e4
        };
        $.post(option, ((err, resp, data) => {
            try {
                err ? (console.log("\n东东农场: API查询请求失败 ‼️‼️"), console.log(JSON.stringify(err)), $.logErr(err)) : safeGet(data) && ($.farmInfo = JSON.parse(data))
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve()
            }
        }))
    }))
}
async function taskInitForFarm() {
    console.log("\n初始化任务列表");
    const functionId = arguments.callee.name.toString();
    $.farmTask = await request(functionId, {
        version: 14,
        channel: 1,
        babelChannel: "45"
    })
}
async function friendListInitForFarm() {
    $.friendList = await request("friendListInitForFarm", {
        version: 4,
        channel: 1
    })
}
async function awardInviteFriendForFarm() {
    $.awardInviteFriendRes = await request("awardInviteFriendForFarm")
}
async function waterFriendForFarm(shareCode) {
    const body = {
        shareCode: shareCode,
        version: 6,
        channel: 1
    };
    $.waterFriendForFarmRes = await request("waterFriendForFarm", body)
}
async function showMsg() {
    $.isNode() && process.env.FRUIT_NOTIFY_CONTROL ? $.ctrTemp = "false" == `${process.env.FRUIT_NOTIFY_CONTROL}` : $.getdata("jdFruitNotify") ? $.ctrTemp = "false" === $.getdata("jdFruitNotify") : $.ctrTemp = "false" == `${jdNotify}`, $.ctrTemp ? ($.msg($.name, subTitle, message, option), $.isNode() && (allMessage += `${subTitle}\n${message}${$.index!==cookiesArr.length?"\n\n":""}`)) : $.log(`\n${message}\n`)
}

function timeFormat(time) {
    let date;
    return date = time ? new Date(time) : new Date, date.getFullYear() + "-" + (date.getMonth() + 1 >= 10 ? date.getMonth() + 1 : "0" + (date.getMonth() + 1)) + "-" + (date.getDate() >= 10 ? date.getDate() : "0" + date.getDate())
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
        console.log("开始获取配置文件\n"), notify = $.isNode() ? require("./sendNotify") : "";
        const jdCookieNode = $.isNode() ? require("./jdCookie.js") : "",
            jdFruitShareCodes = $.isNode() ? require("./jdFruitShareCodes.js") : "";
        $.isNode() ? (Object.keys(jdCookieNode).forEach((item => {
            jdCookieNode[item] && cookiesArr.push(jdCookieNode[item])
        })), process.env.JD_DEBUG && "false" === process.env.JD_DEBUG && (console.log = () => {})) : cookiesArr = [$.getdata("CookieJD"), $.getdata("CookieJD2"), ...jsonParse($.getdata("CookiesJD") || "[]").map((item => item.cookie))].filter((item => !!item)), console.log(`共${cookiesArr.length}个京东账号\n`), $.shareCodesArr = [], $.isNode() ? Object.keys(jdFruitShareCodes).forEach((item => {
            jdFruitShareCodes[item] && $.shareCodesArr.push(jdFruitShareCodes[item])
        })) : ($.getdata("FRUITSHARECODES") && ($.shareCodesArr = $.getdata("FRUITSHARECODES").split("\n").filter((item => !!item))), console.log(`\nBoxJs设置的${$.name}好友邀请码:${$.getdata("FRUITSHARECODES")?$.getdata("FRUITSHARECODES"):"暂无"}\n`)), console.log(`您提供了${$.shareCodesArr.length}个账号的农场助力码\n`), resolve()
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

function request(function_id, body = {}, timeout = 1e3) {
    return new Promise((resolve => {
        setTimeout((() => {
            $.get(taskUrl(function_id, body), ((err, resp, data) => {
                try {
                    err ? (console.log("\n东东农场: API查询请求失败 ‼️‼️"), console.log(JSON.stringify(err)), console.log(`function_id:${function_id}`), $.logErr(err)) : safeGet(data) && (data = JSON.parse(data))
                } catch (e) {
                    $.logErr(e, resp)
                } finally {
                    resolve(data)
                }
            }))
        }), timeout)
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
        url: `${JD_API_HOST}?functionId=${function_id}&appid=wh5&body=${escape(JSON.stringify(body))}`,
        headers: {
            Cookie: cookie,
            UserAgent: $.isNode() ? process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : require("./USER_AGENTS").USER_AGENT : $.getdata("JDUA") ? $.getdata("JDUA") : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"
        },
        timeout: 1e4
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
    if (await requireConfig(), cookiesArr[0]) {
        for (let i = 0; i < cookiesArr.length; i++)
            if (cookiesArr[i]) {
                if (cookie = cookiesArr[i], $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1]), $.index = i + 1, $.isLogin = !0, $.nickName = "", await TotalBean(), console.log(`\n开始【京东账号${$.index}】${$.nickName||$.UserName}\n`), !$.isLogin) {
                    $.msg($.name, "【提示】cookie已失效", `京东账号${$.index} ${$.nickName||$.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, {
                        "open-url": "https://bean.m.jd.com/bean/signIndex.action"
                    }), $.isNode() && await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
                    continue
                }
                message = "", subTitle = "", option = {}, await shareCodesFormat(), await jdFruit()
            } $.isNode() && allMessage && $.ctrTemp && await notify.sendNotify(`${$.name}`, `${allMessage}`)
    } else $.msg($.name, "【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取", "https://bean.m.jd.com/bean/signIndex.action", {
        "open-url": "https://bean.m.jd.com/bean/signIndex.action"
    })
})().catch((e => {
    $.log("", `❌ ${$.name}, 失败! 原因: ${e}!`, "")
})).finally((() => {
    $.done()
}));