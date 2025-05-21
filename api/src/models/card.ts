import mongoose, { Document, Schema } from 'mongoose';

interface IMedia {
  url: string;
  type: 'image' | 'audio' | 'video';
  mimeType: string;
}

export interface ICard extends Document {
  content?: string;
  medias: IMedia[];
  author: string;
  createdAt: Date;
  updatedAt: Date;
}

const CardSchema = new Schema<ICard>(
  {
    content: { type: String, required: false },
    medias: { type: [String], required: false },
    author: { type: String, required: true },
  },
  { timestamps: true },
);

const Card = mongoose.model<ICard>('Card', CardSchema);
export default Card;
