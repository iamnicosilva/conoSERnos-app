import { Injectable, OnModuleInit, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Card, CardDocument } from './schemas/card.schema';
import { UsersService } from '../users/users.service';

@Injectable()
export class CardsService implements OnModuleInit {
    constructor(
        @InjectModel(Card.name) private cardModel: Model<CardDocument>,
        private usersService: UsersService,
    ) { }

    async onModuleInit() {
        const count = await this.cardModel.countDocuments();
        if (count === 0) {
            const initialCards = [
                { content: "A lo que soy LEAL en mi vida es a...", category: "Rompehielo", depthLevel: 1 },
                { content: "Cuando era chiquito/a me gustaba JUGAR con...", category: "Rompehielo", depthLevel: 1 },
                { content: "Cuando estoy TRISTE lo que hago es...", category: "Emocional", depthLevel: 2 },
                { content: "Lo que me saca una SONRISA cada día es...", category: "Positivo", depthLevel: 2 },
                { content: "La mayor LOCURA que hice por amor fue...", category: "Amor", depthLevel: 3 },
                { content: "Lo que hoy ELIJO darle al mundo es...", category: "Propósito", depthLevel: 3 },
                { content: "La PEOR mentira que dije fue...", category: "Profundo", depthLevel: 4 },
                { content: "Mi mayor DECEPCION fue...", category: "Profundo", depthLevel: 4 },
                { content: "Lo que nunca voy a ENTENDER es...", category: "Existencial", depthLevel: 5 },
                { content: "Si tuviera que elegir el TITULO DEL LIBRO DE MI VIDA sería...", category: "Existencial", depthLevel: 5 },
            ];
            await this.cardModel.insertMany(initialCards);
            console.log('Initial cards seeded');
        }
    }

    async drawCard(user: any) {
        if (user.credits <= 0) {
            throw new BadRequestException('No tienes suficientes créditos');
        }

        const cards = await this.cardModel.aggregate([{ $sample: { size: 1 } }]);
        if (!cards || cards.length === 0) {
            throw new BadRequestException('No hay cartas disponibles');
        }

        await this.usersService.decreaseCredits(user.userId || user._id || user.sub);
        return cards[0];
    }
}
