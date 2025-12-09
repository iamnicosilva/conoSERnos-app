import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';
import { UsersService } from '../users/users.service';
import { CreatePreferenceDto } from './dto/create-preference.dto';

@Injectable()
export class PaymentsService {
    private client: MercadoPagoConfig;
    private preference: Preference;
    private payment: Payment;

    constructor(
        private configService: ConfigService,
        private usersService: UsersService,
    ) {
        const accessToken = this.configService.get<string>('MERCADOPAGO_ACCESS_TOKEN');
        if (accessToken) {
            this.client = new MercadoPagoConfig({ accessToken });
            this.preference = new Preference(this.client);
            this.payment = new Payment(this.client);
        }
    }

    async createPreference(user: any, createPreferenceDto: CreatePreferenceDto) {
        if (!this.client) {
            throw new BadRequestException('Mercado Pago no configurado');
        }

        let title = '';
        let price = 0;
        let quantity = 0;

        switch (createPreferenceDto.packId) {
            case 'pack_10':
                title = 'Pack 10 Créditos';
                price = 1000;
                quantity = 10;
                break;
            case 'pack_50':
                title = 'Pack 50 Créditos';
                price = 4500;
                quantity = 50;
                break;
            default:
                throw new BadRequestException('Pack no válido');
        }

        const result = await this.preference.create({
            body: {
                items: [
                    {
                        id: createPreferenceDto.packId,
                        title: title,
                        quantity: 1,
                        unit_price: price,
                        currency_id: 'ARS',
                    },
                ],
                external_reference: user.userId || user._id || user.sub,
                back_urls: {
                    success: 'http://localhost:3000/success',
                    failure: 'http://localhost:3000/failure',
                    pending: 'http://localhost:3000/pending',
                },
                notification_url: 'https://tu-dominio-ngrok.ngrok-free.app/payments/webhook', // CAMBIAR POR URL REAL
            },
        });

        return { init_point: result.init_point };
    }

    async handleWebhook(body: any, query: any) {
        if (query.topic === 'payment' || query.type === 'payment') {
            const paymentId = query.id || query['data.id'];
            if (!paymentId) return;

            try {
                const paymentData = await this.payment.get({ id: paymentId });

                if (paymentData.status === 'approved') {
                    const userId = paymentData.external_reference;
                    const items = paymentData.additional_info?.items;

                    if (userId && items && items.length > 0) {
                        const packId = items[0].id;
                        let creditsToAdd = 0;
                        if (packId === 'pack_10') creditsToAdd = 10;
                        if (packId === 'pack_50') creditsToAdd = 50;

                        if (creditsToAdd > 0) {
                            await this.usersService.addCredits(userId, creditsToAdd);
                            console.log(`Added ${creditsToAdd} credits to user ${userId}`);
                        }
                    }
                }
            } catch (error) {
                console.error('Error processing webhook:', error);
            }
        }
    }
}
