const $ = new Env("宠汪汪_Timorpic"),
    zooFaker = require("./JDJRValidator_Pure");
$.get = zooFaker.injectToRequest2($.get.bind($)), $.post = zooFaker.injectToRequest2($.post.bind($));
const notify = $.isNode() ? require("./sendNotify") : "",
    jdCookieNode = $.isNode() ? require("./jdCookie.js") : "";
let allMessage = "",
    cookiesArr = [],
    cookie = "";
$.isNode() ? (Object.keys(jdCookieNode).forEach((item => {
    cookiesArr.push(jdCookieNode[item])
})), process.env.JD_DEBUG && "false" === process.env.JD_DEBUG && (console.log = () => {})) : cookiesArr = [$.getdata("CookieJD"), $.getdata("CookieJD2"), ...jsonParse($.getdata("CookiesJD") || "[]").map((item => item.cookie))].filter((item => !!item));
let message = "",
    subTitle = "",
    FEED_NUM = 1 * $.getdata("joyFeedCount") || 10,
    teamLevel = "2",
    joyRunFlag = !0,
    jdNotify = !0,
    joyRunNotify = !0;
async function jdJoy() {
    try {
        await getPetTaskConfig(), $.getPetTaskConfigRes.success ? ($.isNode() && process.env.JOY_FEED_COUNT && ([0, 10, 20, 40, 80].indexOf(1 * process.env.JOY_FEED_COUNT) > -1 ? FEED_NUM = process.env.JOY_FEED_COUNT ? 1 * process.env.JOY_FEED_COUNT : FEED_NUM : console.log("您输入的 JOY_FEED_COUNT 为非法数字，请重新输入")), await feedPets(FEED_NUM), await Promise.all([petTask(), appPetTask()]), await deskGoodsTask(), await enterRoom(), await joinTwoPeopleRun()) : message += `${$.getPetTaskConfigRes.errorMessage}`
    } catch (e) {
        $.logErr(e)
    }
}
async function deskGoodsTask() {
    const deskGoodsRes = await getDeskGoodDetails();
    if (deskGoodsRes && deskGoodsRes.success)
        if (deskGoodsRes.data && deskGoodsRes.data.deskGoods) {
            const {
                deskGoods: deskGoods,
                taskChance: taskChance,
                followCount: followCount = 0
            } = deskGoodsRes.data;
            if (console.log(`浏览货柜商品 ${followCount||0}/${taskChance}`), taskChance === followCount) return;
            for (let item of deskGoods) !item.status && item.sku && await followScan(item.sku)
        } else console.log("\n限时商品货架已下架")
}
async function joinTwoPeopleRun() {
    if (joyRunFlag = $.getdata("joyRunFlag") ? $.getdata("joyRunFlag") : joyRunFlag, $.isNode() && process.env.JOY_RUN_FLAG && (joyRunFlag = process.env.JOY_RUN_FLAG), "true" == `${joyRunFlag}`) {
        let teamLevelTemp = [];
        if (teamLevelTemp = $.isNode() ? process.env.JOY_TEAM_LEVEL ? process.env.JOY_TEAM_LEVEL.split("&") : teamLevel.split("&") : $.getdata("JOY_TEAM_LEVEL") ? $.getdata("JOY_TEAM_LEVEL").split("&") : teamLevel.split("&"), teamLevelTemp = teamLevelTemp[$.index - 1] ? teamLevelTemp[$.index - 1] : 2, await getPetRace(), console.log(`\n===以下是京东账号${$.index} ${$.nickName} ${$.petRaceResult.data.teamLimitCount||teamLevelTemp}人赛跑信息===\n`), $.petRaceResult) {
            let petRaceResult = $.petRaceResult.data.petRaceResult;
            if (console.log(`赛跑状态：${petRaceResult}\n`), "not_participate" === petRaceResult && (console.log(`暂未参赛，现在为您参加${teamLevelTemp}人赛跑`), await runMatch(1 * teamLevelTemp), $.runMatchResult.success && (await getWinCoin(), console.log(`${$.getWinCoinRes.data.teamLimitCount||teamLevelTemp}人赛跑参加成功\n`), message += `${$.getWinCoinRes.data.teamLimitCount||teamLevelTemp}人赛跑：成功参加\n`, await energySupplyStation("2"), console.log("双人赛跑助力请自己手动去邀请好友，脚本不带赛跑助力功能\n"))), "unbegin" === petRaceResult && console.log("比赛还未开始，请九点再来"), "time_over" === petRaceResult && console.log("今日参赛的比赛已经结束，请明天九点再来"), "unreceive" === petRaceResult) {
                console.log("今日参赛的比赛已经结束，现在领取奖励"), await getWinCoin();
                let winCoin = 0;
                $.getWinCoinRes && $.getWinCoinRes.success && (winCoin = $.getWinCoinRes.data.winCoin), await receiveJoyRunAward(), console.log(`领取赛跑奖励结果：${JSON.stringify($.receiveJoyRunAwardRes)}`), $.receiveJoyRunAwardRes.success && (joyRunNotify = $.isNode() ? process.env.JOY_RUN_NOTIFY ? process.env.JOY_RUN_NOTIFY : `${joyRunNotify}` : $.getdata("joyRunNotify") ? $.getdata("joyRunNotify") : `${joyRunNotify}`, $.msg($.name, "", `【京东账号${$.index}】${$.nickName}\n太棒了，${$.name}赛跑取得获胜\n恭喜您已获得${winCoin}积分奖励`), allMessage += `京东账号${$.index}${$.nickName}\n太棒了，${$.name}赛跑取得获胜\n恭喜您已获得${winCoin}积分奖励${$.index!==cookiesArr.length?"\n\n":""}`)
            }
            if ("participate" === petRaceResult) {
                if (await energySupplyStation("2"), await getRankList(), $.raceUsers && $.raceUsers.length > 0)
                    for (let index = 0; index < $.raceUsers.length; index++) 0 === index ? console.log(`您当前里程：${$.raceUsers[index].distance}KM\n当前排名:第${$.raceUsers[index].rank}名\n将获得积分:${$.raceUsers[index].coin}\n`) : console.log(`对手 ${$.raceUsers[index].nickName} 当前里程：${$.raceUsers[index].distance}KM`);
                if (console.log("\n今日已参赛，下面显示应援团信息"), await getBackupInfo(), $.getBackupInfoResult.success) {
                    const {
                        currentNickName: currentNickName,
                        totalMembers: totalMembers,
                        totalDistance: totalDistance,
                        backupList: backupList
                    } = $.getBackupInfoResult.data;
                    if (console.log(`${currentNickName}的应援团信息如下\n团员：${totalMembers}个\n团员助力的里程数：${totalDistance}\n`), backupList && backupList.length > 0)
                        for (let item of backupList) console.log(`${item.nickName}为您助力${item.distance}km`);
                    else console.log("暂无好友为您助力赛跑，如需助力，请手动去邀请好友助力\n")
                }
            }
        }
    } else console.log("您设置的是不参加双人赛跑")
}
async function petTask() {
    for (let item of $.getPetTaskConfigRes.datas || []) {
        const joinedCount = item.joinedCount || 0;
        if ("chance_full" !== item.receiveStatus) {
            if ("SignEveryDay" === item.taskType)
                if ("chance_left" === item.receiveStatus) console.log("每日签到未完成,需要自己手动去微信小程序【来客有礼】签到，可获得京豆奖励");
                else if ("unreceive" === item.receiveStatus) {
                const res = await getFood("SignEveryDay");
                console.log(`领取每日签到狗粮结果：${res.data}`)
            }
            if ("race" === item.taskType)
                if ("chance_left" === item.receiveStatus) console.log("每日赛跑未完成");
                else if ("unreceive" === item.receiveStatus) {
                const res = await getFood("race");
                console.log(`领取每日赛跑狗粮结果：${res.data}`)
            }
            if ("exchange" === item.taskType)
                if ("chance_left" === item.receiveStatus) console.log("每日兑换未完成");
                else if ("unreceive" === item.receiveStatus) {
                const res = await getFood("exchange");
                console.log(`领取每日兑换狗粮结果：${res.data}`)
            }
            if ("HelpFeed" === item.taskType)
                if ("chance_left" === item.receiveStatus) console.log("每日帮好友喂一次狗粮未完成");
                else if ("unreceive" === item.receiveStatus) {
                const res = await getFood("HelpFeed");
                console.log(`领取每日帮好友喂一次狗粮 狗粮结果：${res.data}`)
            }
            if ("FeedEveryDay" === item.taskType)
                if ("chance_left" === item.receiveStatus) console.log(`\n${item.taskName}任务进行中\n`);
                else if ("unreceive" === item.receiveStatus) {
                const res = await getFood("FeedEveryDay");
                console.log(`领取每日喂狗粮 结果：${res.data}`)
            }
            if ("InviteUser" === item.taskType)
                if ("chance_left" === item.receiveStatus) console.log("未完成,需要自己手动去邀请好友给你助力,可以获得狗粮");
                else if ("unreceive" === item.receiveStatus) {
                const InviteUser = await getFood("InviteUser");
                console.log(`领取助力后的狗粮结果::${JSON.stringify(InviteUser)}`)
            }
            if ("ThreeMeals" === item.taskType && (console.log("-----每日三餐-----"), "unreceive" === item.receiveStatus)) {
                const ThreeMealsRes = await getFood("ThreeMeals");
                ThreeMealsRes.success && "received" === ThreeMealsRes.errorCode && (console.log("三餐结果领取成功"), message += `【三餐】领取成功，获得${ThreeMealsRes.data}g狗粮\n`)
            }
            if ("FollowShop" === item.taskType) {
                console.log("-----关注店铺-----");
                const followShops = item.followShops;
                for (let shop of followShops)
                    if (!shop.status) {
                        await dofollowShop(shop.shopId), await $.wait(1e3);
                        const followShopRes = await followShop(shop.shopId);
                        console.log(`关注店铺${shop.name}结果::${JSON.stringify(followShopRes)}`), await $.wait(5e3)
                    }
            }
            if ("ScanMarket" === item.taskType) {
                console.log("----逛会场----");
                const scanMarketList = item.scanMarketList;
                for (let scanMarketItem of scanMarketList)
                    if (!scanMarketItem.status) {
                        const body = {
                            marketLink: `${scanMarketItem.marketLink||scanMarketItem.marketLinkH5}`,
                            taskType: "ScanMarket"
                        };
                        await doScanMarket("scan", encodeURI(body.marketLink)), await $.wait(1e3);
                        const scanMarketRes = await scanMarket("scan", body);
                        console.log(`逛会场-${scanMarketItem.marketName}结果::${JSON.stringify(scanMarketRes)}`), await $.wait(5e3)
                    }
            }
            if ("FollowChannel" === item.taskType) {
                console.log("----浏览频道----");
                const followChannelList = item.followChannelList;
                for (let followChannelItem of followChannelList)
                    if (!followChannelItem.status) {
                        const body = {
                            channelId: followChannelItem.channelId,
                            taskType: "FollowChannel"
                        };
                        await doScanMarket("follow_channel", followChannelItem.channelId), await $.wait(1e3);
                        const scanMarketRes = await scanMarket("scan", body);
                        console.log(`浏览频道-${followChannelItem.channelName}结果::${JSON.stringify(scanMarketRes)}`), await $.wait(5e3)
                    }
            }
            if ("FollowGood" === item.taskType) {
                console.log("----关注商品----");
                const followGoodList = item.followGoodList;
                for (let followGoodItem of followGoodList)
                    if (!followGoodItem.status) {
                        const body = `sku=${followGoodItem.sku}`;
                        await doScanMarket("follow_good", followGoodItem.sku), await $.wait(1e3);
                        const scanMarketRes = await scanMarket("followGood", body);
                        console.log(`关注商品-${followGoodItem.skuName}结果::${JSON.stringify(scanMarketRes)}`), await $.wait(5e3)
                    }
            }
            if ("ViewVideo" === item.taskType)
                if (console.log("----激励视频----"), item.taskChance === joinedCount) console.log("今日激励视频已看完");
                else
                    for (let i = 0; i < new Array(item.taskChance - joinedCount).fill("").length; i++) {
                        console.log(`开始第${i+1}次看激励视频`);
                        const body = {
                            taskType: "ViewVideo"
                        };
                        let sanVideoRes = await scanMarket("scan", body);
                        console.log(`看视频激励结果--${JSON.stringify(sanVideoRes)}`)
                    }
        } else console.log(`${item.taskName} 任务已完成`)
    }
}
async function appPetTask() {
    if (await appGetPetTaskConfig(), $.appGetPetTaskConfigRes.success)
        for (let item of $.appGetPetTaskConfigRes.datas || [])
            if ("ScanMarket" === item.taskType && "chance_left" === item.receiveStatus) {
                const scanMarketList = item.scanMarketList;
                for (let scan of scanMarketList)
                    if (!scan.status && "h5" === scan.showDest) {
                        const body = {
                            marketLink: `${scan.marketLink||scan.marketLinkH5}`,
                            taskType: "ScanMarket"
                        };
                        await appScanMarket("scan", body), await $.wait(5e3)
                    }
            }
}

