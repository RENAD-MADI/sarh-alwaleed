import mongoose from 'mongoose';
import Message from '../models/Message.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import logger from '../utils/logger.js';

export const addMessage = asyncHandler(async (req, res) => {
  const { name, phone, subject, message } = req.body;
  // The public form labels this field `Email`; the validator normalises both.
  const email = req.body.email || req.body.Email || '';

  const doc = await Message.create({ name, phone, email, subject, message });

  logger.info('Contact message received', { id: doc._id.toString() });
  res.status(201).json({ success: true, message: 'Message Sent successfully' });
});

export const listMessages = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const pageSize = Math.max(limit, 20);

  const [messages, totalItems] = await Promise.all([
    Message.find().sort({ createdAt: -1 }).skip((page - 1) * pageSize).limit(pageSize).lean(),
    Message.countDocuments(),
  ]);

  res.json({
    success: true,
    messages,
    pagination: {
      page,
      limit: pageSize,
      totalItems,
      totalPages: Math.max(1, Math.ceil(totalItems / pageSize)),
    },
  });
});

export const markMessageRead = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) throw ApiError.badRequest('Invalid id');

  const doc = await Message.findByIdAndUpdate(
    req.params.id,
    { isRead: true },
    { new: true }
  ).lean();
  if (!doc) throw ApiError.notFound('Message not found');

  res.json({ success: true, message: 'Message marked as read', data: doc });
});
