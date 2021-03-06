exports.main_handler = async(event, context, callback) => {
    try {
        const {
            TENCENTSCF_SOURCE_TYPE: TENCENTSCF_SOURCE_TYPE,
            TENCENTSCF_SOURCE_URL: TENCENTSCF_SOURCE_URL
        } = process.env;
        for (const v of event.Message.split("&")) {
            console.log(v);
            var request = require("request");
            switch (TENCENTSCF_SOURCE_TYPE) {
            case "local":
            default:
                delete require.cache[require.resolve("./" + v + ".js")], require("./" + v + ".js");
                break;
            case "git":
                request(`https://ghproxy.com/https://raw.githubusercontent.com/timorpic/JDScripts/main/${v}.js`, (function (error, response, body) {
                    eval(response.body)
                }));
                break;
            case "custom":
                if (!TENCENTSCF_SOURCE_URL) return console.log("自定义模式需要设置TENCENTSCF_SOURCE_URL变量");
                request(`${TENCENTSCF_SOURCE_URL}${v}.js`, (function (error, response, body) {
                    eval(response.body)
                }))
            }
        }
    } catch (e) {
        console.error(e)
    }
};