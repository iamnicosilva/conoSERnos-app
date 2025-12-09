import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
    @Prop({ required: true, unique: true, trim: true, lowercase: true })
    email: string;

    @Prop({ required: true, select: false })
    password: string;

    @Prop({ required: true })
    fullName: string;

    @Prop({ type: [String], default: ['user'] })
    roles: string[];

    @Prop({ default: 5 })
    credits: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
