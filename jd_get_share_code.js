const $ = new Env("获取互助码_Timorpic"),
    JD_API_HOST = "https://api.m.jd.com/client.action";
let message, cookiesArr = [],
    cookie = "";
const jdCookieNode = $.isNode() ? require("./jdCookie.js") : "";

function getJdFactory() {
    return new Promise((resolve => {
        $.post(taskPostUrl("jdfactory_getTaskDetail", {}, "jdfactory_getTaskDetail"), (async (err, resp, data) => {
            try {
                err ? (console.log(`${JSON.stringify(err)}`), console.log("$东东工厂 API请求失败，请检查网路重试")) : safeGet(data) && 0 === (data = JSON.parse(data)).data.bizCode && ($.taskVos = data.data.result.taskVos, $.taskVos.map((item => {
                    14 === item.taskType && console.log(`【京东账号${$.index}（${$.UserName}）东东工厂】${item.assistTaskDetailVo.taskToken}`)
                })))
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve()
            }
        }))
    }))
}

function getJxFactory() {
    return new Promise((resolve => {
        $.get(function JXGC_taskurl(functionId, body = "") {
            return {
                url: `https://m.jingxi.com/dreamfactory/${functionId}?zone=dream_factory&${body}&sceneval=2&g_login_type=1&_time=${Date.now()}&_=${Date.now()}`,
                headers: {
                    Cookie: cookie,
                    Host: "m.jingxi.com",
                    Accept: "*/*",
                    Connection: "keep-alive",
                    "User-Agent": "jdpingou;iPhone;3.14.4;14.0;ae75259f6ca8378672006fc41079cd8c90c53be8;network/wifi;model/iPhone10,2;appBuild/100351;ADID/00000000-0000-0000-0000-000000000000;supportApplePay/1;hasUPPay/0;pushNoticeIsOpen/1;hasOCPay/0;supportBestPay/0;session/62;pap/JA2015_311210;brand/apple;supportJDSHWK/1;Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148",
                    "Accept-Language": "zh-cn",
                    Referer: "https://wqsd.jd.com/pingou/dream_factory/index.html",
                    "Accept-Encoding": "gzip, deflate, br"
                }
            }
        }("userinfo/GetUserInfo", "pin=&sharePin=&shareType=&materialTuanPin=&materialTuanId="), (async (err, resp, data) => {
            try {
                if (err) console.log(`${JSON.stringify(err)}`), console.log("京喜工厂 API请求失败，请检查网路重试");
                else if (safeGet(data))
                    if (0 === (data = JSON.parse(data)).ret) {
                        if (data = data.data, $.unActive = !0, $.encryptPin = "", $.shelvesList = [], data.factoryList && data.productionList) {
                            const production = data.productionList[0],
                                factory = data.factoryList[0];
                            data.productionStage;
                            $.factoryId = factory.factoryId, $.productionId = production.productionId, $.commodityDimId = production.commodityDimId, $.encryptPin = data.user.encryptPin, console.log(`【京东账号${$.index}（${$.UserName}）京喜工厂】${data.user.encryptPin}`)
                        }
                    } else $.unActive = !1, data.factoryList ? data.factoryList && !data.productionList && console.log(`【提示】京东账号${$.index}[${$.nickName}]京喜工厂未选购商品请手动去京东APP->游戏与互动->查看更多->京喜工厂 选购`) : console.log(`【提示】京东账号${$.index}[${$.nickName}]京喜工厂活动未开始请手动去京东APP->游戏与互动->查看更多->京喜工厂 开启活动`);
                else console.log(`GetUserInfo异常：${JSON.stringify(data)}`)
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve()
            }
        }))
    }))
}

