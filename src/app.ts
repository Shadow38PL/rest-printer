import express from 'express';
import 'express-async-errors';
import bodyParser from 'body-parser';

import printer from './printer';
import validator from './validator';
import printRouter from './routers/printRouter';
import defaultController from './controllers/defaultController';
import { errorHandler } from './errors';

printer.init();

const app = express();

app.use(validator.authorization);
app.use(validator.quotaCheck);
app.use(bodyParser.json());
app.use(printRouter);
app.use(defaultController)
app.use(errorHandler);

app.listen(3000);
console.log('API started!');