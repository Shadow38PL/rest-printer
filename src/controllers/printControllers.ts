import { Request, Response, NextFunction } from "express";

import { QuotaError, BadRequestError } from '../errors';
import database from '../database';
import printer from '../printer';

const html = async (req: Request, res: Response, next: NextFunction) => {
    const { userId, quota, authorization } = res.locals;
    const { html, fileName } = req.body;

    if (html == null)
        throw new BadRequestError();

    const pdf = await printer.print(html);
    const pdfSize = Math.ceil(pdf.byteLength / 1024 / 1024 * 10) / 10;

    if (pdfSize > quota)
        throw new QuotaError()

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename=${fileName || 'file'}.pdf`);
    res.setHeader('Content-Transfer-Encoding', 'binary');

    res.status(200).send(pdf);

    database.reduceUserQuota(userId, pdfSize);
    database.logDataUsage(authorization, pdfSize);
}

export default { html };