import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

    async create(createUserDto: CreateUserDto): Promise<User> {
        const { password, ...rest } = createUserDto;
        const hashedPassword = await bcrypt.hash(password, 10);
        const createdUser = new this.userModel({
            ...rest,
            password: hashedPassword,
        });
        return createdUser.save();
    }

    async findOneByEmail(email: string): Promise<UserDocument | null> {
        return this.userModel.findOne({ email }).select('+password').exec();
    }

    async findOneById(id: string): Promise<User | null> {
        return this.userModel.findById(id).exec();
    }

    async decreaseCredits(userId: string): Promise<UserDocument | null> {
        return this.userModel.findByIdAndUpdate(
            userId,
            { $inc: { credits: -1 } },
            { new: true },
        ).exec();
    }

    async addCredits(userId: string, amount: number): Promise<UserDocument | null> {
        return this.userModel.findByIdAndUpdate(
            userId,
            { $inc: { credits: amount } },
            { new: true },
        ).exec();
    }
}