function getJxNc() {
    return new Promise((resolve => {
        $.get(function JXNC_taskurl(function_path, body) {
            return {
                url: `https://wq.jd.com/cubeactive/farm/${function_path}?${body}&farm_jstoken=&phoneid=&timestamp=&sceneval=2&g_login_type=1&_=${Date.now()}&g_ty=ls`,
                headers: {
                    Cookie: cookie,
                    Accept: "*/*",
                    Connection: "keep-alive",
                    Referer: "https://st.jingxi.com/pingou/dream_factory/index.html",
                    "Accept-Encoding": "gzip, deflate, br",
                    Host: "wq.jd.com",
                    "Accept-Language": "zh-cn",
                    "User-Agent": $.isNode() ? process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : require("./USER_AGENTS").USER_AGENT : $.getdata("JDUA") ? $.getdata("JDUA") : "jdapp;iPhone;9.2.2;14.2;%E4%BA%AC%E4%B8%9C/9.2.2 CFNetwork/1206 Darwin/20.1.0"
                }
            }
        }("query", "type=1"), (async (err, resp, data) => {
            try {
                if (err) console.log(`${JSON.stringify(err)}`), console.log("京喜农场 API请求失败，请检查网路重试");
                else if (safeGet(data = data.match(/try\{Query\(([\s\S]*)\)\;\}catch\(e\)\{\}/)[1])) {
                    if (0 === (data = JSON.parse(data)).ret)
                        if (data.active) {
                            let shareCodeJson = {
                                smp: data.smp,
                                active: data.active,
                                joinnum: data.joinnum
                            };
                            console.log("注意：京喜农场 种植种子发生变化的时候，互助码也会变！！"), console.log(`【京东账号${$.index}（${$.UserName}）京喜农场】` + JSON.stringify(shareCodeJson))
                        } else console.log(`【京东账号${$.index}（${$.UserName}）京喜农场】未选择种子，请先去京喜农场选择种子`)
                } else console.log(`京喜农场返回值解析异常：${JSON.stringify(data)}`)
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve()
            }
        }))
    }))
}

