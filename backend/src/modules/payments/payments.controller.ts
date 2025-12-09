import { Controller, Post, Body, UseGuards, Query, Req } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePreferenceDto } from './dto/create-preference.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('payments')
export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService) { }

    @UseGuards(JwtAuthGuard)
    @Post('create-preference')
    async createPreference(@CurrentUser() user: any, @Body() createPreferenceDto: CreatePreferenceDto) {
        return this.paymentsService.createPreference(user, createPreferenceDto);
    }

    @Post('webhook')
    async handleWebhook(@Body() body: any, @Query() query: any) {
        // Mercado Pago espera un 200 OK rápido
        this.paymentsService.handleWebhook(body, query);
        return { status: 'OK' };
    }
}
