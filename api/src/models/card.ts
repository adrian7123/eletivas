import mongoose, { Document, Schema } from "mongoose";

export interface ICard extends Document {
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const CardSchema = new Schema<ICard>(
  {
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Card = mongoose.model<ICard>("Card", CardSchema);
export default Card;
