import { Controller, Get, Post, Req } from '@nestjs/common';
import User from '../middleware/database/schemas/user';

@Controller()
export class AppController {
  @Post('/createAccount')
  async createAccount(@Req() req) {
    const userAlreadyExists = await User.findOne({'profile.username': req.username });
    return {
        userExists: userAlreadyExists,
    }
  }
}