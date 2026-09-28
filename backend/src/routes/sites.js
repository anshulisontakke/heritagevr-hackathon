import { Router } from 'express';
import {
  getAllSites, getSiteById, createSite, updateSite, deleteSite,
  getSiteComponents, createComponent, updateComponent, deleteComponent,
} from '../controllers/siteController.js';
import { authenticate, authorizeAdmin } from '../middleware/auth.js';
import { siteValidation, validate } from '../middleware/validation.js';

const router = Router();

// Public routes
router.get('/', getAllSites);
router.get('/:id', getSiteById);
router.get('/:id/components', getSiteComponents);

// Admin routes
router.post('/', authenticate, authorizeAdmin, siteValidation, validate, createSite);
router.put('/:id', authenticate, authorizeAdmin, updateSite);
router.delete('/:id', authenticate, authorizeAdmin, deleteSite);

router.post('/:id/components', authenticate, authorizeAdmin, createComponent);
router.put('/:id/components/:componentId', authenticate, authorizeAdmin, updateComponent);
router.delete('/:id/components/:componentId', authenticate, authorizeAdmin, deleteComponent);

export default router;
