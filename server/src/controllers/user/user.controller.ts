import { Controller, Post, Req } from '@nestjs/common';
import { AppService } from 'src/app.service';
import User from '../../../middleware/database/schemas/user';

@Controller('user')
export class UserController {
  constructor(private readonly appService: AppService) {}

  @Post('/editProfile')
  async editProfile(@Req() req) {}

  @Post('/deleteAccount')
  async deleteAccount(@Req() req) {}

  @Post('/searchUser')
  async searchUser(@Req() req) {
    const search = req.body.search;

    const allUsers = await User.find({});
    const user = allUsers.filter(
      (u) =>
        u.id === search ||
        u.profile.name.includes(search) ||
        u.profile.username.includes(search),
    );

    return user;
  }

  @Post('/verifyUsername')
  async verifyUsername(@Req() req) {
    const username = req.body.username;
    const verify = await User.findOne({ 'profile.username': username });

    if (verify) {
      return { exists: true };
    } else return { exists: false };
  }
}
