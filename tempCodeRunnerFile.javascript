const puppeteer = require("puppeteer");
let page;
const pdf = require("pdfkit");
const fs = require("fs");
async function scrolltoBottom(){
    await page.evaluate(goToBottom);
    function goToBottom(){
    window.scrollBy(0,window.innerHeight);
    }
}

(async () => {
    try {
        
        const openbrowserpromise = await puppeteer.launch({headless:false});
        const browsepages = await openbrowserpromise.pages();
        page = browsepages[0];
        await page.goto("https://www.youtube.com/playlist?list=PLzmYuPTBcoN5LM3C7jG826IPImRb-Bqqw");
        await page.waitForSelector("h1#title");
        let name = await page.evaluate(function(select){return  document.querySelector(select).innerText}, "h1#title");
        await page.waitForSelector("#stats > yt-formatted-string:nth-child(1)");
        let videos  = await page.evaluate(function(select){return document.querySelector(select).innerText}, "#stats > yt-formatted-string:nth-child(1)");
        await page.waitForSelector("#stats > yt-formatted-string:nth-child(2)");
        let views = await page.evaluate(function(select){return document.querySelector(select).innerText}, "#stats > yt-formatted-string:nth-child(2)");
        console.log(name, videos, views);
        videos = videos.split(" ")[0];
        console.log(videos);
        await page.waitForSelector("#index-container");
        let duration = await page.evaluate(function(select){return document.querySelectorAll(select).length} , "#index-container");
        while(videos - duration >= 2){
            console.log(duration);
            await scrolltoBottom();
            duration = await page.evaluate(function(select){
                return document.querySelectorAll(select).length , "#index-container"
            })
        }
        let finallist = await getstat();
        let pdfdoc = new pdf
        pdfdoc.pipe(fs.createWriteStream('play.pdf'))
        pdfdoc.text(JSON.stringify(finallist))
            pdfdoc.end();
    } catch (error) {
        
    }
})()
function getNameDuration(vedioselector, durationselector){
    let vedioelem = document.querySelectorAll(vedioselector);
    let durationelem = document.querySelectorAll(durationselector);
    let currentlist  = [];
    for(let i = 0; i<durationelem.length; i++){
        let vediotitle = vedioelem[i].innerText;
        let durationtitle = durationelem[i].innerText;
        currentlist.push(vediotitle, durationtitle);
    }
   return currentlist;
}

async function getstat(){
    let list = page.evaluate(getNameDuration, ".yt-simple-endpoint.style-scope.ytd-playlist-video-renderer", "#container>#thumbnail span.style-scope.ytd-thumbnail-overlay-time-status-renderer");
    return list;
}