function getDeskGoodDetails() {
    return new Promise((resolve => {
        $.get(taskUrl("https://jdjoy.jd.com/common/pet/getDeskGoodDetails?invokeKey=q8DNJdpcfRQ69gIx"), ((err, resp, data) => {
            try {
                err ? (console.log(JSON.stringify(err)), console.log(`${$.name} getDeskGoodDetails API请求失败，请检查网路重试`)) : data = JSON.parse(data)
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve(data)
            }
        }))
    }))
}

function followScan(sku) {
    return new Promise((resolve => {
        const body = {
            taskType: "ScanDeskGood",
            sku: sku
        };
        $.post(taskPostUrl("https://jdjoy.jd.com/common/pet/scan?invokeKey=q8DNJdpcfRQ69gIx", body), ((err, resp, data) => {
            try {
                err ? (console.log(JSON.stringify(err)), console.log(`${$.name} followScan API请求失败，请检查网路重试`)) : data = JSON.parse(data)
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve(data)
            }
        }))
    }))
}

function scanMarket(type, body) {
    return new Promise((resolve => {
        const url = `https://draw.jdfcloud.com//common/pet/${type}?invokeKey=q8DNJdpcfRQ69gIx`;
        $.post(taskPostUrl(url, body), ((err, resp, data) => {
            try {
                err ? (console.log(JSON.stringify(err)), console.log(`${$.name} scanMarket API请求失败，请检查网路重试`)) : data = JSON.parse(data)
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve(data)
            }
        }))
    }))
}

