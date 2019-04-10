const express = require('express')
const puppeteer = require('puppeteer')
const concat = require('concat-stream');

const app = express()
let browser

puppeteer.launch({args: ['--no-sandbox']}).then((res) => browser = res)

app.use(function(req, res, next){
  req.pipe(concat(function(data){
    req.body = data;
    next();
  }));
});

app.post('/', async (req, res) => {
    const page = await browser.newPage()
    await page.goto(`data:text/html,${req.body.toString('utf-8')}`, {waitUntil: 'networkidle0'})
    let pdf = await page.pdf({format: 'A4'})
    page.close()

	  res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename=file.pdf');
    res.setHeader('Content-Transfer-Encoding', 'binary');

    res.send(pdf)
})

app.listen(5000)