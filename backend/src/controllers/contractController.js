import mongoose from 'mongoose';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import logger from '../utils/logger.js';
import { collectAttachments } from '../middleware/upload.js';

/** Model-owned properties a client must never be able to set directly. */
const PROTECTED_FIELDS = new Set([
  '_id',
  '__v',
  'createdAt',
  'updatedAt',
  'status',
  'ownerImage',
  'clientImage',
  'sakImage',
  'familyImages',
  'agencyImage',
  'agentImage',
  'commercialImage',
]);

function stripProtected(body) {
  const clean = {};
  for (const [key, value] of Object.entries(body)) {
    if (!PROTECTED_FIELDS.has(key)) clean[key] = value;
  }
  return clean;
}

/**
 * Builds the CRUD handlers shared by the three contract types. They differ only
 * in their model and which attachment fields they accept.
 *
 * @param {object} options
 * @param {import('mongoose').Model} options.Model
 * @param {Record<string,string>} options.fileFieldMap form field -> model property
 * @param {string} options.label human-readable name used in logs
 */
export function createContractController({ Model, fileFieldMap, label }) {
  const create = asyncHandler(async (req, res) => {
    const payload = {
      ...stripProtected(req.body),
      ...collectAttachments(req.files, fileFieldMap),
    };

    const doc = await Model.create(payload);

    // Never echo the submitted PII back to the browser; the id is enough for
    // the frontend to show a confirmation.
    logger.info(`${label} contract created`, { id: doc._id.toString() });
    res.status(201).json({
      success: true,
      message: 'Data Added Successfully',
      data: { id: doc._id, referenceNumber: doc._id.toString().slice(-8).toUpperCase() },
    });
  });

  const list = asyncHandler(async (_req, res) => {
    // Used by the dashboards only to learn how many records exist. Returning
    // ids alone keeps a full PII dump off this endpoint.
    const [items, totalItems] = await Promise.all([
      Model.find().select('_id createdAt status').sort({ createdAt: -1 }).lean(),
      Model.countDocuments(),
    ]);

    res.json({ success: true, data: items, totalItems });
  });

  const listPage = asyncHandler(async (req, res) => {
    const { page, limit } = req.query;

    const [items, totalItems] = await Promise.all([
      Model.find()
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Model.countDocuments(),
    ]);

    res.json({
      success: true,
      data: items,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages: Math.max(1, Math.ceil(totalItems / limit)),
      },
    });
  });

  const getOne = asyncHandler(async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) throw ApiError.badRequest('Invalid id');

    const doc = await Model.findById(req.params.id).lean();
    if (!doc) throw ApiError.notFound(`${label} contract not found`);

    res.json({ success: true, data: doc });
  });

  const updateStatus = asyncHandler(async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) throw ApiError.badRequest('Invalid id');

    const doc = await Model.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    ).lean();
    if (!doc) throw ApiError.notFound(`${label} contract not found`);

    logger.info(`${label} contract status changed`, {
      id: req.params.id,
      status: req.body.status,
      by: req.user?._id?.toString(),
    });
    res.json({ success: true, message: 'Status updated', data: doc });
  });

  return { create, list, listPage, getOne, updateStatus };
}

export default createContractController;
