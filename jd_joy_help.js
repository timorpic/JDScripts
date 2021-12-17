const friendsArr = [];
let newUrl, url = $request.url;

function randomNumber(min = 0, max = 100) {
    return Math.min(Math.floor(min + Math.random() * (max - min)), max)
}
try {
    console.log(`url:${url}`);
    let friendPin = encodeURI(friendsArr[randomNumber(0, friendsArr.length)]);
    const timestamp = (new Date).getTime(),
        lks = url.match(/lks=.*?$/g)[0];
    newUrl = url.replace(/friendPin=.*?$/i, "friendPin=" + friendPin).replace(/invitePin=.*?$/i, "invitePin=" + friendPin).replace(/inviteTimeStamp=.*?$/i, "inviteTimeStamp=" + timestamp + "&"), newUrl += `&${lks}`, console.log(`newUrl:${newUrl}`)
} catch (e) {
    console.log(e)
} finally {
    $done({
        url: newUrl
    })
}