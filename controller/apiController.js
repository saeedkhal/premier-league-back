const cheerio = require('cheerio');
const puppeteer = require('puppeteer');

exports.eventsController = async (req, res) =>{
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto('https://www.premierleague.com/home');
        await page.waitForFunction('window.performance.timing.domContentLoadedEventEnd > 0');
        await page.waitForSelector('.day')
        const html = await page.content();
        // fs.writeFileSync('events.html', html);
        // const html = fs.readFileSync('events.html');
    
        const $ = cheerio.load(html);
        const getData = (element) => {
          const homeTeamAbb = $(element).find('.teamName abbr').eq(0).text().trim();
          const awayTeamAbb = $(element).find('.teamName abbr').eq(1).text().trim();
          const homeTeamName = $(element).find('.teamName abbr').eq(0).attr('title');
          const awayTeamName = $(element).find('.teamName abbr').eq(1).attr('title');
          const homeTeamImg = $(element).find('img').eq(0).attr('src');
          const awayTeamImg = $(element).find('img').eq(1).attr('src');
          const matchScore = $(element).find('.score').text().trim() || "0-0";
          const matchStartsAt = $(element).find('time').attr('data-kickoff') || null;
          const broadcasterImage = $(element).find('.broadcaster-image').attr('src');
          const minutes = $(element).find('.js-minutes').text().trim();
          const isLive = $(element).hasClass('js-live-fixture');
          const match = { minutes, isLive, broadcasterImage, homeTeamAbb, awayTeamAbb, homeTeamName, awayTeamName, homeTeamImg, awayTeamImg, matchScore, matchStartsAt };
    
          return match
        }
    
        const matches = $('.day').map((i, day) => {
          const htmlMatches = $(day).find('.matchAbridged').filter('[href]');
          const time = $(day).find('time').text().trim();
          let events;
          if (!htmlMatches.length) {
            return {
              time: null,
              events: []
            }
          }
          events = htmlMatches.map((index, element) => {
            const match = getData(element);
            return match
          }).get();
    
          return {
            time,
            events
          }
        }).get();
    
    
        const week = $('.fixturesAbridgedHeader header .week').first().text().trim();
         res.status(200).json({
            status:'success',
            week,
            matches
        })
        
      } catch (err) {
        res.status(200).json({
            status:'success',
            body:'bong'
        })
      }

}