function doScanMarket(type, body) {
    return new Promise((resolve => {
        const url = `https://draw.jdfcloud.com//common/pet/icon/click?iconCode=${type}&linkAddr=${body}&invokeKey=q8DNJdpcfRQ69gIx`;
        $.get(taskUrl(url), ((err, resp, data) => {
            try {
                err ? (console.log(JSON.stringify(err)), console.log(`${$.name} doScanMarket API请求失败，请检查网路重试`)) : data = JSON.parse(data)
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve(data)
            }
        }))
    }))
}

function appScanMarket(type, body) {
    return new Promise((resolve => {
        const url = `https://jdjoy.jd.com/common/pet/${type}?invokeKey=q8DNJdpcfRQ69gIx`;
        $.post(taskPostUrl(url, body), ((err, resp, data) => {
            try {
                err ? (console.log(JSON.stringify(err)), console.log(`${$.name} appScanMarket API请求失败，请检查网路重试`)) : console.log(`京东app逛会场结果::${data}`)
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve(data)
            }
        }))
    }))
}

function getFood(type) {
    return new Promise((resolve => {
        const url = `https://draw.jdfcloud.com//common/pet/getFood?taskType=${type}&invokeKey=q8DNJdpcfRQ69gIx`;
        $.get(taskUrl(url), ((err, resp, data) => {
            try {
                err ? (console.log(JSON.stringify(err)), console.log(`${$.name} getFood API请求失败，请检查网路重试`)) : data = JSON.parse(data)
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve(data)
            }
        }))
    }))
}

