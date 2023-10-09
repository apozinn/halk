import { Controller, Get, Post, Req, Param } from '@nestjs/common';
import { AppService } from 'src/app.service';
import User from '../../../middleware/database/schemas/user';

@Controller('status')
export class StatusController {
	constructor(private readonly appService: AppService) {}

	@Post('/postStatus')
	async postStatus(@Req() req) {
		const user = req.body.user;
		const thisStatus = req.body.status;

		if(thisStatus) {
			await User.findOneAndUpdate(
				{ id: user.id },
				{$push: { status: thisStatus }},
			);
			return { post: true };
		} else return { error: true };
	}

	@Get('/getStatus/:reqUser')
	async getStatus(@Param() params) {
		const reqUser = await User.findOne({ id: params.reqUser });
		const reqStatus = [];
		if(reqUser) {
			const following = reqUser.following;
			await following.forEach(async(follow) => {
				const user = await User.findOne({ id: follow });
				if(user) {
					if(user.status.length) {
						reqStatus.push({ author: user, stories: user.status });
					}
				}
			});
		}
		return reqStatus;
	}
}
