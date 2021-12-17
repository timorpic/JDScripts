const https = require("https"),
    http = require("http"),
    stream = require("stream"),
    {
        promisify: promisify
    } = require("util"),
    pipelineAsync = promisify(stream.pipeline),
    zlib = require("zlib"),
    vm = require("vm"),
    PNG = require("png-js"),
    UA = require("./USER_AGENTS.js").USER_AGENT;

function sleep(timeout) {
    return new Promise((resolve => setTimeout(resolve, timeout)))
}
Math.avg = function average() {
    for (var sum = 0, len = this.length, i = 0; i < len; i++) sum += this[i];
    return sum / len
};
class PNGDecoder extends PNG {
    constructor(args) {
        super(args), this.pixels = []
    }
    decodeToPixels() {
        return new Promise((resolve => {
            try {
                this.decode((pixels => {
                    this.pixels = pixels, resolve()
                }))
            } catch (e) {
                console.info(e)
            }
        }))
    }
    getImageData(x, y, w, h) {
        const {
            pixels: pixels
        } = this, len = w * h * 4, startIndex = 4 * x + y * (4 * w);
        return {
            data: pixels.slice(startIndex, startIndex + len)
        }
    }
}
const PUZZLE_GAP = 8,
    PUZZLE_PAD = 10;
class PuzzleRecognizer {
    constructor(bg, patch, y) {
        const imgBg = new PNGDecoder(Buffer.from(bg, "base64")),
            imgPatch = new PNGDecoder(Buffer.from(patch, "base64"));
        this.bg = imgBg, this.patch = imgPatch, this.rawBg = bg, this.rawPatch = patch, this.y = y, this.w = imgBg.width, this.h = imgBg.height
    }
    async run() {
        try {
            return await this.bg.decodeToPixels(), await this.patch.decodeToPixels(), this.recognize()
        } catch (e) {
            console.info(e)
        }
    }
    recognize() {
        const {
            ctx: ctx,
            w: width,
            bg: bg
        } = this, {
            width: patchWidth,
            height: patchHeight
        } = this.patch, posY = this.y + 10 + (patchHeight - 10) / 2 - 4, cData = bg.getImageData(0, posY, width, 8).data, lumas = [];
        for (let x = 0; x < width; x++) {
            var sum = 0;
            for (let y = 0; y < 8; y++) {
                var idx = 4 * x + y * (4 * width);
                sum += .2126 * cData[idx] + .7152 * cData[idx + 1] + .0722 * cData[idx + 2]
            }
            lumas.push(sum / 8)
        }
        const margin = patchWidth - 10;
        for (let i = 0, len = lumas.length - 8; i < len; i++) {
            const left = (lumas[i] + lumas[i + 1]) / 2,
                right = (lumas[i + 2] + lumas[i + 3]) / 2,
                mi = margin + i,
                mLeft = (lumas[mi] + lumas[mi + 1]) / 2,
                mRigth = (lumas[mi + 2] + lumas[mi + 3]) / 2;
            if (left - right > 20 && mLeft - mRigth < -20) {
                const pieces = lumas.slice(i + 2, margin + i + 2),
                    median = pieces.sort(((x1, x2) => x1 - x2))[20],
                    avg = Math.avg(pieces);
                if (median > left || median > mRigth) return;
                if (avg > 100) return;
                return i + 2 - 10
            }
        }
        return -1
    }
    runWithCanvas() {
        const {
            createCanvas: createCanvas,
            Image: Image
        } = require("canvas"), canvas = createCanvas(), ctx = canvas.getContext("2d"), imgBg = new Image, imgPatch = new Image, prefix = "data:image/png;base64,";
        imgBg.src = prefix + this.rawBg, imgPatch.src = prefix + this.rawPatch;
        const {
            naturalWidth: w,
            naturalHeight: h
        } = imgBg;
        canvas.width = w, canvas.height = h, ctx.clearRect(0, 0, w, h), ctx.drawImage(imgBg, 0, 0, w, h);
        const width = w,
            {
                naturalWidth: naturalWidth,
                naturalHeight: naturalHeight
            } = imgPatch,
            posY = this.y + 10 + (naturalHeight - 10) / 2 - 4,
            cData = ctx.getImageData(0, posY, width, 8).data,
            lumas = [];
        for (let x = 0; x < width; x++) {
            var sum = 0;
            for (let y = 0; y < 8; y++) {
                var idx = 4 * x + y * (4 * width);
                sum += .2126 * cData[idx] + .7152 * cData[idx + 1] + .0722 * cData[idx + 2]
            }
            lumas.push(sum / 8)
        }
        const margin = naturalWidth - 10;
        for (let i = 0, len = lumas.length - 8; i < len; i++) {
            const left = (lumas[i] + lumas[i + 1]) / 2,
                right = (lumas[i + 2] + lumas[i + 3]) / 2,
                mi = margin + i,
                mLeft = (lumas[mi] + lumas[mi + 1]) / 2,
                mRigth = (lumas[mi + 2] + lumas[mi + 3]) / 2;
            if (left - right > 20 && mLeft - mRigth < -20) {
                const pieces = lumas.slice(i + 2, margin + i + 2),
                    median = pieces.sort(((x1, x2) => x1 - x2))[20],
                    avg = Math.avg(pieces);
                if (median > left || median > mRigth) return;
                if (avg > 100) return;
                return i + 2 - 10
            }
        }
        return -1
    }
}
const DATA = {
        appId: "17839d5db83",
        product: "embed",
        lang: "zh_CN"
    },
    SERVER = "61.49.99.122";