function followShop(shopId) {
    return new Promise((resolve => {
        const body = `shopId=${shopId}`;
        $.post(taskPostUrl("https://draw.jdfcloud.com//common/pet/followShop?invokeKey=q8DNJdpcfRQ69gIx", body), ((err, resp, data) => {
            try {
                err ? (console.log(JSON.stringify(err)), console.log(`${$.name} followShop API请求失败，请检查网路重试`)) : data = JSON.parse(data)
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve(data)
            }
        }))
    }))
}

function dofollowShop(shopId) {
    return new Promise((resolve => {
        const url = `https://draw.jdfcloud.com//common/pet/icon/click?iconCode=follow_shop&linkAddr=${shopId}&invokeKey=JL1VTNRadM68cIMQ`;
        $.get(taskUrl(url), ((err, resp, data) => {
            try {
                err ? (console.log(JSON.stringify(err)), console.log(`${$.name} dofollowShop API请求失败，请检查网路重试`)) : data = JSON.parse(data)
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve(data)
            }
        }))
    }))
}

function enterRoom() {
    return new Promise((resolve => {
        $.post(taskPostUrl("https://draw.jdfcloud.com//common/pet/enterRoom/h5?invitePin=&openId=&invokeKey=JL1VTNRadM68cIMQ", {}), ((err, resp, data) => {
            try {
                err ? (console.log(JSON.stringify(err)), console.log(`${$.name} enterRoom API请求失败，请检查网路重试`)) : ($.roomData = JSON.parse(data), console.log(`现有狗粮: ${$.roomData.data.petFood}\n`), subTitle = `【用户名】${$.roomData.data.pin}`, message = `现有积分: ${$.roomData.data.petCoin}\n现有狗粮: ${$.roomData.data.petFood}\n喂养次数: ${$.roomData.data.feedCount}\n宠物等级: ${$.roomData.data.petLevel}\n`)
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve()
            }
        }))
    }))
}

