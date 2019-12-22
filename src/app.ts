import express from 'express'
import concat from 'concat-stream'
import puppeteer, { Browser } from 'puppeteer'

let browser : Browser

puppeteer.launch({args: ['--no-sandbox']}).then((res) => browser = res)

let app = express()

app.use((req, res, next) => {
    req.pipe(concat((data) => {
        req.body = data
        next()
    }))
})

app.post('/html', async (req, res) => {
    let body : {
        html : string
    }

    try {
        body = JSON.parse(req.body.toString('utf-8'))
    } catch (e) {
        return res.status(400).contentType('application/json').send('Bad request')
    }    

    if (body.html == null)
        return res.status(400).contentType('application/json').send('Bad request')

    if (req.headers.authorization != 'test123')
        return res.status(401).contentType('application/json').send('Invalid or missing api key')

    const page = await browser.newPage()
    await page.goto(`data:text/html,${body.html}`, {waitUntil: 'networkidle0'})
    let pdf = await page.pdf({format: 'A4'})
    page.close()

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename=file.pdf');
    res.setHeader('Content-Transfer-Encoding', 'binary');

    res.send(pdf)
})

app.all('*', async (req, res) => {
    res.contentType('application/json')
    res.status(404)
    res.send({
        statusCode: 404,
        message: 'Resource not found'
    })
})

app.listen(3000)