function getJdPet() {
    return new Promise((resolve => {
        $.post(function jdPet_Url(function_id, body = {}) {
            return body.version = 2, body.channel = "app", {
                url: `https://api.m.jd.com/client.action?functionId=${function_id}`,
                body: `body=${escape(JSON.stringify(body))}&appid=wh5&loginWQBiz=pet-town&clientVersion=9.0.4`,
                headers: {
                    Cookie: cookie,
                    "User-Agent": $.isNode() ? process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : "jdapp;iPhone;9.2.2;14.2;%E4%BA%AC%E4%B8%9C/9.2.2 CFNetwork/1206 Darwin/20.1.0" : $.getdata("JDUA") ? $.getdata("JDUA") : "jdapp;iPhone;9.2.2;14.2;%E4%BA%AC%E4%B8%9C/9.2.2 CFNetwork/1206 Darwin/20.1.0",
                    Host: "api.m.jd.com",
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            }
        }("initPetTown"), (async (err, resp, data) => {
            try {
                if (err) console.log("东东萌宠: API查询请求失败 ‼️‼️"), console.log(JSON.stringify(err)), $.logErr(err);
                else {
                    const initPetTownRes = data = JSON.parse(data);
                    if (message = `【京东账号${$.index}】${$.nickName}`, "0" === initPetTownRes.code && "0" === initPetTownRes.resultCode && "success" === initPetTownRes.message) {
                        if ($.petInfo = initPetTownRes.result, 0 === $.petInfo.userStatus) return;
                        console.log(`【京东账号${$.index}（${$.UserName}）京东萌宠】${$.petInfo.shareCode}`)
                    } else "0" === initPetTownRes.code ? console.log(`初始化萌宠失败:  ${initPetTownRes.message}`) : console.log("shit")
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve(data)
            }
        }))
    }))
}
async function getJdZZ() {
    await
    function getTaskList() {
        return new Promise((resolve => {
            $.get(function taskZZUrl(functionId, body = {}) {
                return {
                    url: `https://api.m.jd.com/client.action?functionId=${functionId}&body=${escape(JSON.stringify(body))}&client=wh5&clientVersion=9.1.0`,
                    headers: {
                        Cookie: cookie,
                        Host: "api.m.jd.com",
                        Connection: "keep-alive",
                        "Content-Type": "application/json",
                        Referer: "http://wq.jd.com/wxapp/pages/hd-interaction/index/index",
                        "User-Agent": $.isNode() ? process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : require("./USER_AGENTS").USER_AGENT : $.getdata("JDUA") ? $.getdata("JDUA") : "jdapp;iPhone;9.2.2;14.2;%E4%BA%AC%E4%B8%9C/9.2.2 CFNetwork/1206 Darwin/20.1.0",
                        "Accept-Language": "zh-cn",
                        "Accept-Encoding": "gzip, deflate, br"
                    }
                }
            }("interactTaskIndex"), (async (err, resp, data) => {
                try {
                    err ? (console.log(`${JSON.stringify(err)}`), console.log(`${$.name} API请求失败，请检查网路重试`)) : safeGet(data) && (data = JSON.parse(data), $.taskList = data.data.taskDetailResList, $.taskList.filter((item => !!item && 3 === item.taskId)) && $.taskList.filter((item => !!item && 3 === item.taskId)).length && console.log(`【京东账号${$.index}（${$.UserName}）的京东赚赚好友互助码】${$.taskList.filter((item=>!!item&&3===item.taskId))[0].itemId}`))
                } catch (e) {
                    $.logErr(e, resp)
                } finally {
                    resolve(data)
                }
            }))
        }))
    }()
}
async function getPlantBean() {
    async function plantBeanIndex() {
        $.plantBeanIndexResult = await
        function plant_request(function_id, body = {}) {
            return new Promise((async resolve => {
                $.post(function plant_taskUrl(function_id, body) {
                    return body.version = "9.0.0.1", body.monitor_source = "plant_app_plant_index", body.monitor_refer = "", {
                        url: "https://api.m.jd.com/client.action",
                        body: `functionId=${function_id}&body=${escape(JSON.stringify(body))}&appid=ld&client=apple&area=5_274_49707_49973&build=167283&clientVersion=9.1.0`,
                        headers: {
                            Cookie: cookie,
                            Host: "api.m.jd.com",
                            Accept: "*/*",
                            Connection: "keep-alive",
                            "User-Agent": $.isNode() ? process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : "jdapp;iPhone;9.2.2;14.2;%E4%BA%AC%E4%B8%9C/9.2.2 CFNetwork/1206 Darwin/20.1.0" : $.getdata("JDUA") ? $.getdata("JDUA") : "jdapp;iPhone;9.2.2;14.2;%E4%BA%AC%E4%B8%9C/9.2.2 CFNetwork/1206 Darwin/20.1.0",
                            "Accept-Language": "zh-Hans-CN;q=1,en-CN;q=0.9",
                            "Accept-Encoding": "gzip, deflate, br",
                            "Content-Type": "application/x-www-form-urlencoded"
                        }
                    }
                }(function_id, body), ((err, resp, data) => {
                    try {
                        err ? (console.log("种豆得豆: API查询请求失败 ‼️‼️"), console.log(`function_id:${function_id}`), $.logErr(err)) : data = JSON.parse(data)
                    } catch (e) {
                        $.logErr(e, resp)
                    } finally {
                        resolve(data)
                    }
                }))
            }))
        }("plantBeanIndex")
    }
    await async function jdPlantBean() {
        if (await plantBeanIndex(), "0" === $.plantBeanIndexResult.code) {
            const shareUrl = $.plantBeanIndexResult.data.jwordShareInfo.shareUrl;
            $.myPlantUuid = function getParam(url, name) {
                const reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"),
                    r = url.match(reg);
                return null != r ? unescape(r[2]) : null
            }(shareUrl, "plantUuid"), console.log(`【京东账号${$.index}（${$.UserName}）种豆得豆】${$.myPlantUuid}`)
        } else console.log(`种豆得豆-初始失败:  ${JSON.stringify($.plantBeanIndexResult)}`)
    }()
}
async function getJDFruit() {
    await async function jdFruit() {
        await async function initForFarm() {
            return new Promise((resolve => {
                const option = {
                    url: `${JD_API_HOST}?functionId=initForFarm`,
                    body: `body=${escape(JSON.stringify({version:4}))}&appid=wh5&clientVersion=9.1.0`,
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
                        "User-Agent": $.isNode() ? process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : "jdapp;iPhone;9.2.2;14.2;%E4%BA%AC%E4%B8%9C/9.2.2 CFNetwork/1206 Darwin/20.1.0" : $.getdata("JDUA") ? $.getdata("JDUA") : "jdapp;iPhone;9.2.2;14.2;%E4%BA%AC%E4%B8%9C/9.2.2 CFNetwork/1206 Darwin/20.1.0",
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                };
                $.post(option, ((err, resp, data) => {
                    try {
                        err ? (console.log("东东农场: API查询请求失败 ‼️‼️"), console.log(JSON.stringify(err)), $.logErr(err)) : safeGet(data) && ($.farmInfo = JSON.parse(data))
                    } catch (e) {
                        $.logErr(e, resp)
                    } finally {
                        resolve()
                    }
                }))
            }))
        }(), $.farmInfo.farmUserPro && console.log(`【京东账号${$.index}（${$.UserName}）京东农场】${$.farmInfo.farmUserPro.shareCode}`)
    }()
}
async function getJoy() {
    let body = {
        paramData: {}
    };
    return new Promise((async resolve => {
        $.get(function taskUrl(functionId, body = "") {
            let t = Date.now().toString().substr(0, 10),
                e = body || "";
            return e = $.md5("aDvScBv$gGQvrXfva8dG!ZC@DA70Y%lX" + e + t), e += Number(t).toString(16), {
                url: `${JD_API_HOST}?uts=${e}&appid=crazy_joy&functionId=${functionId}&body=${escape(body)}&t=${t}`,
                headers: {
                    Cookie: cookie,
                    Host: "api.m.jd.com",
                    Accept: "*/*",
                    Connection: "keep-alive",
                    "User-Agent": $.isNode() ? process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : require("./USER_AGENTS").USER_AGENT : $.getdata("JDUA") ? $.getdata("JDUA") : "jdapp;iPhone;9.2.2;14.2;%E4%BA%AC%E4%B8%9C/9.2.2 CFNetwork/1206 Darwin/20.1.0",
                    "Accept-Language": "zh-cn",
                    Referer: "https://crazy-joy.jd.com/",
                    origin: "https://crazy-joy.jd.com",
                    "Accept-Encoding": "gzip, deflate, br"
                }
            }
        }("crazyJoy_user_gameState", JSON.stringify(body)), (async (err, resp, data) => {
            try {
                err ? (console.log(`${JSON.stringify(err)}`), console.log(`${$.name} API请求失败，请检查网路重试`)) : safeGet(data) && (data = JSON.parse(data)).success && data.data && data.data.userInviteCode && console.log(`【京东账号${$.index}（${$.UserName}）crazyJoy】${data.data.userInviteCode}`)
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve()
            }
        }))
    }))
}
async function getSgmh(timeout = 0) {
    return new Promise((resolve => {
        setTimeout((() => {
            let url = {
                url: "https://api.m.jd.com/client.action",
                headers: {
                    Origin: "https://h5.m.jd.com",
                    Cookie: cookie,
                    Connection: "keep-alive",
                    Accept: "application/json, text/plain, */*",
                    Referer: "https://h5.m.jd.com/babelDiy/Zeus/2WBcKYkn8viyxv7MoKKgfzmu7Dss/index.html",
                    Host: "api.m.jd.com",
                    "Accept-Encoding": "gzip, deflate, br",
                    "Accept-Language": "zh-cn"
                },
                body: 'functionId=interact_template_getHomeData&body={"appId":"1EFRXxg","taskToken":""}&client=wh5&clientVersion=1.0.0'
            };
            $.post(url, (async (err, resp, data) => {
                try {
                    if (0 === (data = JSON.parse(data)).data.bizCode) {
                        const invites = data.data.result.taskVos.filter((item => "邀请好友助力" === item.taskName));
                        console.log(`【京东账号${$.index}（${$.UserName}）闪购盲盒】${invites&&invites[0].assistTaskDetailVo.taskToken}`)
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

function getCFD(showInvite = !0) {
    return new Promise((async resolve => {
        $.get(function taskUrl(function_path, body) {
            return {
                url: `https://m.jingxi.com/jxcfd/${function_path}?strZone=jxcfd&bizCode=jxcfd&source=jxcfd&dwEnv=7&_cfd_t=${Date.now()}&ptag=138631.26.55&${body}&_ste=1&_=${Date.now()}&sceneval=2&g_login_type=1&g_ty=ls`,
                headers: {
                    Cookie: cookie,
                    Accept: "*/*",
                    Connection: "keep-alive",
                    Referer: "https://st.jingxi.com/fortune_island/index.html?ptag=138631.26.55",
                    "Accept-Encoding": "gzip, deflate, br",
                    Host: "m.jingxi.com",
                    "User-Agent": `jdpingou;iPhone;3.15.2;14.2.1;ea00763447803eb0f32045dcba629c248ea53bb3;network/wifi;model/iPhone13,2;appBuild/100365;ADID/00000000-0000-0000-0000-000000000000;supportApplePay/1;hasUPPay/0;pushNoticeIsOpen/0;hasOCPay/0;supportBestPay/0;session/${98*Math.random+1};pap/JA2015_311210;brand/apple;supportJDSHWK/1;Mozilla/5.0 (iPhone; CPU iPhone OS 14_2_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148`,
                    "Accept-Language": "zh-cn"
                }
            }
        }("user/QueryUserInfo"), ((err, resp, data) => {
            try {
                const {
                    iret: iret,
                    SceneList: SceneList = {},
                    XbStatus: {
                        XBDetail: XBDetail = [],
                        dwXBRemainCnt: dwXBRemainCnt
                    } = {},
                    ddwMoney: ddwMoney,
                    dwIsNewUser: dwIsNewUser,
                    sErrMsg: sErrMsg,
                    strMyShareId: strMyShareId,
                    strPin: strPin
                } = JSON.parse(data);
                console.log(`【京东账号${$.index}（${$.UserName}）财富岛】${strMyShareId}`)
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve()
            }
        }))
    }))
}

function getJdCash() {
    return new Promise((resolve => {
        $.get(function taskUrl(functionId, body = {}) {
            return {
                url: `https://api.m.jd.com/client.action?functionId=${functionId}&body=${escape(JSON.stringify(body))}&appid=CashRewardMiniH5Env&appid=9.1.0`,
                headers: {
                    Cookie: cookie,
                    Host: "api.m.jd.com",
                    Connection: "keep-alive",
                    "Content-Type": "application/json",
                    Referer: "http://wq.jd.com/wxapp/pages/hd-interaction/index/index",
                    "User-Agent": $.isNode() ? process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : require("./USER_AGENTS").USER_AGENT : $.getdata("JDUA") ? $.getdata("JDUA") : "jdapp;iPhone;9.2.2;14.2;%E4%BA%AC%E4%B8%9C/9.2.2 CFNetwork/1206 Darwin/20.1.0",
                    "Accept-Language": "zh-cn",
                    "Accept-Encoding": "gzip, deflate, br"
                }
            }
        }("cash_mob_home"), (async (err, resp, data) => {
            try {
                err ? (console.log(`${JSON.stringify(err)}`), console.log(`${$.name} API请求失败，请检查网路重试`)) : safeGet(data) && 0 === (data = JSON.parse(data)).code && data.data.result && console.log(`【京东账号${$.index}（${$.UserName}）签到领现金】${data.data.result.inviteCode}`)
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve(data)
            }
        }))
    }))
}
async function getShareCode() {
    console.log(`======账号${$.index}开始======`), await getJDFruit(), await getJdPet(), await getPlantBean(), await getJdFactory(), await getJxFactory(), await getJxNc(), await getJdZZ(), await getJoy(), await getSgmh(), await getCFD(), await getJdCash(), console.log(`======账号${$.index}结束======\n`)
}

function safeGet(data) {
    try {
        if ("object" == typeof JSON.parse(data)) return !0
    } catch (e) {
        return console.log(e), console.log("京东服务器访问数据为空，请检查自身设备网络情况"), !1
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
                "User-Agent": $.isNode() ? process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : require("./USER_AGENTS").USER_AGENT : $.getdata("JDUA") ? $.getdata("JDUA") : "jdapp;iPhone;9.2.2;14.2;%E4%BA%AC%E4%B8%9C/9.2.2 CFNetwork/1206 Darwin/20.1.0"
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

function taskPostUrl(function_id, body = {}, function_id2) {
    let url = `${JD_API_HOST}`;
    return function_id2 && (url += `?functionId=${function_id2}`), {
        url: url,
        body: `functionId=${function_id}&body=${escape(JSON.stringify(body))}&client=wh5&clientVersion=9.1.0`,
        headers: {
            Cookie: cookie,
            origin: "https://h5.m.jd.com",
            referer: "https://h5.m.jd.com/",
            "Content-Type": "application/x-www-form-urlencoded",
            "User-Agent": $.isNode() ? process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : "jdapp;iPhone;9.2.2;14.2;%E4%BA%AC%E4%B8%9C/9.2.2 CFNetwork/1206 Darwin/20.1.0" : $.getdata("JDUA") ? $.getdata("JDUA") : "jdapp;iPhone;9.2.2;14.2;%E4%BA%AC%E4%B8%9C/9.2.2 CFNetwork/1206 Darwin/20.1.0"
        }
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
}! function (n) {
    "use strict";

    function r(n, r) {
        var t = (65535 & n) + (65535 & r);
        return (n >> 16) + (r >> 16) + (t >> 16) << 16 | 65535 & t
    }

    function u(n, u, e, o, c, f) {
        return r(function t(n, r) {
            return n << r | n >>> 32 - r
        }(r(r(u, n), r(o, f)), c), e)
    }

    function e(n, r, t, e, o, c, f) {
        return u(r & t | ~r & e, n, r, o, c, f)
    }

    function o(n, r, t, e, o, c, f) {
        return u(r & e | t & ~e, n, r, o, c, f)
    }

    function c(n, r, t, e, o, c, f) {
        return u(r ^ t ^ e, n, r, o, c, f)
    }

    function f(n, r, t, e, o, c, f) {
        return u(t ^ (r | ~e), n, r, o, c, f)
    }

    function i(n, t) {
        n[t >> 5] |= 128 << t % 32, n[14 + (t + 64 >>> 9 << 4)] = t;
        var u, i, a, h, g, l = 1732584193,
            d = -271733879,
            v = -1732584194,
            C = 271733878;
        for (u = 0; u < n.length; u += 16) i = l, a = d, h = v, g = C, d = f(d = f(d = f(d = f(d = c(d = c(d = c(d = c(d = o(d = o(d = o(d = o(d = e(d = e(d = e(d = e(d, v = e(v, C = e(C, l = e(l, d, v, C, n[u], 7, -680876936), d, v, n[u + 1], 12, -389564586), l, d, n[u + 2], 17, 606105819), C, l, n[u + 3], 22, -1044525330), v = e(v, C = e(C, l = e(l, d, v, C, n[u + 4], 7, -176418897), d, v, n[u + 5], 12, 1200080426), l, d, n[u + 6], 17, -1473231341), C, l, n[u + 7], 22, -45705983), v = e(v, C = e(C, l = e(l, d, v, C, n[u + 8], 7, 1770035416), d, v, n[u + 9], 12, -1958414417), l, d, n[u + 10], 17, -42063), C, l, n[u + 11], 22, -1990404162), v = e(v, C = e(C, l = e(l, d, v, C, n[u + 12], 7, 1804603682), d, v, n[u + 13], 12, -40341101), l, d, n[u + 14], 17, -1502002290), C, l, n[u + 15], 22, 1236535329), v = o(v, C = o(C, l = o(l, d, v, C, n[u + 1], 5, -165796510), d, v, n[u + 6], 9, -1069501632), l, d, n[u + 11], 14, 643717713), C, l, n[u], 20, -373897302), v = o(v, C = o(C, l = o(l, d, v, C, n[u + 5], 5, -701558691), d, v, n[u + 10], 9, 38016083), l, d, n[u + 15], 14, -660478335), C, l, n[u + 4], 20, -405537848), v = o(v, C = o(C, l = o(l, d, v, C, n[u + 9], 5, 568446438), d, v, n[u + 14], 9, -1019803690), l, d, n[u + 3], 14, -187363961), C, l, n[u + 8], 20, 1163531501), v = o(v, C = o(C, l = o(l, d, v, C, n[u + 13], 5, -1444681467), d, v, n[u + 2], 9, -51403784), l, d, n[u + 7], 14, 1735328473), C, l, n[u + 12], 20, -1926607734), v = c(v, C = c(C, l = c(l, d, v, C, n[u + 5], 4, -378558), d, v, n[u + 8], 11, -2022574463), l, d, n[u + 11], 16, 1839030562), C, l, n[u + 14], 23, -35309556), v = c(v, C = c(C, l = c(l, d, v, C, n[u + 1], 4, -1530992060), d, v, n[u + 4], 11, 1272893353), l, d, n[u + 7], 16, -155497632), C, l, n[u + 10], 23, -1094730640), v = c(v, C = c(C, l = c(l, d, v, C, n[u + 13], 4, 681279174), d, v, n[u], 11, -358537222), l, d, n[u + 3], 16, -722521979), C, l, n[u + 6], 23, 76029189), v = c(v, C = c(C, l = c(l, d, v, C, n[u + 9], 4, -640364487), d, v, n[u + 12], 11, -421815835), l, d, n[u + 15], 16, 530742520), C, l, n[u + 2], 23, -995338651), v = f(v, C = f(C, l = f(l, d, v, C, n[u], 6, -198630844), d, v, n[u + 7], 10, 1126891415), l, d, n[u + 14], 15, -1416354905), C, l, n[u + 5], 21, -57434055), v = f(v, C = f(C, l = f(l, d, v, C, n[u + 12], 6, 1700485571), d, v, n[u + 3], 10, -1894986606), l, d, n[u + 10], 15, -1051523), C, l, n[u + 1], 21, -2054922799), v = f(v, C = f(C, l = f(l, d, v, C, n[u + 8], 6, 1873313359), d, v, n[u + 15], 10, -30611744), l, d, n[u + 6], 15, -1560198380), C, l, n[u + 13], 21, 1309151649), v = f(v, C = f(C, l = f(l, d, v, C, n[u + 4], 6, -145523070), d, v, n[u + 11], 10, -1120210379), l, d, n[u + 2], 15, 718787259), C, l, n[u + 9], 21, -343485551), l = r(l, i), d = r(d, a), v = r(v, h), C = r(C, g);
        return [l, d, v, C]
    }

    function a(n) {
        var r, t = "",
            u = 32 * n.length;
        for (r = 0; r < u; r += 8) t += String.fromCharCode(n[r >> 5] >>> r % 32 & 255);
        return t
    }

    function h(n) {
        var r, t = [];
        for (t[(n.length >> 2) - 1] = void 0, r = 0; r < t.length; r += 1) t[r] = 0;
        var u = 8 * n.length;
        for (r = 0; r < u; r += 8) t[r >> 5] |= (255 & n.charCodeAt(r / 8)) << r % 32;
        return t
    }

    function d(n) {
        var r, t, u = "";
        for (t = 0; t < n.length; t += 1) r = n.charCodeAt(t), u += "0123456789abcdef".charAt(r >>> 4 & 15) + "0123456789abcdef".charAt(15 & r);
        return u
    }

    function v(n) {
        return unescape(encodeURIComponent(n))
    }

    function C(n) {
        return function g(n) {
            return a(i(h(n), 8 * n.length))
        }(v(n))
    }

    function m(n, r) {
        return function l(n, r) {
            var t, u, e = h(n),
                o = [],
                c = [];
            for (o[15] = c[15] = void 0, e.length > 16 && (e = i(e, 8 * n.length)), t = 0; t < 16; t += 1) o[t] = 909522486 ^ e[t], c[t] = 1549556828 ^ e[t];
            return u = i(o.concat(h(r)), 512 + 8 * r.length), a(i(c.concat(u), 640))
        }(v(n), v(r))
    }
    $.md5 = function b(n, r, t) {
        return r ? t ? m(r, n) : function s(n, r) {
            return d(m(n, r))
        }(r, n) : t ? C(n) : function A(n) {
            return d(C(n))
        }(n)
    }
}(), $.isNode() ? (Object.keys(jdCookieNode).forEach((item => {
    cookiesArr.push(jdCookieNode[item])
})), process.env.JD_DEBUG && "false" === process.env.JD_DEBUG && (console.log = () => {})) : cookiesArr = [$.getdata("CookieJD"), $.getdata("CookieJD2"), ...jsonParse($.getdata("CookiesJD") || "[]").map((item => item.cookie))].filter((item => !!item)), (async () => {
    if (cookiesArr[0]) {
        $.log("\n注：临时活动的互助码不添加到此处，如有需要请手动运行对应临时活动脚本\n");
        for (let i = 0; i < cookiesArr.length; i++)
            if (cookiesArr[i]) {
                if (cookie = cookiesArr[i], $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1]), $.index = i + 1, $.isLogin = !0, $.nickName = "", message = "", await TotalBean(), !$.isLogin) continue;
                await getShareCode()
            }
    } else $.msg($.name, "【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取", "https://bean.m.jd.com/bean/signIndex.action", {
        "open-url": "https://bean.m.jd.com/bean/signIndex.action"
    })
})().catch((e => {
    $.log("", `❌ ${$.name}, 失败! 原因: ${e}!`, "")
})).finally((() => {
    $.done()
}));