const $ = new Env("内容鉴赏官_Timorpic"),
    notify = $.isNode() ? require("./sendNotify") : "",
    jdCookieNode = $.isNode() ? require("./jdCookie.js") : "";
let message, jdNotify = !0,
    cookiesArr = [],
    cookie = "",
    isLoginInfo = {};
$.shareCodes = [], $.isNode() ? (Object.keys(jdCookieNode).forEach((item => {
    cookiesArr.push(jdCookieNode[item])
})), process.env.JD_DEBUG && "false" === process.env.JD_DEBUG && (console.log = () => {})) : cookiesArr = [$.getdata("CookieJD"), $.getdata("CookieJD2"), ...jsonParse($.getdata("CookiesJD") || "[]").map((item => item.cookie))].filter((item => !!item));
const JD_API_HOST = "https://api.m.jd.com/";
let pageId, encodeActivityId, paginationFlrs, activityId, agid = [],
    allMessage = "";
async function jdConnoisseur() {
    await getActiveInfo(), await $.wait(2e3), await getshareCode()
}
async function getActiveInfo(url = "https://prodev.m.jd.com/mall/active/2y1S9xVYdTud2VmFqhHbkcoAYhJT/index.html") {
    let options = {
        url: url,
        headers: {
            Host: "prodev.m.jd.com",
            Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "User-Agent": $.isNode() ? process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : require("./USER_AGENTS").USER_AGENT : $.getdata("JDUA") ? $.getdata("JDUA") : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1",
            "Accept-Language": "zh-CN,zh-Hans;q=0.9",
            "Accept-Encoding": "gzip, deflate, br",
            Cookie: cookie
        }
    };
    return new Promise((async resolve => {
        $.get(options, (async (err, resp, data) => {
            try {
                if (err) console.log(JSON.stringify(err)), console.log(`${$.name} getActiveInfo API请求失败，请检查网路重试`);
                else if (data) {
                    data = data && data.match(/window\.performance.mark\(e\)}}\((.*)\);<\/script>/)[1], data = JSON.parse(data), pageId = data.activityInfo.pageId, encodeActivityId = data.activityInfo.encodeActivityId, paginationFlrs = data.paginationFlrs, activityId = data.activityInfo.activityId;
                    for (let key of Object.keys(data.codeFloors)) {
                        let vo = data.codeFloors[key];
                        vo.boardParams && "2PbAu1BAT79RxrM5V7c2VAPUQDSd" === vo.boardParams.taskCode ? (agid.push(vo.materialParams.advIdKOC[0].advGrpId), agid.push(vo.materialParams.advIdVideo[0].advGrpId), console.log(`去做【${vo.boardParams.btnText}】`), await getTaskInfo("5", vo.boardParams.projectCode, vo.boardParams.taskCode), await $.wait(2e3)) : !vo.boardParams || "XTXNrKoUP5QK1LSU8LbTJpFwtbj" !== vo.boardParams.taskCode && "2bpKT3LMaEjaGyVQRr2dR8zzc9UU" !== vo.boardParams.taskCode ? !vo.boardParams || "3dw9N5yB18RaN9T1p5dKHLrWrsX" !== vo.boardParams.taskCode && "CtXTxzkh4ExFCrGf8si3ePxGnPy" !== vo.boardParams.taskCode && "Hys8nCmAaqKmv1G3Y3a5LJEk36Y" !== vo.boardParams.taskCode && "26KhtkXmoaj6f37bE43W5kF8a9EL" !== vo.boardParams.taskCode || (await getTaskInfo("1", vo.boardParams.projectCode, vo.boardParams.taskCode), await $.wait(2e3)) : (console.log(`去做【${vo.boardParams.titleText}】`), await getTaskInfo("9", vo.boardParams.projectCode, vo.boardParams.taskCode), await $.wait(2e3))
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
async function getTaskInfo(type, projectId, assignmentId, helpType = "1", itemId = "") {
    let body = {
        type: type,
        projectId: projectId,
        assignmentId: assignmentId,
        doneHide: !1
    };
    return assignmentId === $.taskCode && (body.itemId = itemId, body.helpType = helpType), new Promise((async resolve => {
        $.post(taskUrl("interactive_info", body), (async (err, resp, data) => {
            try {
                err ? (console.log(`${JSON.stringify(err)}`), console.log(`${$.name} getTaskInfo API请求失败，请检查网路重试`)) : data && (data = JSON.parse(data), "2PbAu1BAT79RxrM5V7c2VAPUQDSd" !== assignmentId && "3dw9N5yB18RaN9T1p5dKHLrWrsX" !== assignmentId && "2gWnJADG8JXMpp1WXiNHgSy4xUSv" !== assignmentId && "CtXTxzkh4ExFCrGf8si3ePxGnPy" !== assignmentId && "26KhtkXmoaj6f37bE43W5kF8a9EL" !== assignmentId && "bWE8RTJm5XnooFr4wwdDM5EYcKP" !== assignmentId || body.helpType ? "XTXNrKoUP5QK1LSU8LbTJpFwtbj" !== assignmentId && "2bpKT3LMaEjaGyVQRr2dR8zzc9UU" !== assignmentId || body.helpType ? "Hys8nCmAaqKmv1G3Y3a5LJEk36Y" !== assignmentId || body.helpType ? assignmentId === $.taskCode && body.helpType && ("1" === helpType ? "0" === data.code && data.data ? "2" !== data.data[0].status && (console.log(`【京东账号${$.index}（${$.UserName}）的内容鉴赏官好友互助码】${data.data[0].itemId}`), $.shareCodes.push({
                    use: $.UserName,
                    code: data.data[0].itemId
                })) : console.log(data.message) : "2" === helpType && ("0" === data.code && data.data ? "0" === data.data[0].code ? await interactive_done(type, $.projectCode, $.taskCode, itemId) : "103" === data.data[0].code ? ($.canHelp = !1, console.log("助力失败：无助力次数")) : "102" === data.data[0].code ? console.log(`助力失败：${data.data[0].msg}`) : "106" === data.data[0].code ? ($.delcode = !0, console.log("助力失败：您的好友已完成任务")) : console.log(JSON.stringify(data)) : console.log(data.message))) : "0" === data.code && data.data ? (console.log(`去做【${data.data[0].title}】`), "2" !== data.data[0].status ? (await interactive_accept(type, data.data[0].projectId, data.data[0].assignmentId, data.data[0].itemId), await $.wait(1e3 * data.data[0].waitDuration || 2e3), await qryViewkitCallbackResult(data.data[0].projectId, data.data[0].assignmentId, data.data[0].itemId)) : console.log("任务已完成")) : console.log(data.message) : "0" === data.code && data.data ? "2" !== data.data[0].status ? (await sign_interactive_done(type, data.data[0].projectId, data.data[0].assignmentId), await $.wait(1e3 * data.data[0].waitDuration || 2e3), await interactive_reward(type, data.data[0].projectId, data.data[0].assignmentId)) : console.log("任务已完成") : console.log(data.message) : ("2PbAu1BAT79RxrM5V7c2VAPUQDSd" !== assignmentId && console.log(`去做【${data.data[0].title}】`), "0" === data.code && data.data ? data.data[0] ? "2" !== data.data[0].status ? (await interactive_done(type, data.data[0].projectId, data.data[0].assignmentId, data.data[0].itemId), await $.wait(1e3 * data.data[0].waitDuration || 2e3)) : console.log("2PbAu1BAT79RxrM5V7c2VAPUQDSd" === assignmentId ? "今日已签到" : "任务已完成") : console.log("无当前任务") : console.log(data.message)))
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve()
            }
        }))
    }))
}

function interactive_done(type, projectId, assignmentId, itemId) {
    let body = {
        projectId: projectId,
        assignmentId: assignmentId,
        itemId: itemId,
        type: type
    };
    return "5" !== type && "2" !== type || (body.agid = agid), new Promise((resolve => {
        $.post(taskUrl("interactive_done", body), ((err, resp, data) => {
            try {
                err ? (console.log(`${JSON.stringify(err)}`), console.log(`${$.name} interactive_done API请求失败，请检查网路重试`)) : data && (data = JSON.parse(data), "2" === type ? "0" === data.code && "0" === data.busiCode ? (console.log(data.data.msg), data.data.success || ($.canHelp = !1)) : console.log(data.message) : "0" === data.code && "0" === data.busiCode ? console.log(data.data.rewardMsg) : console.log(data.message))
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve()
            }
        }))
    }))
}
async function sign_interactive_done(type, projectId, assignmentId) {
    let body = JSON.stringify({
            assignmentId: assignmentId,
            type: type,
            projectId: projectId
        }),
        uuid = randomString(40),
        sign = await getSign("interactive_done", body, uuid),
        url = `${JD_API_HOST}client.action?functionId=interactive_done&client=apple&clientVersion=10.1.0&uuid=${uuid}&${sign}`;
    return new Promise((resolve => {
        $.post(taskPostUrl(url, body), ((err, resp, data) => {
            try {
                err ? (console.log(`${JSON.stringify(err)}`), console.log(`${$.name} sign_interactive_done API请求失败，请检查网路重试`)) : data && (data = JSON.parse(data))
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve()
            }
        }))
    }))
}

function interactive_reward(type, projectId, assignmentId) {
    return new Promise((resolve => {
        $.post(taskUrl("interactive_reward", {
            projectId: projectId,
            assignmentId: assignmentId,
            type: type
        }), ((err, resp, data) => {
            try {
                err ? (console.log(`${JSON.stringify(err)}`), console.log(`${$.name} interactive_reward API请求失败，请检查网路重试`)) : data && ("0" === (data = JSON.parse(data)).code && "0" === data.busiCode ? console.log(data.data.rewardMsg) : console.log(data.message))
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve()
            }
        }))
    }))
}

function interactive_accept(type, projectId, assignmentId, itemId) {
    return new Promise((resolve => {
        $.post(taskUrl("interactive_accept", {
            projectId: projectId,
            assignmentId: assignmentId,
            type: type,
            itemId: itemId
        }), ((err, resp, data) => {
            try {
                err ? (console.log(`${JSON.stringify(err)}`), console.log(`${$.name} interactive_accept API请求失败，请检查网路重试`)) : data && (data = JSON.parse(data))
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve()
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
        uuid = randomString(40),
        sign = await getSign("qryViewkitCallbackResult", body, uuid),
        url = `${JD_API_HOST}client.action?functionId=qryViewkitCallbackResult&client=apple&clientVersion=10.1.0&uuid=${uuid}&${sign}`;
    return new Promise((resolve => {
        $.post(taskPostUrl(url, body), ((err, resp, data) => {
            try {
                err ? (console.log(`${JSON.stringify(err)}`), console.log(`${$.name} qryViewkitCallbackResult API请求失败，请检查网路重试`)) : data && ("0" !== (data = JSON.parse(data)).code && "query success!" !== data.msg || console.log("恭喜获得2个京豆"))
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve()
            }
        }))
    }))
}
async function getshareCode() {
    let sid = randomString(40),
        body = JSON.stringify({
            activityId: encodeActivityId,
            pageNum: "-1",
            innerAnchor: "",
            innerExtId: "",
            hideTopFoot: "",
            innerLinkBase64: "",
            innerIndex: "0",
            focus: "",
            forceTop: "",
            addressId: "4091160336",
            posLng: "",
            posLat: "",
            homeLng: "",
            homeLat: "",
            gps_area: "",
            headId: "",
            headArea: "",
            warehouseId: "",
            dcId: "",
            babelChannel: "ttt1",
            mitemAddrId: "",
            geo: {
                lng: "",
                lat: ""
            },
            flt: "",
            jda: "168871293.1632069151379637759921.1632069151.1634449233.1634455108.187",
            topNavStyle: "",
            url: `https://prodev.m.jd.com/mall/active/${encodeActivityId}/index.html?babelChannel=ttt1&tttparams=s1AJNojeyJsbmciOiIxMTcuMDA2NTYzIiwiZ0xhdCI6IjQwLjE4OTkzIiwibGF0IjoiNDAuMTgxOTM0IiwiZ0xuZyI6IjExNy4wMTAwNzEiLCJncHNfYXJlYSI6IjFfMjk1M181NDA0NF8wIiwidW5fYXJlYSI6IjFfMjk1M181NDA0NF8wIn70%3D&lng=&lat=&sid=${sid}&un_area=`,
            fullUrl: `https://prodev.m.jd.com/mall/active/${encodeActivityId}/index.html?babelChannel=ttt1&tttparams=s1AJNojeyJsbmciOiIxMTcuMDA2NTYzIiwiZ0xhdCI6IjQwLjE4OTkzIiwibGF0IjoiNDAuMTgxOTM0IiwiZ0xuZyI6IjExNy4wMTAwNzEiLCJncHNfYXJlYSI6IjFfMjk1M181NDA0NF8wIiwidW5fYXJlYSI6IjFfMjk1M181NDA0NF8wIn70%3D&lng=&lat=&sid=${sid}&un_area=`,
            autoSkipEmptyPage: !1,
            paginationParam: "2",
            paginationFlrs: paginationFlrs,
            transParam: `{"bsessionId":"","babelChannel":"ttt1","actId":"${activityId}","enActId":"${encodeActivityId}","pageId":"${pageId}","encryptCouponFlag":"1","sc":"apple","scv":"10.1.6","requestChannel":"h5","jdAtHomePage":"0"}`,
            siteClient: "apple",
            siteClientVersion: "10.1.6",
            matProExt: {
                unpl: "V2_ZzNtbUEAR0B1CUBWeRkLVWIGF1pKX0IXIVpOUi8eWFJkBxpbclRCFnUURlVnGVgUZwMZWEtcRxBFCEZkexhdBmIKFFxGXnMlfQAoVDYZMgYJAF8QD2dAFUUJdlR8G1wBZwAXXENRRhFxCU9QextZBWQzIl1EZ3MldDhHZHopF2tmThJaQFdHFXYNR1V9HFgBZgoWXUBSQxZFCXZX|V2_ZzNtbRYEREB1X0VTfU5fAGIHEwhLUUZCfVgVAX0aCVJlVhUPclRCFnUURlVnGV0UZwYZXkVcRxdFCEJkexhdBW8KF1xGVnMlfGZFV38dXwFiBREzQlZCe0ULRmR6KVUBYgoSXEUHShJ2X0YDLx8PADQKFwhAB0MSIg4RAy5LCwBhARpcFwNzJXwJdlJ5EV0DYAEiCBwIFVAlUB0MK0YKWD8DIlxyVnMURV4oVHoYXQVmAxRcRBpKEXABRlV8SVUCZFQSChZREBAmAUMBeUlcAjAFRQoXBRQQcwpOVS5NbARXAw%3d%3d"
            },
            userInterest: {
                whiteNote: "0_0_0",
                payment: "0_0_0",
                plusNew: "0_0_0",
                plusRenew: "0_0_0"
            }
        }),
        options = {
            url: `${JD_API_HOST}?client=wh5&clientVersion=1.0.0&functionId=qryH5BabelFloors`,
            body: `body=${encodeURIComponent(body)}&screen=1242*2208&sid=${sid}&uuid=${randomString(40)}&area=&osVersion=15.0.1&d_model=iphone11,2`,
            headers: {
                Host: "api.m.jd.com",
                Accept: "*/*",
                "Content-Type": "application/x-www-form-urlencoded",
                Origin: "https://prodev.m.jd.com",
                "Accept-Language": "zh-CN,zh-Hans;q=0.9",
                "User-Agent": $.isNode() ? process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : require("./USER_AGENTS").USER_AGENT : $.getdata("JDUA") ? $.getdata("JDUA") : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1",
                Referer: "https://prodev.m.jd.com/",
                "Accept-Encoding": "gzip, deflate, br",
                Cookie: cookie
            }
        };
    return new Promise((async resolve => {
        $.post(options, (async (err, resp, data) => {
            try {
                if (err) console.log(`${JSON.stringify(err)}`), console.log(`${$.name} getshareCode API请求失败，请检查网路重试`);
                else if (data) {
                    data = JSON.parse(data);
                    for (let key of Object.keys(data.floorList)) {
                        let vo = data.floorList[key];
                        !vo.boardParams || "2gWnJADG8JXMpp1WXiNHgSy4xUSv" !== vo.boardParams.taskCode && "26KhtkXmoaj6f37bE43W5kF8a9EL" !== vo.boardParams.taskCode && "bWE8RTJm5XnooFr4wwdDM5EYcKP" !== vo.boardParams.taskCode ? vo.boardParams && "3PX8SPeYoQMgo1aJBZYVkeC7QzD3" === vo.boardParams.taskCode && ($.projectCode = vo.boardParams.projectCode, $.taskCode = vo.boardParams.taskCode) : (await getTaskInfo("1", vo.boardParams.projectCode, vo.boardParams.taskCode), await $.wait(2e3))
                    }
                    await getTaskInfo("2", $.projectCode, $.taskCode)
                }
            } catch (e) {
                $.logErr(e, resp)
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

function taskUrl(functionId, body) {
    return body = "interactive_info" === functionId ? `[${encodeURIComponent(JSON.stringify(body))}]` : encodeURIComponent(JSON.stringify(body)), {
        url: `${JD_API_HOST}${functionId}?functionId=${functionId}&appid=contenth5_common&body=${body}&client=wh5`,
        headers: {
            Host: "api.m.jd.com",
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/x-www-form-urlencoded",
            Origin: "https://prodev.m.jd.com",
            "Accept-Language": "zh-CN,zh-Hans;q=0.9",
            "Accept-Encoding": "gzip, deflate, br",
            "User-Agent": $.isNode() ? process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : require("./USER_AGENTS").USER_AGENT : $.getdata("JDUA") ? $.getdata("JDUA") : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1",
            Referer: "https://prodev.m.jd.com/",
            Cookie: cookie
        }
    }
}

function taskPostUrl(url, body) {
    return {
        url: url,
        body: `body=${encodeURIComponent(body)}`,
        headers: {
            Host: "api.m.jd.com",
            "Content-Type": "application/x-www-form-urlencoded",
            "j-e-c": "",
            Accept: "*/*",
            "j-e-h": "",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "zh-Hans-CN;q=1",
            "User-Agent": "JD4iPhone/167841 (iPhone; iOS; Scale/3.00)",
            Referer: "",
            Cookie: cookie
        }
    }
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

function randomString(e) {
    e = e || 32;
    let t = "abcdef0123456789",
        a = t.length,
        n = "";
    for (let i = 0; i < e; i++) n += t.charAt(Math.floor(Math.random() * a));
    return n
}

function getAuthorShareCode(url) {
    return new Promise((async resolve => {
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
                resolve(JSON.parse(data))
            } catch (e) {} finally {
                resolve()
            }
        })), await $.wait(1e4), resolve()
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
    if (!cookiesArr[0]) return void $.msg($.name, "【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取", "https://bean.m.jd.com/bean/signIndex.action", {
        "open-url": "https://bean.m.jd.com/bean/signIndex.action"
    });
    let res = await getAuthorShareCode("https://sub.timor.icu/JDscripts/connoisseur.json");
    res || ($.http.get({
        url: "https://purge.jsdelivr.net/gh/asd920/updateTeam@main/shareCodes/connoisseur.json"
    }).then((resp => {})).catch((e => console.log("刷新CDN异常", e))), await $.wait(1e3), res = await getAuthorShareCode("https://sub.timor.icu/JDscripts/connoisseur.json"));
    for (let i = 0; i < cookiesArr.length; i++)
        if (cookiesArr[i]) {
            if (cookie = cookiesArr[i], $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1]), $.index = i + 1, $.isLogin = !0, $.nickName = "", message = "", await TotalBean(), isLoginInfo[$.UserName] = $.isLogin, console.log(`\n******开始【京东账号${$.index}】${$.nickName||$.UserName}*********\n`), !$.isLogin) {
                $.msg($.name, "【提示】cookie已失效", `京东账号${$.index} ${$.nickName||$.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, {
                    "open-url": "https://bean.m.jd.com/bean/signIndex.action"
                }), $.isNode() && await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
                continue
            }
            await jdConnoisseur()
        } $.shareCodes = [...new Set([...$.shareCodes, ...res || []])];
    for (let i = 0; i < cookiesArr.length; i++)
        if (cookiesArr[i]) {
            if (cookie = cookiesArr[i], $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1]), !isLoginInfo[$.UserName]) continue;
            if ($.canHelp = !0, !$.shareCodes || !$.shareCodes.length) break;
            console.log("\n开始互助\n");
            for (let j = 0; j < $.shareCodes.length && $.canHelp; j++) console.log(`账号${$.UserName} 去助力 ${$.shareCodes[j].use} 的助力码 ${$.shareCodes[j].code}`), $.UserName !== $.shareCodes[j].use ? ($.delcode = !1, await getTaskInfo("2", $.projectCode, $.taskCode, "2", $.shareCodes[j].code), await $.wait(2e3), $.delcode && ($.shareCodes.splice(j, 1), j--)) : console.log("助力失败：不能助力自己")
        }
})().catch((e => {
    $.log("", `❌ ${$.name}, 失败! 原因: ${e}!`, "")
})).finally((() => {
    $.done()
}));