import { Router } from 'express';

import ResidentialContract from '../models/ResidentialContract.js';
import CommercialContract from '../models/CommercialContract.js';
import SubContract from '../models/SubContract.js';

import { buildContractRouter } from './contractRoutes.js';
import messageRoutes from './messageRoutes.js';
import authRoutes from './authRoutes.js';
import uploadRoutes from './uploadRoutes.js';

import {
  residentialContractSchema,
  commercialContractSchema,
  subContractSchema,
} from '../validators/index.js';

const router = Router();

router.get('/health', (_req, res) => {
  res.json({ success: true, status: 'ok', uptime: process.uptime() });
});

router.use('/auth', authRoutes);
router.use('/message', messageRoutes);
router.use('/uploads', uploadRoutes);

// Route prefixes match the paths the existing frontend already calls.
router.use(
  '/realEsate',
  buildContractRouter({
    Model: ResidentialContract,
    label: 'Residential',
    bodySchema: residentialContractSchema,
    fileFieldMap: {
      owner: 'ownerImage',
      client: 'clientImage',
      sak: 'sakImage',
      family: 'familyImages',
      agency: 'agencyImage',
      agent: 'agentImage',
    },
  })
);

router.use(
  '/commercial',
  buildContractRouter({
    Model: CommercialContract,
    label: 'Commercial',
    bodySchema: commercialContractSchema,
    fileFieldMap: {
      owner: 'ownerImage',
      client: 'clientImage',
      sak: 'sakImage',
      commercialImage: 'commercialImage',
      agency: 'agencyImage',
      agent: 'agentImage',
    },
  })
);

router.use(
  '/elbaten',
  buildContractRouter({
    Model: SubContract,
    label: 'Sublease',
    bodySchema: subContractSchema,
    fileFieldMap: {
      owner: 'ownerImage',
      client: 'clientImage',
      agent: 'agentImage',
    },
  })
);

export default router;
