import { Request, Response, NextFunction } from 'express';

export class AuthorizationError extends Error {
    constructor () {
        super('Invalid or missing API key');

        this.name = 'AuthorizationError';
    }
}

export class QuotaError extends Error {
    constructor () {
        super('Insufficient quota');

        this.name = 'QuotaError';
    }
}

export class NotFoundError extends Error {
    constructor () {
        super('Resource not found');

        this.name = 'NotFoundError';
    }
}

export class BadRequestError extends Error {
    constructor () {
        super('Bad request');

        this.name = 'BadRequestError';
    }
}

export const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
    if (error instanceof AuthorizationError) {
        res.status(401).json({
            statusCode: 401,
            message: error.message
        });
    } else if (error instanceof QuotaError) {
        res.status(403).json({
            statusCode: 403,
            message: error.message
        });
    } else if (error instanceof NotFoundError) {
        res.status(404).json({
            statusCode: 404,
            message: error.message
        });
    } else if (error instanceof BadRequestError || error instanceof SyntaxError) {
        res.status(400).json({
            statusCode: 400,
            message: 'Bad request'
        });
    } else {
        res.status(500).json({
            statusCode: 500,
            message: 'Internal server error'
        });
    }
}