import { Request, Response, NextFunction } from 'express';

export class AuthorizationError extends Error {
    constructor() {
        super('Invalid or missing API key');

        this.name = 'AuthorizationError';
    }
}

export class QuotaError extends Error {
    constructor() {
        super('Insufficient quota');

        this.name = 'QuotaError';
    }
}

export class NotFoundError extends Error {
    constructor() {
        super('Resource not found');

        this.name = 'NotFoundError';
    }
}

export class BadRequestError extends Error {
    constructor() {
        super('Bad request');

        this.name = 'BadRequestError';
    }
}

export const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
    const respond = (statusCode: number, message: string) => {
        res.status(statusCode).json({ statusCode, message });
    }

    switch (error.constructor) {
        case AuthorizationError:
            respond(401, error.message);
        case QuotaError:
            respond(403, error.message);
        case NotFoundError:
            respond(404, error.message);
        case BadRequestError:
        case SyntaxError:
            respond(400, 'Bad request');
        default:
            respond(500, 'Internal server error');
    }
}