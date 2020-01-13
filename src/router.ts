import express from 'express';

import { QuotaError, NotFoundError, BadRequestError } from './errors';
import database from './database';
import Printer from './printer';
import bodyParser from 'body-parser';

export default (printer: Printer) => {
    const router = express.Router();
    
    router.post('/html', async (req, res, next) => {
        const userId = res.locals.userId;
        const quota = res.locals.quota;
        const authorization = res.locals.authorization;
        const html = req.body.html;
        const fileName = req.body.fileName;

        if (html == null)
            throw new BadRequestError();
    
        const pdf = await printer.print(html);
        const pdfSize = Math.ceil(pdf.byteLength / 1024 / 1024 * 10) / 10;
    
        if (pdfSize > quota)
            throw new QuotaError()
    
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename=${ fileName ? fileName : 'file' }.pdf`);
        res.setHeader('Content-Transfer-Encoding', 'binary');
    
        res.status(200).send(pdf);
    
        database.reduceUserQuota(userId, pdfSize);
        database.logDataUsage(authorization, pdfSize);
    });

    router.all('*', (req, res, next) => {
        throw new NotFoundError();
    });

    return router;
}
