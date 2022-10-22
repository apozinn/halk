import { Controller } from '@nestjs/common';
import { AppService } from 'src/app.service';

@Controller('chat')
export class ChatController {
    constructor(private readonly appService: AppService) {}
}
