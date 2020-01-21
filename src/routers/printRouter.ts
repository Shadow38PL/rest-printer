import { Router } from 'express';

import printControllers from '../controllers/printControllers';

const printRouter = Router();

printRouter.post('/html', printControllers.html);

export default printRouter