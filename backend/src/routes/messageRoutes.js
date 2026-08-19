import { Router } from 'express';
import {
  addMessage,
  listMessages,
  markMessageRead,
} from '../controllers/messageController.js';
import { requireAuth } from '../middleware/auth.js';
import validate from '../middleware/validate.js';
import { messageSchema, paginationSchema } from '../validators/index.js';
import { submitLimiter } from '../middleware/rateLimit.js';

const router = Router();

router.post('/addMessage', submitLimiter, validate(messageSchema), addMessage);

// Reading enquiries exposes customer contact details — staff only.
router.get('/', requireAuth, validate(paginationSchema, 'query'), listMessages);
router.patch('/:id/read', requireAuth, markMessageRead);

export default router;
