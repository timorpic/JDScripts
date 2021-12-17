const $ = new Env("领京豆额外奖励_Timorpic"),
  notify = $.isNode() ? require("./sendNotify") : "",
  jdCookieNode = $.isNode() ? require("./jdCookie.js") : "";
let jdNotify = !0;
const helpAuthor = !0;
let message, cookiesArr = [],
  cookie = "",
  uuid = "";
$.isNode() ? (Object.keys(jdCookieNode).forEach((item => {
  cookiesArr.push(jdCookieNode[item])
})), process.env.JD_DEBUG && "false" === process.env.JD_DEBUG && (console.log = () => {})) : cookiesArr = [$.getdata("CookieJD"), $.getdata("CookieJD2"), ...jsonParse($.getdata("CookiesJD") || "[]").map((item => item.cookie))].filter((item => !!item));
const JD_API_HOST = "https://api.m.jd.com/";
async
function jdBeanHome() {
  try {
    $.doneState = !1;
    do {
      await doTask2(), await $.wait(3e3)
    } while (!$.doneState);
    await $.wait(1e3), await award("feeds"), await $.wait(1e3), await getUserInfo(), await $.wait(1e3), await getTaskList(), await receiveJd2(), await morningGetBean(), await $.wait(1e3), await beanTaskList(1), await $.wait(1e3), await queryCouponInfo(), $.doneState = !1;
    let num = 0;
    do {
      await $.wait(2e3), await beanTaskList(2), num++
    } while (!$.doneState && num < 5);
    await $.wait(2e3), $.doneState && await beanTaskList(3), await showMsg()
  } catch (e) {
    $.logErr(e)
  }
}