function appGetPetTaskConfig() {
    return new Promise((resolve => {
        $.get(taskUrl("https://jdjoy.jd.com/common/pet/getPetTaskConfig?invokeKey=q8DNJdpcfRQ69gIx"), ((err, resp, data) => {
            try {
                err ? (console.log(JSON.stringify(err)), console.log(`${$.name} appGetPetTaskConfig API请求失败，请检查网路重试`)) : $.appGetPetTaskConfigRes = JSON.parse(data)
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve()
            }
        }))
    }))
}

function feedPets(feedNum) {
    return new Promise((resolve => {
        if (console.log(`您设置的喂食数量:${FEED_NUM}g\n`), 0 === FEED_NUM) return console.log("跳出喂食"), void resolve();
        console.log(`实际的喂食数量:${feedNum}g\n`);
        const url = `https://draw.jdfcloud.com//common/pet/feed?feedCount=${feedNum}&invokeKey=JL1VTNRadM68cIMQ`;
        $.get(taskUrl(url), (async (err, resp, data) => {
            try {
                err ? (console.log(JSON.stringify(err)), console.log(`${$.name} feedPets API请求失败，请检查网路重试`)) : (data = JSON.parse(data)).success && ("feed_ok" === data.errorCode ? (console.log("喂食成功"), message += `【喂食成功】消耗${feedNum}g狗粮\n`) : "time_error" === data.errorCode ? (console.log("喂食失败：您的汪汪正在食用中,请稍后再喂食"), message += "【喂食失败】您的汪汪正在食用中,请稍后再喂食\n") : "food_insufficient" === data.errorCode ? (console.log(`当前喂食${feedNum}g狗粮不够, 现为您降低一档次喂食\n`), 80 === feedNum ? feedNum = 40 : 40 === feedNum ? feedNum = 20 : 20 === feedNum ? feedNum = 10 : 10 === feedNum && (feedNum = 0), 0 !== feedNum ? await feedPets(feedNum) : (console.log("您的狗粮已不足10g"), message += "【喂食失败】您的狗粮已不足10g\n")) : console.log(`其他状态${data.errorCode}`))
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve()
            }
        }))
    }))
}

