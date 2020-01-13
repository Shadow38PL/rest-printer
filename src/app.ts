import express from 'express';
require('express-async-errors');
import bodyParser from 'body-parser';

import Printer from './printer';
import validator from './validator';
import { errorHandler } from './errors';
import router from './router';

const printer = new Printer();
printer.init();

const app = express();

app.use(validator.authorization);
app.use(validator.quotaCheck);
app.use(bodyParser.json());
app.use(router(printer));
app.use(errorHandler);

app.listen(3000);
console.log('API started!');