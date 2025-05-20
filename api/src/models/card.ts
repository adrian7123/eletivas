import mongoose, { Document, Schema } from 'mongoose';

interface IMedia {
  url: string;
  type: 'image' | 'audio' | 'video';
  mimeType: string;
}

export interface ICard extends Document {
  content: string;
  medias: IMedia[];
  author: string;
  createdAt: Date;
  updatedAt: Date;
}

const MediaSchema = new Schema({
  url: { type: String, required: true },
  type: { type: String, enum: ['image', 'audio', 'video'], required: true },
  mimeType: { type: String, required: true },
});

const CardSchema = new Schema<ICard>(
  {
    content: { type: String, required: true },
    medias: { type: [MediaSchema], required: false },
    author: { type: String, required: true },
  },
  { timestamps: true },
);

const Card = mongoose.model<ICard>('Card', CardSchema);
export default Card;
