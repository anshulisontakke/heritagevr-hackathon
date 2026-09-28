import { Router } from 'express';
import { submitContact, getMessages } from '../controllers/contactController.js';
import { authenticate, authorizeAdmin } from '../middleware/auth.js';
import { contactValidation, validate } from '../middleware/validation.js';

const router = Router();

router.post('/', contactValidation, validate, submitContact);
router.get('/', authenticate, authorizeAdmin, getMessages);

export default router;
