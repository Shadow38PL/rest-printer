import { Request, Response, NextFunction } from 'express';

import { AuthorizationError, QuotaError } from './errors';
import database from './database';

const authorization = async (req: Request, res: Response, next: NextFunction) => {
    if (req.headers.authorization?.length != 80)
        throw new AuthorizationError();

    const userId = await database.getUserIdByKey(req.headers.authorization);

    if (userId == null)
        throw new AuthorizationError();

    res.locals.authorization = req.headers.authorization;
    res.locals.userId = userId;

    next();
}

const quotaCheck = async (req: Request, res: Response, next: NextFunction) => {
    const userId = res.locals.userId;

    const quota = await database.getUserQuota(userId);
    
    if (quota == 0 || quota == null)
        throw new QuotaError();

    res.locals.quota = quota;

    next();
}

export default {
    authorization,
    quotaCheck
}