function getPetTaskConfig() {
    return new Promise((resolve => {
        $.get(taskUrl("https://draw.jdfcloud.com//common/pet/getPetTaskConfig?invokeKey=JL1VTNRadM68cIMQ"), ((err, resp, data) => {
            try {
                err ? (console.log(JSON.stringify(err)), console.log(`${$.name} getPetTaskConfig API请求失败，请检查网路重试`)) : $.getPetTaskConfigRes = JSON.parse(data)
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve()
            }
        }))
    }))
}

function getPetRace() {
    return new Promise((resolve => {
        $.get(taskUrl("https://jdjoy.jd.com/common/pet/combat/detail/v2?help=false&invokeKey=q8DNJdpcfRQ69gIx"), ((err, resp, data) => {
            try {
                err ? (console.log(JSON.stringify(err)), console.log(`${$.name} getPetRace API请求失败，请检查网路重试`)) : $.petRaceResult = JSON.parse(data)
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve()
            }
        }))
    }))
}

function getRankList() {
    return new Promise((resolve => {
        $.raceUsers = [];
        $.get(taskUrl("https://jdjoy.jd.com/common/pet/combat/getRankList?invokeKey=q8DNJdpcfRQ69gIx"), ((err, resp, data) => {
            try {
                err ? (console.log(JSON.stringify(err)), console.log(`${$.name} getRankList API请求失败，请检查网路重试`)) : (data = JSON.parse(data)).success && ($.raceUsers = data.datas)
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve()
            }
        }))
    }))
}

function runMatch(teamLevel, timeout = 5e3) {
    return 10 !== teamLevel && 50 !== teamLevel || (timeout = 6e4), console.log(`正在参赛中，请稍等${timeout/1e3}秒，以防多个账号匹配到统一赛场\n`), new Promise((async resolve => {
        await $.wait(timeout);
        const url = `https://jdjoy.jd.com/common/pet/combat/match?teamLevel=${teamLevel}&invokeKey=q8DNJdpcfRQ69gIx`;
        $.get(taskUrl(url), ((err, resp, data) => {
            try {
                err ? (console.log(JSON.stringify(err)), console.log(`${$.name} runMatch API请求失败，请检查网路重试`)) : $.runMatchResult = JSON.parse(data)
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve()
            }
        }))
    }))
}

function getBackupInfo() {
    return new Promise((resolve => {
        $.get(taskUrl("https://jdjoy.jd.com/common/pet/combat/getBackupInfo?invokeKey=q8DNJdpcfRQ69gIx"), ((err, resp, data) => {
            try {
                err ? (console.log(JSON.stringify(err)), console.log(`${$.name} getBackupInfo API请求失败，请检查网路重试`)) : $.getBackupInfoResult = JSON.parse(data)
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve()
            }
        }))
    }))
}

