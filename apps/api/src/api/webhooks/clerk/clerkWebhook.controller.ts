import type { WebhookEvent } from '@clerk/backend';
import {
  BadRequestException,
  Controller,
  Headers,
  HttpException,
  HttpStatus,
  Post,
  type RawBodyRequest,
  Req,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request } from 'express';
import { Public } from 'src/api/auth/decorators';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import { Webhook } from 'svix';

@Controller('webhooks/clerk')
export class ClerkWebhookController {
  private readonly webhookSecret: string;

  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {
    this.webhookSecret = this.configService.getOrThrow<string>(
      'CLERK_WEBHOOK_SIGNING_SECRET',
    );
  }

  @Public()
  @Post()
  async handleWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('svix-id') svixId: string,
    @Headers('svix-timestamp') svixTimestamp: string,
    @Headers('svix-signature') svixSignature: string,
  ) {
    if (!svixId || !svixTimestamp || !svixSignature) {
      throw new BadRequestException('Missing svix headers');
    }

    const payload = req.rawBody;

    if (!payload) {
      throw new BadRequestException('Missing raw body payload');
    }

    const wh = new Webhook(this.webhookSecret);
    let evnt: WebhookEvent;

    try {
      evnt = wh.verify(payload, {
        'svix-id': svixId,
        'svix-timestamp': svixTimestamp,
        'svix-signature': svixSignature,
      }) as WebhookEvent;
    } catch (err) {
      throw new BadRequestException('Invalid webhook signature');
    }

    const eventType = evnt.type;
    try {
      switch (eventType) {
        case 'user.created':
        case 'user.updated':
          {
            const {
              id,
              first_name,
              last_name,
              email_addresses,
              image_url,
              username,
            } = evnt.data;

            const primaryEmail = email_addresses[0].email_address;

            const userObj = {
              email: primaryEmail,
              imageUrl: image_url,
              // username, firstname, lastname cannot be empty because in clerk dashboard they are required fields
              firstName: first_name!,
              lastName: last_name!,
              username: username!,
            };

            await this.prismaService.user.upsert({
              create: {
                clerkId: id,
                ...userObj,
              },
              where: {
                clerkId: id,
              },
              update: userObj,
            });
          }
          break;
        case 'user.deleted':
          const { id } = evnt.data;
          await this.prismaService.user.delete({ where: { clerkId: id } });

          break;
      }
    } catch (error) {
      throw new HttpException(
        'Failed to process webhook',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return { received: true };
  }
}
