import { Controller, Get, Post, Req, Param, Headers } from '@nestjs/common';
import { AppService } from 'src/app.service';
import User from '../../../middleware/database/schemas/user';

@Controller('status')
export class StatusController {
	constructor(private readonly appService: AppService) {}

	@Post('/postStatus')
	async postStatus(@Req() req, @Headers() headers) {
		const acess = this.appService.verifyAcessToken(headers.acesstoken);
		if (!acess.allowedAccess) {
			return acess;
		}
	}

	@Get('/getStatus/:reqUser')
	async getStatus(@Param() params, @Headers() headers) {
		const acess = this.appService.verifyAcessToken(headers.acesstoken);
		if (!acess.allowedAccess) {
			return acess;
		}
	}
}
