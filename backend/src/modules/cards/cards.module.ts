import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CardsService } from './cards.service';
import { CardsController } from './cards.controller';
import { Card, CardSchema } from './schemas/card.schema';
import { UsersModule } from '../users/users.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Card.name, schema: CardSchema }]),
        UsersModule,
    ],
    controllers: [CardsController],
    providers: [CardsService],
})
export class CardsModule { }
