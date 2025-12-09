import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CardDocument = Card & Document;

@Schema({ timestamps: true })
export class Card {
    @Prop({ required: true })
    content: string;

    @Prop()
    category: string;

    @Prop({ required: true, min: 1, max: 5 })
    depthLevel: number;

    @Prop({ default: 'ConoSERnos v1' })
    version: string;

    @Prop({ default: false })
    isCollectible: boolean;
}

export const CardSchema = SchemaFactory.createForClass(Card);
