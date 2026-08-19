import mongoose from 'mongoose';

/**
 * Uploaded file reference. `secure_url` keeps the shape the dashboards already
 * render, so the frontend needed no change when storage moved off Cloudinary.
 */
export const fileSchema = new mongoose.Schema(
  {
    secure_url: { type: String, required: true },
    filename: { type: String, required: true },
    originalName: { type: String, default: '' },
    mimeType: { type: String, default: '' },
    size: { type: Number, default: 0 },
  },
  { _id: false }
);

export default fileSchema;
