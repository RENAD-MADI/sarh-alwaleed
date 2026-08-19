import { Router } from 'express';
import { createContractController } from '../controllers/contractController.js';
import { uploadFields } from '../middleware/upload.js';
import { requireAuth } from '../middleware/auth.js';
import validate from '../middleware/validate.js';
import { paginationSchema, statusUpdateSchema } from '../validators/index.js';
import { submitLimiter } from '../middleware/rateLimit.js';

/**
 * Builds the route table shared by all three contract types.
 *
 * Public: only the create endpoint, so customers can submit a contract.
 * Protected: everything that reads stored data — these responses contain
 * national IDs, IBANs and scanned documents.
 */
export function buildContractRouter({ Model, fileFieldMap, label, bodySchema }) {
  const router = Router();
  const controller = createContractController({ Model, fileFieldMap, label });
  const fields = Object.keys(fileFieldMap);

  router.post(
    '/add',
    submitLimiter,
    uploadFields(fields),
    validate(bodySchema),
    controller.create
  );

  router.get('/', requireAuth, controller.list);
  router.get('/page', requireAuth, validate(paginationSchema, 'query'), controller.listPage);
  router.get('/:id', requireAuth, controller.getOne);
  router.patch(
    '/:id/status',
    requireAuth,
    validate(statusUpdateSchema),
    controller.updateStatus
  );

  return router;
}

export default buildContractRouter;
