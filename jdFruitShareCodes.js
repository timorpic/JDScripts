let FruitShareCodes = ["debfd7bcf944428caab3fe4c2ac629a2@fd222c20cb654e7c933eeb38a4072841", "debfd7bcf944428caab3fe4c2ac629a2@fd222c20cb654e7c933eeb38a4072841"];
process.env.FRUITSHARECODES ? process.env.FRUITSHARECODES.indexOf("&") > -1 ? (console.log("您的东东农场互助码选择的是用&隔开\n"), FruitShareCodes = process.env.FRUITSHARECODES.split("&")) : process.env.FRUITSHARECODES.indexOf("\n") > -1 ? (console.log("您的东东农场互助码选择的是用换行隔开\n"), FruitShareCodes = process.env.FRUITSHARECODES.split("\n")) : FruitShareCodes = process.env.FRUITSHARECODES.split() : process.env.JD_COOKIE && console.log("由于您secret里面未提供助力码，故此处运行将会给脚本内置的码进行助力，请知晓！");
for (let i = 0; i < FruitShareCodes.length; i++) {
    exports["FruitShareCode" + (i + 1 === 1 ? "" : i + 1)] = FruitShareCodes[i]
}