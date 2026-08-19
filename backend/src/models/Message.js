import mongoose from 'mongoose';

/** Contact-form enquiry submitted from the public site (للإستفسارات و الشكاوي). */
const messageSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: true, maxlength: 120 },
    phone: { type: String, trim: true, required: true, maxlength: 20 },
    email: { type: String, trim: true, lowercase: true, default: '', maxlength: 160 },
    subject: { type: String, trim: true, required: true, maxlength: 200 },
    message: { type: String, trim: true, required: true, maxlength: 5000 },
    isRead: { type: Boolean, default: false, index: true },
  },
  { timestamps: true, collection: 'messages' }
);

messageSchema.index({ createdAt: -1 });

export default mongoose.model('Message', messageSchema);
