import { Controller, Post, Req, Body, BadRequestException } from '@nestjs/common';
import User from '../../middleware/database/schemas/user';
import { v4 as uuidv4 } from 'uuid';
import * as argon2 from 'argon2';

@Controller('auth')
export class AuthController {

  @Post('/signIn')
  async signIn(@Body() body: any) {
    const { username, password } = body;

    if (!username || !password) {
      throw new BadRequestException('Username and password are required.');
    }

    const user = await User.findOne({ 'profile.username': username });

    if (!user) {
      return { logged: false, reason: 'Could not find a user with this username.' };
    }

    const isPasswordValid = await argon2.verify(user.password, password);
    if (!isPasswordValid) {
      return { logged: false, reason: 'Invalid password.' };
    }

    return {
      logged: true,
      user: {
        id: user.id,
        following: user.following,
        profile: user.profile,
      },
    };
  }

  @Post('/signUp')
  async signUp(@Body() body: any) {
    const { username, password } = body;

    if (!username || !password) {
      throw new BadRequestException('Username and password are required.');
    }

    const userExists = await User.findOne({ 'profile.username': username });
    if (userExists) {
      return { created: false, reason: 'There is already a user with this username.' };
    }

    const passwordHash = await argon2.hash(password);
    const newUser = await User.create({
      id: uuidv4(),
      password: passwordHash,
      profile: { username },
    });

    return {
      created: true,
      user: {
        id: newUser.id,
        following: newUser.following,
        profile: newUser.profile,
      },
    };
  }

  @Post('/createProfile')
  async createProfile(@Body() body: any) {
    const { id, profile } = body;
    if (!id || !profile) {
      throw new BadRequestException('User ID and profile data are required.');
    }

    const user = await User.findOne({ id });
    if (!user) {
      return { created: false, reason: 'User not found.' };
    }

    user.profile = {
      ...user.profile,
      name: profile.name ?? user.profile.name,
      bio: profile.bio ?? user.profile.bio,
      avatar: profile.avatar ?? user.profile.avatar,
    };

    await user.save();

    return {
      created: true,
      user: {
        id: user.id,
        following: user.following,
        profile: user.profile,
      },
    };
  }
}