class JDJRValidator {
    constructor() {
        this.data = {}, this.x = 0, this.t = Date.now()
    }
    async run(scene) {
        try {
            const tryRecognize = async () => {
                const x = await this.recognize(scene);
                return x > 0 ? x : await tryRecognize()
            }, puzzleX = await tryRecognize(), pos = new MousePosFaker(puzzleX).run(), d = getCoordinate(pos);
            await sleep(pos[pos.length - 1][2] - Date.now());
            const result = await JDJRValidator.jsonp("/slide/s.html", {
                d: d,
                ...this.data
            }, scene);
            return "success" === result.message ? (console.log("JDJR验证用时: %fs", (Date.now() - this.t) / 1e3), result) : (console.count("验证失败"), await sleep(300), await this.run(scene))
        } catch (e) {
            console.info(e)
        }
    }
    async recognize(scene) {
        try {
            const data = await JDJRValidator.jsonp("/slide/g.html", {
                    e: ""
                }, scene),
                {
                    bg: bg,
                    patch: patch,
                    y: y
                } = data,
                re = new PuzzleRecognizer(bg, patch, y),
                puzzleX = await re.run();
            return puzzleX > 0 && (this.data = {
                c: data.challenge,
                w: re.w,
                e: "",
                s: "",
                o: ""
            }, this.x = puzzleX), puzzleX
        } catch (e) {
            console.info(e)
        }
    }
    async report(n) {
        console.time("PuzzleRecognizer");
        let count = 0;
        for (let i = 0; i < n; i++) {
            await this.recognize() > 0 && count++
        }
        console.log("验证成功: %f%", count / n * 100), console.timeEnd("PuzzleRecognizer")
    }
    static jsonp(api, data = {}, scene) {
        return new Promise(((resolve, reject) => {
            const fnId = `jsonp_${String(Math.random()).replace(".","")}`,
                query = new URLSearchParams({
                    ...DATA,
                    scene: scene,
                    ...{
                        callback: fnId
                    },
                    ...data
                }).toString(),
                url = `http://${SERVER}${api}?${query}`,
                headers = {
                    Accept: "*/*",
                    "Accept-Encoding": "gzip,deflate,br",
                    "Accept-Language": "zh-CN,en-US",
                    Connection: "keep-alive",
                    Host: SERVER,
                    "Proxy-Connection": "keep-alive",
                    Referer: "https://h5.m.jd.com/babelDiy/Zeus/2wuqXrZrhygTQzYA7VufBEpj4amH/index.html",
                    "User-Agent": UA
                },
                req = http.get(url, {
                    headers: headers
                }, (response => {
                    let res = response;
                    if ("gzip" === res.headers["content-encoding"]) {
                        const unzipStream = new stream.PassThrough;
                        pipelineAsync(response, zlib.createGunzip(), unzipStream), res = unzipStream
                    }
                    res.setEncoding("utf8");
                    let rawData = "";
                    res.on("data", (chunk => rawData += chunk)), res.on("end", (() => {
                        try {
                            const ctx = {
                                [fnId]: data => ctx.data = data,
                                data: {}
                            };
                            vm.createContext(ctx), vm.runInContext(rawData, ctx), res.resume(), resolve(ctx.data)
                        } catch (e) {
                            reject(e)
                        }
                    }))
                }));
            req.on("error", reject), req.end()
        }))
    }
}

