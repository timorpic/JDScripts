let shareCodes = ["bL_LSr3rcUFgsnwSECkbTQ==@04Z2GKwtQvLsLupbyOUEaA==", "bL_LSr3rcUFgsnwSECkbTQ==@04Z2GKwtQvLsLupbyOUEaA=="];
process.env.DREAM_FACTORY_SHARE_CODES ? process.env.DREAM_FACTORY_SHARE_CODES.indexOf("&") > -1 ? (console.log("您的互助码选择的是用&隔开\n"), shareCodes = process.env.DREAM_FACTORY_SHARE_CODES.split("&")) : process.env.DREAM_FACTORY_SHARE_CODES.indexOf("\n") > -1 ? (console.log("您的互助码选择的是用换行隔开\n"), shareCodes = process.env.DREAM_FACTORY_SHARE_CODES.split("\n")) : shareCodes = process.env.DREAM_FACTORY_SHARE_CODES.split() : process.env.DREAM_FACTORY_SHARE_CODES && console.log("由于您secret里面未提供助力码，故此处运行将会给脚本内置的码进行助力，请知晓！");
for (let i = 0; i < shareCodes.length; i++) {
    exports["shareCodes" + (i + 1 === 1 ? "" : i + 1)] = shareCodes[i]
}