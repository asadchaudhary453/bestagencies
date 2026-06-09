import mongoose, { Document, Model, Schema } from "mongoose";
import crypto from "crypto";

export interface IPasswordResetToken extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  token: string;
  expiresAt: Date;
  createdAt: Date;
}

const passwordResetTokenSchema = new Schema<IPasswordResetToken>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    token: {
      type: String,
      required: true,
      unique: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      default: () => new Date(Date.now() + 60 * 60 * 1000), // 1 hour from now
    },
  },
  {
    timestamps: true,
  }
);

// Index for automatic deletion of expired tokens
passwordResetTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Static method to generate a secure token
passwordResetTokenSchema.statics.generateToken = function (): string {
  return crypto.randomBytes(32).toString("hex");
};

// Prevent model recompilation in development
function getModel(): Model<IPasswordResetToken> {
  if (mongoose.models && mongoose.models.PasswordResetToken) {
    return mongoose.models.PasswordResetToken as Model<IPasswordResetToken>;
  }
  return mongoose.model<IPasswordResetToken>("PasswordResetToken", passwordResetTokenSchema);
}

const PasswordResetToken = getModel();

export default PasswordResetToken;