function getCoordinate(c) {
    function pretreatment(d, c, b) {
        var e = function string10to64(d) {
                var c = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-~".split(""),
                    b = c.length,
                    e = +d,
                    a = [];
                do {
                    mod = e % b, e = (e - mod) / b, a.unshift(c[mod])
                } while (e);
                return a.join("")
            }(Math.abs(d)),
            a = "";
        return b || (a += d > 0 ? "1" : "0"), a += function prefixInteger(a, b) {
            return (Array(b).join(0) + a).slice(-b)
        }(e, c), a
    }
    for (var b = new Array, e = 0; e < c.length; e++)
        if (0 == e) b.push(pretreatment(c[e][0] < 262143 ? c[e][0] : 262143, 3, !0)), b.push(pretreatment(c[e][1] < 16777215 ? c[e][1] : 16777215, 4, !0)), b.push(pretreatment(c[e][2] < 4398046511103 ? c[e][2] : 4398046511103, 7, !0));
        else {
            var a = c[e][0] - c[e - 1][0],
                f = c[e][1] - c[e - 1][1],
                d = c[e][2] - c[e - 1][2];
            b.push(pretreatment(a < 4095 ? a : 4095, 2, !1)), b.push(pretreatment(f < 4095 ? f : 4095, 2, !1)), b.push(pretreatment(d < 16777215 ? d : 16777215, 4, !0))
        } return b.join("")
}
const HZ = 5;
class MousePosFaker {
    constructor(puzzleX) {
        this.x = parseInt(20 * Math.random() + 20, 10), this.y = parseInt(80 * Math.random() + 80, 10), this.t = Date.now(), this.pos = [
            [this.x, this.y, this.t]
        ], this.minDuration = parseInt(200, 10), this.puzzleX = puzzleX + parseInt(2 * Math.random() - 1, 10), this.STEP = parseInt(6 * Math.random() + 5, 10), this.DURATION = 100 * parseInt(7 * Math.random() + 14, 10), this.STEP = 9
    }
    run() {
        const perX = this.puzzleX / this.STEP,
            perDuration = this.DURATION / this.STEP,
            firstPos = [this.x - parseInt(6 * Math.random(), 10), this.y + parseInt(11 * Math.random(), 10), this.t];
        this.pos.unshift(firstPos), this.stepPos(perX, perDuration), this.fixPos();
        const reactTime = parseInt(60 + 100 * Math.random(), 10),
            lastIdx = this.pos.length - 1,
            lastPos = [this.pos[lastIdx][0], this.pos[lastIdx][1], this.pos[lastIdx][2] + reactTime];
        return this.pos.push(lastPos), this.pos
    }
    stepPos(x, duration) {
        let n = 0;
        Math.sqrt(2);
        for (let i = 1; i <= this.STEP; i++) n += 1 / i;
        for (let i = 0; i < this.STEP; i++) {
            x = this.puzzleX / (n * (i + 1));
            const currX = parseInt(30 * Math.random() - 15 + x, 10),
                currY = parseInt(7 * Math.random() - 3, 10),
                currDuration = parseInt((.4 * Math.random() + .8) * duration, 10);
            this.moveToAndCollect({
                x: currX,
                y: currY,
                duration: currDuration
            })
        }
    }
    fixPos() {
        const actualX = this.pos[this.pos.length - 1][0] - this.pos[1][0],
            deviation = this.puzzleX - actualX;
        Math.abs(deviation) > 4 && this.moveToAndCollect({
            x: deviation,
            y: parseInt(8 * Math.random() - 3, 10),
            duration: 250
        })
    }
    moveToAndCollect({
        x: x,
        y: y,
        duration: duration
    }) {
        let movedX = 0,
            movedY = 0,
            movedT = 0;
        const times = duration / this.minDuration;
        let perX = x / times,
            perY = y / times,
            padDuration = 0;
        for (Math.abs(perX) < 1 && (padDuration = duration / Math.abs(x) - this.minDuration, perX = 1, perY = y / Math.abs(x)); Math.abs(movedX) < Math.abs(x);) {
            const rDuration = parseInt(padDuration + 16 * Math.random() - 4, 10);
            movedX += perX + 2 * Math.random() - 1, movedY += perY, movedT += this.minDuration + rDuration;
            const currX = parseInt(this.x + movedX, 10),
                currY = parseInt(this.y + movedY, 10),
                currT = this.t + movedT;
            this.pos.push([currX, currY, currT])
        }
        this.x += x, this.y += y, this.t += Math.max(duration, movedT)
    }
}

function injectToRequest2(fn, scene = "cww") {
    return (opts, cb) => {
        fn(opts, (async (err, resp, data) => {
            try {
                if (err) return void console.error("验证请求失败.");
                if (data.search("验证") > -1) {
                    console.log("JDJR验证中......");
                    const res = await (new JDJRValidator).run(scene);
                    res && (opts.url += `&validate=${res.validate}`), fn(opts, cb)
                } else cb(err, resp, data)
            } catch (e) {
                console.info(e)
            }
        }))
    }
}
async function injectToRequest(scene = "cww") {
    console.log("JDJR验证中......");
    return `&validate=${(await(new JDJRValidator).run(scene)).validate}`
}
module.exports = {
    sleep: sleep,
    injectToRequest: injectToRequest,
    injectToRequest2: injectToRequest2
};