import { Controller, Post, Req } from '@nestjs/common';
import { AppService } from 'src/app.service';
import User from '../../../middleware/database/schemas/user';
import { v4 as uuidv4 } from 'uuid';

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

  @Post('/login')
  async login(@Req() req) {
    const username:string = req.body.username;
    const password:string = req.body.password;
    const user = await User.findOne({ 'profile.username': username });

    const userObject = {
      id: user.id,
      following: user.following,
      profile: user.profile,
    };

    if(user) {
      if(user.password == password) {
        return {
          logged: true,
          user: userObject,
        };
      } else {
        return {
          logged: false,
          reason: "Invalid password",
        };
      }
    } else {
      return {
        logged: false,
        reason: "User don't finded",
      };
    }
  }

  @Post('/createAccount')
  async createAccount(@Req() req) {
    const username: string = req.body.username;
    const password: string = req.body.password;
    const userAlreadyExists = await User.findOne({'profile.username': username });

    if(userAlreadyExists) {
      return { userAlreadyExists };
    } else {
      const newUser = {
        id: uuidv4(),
        password: password,
        profile: {
          username
        },
      };

      const user = await User.create(newUser);
      const userObject = {
        id: user.id,
        following: user.following,
        profile: user.profile,
      };

      if(user) {
        return {
          created: true,
          user: userObject,
        };
      } else {
        return {
          created: false,
        };
      }
    }
  }
}
