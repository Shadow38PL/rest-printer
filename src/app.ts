import express, { json } from 'express'
import concat from 'concat-stream'
import puppeteer, { Browser } from 'puppeteer'

import database from './database'

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
        return res.status(400).contentType('application/json').send({
            statusCode: 400,
            message: 'Bad request'
        })
    }    

    if (body.html == null)
        return res.status(400).contentType('application/json').send({
            statusCode: 400,
            message: 'Bad request'
        })

    if (req.headers.authorization?.length != 80)
        return res.status(401).contentType('application/json').send({
            statusCode: 401,
            message: 'Invalid or missing api key'
        })

    let userId
    let quota

    try {
        userId = await database.getUserIdByKey(req.headers.authorization)
    
        if (userId == null)
            return res.status(401).contentType('application/json').send({
                statusCode: 401,
                message: 'Invalid or missing api key'
            })
    
        quota = await database.getUserQuota(userId)
    
        if (quota == 0 || quota == null)
            return res.status(403).contentType('application/json').send({
                statusCode: 403,
                message: 'Insufficient quota'
            })
    } catch (e) {
        return res.status(500).contentType('application/json').send({
            statusCode: 500,
            message: 'Internal server error'
        })
    }

    const page = await browser.newPage()
    await page.goto(`data:text/html,${body.html}`, {waitUntil: 'networkidle0'})
    let pdf = await page.pdf({format: 'A4'})
    page.close()

    const pdfSize = Math.ceil(pdf.byteLength / 1024 / 1024 * 10) / 10

    if (pdfSize > quota)
        return res.status(403).contentType('application/json').send({
            statusCode: 403,
            message: 'Insufficient quota'
        })

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename=file.pdf');
    res.setHeader('Content-Transfer-Encoding', 'binary');

    res.send(pdf)

    database.reduceUserQuota(userId, pdfSize)
    database.logDataUsage(req.headers.authorization, pdfSize)
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