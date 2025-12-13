import { Router } from 'express';
import { registerUser, loginUser } from './controllers/auth.controller';
import {
  createSweetController,
  listSweetsController,
  searchSweetsController,
  getSweetController,
  updateSweetController,
  deleteSweetController,
  purchaseSweetController,
  restockSweetController
} from './controllers/sweet.controller';
import { validateBody, validateQuery } from './middleware/validate';
import { registerSchema, loginSchema } from './dtos/auth.dto';
import { createSweetSchema, updateSweetSchema, purchaseSchema, restockSchema, searchSchema } from './dtos/sweet.dto';
import { authenticate, authorizeAdmin } from './middleware/auth';

const router = Router();
router.post('/auth/register', validateBody(registerSchema), registerUser);
router.post('/auth/login', validateBody(loginSchema), loginUser);
router.get('/sweets', listSweetsController);
router.get('/sweets/search', validateQuery(searchSchema), searchSweetsController);
router.get('/sweets/:id', getSweetController);
router.post('/sweets', authenticate, authorizeAdmin, validateBody(createSweetSchema), createSweetController);
router.put('/sweets/:id', authenticate, authorizeAdmin, validateBody(updateSweetSchema), updateSweetController);
router.delete('/sweets/:id', authenticate, authorizeAdmin, deleteSweetController);
router.post('/sweets/:id/purchase', authenticate, validateBody(purchaseSchema), purchaseSweetController);
router.post('/sweets/:id/restock', authenticate, authorizeAdmin, validateBody(restockSchema), restockSweetController);

export default router;
