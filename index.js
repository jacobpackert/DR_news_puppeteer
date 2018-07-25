const puppeteer = require('puppeteer');
const fs = require('fs');
const chalk = require('chalk');

async function run() {
    const browser = await puppeteer.launch({
        headless: false,
        devtools: true
    });
    const page = await browser.newPage();

    const COOKIE_BUTTON = '#CybotCookiebotDialogBodyButtonAccept';

    await page.goto('https://www.dr.dk/nyheder/');

    await page.waitFor(2000);

    await page.click(COOKIE_BUTTON);
    await page.waitFor(1000);
    await page.screenshot({
        path: 'dr.png'
    });


    let headlines = await page.evaluate(() => {
            let headlinesarray = [];
            for (let i = 1; i < 6; i++) {
                const DYNAMICHEADLINE = 'body > div.site-wrapper > div > div:nth-child(3) > div.col-lg-8.col-md-8.col-sm-8.col-xs-12 > div > div:nth-child(2) > div > div > div > ol > li:nth-child(' + i + ') > div.latest__list-item-head > h3';
                const DYNAMICLINK = 'body > div.site-wrapper > div > div:nth-child(3) > div.col-lg-8.col-md-8.col-sm-8.col-xs-12 > div > div:nth-child(2) > div > div > div > ol > li:nth-child(' + i + ') > div.article-body.article-body--brief > p:nth-child(2) > a';
                let innerlink;
                let innerSelection;
                if (document.querySelector(DYNAMICLINK) == null) {
                    console.log(i + "no link in this article");
                    innerSelection =
                        '\n' + i + ": " +
                        document.querySelector(DYNAMICHEADLINE).innerHTML;

                } else {
                    innerlink = document.querySelector(DYNAMICLINK);
                    innerSelection =
                        '\n' + i + ": " +
                        document.querySelector(DYNAMICHEADLINE).innerHTML +
                        ", " +
                        innerlink;
                };
            

            // document.querySelector(DYNAMICLINK);
            console.log(i + ": " + innerSelection);

            //TODO: hvad hvis artiklen har et link? Kan vi så få fat på det link? Der ligger en selector her:
            // body > div.site-wrapper > div > div:nth-child(3) > div.col-lg-8.col-md-8.col-sm-8.col-xs-12 > div > div:nth-child(2) > div > div > div > ol > li:nth-child(3) > div.article-body.article-body--brief > p:nth-child(2) > a
            // men det er ikke altid, der er et link. Skal det så være if != undefined eller sådan noget?

            headlinesarray.push(innerSelection);
        }
        return headlinesarray;

    })

await console.log('\n' +
    chalk.bold.red("🚨  HEADLINES: 🚨") + headlines);


// browser.close();

fs.writeFile('headlines.txt', headlines, (err) => {
    if (err) throw err;
    console.log('✅ ' + chalk.green.bold('headlines.txt has been saved!'));
});

}

run();