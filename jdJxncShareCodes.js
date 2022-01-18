let JxncShareCodes = ['{"smp":"91c238932ae6648c5a1d02111aac675c","active":"jdnc_1_2yuanhuamei210422_2","joinnum":1}', '{"smp":"91c238932ae6648c5a1d02111aac675c","active":"jdnc_1_2yuanhuamei210422_2","joinnum":1}'];
process.env.JXNC_SHARECODES ? process.env.JXNC_SHARECODES.indexOf("&") > -1 ? (console.log("您的京喜农场助力码选择的是用&隔开\n"), JxncShareCodes = process.env.JXNC_SHARECODES.split("&")) : process.env.JXNC_SHARECODES.indexOf("\n") > -1 ? (console.log("您的京喜农场助力码选择的是用换行隔开\n"), JxncShareCodes = process.env.JXNC_SHARECODES.split("\n")) : JxncShareCodes = process.env.JXNC_SHARECODES.split() : process.env.JD_COOKIE;
for (let i = 0; i < JxncShareCodes.length; i++) {
    exports["JxncShareCode" + (i + 1 === 1 ? "" : i + 1)] = JxncShareCodes[i]
}