function getWinCoin() {
    return new Promise((resolve => {
        $.get(taskUrl("https://draw.jdfcloud.com//common/pet/combat/detail/v2?help=false&invokeKey=q8DNJdpcfRQ69gIx"), ((err, resp, data) => {
            try {
                err ? (console.log(JSON.stringify(err)), console.log(`${$.name} getWinCoin API请求失败，请检查网路重试`)) : data && ($.getWinCoinRes = JSON.parse(data))
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve()
            }
        }))
    }))
}

function receiveJoyRunAward() {
    return new Promise((resolve => {
        $.get(taskUrl("https://jdjoy.jd.com/common/pet/combat/receive?invokeKey=q8DNJdpcfRQ69gIx"), ((err, resp, data) => {
            try {
                err ? (console.log(JSON.stringify(err)), console.log(`${$.name} receiveJoyRunAward API请求失败，请检查网路重试`)) : $.receiveJoyRunAwardRes = JSON.parse(data)
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve()
            }
        }))
    }))
}
async function energySupplyStation(showOrder) {
    let status;
    if (await getSupplyInfo(showOrder), $.getSupplyInfoRes && $.getSupplyInfoRes.success && $.getSupplyInfoRes.data) {
        const {
            marketList: marketList
        } = $.getSupplyInfoRes.data;
        for (let list of marketList) list.status ? ($.log(`能力补给站 ${$.getSupplyInfoRes.data.addDistance}km里程 已领取\n`), status = list.status) : (await scanMarket("combat/supply", {
            showOrder: showOrder,
            supplyType: "scan_market",
            taskInfo: list.marketLink || list.marketLinkH5
        }), await getSupplyInfo(showOrder));
        status || await energySupplyStation(showOrder)
    }
}

function getSupplyInfo(showOrder) {
    return new Promise((resolve => {
        const url = `https://draw.jdfcloud.com//common/pet/combat/getSupplyInfo?showOrder=${showOrder}&invokeKey=q8DNJdpcfRQ69gIx`;
        $.get(taskUrl(url), ((err, resp, data) => {
            try {
                err ? (console.log(JSON.stringify(err)), console.log(`${$.name} getSupplyInfo API请求失败，请检查网路重试`)) : data && ($.getSupplyInfoRes = JSON.parse(data))
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve()
            }
        }))
    }))
}

function showMsg() {
    jdNotify = $.getdata("jdJoyNotify") ? $.getdata("jdJoyNotify") : jdNotify, jdNotify && "false" !== jdNotify ? $.log(`\n${message}\n`) : $.msg($.name, subTitle, message)
}

function TotalBean() {
    return new Promise((resolve => {
        const options = {
            url: "https://me-api.jd.com/user_new/info/GetJDUserInfoUnion",
            headers: {
                Host: "me-api.jd.com",
                Accept: "*/*",
                "User-Agent": "ScriptableWidgetExtension/185 CFNetwork/1312 Darwin/21.0.0",
                "Accept-Language": "zh-CN,zh-Hans;q=0.9",
                "Accept-Encoding": "gzip, deflate, br",
                Cookie: cookie
            }
        };
        $.get(options, ((err, resp, data) => {
            try {
                if (err) $.logErr(err);
                else if (data) {
                    if ("1001" === (data = JSON.parse(data)).retcode) return void($.isLogin = !1);
                    "0" === data.retcode && data.data && data.data.hasOwnProperty("userInfo") && ($.nickName = data.data.userInfo.baseInfo.nickname)
                } else console.log("京东服务器返回空数据")
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve()
            }
        }))
    }))
}