function morningGetBean() {
  return new Promise((resolve => {
    $.post(taskBeanUrl("morningGetBean", {
      fp: "-1",
      shshshfp: "-1",
      shshshfpa: "-1",
      referUrl: "-1",
      userAgent: "-1",
      jda: "-1",
      rnVersion: "3.9"
    }), ((err, resp, data) => {
      try {
        err ? (console.log(`${JSON.stringify(err)}`), console.log(`${$.name} morningGetBean API请求失败，请检查网路重试`)) : safeGet(data) && ("1" === (data = JSON.parse(data)).data.awardResultFlag ? console.log(`早起福利领取成功：${data.data.bizMsg}`) : (data.data.awardResultFlag, console.log(`早起福利领取失败：${data.data.bizMsg}`)))
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data)
      }
    }))
  }))
}
async
function beanTaskList(type) {
  return new Promise((resolve => {
    $.post(taskBeanUrl("beanTaskList", {
      viewChannel: "myjd"
    }), (async(err, resp, data) => {
      try {
        if (err) console.log(`${JSON.stringify(err)}`), console.log(`${$.name} beanTaskList API请求失败，请检查网路重试`);
        else if (safeGet(data)) switch (data = JSON.parse(data), type) {
        case 1:
          console.log(`当前等级:${data.data.curLevel} 下一级可领取:${data.data.nextLevelBeanNum||0}京豆`), data.data.viewAppHome && (data.data.viewAppHome.takenTask || (console.log(`去做[${data.data.viewAppHome.mainTitle}]`), await beanHomeIconDoTask({
            flag: "0",
            viewChannel: "myjd"
          })), await $.wait(2e3), data.data.viewAppHome.doneTask ? console.log(`[${data.data.viewAppHome.mainTitle}]已做完`) : (console.log(`去领奖[${data.data.viewAppHome.mainTitle}]`), await beanHomeIconDoTask({
            flag: "1",
            viewChannel: "AppHome"
          })));
          break;
        case 2:
          $.doneState = !0;
          let taskInfos = data.data.taskInfos;
          for (let key of Object.keys(taskInfos)) {
            let vo = taskInfos[key];
            if (vo.times < vo.maxTimes)
              for (let key of Object.keys(vo.subTaskVOS)) {
                let taskList = vo.subTaskVOS[key];
                1 === taskList.status && ($.doneState = !1, console.log(`去做[${vo.taskName}]${taskList.title||""}`), await $.wait(2e3), await beanDoTask({
                  actionType: 1,
                  taskToken: `${taskList.taskToken}`
                }, vo.taskType), 9 !== vo.taskType && 8 !== vo.taskType || (await $.wait(3e3), await beanDoTask({
                  actionType: 0,
                  taskToken: `${taskList.taskToken}`
                }, vo.taskType)))
              }
          }
          break;
        case 3:
          let taskInfos3 = data.data.taskInfos;
          for (let key of Object.keys(taskInfos3)) {
            let vo = taskInfos3[key];
            vo.times === vo.maxTimes && console.log(`[${vo.taskName}]已做完`)
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

function beanDoTask(body, taskType) {
  return new Promise((resolve => {
    $.post(taskBeanUrl("beanDoTask", body), ((err, resp, data) => {
      try {
        err ? (console.log(`${JSON.stringify(err)}`), console.log(`${$.name} beanDoTask API请求失败，请检查网路重试`)) : safeGet(data) && (data = JSON.parse(data), 1 === body.actionType && 9 !== taskType && 8 !== taskType && ("0" === data.code && "0" === data.data.bizCode ? console.log(`完成任务，获得+${data.data.score}成长值`) : console.log(`完成任务失败：${data}`)), 0 === body.actionType && ("0" === data.code && "0" === data.data.bizCode ? console.log(data.data.bizMsg) : console.log(`完成任务失败：${data}`)))
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data)
      }
    }))
  }))
}

function beanHomeIconDoTask(body) {
  return new Promise((resolve => {
    $.post(taskBeanUrl("beanHomeIconDoTask", body), ((err, resp, data) => {
      try {
        err ? (console.log(`${JSON.stringify(err)}`), console.log(`${$.name} beanHomeIconDoTask API请求失败，请检查网路重试`)) : safeGet(data) && (data = JSON.parse(data), "0" === body.flag && data.data.taskResult && console.log(data.data.remindMsg), "1" === body.flag && data.data.taskResult && console.log(data.data.remindMsg))
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data)
      }
    }))
  }))
}
async
function queryCouponInfo() {
  return new Promise((async resolve => {
    $.get(taskBeanUrl("queryCouponInfo", {
      rnVersion: "4.7",
      fp: "-1",
      shshshfp: "-1",
      shshshfpa: "-1",
      referUrl: "-1",
      userAgent: "-1",
      jda: "-1"
    }), (async(err, resp, data) => {
      try {
        err ? (console.log(`${JSON.stringify(err)}`), console.log(`${$.name} queryCouponInfo API请求失败，请检查网路重试`)) : safeGet(data) && (data = JSON.parse(data)).data && data.data.couponTaskInfo && (data.data.couponTaskInfo.awardFlag ? console.log(`[${data.data.couponTaskInfo.taskName}]已做完`) : (console.log(`去做[${data.data.couponTaskInfo.taskName}]`), await sceneGetCoupon()))
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve()
      }
    }))
  }))
}

function sceneGetCoupon() {
  return new Promise((resolve => {
    $.get(taskBeanUrl("sceneGetCoupon", {
      rnVersion: "4.7",
      fp: "-1",
      shshshfp: "-1",
      shshshfpa: "-1",
      referUrl: "-1",
      userAgent: "-1",
      jda: "-1"
    }), ((err, resp, data) => {
      try {
        err ? (console.log(`${JSON.stringify(err)}`), console.log(`${$.name} sceneGetCoupon API请求失败，请检查网路重试`)) : safeGet(data) && ("0" === (data = JSON.parse(data)).code && data.data && data.data.bizMsg ? console.log(data.data.bizMsg) : console.log(`完成任务失败：${data}`))
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve()
      }
    }))
  }))
}

function randomString() {
  return Math.random().toString(16).slice(2, 10) + Math.random().toString(16).slice(2, 10) + Math.random().toString(16).slice(2, 10) + Math.random().toString(16).slice(2, 10) + Math.random().toString(16).slice(2, 10)
}

function getRandomInt(min, max) {
  return min = Math.ceil(min), max = Math.floor(max), Math.floor(Math.random() * (max - min)) + min
}

function doTask2() {
  return new Promise((resolve => {
    const body = {
      awardFlag: !1,
      skuId: `${getRandomInt(1e7,2e7)}`,
      source: "feeds",
      type: "1"
    };
    $.post(taskUrl("beanHomeTask", body), ((err, resp, data) => {
      try {
        err ? (console.log(`${JSON.stringify(err)}`), console.log(`${$.name} API请求失败，请检查网路重试`)) : safeGet(data) && ("0" === (data = JSON.parse(data)).code && data.data ? (console.log(`任务完成进度：${data.data.taskProgress}/${data.data.taskThreshold}`), data.data.taskProgress === data.data.taskThreshold && ($.doneState = !0)) : "0" === data.code && "HT201" === data.errorCode ? $.doneState = !0 : ($.doneState = !0, console.log(`做任务异常：${JSON.stringify(data)}`)))
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve()
      }
    }))
  }))
}

function getAuthorShareCode(url) {
  return new Promise((resolve => {
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
    $.get(options, (async(err, resp, data) => {
      try {
        err || data && (data = JSON.parse(data))
      } catch (e) {} finally {
        resolve(data)
      }
    }))
  }))
}

function getUserInfo() {
  return new Promise((resolve => {
    $.post(taskUrl("signBeanGroupStageIndex", "body"), (async(err, resp, data) => {
      try {
        if (err) console.log(`${JSON.stringify(err)}`), console.log(`${$.name} API请求失败，请检查网路重试`);
        else if (safeGet(data) && (data = JSON.parse(data)).data.jklInfo) {
          $.actId = data.data.jklInfo.keyId;
          let {
            shareCode: shareCode,
            groupCode: groupCode
          } = data.data;
          shareCode ? (console.log(shareCode, groupCode), data.data.beanActivityVisitVenue && "0" === data.data.beanActivityVisitVenue.taskStatus && await help(shareCode, groupCode, 1), console.log(`\n京东账号${$.index} ${$.nickName||$.UserName} 抢京豆邀请码：${shareCode}\n`), $.newShareCodes.push([shareCode, groupCode, $.UserName])) : (console.log("未获取到助力码，去开团"), await hitGroup())
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve()
      }
    }))
  }))
}

function hitGroup() {
  return new Promise((resolve => {
    $.get(taskGetUrl("signGroupHit", {
      activeType: 2
    }), (async(err, resp, data) => {
      try {
        if (err) console.log(`${JSON.stringify(err)}`), console.log(`${$.name} API请求失败，请检查网路重试`);
        else if (safeGet(data))
          if ("SG150" === (data = JSON.parse(data)).data.respCode) {
            let {
              shareCode: shareCode,
              groupCode: groupCode
            } = data.data.signGroupMain;
            shareCode ? ($.newShareCodes.push([shareCode, groupCode, $.UserName]), console.log("开团成功"), console.log(`\n京东账号${$.index} ${$.nickName||$.UserName} 抢京豆邀请码：${shareCode}\n`), await help(shareCode, groupCode, 1)) : console.log(`为获取到助力码，错误信息${JSON.stringify(data.data)}`)
          } else console.log(`开团失败，错误信息${JSON.stringify(data.data)}`)
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve()
      }
    }))
  }))
}

function help(shareCode, groupCode, isTask = 0) {
  return new Promise((resolve => {
    const body = {
      activeType: 2,
      groupCode: groupCode,
      shareCode: shareCode,
      activeId: $.actId
    };
    isTask ? (console.log("【抢京豆】做任务获取助力"), body.isTask = "1") : (console.log(`【抢京豆】去助力好友${shareCode}`), body.source = "guest"), $.get(taskGetUrl("signGroupHelp", body), (async(err, resp, data) => {
      try {
        err ? (console.log(`${JSON.stringify(err)}`), console.log(`【抢京豆】${$.name} API请求失败，请检查网路重试`)) : safeGet(data) && ("0" === (data = JSON.parse(data)).code && console.log(`【抢京豆】${data.data.helpToast}`), "0" === data.code && data.data && "SG209" === data.data.respCode && ($.canHelp = !1))
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data)
      }
    }))
  }))
}

function showMsg() {
  return new Promise((resolve => {
    message && $.msg($.name, "", `【京东账号${$.index}】${$.nickName}\n${message}`), resolve()
  }))
}

function getTaskList() {
  return new Promise((resolve => {
    $.post(taskUrl("findBeanHome", {
      rnVersion: "4.7",
      rnClient: "2",
      source: "AppHome"
    }), (async(err, resp, data) => {
      try {
        if (err) console.log(`${JSON.stringify(err)}`), console.log(`${$.name} API请求失败，请检查网路重试`);
        else if (safeGet(data)) {
          (data = JSON.parse(data)).data.floorList.filter((vo => "种豆得豆定制化场景" === vo.floorName))[0].viewed || (await receiveTask(), await $.wait(3e3));
          let tasks = data.data.floorList.filter((vo => "赚京豆" === vo.floorName))[0].stageList;
          for (let i = 0; i < tasks.length; ++i) {
            const vo = tasks[i];
            vo.viewed || (await receiveTask(vo.stageId, `4_${vo.stageId}`), await $.wait(3e3))
          }
          await award()
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve()
      }
    }))
  }))
}

function receiveTask(itemId = "zddd", type = "3") {
  return new Promise((resolve => {
    const body = {
      awardFlag: !1,
      itemId: itemId,
      source: "home",
      type: type
    };
    $.post(taskUrl("beanHomeTask", body), ((err, resp, data) => {
      try {
        err ? (console.log(`${JSON.stringify(err)}`), console.log(`${$.name} API请求失败，请检查网路重试`)) : safeGet(data) && ((data = JSON.parse(data)).data ? console.log(`完成任务成功，进度${data.data.taskProgress}/${data.data.taskThreshold}`) : console.log(`完成任务失败，${data.errorMessage}`))
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve()
      }
    }))
  }))
}

function award(source = "home") {
  return new Promise((resolve => {
    const body = {
      awardFlag: !0,
      source: source
    };
    $.post(taskUrl("beanHomeTask", body), ((err, resp, data) => {
      try {
        err ? (console.log(`${JSON.stringify(err)}`), console.log(`${$.name} API请求失败，请检查网路重试`)) : safeGet(data) && ((data = JSON.parse(data)).data ? (console.log(`领奖成功，获得 ${data.data.beanNum} 个京豆`), message += `领奖成功，获得 ${data.data.beanNum} 个京豆\n`) : console.log(`领奖失败，${data.errorMessage}`))
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve()
      }
    }))
  }))
}

function receiveJd2() {
  var options = {
    url: "https://api.m.jd.com/client.action?functionId=sceneInitialize",
    headers: {
      Host: "api.m.jd.com",
      "content-type": "application/x-www-form-urlencoded",
      accept: "*/*",
      "user-agent": "JD4iPhone/167515 (iPhone; iOS 14.2; Scale/3.00)",
      "accept-language": "zh-Hans-JP;q=1, en-JP;q=0.9, zh-Hant-TW;q=0.8, ja-JP;q=0.7, en-US;q=0.6",
      Cookie: cookie
    },
    body: "body=%7B%7D&build=167576&client=apple&clientVersion=9.4.3&openudid=53f4d9c70c1c81f1c8769d2fe2fef0190a3f60d2&osVersion=14.2&partner=TF&rfs=0000&scope=10&screen=1242%2A2208&sign=19c33b5b9ad4f02c53b6040fc8527119&st=1614701322170&sv=122"
  };
  return new Promise((resolve => {
    $.post(options, ((err, resp, data) => {
      try {
        err ? (console.log(`${JSON.stringify(err)}`), console.log(`${$.name} API请求失败，请检查网路重试`)) : safeGet(data) && ("0" === (data = JSON.parse(data)).code && data.data ? (console.log(`强制开启新版领京豆成功,获得${data.data.sceneLevelConfig.beanNum}京豆\n`), $.msg($.name, "", `强制开启新版领京豆成功\n获得${data.data.sceneLevelConfig.beanNum}京豆`)) : console.log(`强制开启新版领京豆结果:${JSON.stringify(data)}\n`))
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve()
      }
    }))
  }))
}

function taskGetUrl(function_id, body) {
  return {
    url: `${JD_API_HOST}client.action?functionId=${function_id}&body=${escape(JSON.stringify(body))}&appid=ld&clientVersion=9.2.0`,
    headers: {
      Cookie: cookie,
      Host: "api.m.jd.com",
      Accept: "*/*",
      Connection: "keep-alive",
      "User-Agent": $.isNode() ? process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : require("./USER_AGENTS").USER_AGENT : $.getdata("JDUA") ? $.getdata("JDUA") : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1",
      "Accept-Language": "zh-Hans-CN;q=1,en-CN;q=0.9",
      "Accept-Encoding": "gzip, deflate, br",
      "Content-Type": "application/x-www-form-urlencoded"
    }
  }
}

function taskBeanUrl(function_id, body = {}) {
  return {
    url: `${JD_API_HOST}client.action?functionId=${function_id}&body=${escape(JSON.stringify(body))}&appid=ld&client=apple&clientVersion=10.0.8&uuid=${uuid}&openudid=${uuid}`,
    headers: {
      Cookie: cookie,
      Host: "api.m.jd.com",
      Accept: "*/*",
      Connection: "keep-alive",
      "User-Agent": $.isNode() ? process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : require("./USER_AGENTS").USER_AGENT : $.getdata("JDUA") ? $.getdata("JDUA") : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1",
      "Accept-Language": "zh-cn",
      "Accept-Encoding": "gzip, deflate, br",
      Referer: "https://h5.m.jd.com/"
    }
  }
}

function taskUrl(function_id, body) {
  return body.version = "9.0.0.1", body.monitor_source = "plant_app_plant_index", body.monitor_refer = "", {
    url: JD_API_HOST,
    body: `functionId=${function_id}&body=${escape(JSON.stringify(body))}&appid=ld&client=apple&area=5_274_49707_49973&build=167283&clientVersion=9.1.0`,
    headers: {
      Cookie: cookie,
      Host: "api.m.jd.com",
      Accept: "*/*",
      Connection: "keep-alive",
      "User-Agent": $.isNode() ? process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : require("./USER_AGENTS").USER_AGENT : $.getdata("JDUA") ? $.getdata("JDUA") : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1",
      "Accept-Language": "zh-Hans-CN;q=1,en-CN;q=0.9",
      "Accept-Encoding": "gzip, deflate, br",
      "Content-Type": "application/x-www-form-urlencoded"
    }
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
}(async() => {
  if ($.newShareCodes = [], cookiesArr[0]) {
    for (let i = 0; i < cookiesArr.length; i++)
      if (cookiesArr[i]) {
        if (cookie = cookiesArr[i], $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1]), $.index = i + 1, $.isLogin = !0, $.nickName = "", message = "", uuid = randomString(), await TotalBean(), console.log(`\n******开始【京东账号${$.index}】${$.nickName||$.UserName}*********\n`), !$.isLogin) {
          $.msg($.name, "【提示】cookie已失效", `京东账号${$.index} ${$.nickName||$.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, {
            "open-url": "https://bean.m.jd.com/bean/signIndex.action"
          }), $.isNode() && await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
          continue
        }
        await jdBeanHome()
      }
  } else $.msg($.name, "【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取", "https://bean.m.jd.com/bean/signIndex.action", {
    "open-url": "https://bean.m.jd.com/bean/signIndex.action"
  })
})().catch((e => {
  $.log("", `❌ ${$.name}, 失败! 原因: ${e}!`, "")
})).finally((() => {
  $.done()
}));