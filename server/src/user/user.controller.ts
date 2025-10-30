import { Controller, Post, Body, BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { AppService } from 'src/app.service';
import User from '../../middleware/database/schemas/user';
import * as argon2 from 'argon2';

@Controller('user')
export class UserController {
  constructor(private readonly appService: AppService) {}

  @Post('/editProfile')
  async editProfile(@Body() body: any) {
    const { id, profile } = body;
    if (!id || !profile) throw new BadRequestException('Missing user id or profile data.');

    const { name, bio, avatar, username } = profile;
    const user = await User.findOne({ id });
    if (!user) throw new NotFoundException('User not found.');

    if (username && username !== user.profile.username) {
      const usernameExists = await User.findOne({ 'profile.username': username });
      if (usernameExists) throw new BadRequestException('Username is already taken.');
      user.profile.username = username;
    }

    if (name) user.profile.name = name;
    if (bio) user.profile.bio = bio;
    if (avatar) user.profile.avatar = avatar;

    await user.save();

    return {
      updated: true,
      user: {
        id: user.id,
        following: user.following,
        profile: user.profile,
      },
    };
  }

  @Post('/deleteAccount')
  async deleteAccount(@Body() body: any) {
    const { id, password } = body;
    if (!id || !password) throw new BadRequestException('Missing user id or password.');

    const user = await User.findOne({ id });
    if (!user) throw new NotFoundException('User not found.');

    const valid = await argon2.verify(user.password, password);
    if (!valid) throw new UnauthorizedException('Invalid password.');

    await User.deleteOne({ id });

    return {
      deleted: true,
      message: 'Account deleted successfully.',
    };
  }

  @Post('/searchUser')
  async searchUser(@Body() body: any) {
    const { userId, search } = body;
    if (!search || !search.trim().length) throw new BadRequestException('Search query is required.');

    const users = await User.find({
      id: { $ne: userId },
      $or: [
        { 'profile.username': { $regex: search, $options: 'i' } },
        { 'profile.name': { $regex: search, $options: 'i' } },
      ],
    }).lean();

    return users.map((u) => ({
      id: u.id,
      profile: u.profile,
      following: u.following,
    }));
  }

  @Post('/verifyUsername')
  async verifyUsername(@Body() body: any) {
    const { username } = body;
    if (!username || !username.trim().length) throw new BadRequestException('Username is required.');

    const exists = !!(await User.findOne({ 'profile.username': username }).lean());
    return { exists };
  }
}