function taskUrl(url) {
    let lkt = (new Date).getTime(),
        lks = $.md5("JL1VTNRadM68cIMQ" + lkt).toString();
    return "jdjoy.jd.com" === url.split("/")[2] ? {
        url: (url += "&reqSource=h5") + $.validate,
        headers: {
            Host: "jdjoy.jd.com",
            Accept: "*/*",
            Origin: "https://h5.m.jd.com",
            "Accept-Language": "zh-CN,zh-Hans;q=0.9",
            "User-Agent": $.isNode() ? process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : require("./USER_AGENTS").USER_AGENT : $.getdata("JDUA") ? $.getdata("JDUA") : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1",
            Referer: "https://h5.m.jd.com/",
            "Accept-Encoding": "gzip, deflate, br",
            Cookie: cookie,
            lkt: lkt,
            lks: lks
        }
    } : {
        url: (url += "&reqSource=weapp") + $.validate,
        headers: {
            Host: "draw.jdfcloud.com",
            Connection: "keep-alive",
            "Content-Type": "application/json",
            "Accept-Encoding": "gzip,compress,br,deflate",
            "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 15_0_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.15(0x18000f25) NetType/WIFI Language/zh_CN",
            Referer: "https://servicewechat.com/wxccb5c536b0ecd1bf/760/page-frame.html",
            Cookie: cookie,
            lkt: lkt,
            lks: lks
        }
    }
}

function taskPostUrl(url, body) {
    let CT, lkt = (new Date).getTime(),
        lks = $.md5("q8DNJdpcfRQ69gIx" + lkt).toString(),
        Host = url.split("/")[2];
    return url.indexOf("followShop") > -1 || url.indexOf("followGood") > -1 ? CT = "application/x-www-form-urlencoded" : (CT = "application/json", body = JSON.stringify(body)), "jdjoy.jd.com" === Host ? {
        url: (url += "&reqSource=h5") + $.validate,
        body: body,
        headers: {
            Host: "jdjoy.jd.com",
            "Content-Type": CT,
            Accept: "*/*",
            "Accept-Language": "zh-CN,zh-Hans;q=0.9",
            "Accept-Encoding": "gzip, deflate, br",
            Origin: "https://h5.m.jd.com",
            "User-Agent": $.isNode() ? process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : require("./USER_AGENTS").USER_AGENT : $.getdata("JDUA") ? $.getdata("JDUA") : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1",
            Referer: "https://h5.m.jd.com/",
            Cookie: cookie,
            lkt: lkt,
            lks: lks
        }
    } : {
        url: (url += "&reqSource=weapp") + $.validate,
        body: body,
        headers: {
            Host: "draw.jdfcloud.com",
            Connection: "keep-alive",
            "Content-Type": CT,
            "Accept-Encoding": "gzip,compress,br,deflate",
            "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 15_0_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.15(0x18000f25) NetType/WIFI Language/zh_CN",
            Referer: "https://servicewechat.com/wxccb5c536b0ecd1bf/760/page-frame.html",
            Cookie: cookie,
            lkt: lkt,
            lks: lks
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
}(async () => {
    if (cookiesArr[0]) {
        for (let i = 0; i < cookiesArr.length; i++)
            if (cookiesArr[i]) {
                if (cookie = cookiesArr[i], $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1]), $.index = i + 1, $.isLogin = !0, $.nickName = "", await TotalBean(), console.log(`\n******开始【京东账号${$.index}】${$.nickName||$.UserName}*******\n`), !$.isLogin) {
                    $.msg($.name, "【提示】cookie已失效", `京东账号${$.index} ${$.nickName||$.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, {
                        "open-url": "https://bean.m.jd.com/bean/signIndex.action"
                    }), $.isNode() && await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
                    continue
                }
                message = "", subTitle = "", $.validate = "", await jdJoy(), await showMsg()
            } $.isNode() && "true" === joyRunNotify && allMessage && await notify.sendNotify(`${$.name}`, `${allMessage}`)
    } else $.msg($.name, "【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取", "https://bean.m.jd.com/bean/signIndex.action", {
        "open-url": "https://bean.m.jd.com/bean/signIndex.action"
    })
})().catch((e => {
        $.log("", `❌ ${$.name}, 失败! 原因: ${e}!`, "")
    })).finally((() => {
        $.done()
    })),
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