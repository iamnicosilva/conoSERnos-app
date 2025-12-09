import { Controller, Get, UseGuards } from '@nestjs/common';
import { CardsService } from './cards.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('cards')
export class CardsController {
    constructor(private readonly cardsService: CardsService) { }

    @UseGuards(JwtAuthGuard)
    @Get('draw')
    async drawCard(@CurrentUser() user: any) {
        return this.cardsService.drawCard(user);
    }
}
