import { Controller, Post, Req, Headers } from '@nestjs/common';
import { AppService } from 'src/app.service';
import User from '../../../middleware/database/schemas/user';

@Controller('user')
export class UserController {
  constructor(private readonly appService: AppService) {}

  @Post('/editUser')
  async editUser(@Req() req, @Headers() headers) {
    const acess = this.appService.verifyAcessToken(headers.acesstoken);
    if (!acess.allowedAccess) {
      return acess;
    }

    const userId = req.body.userId;
    const edits = req.body.edits;

    try {
      await edits.forEach(async (edit) => {
        const { editName, editValue } = edit;

        await User.findOneAndUpdate(
          { id: userId },
          {
            $set: { editName: editValue },
          },
        );
      });

      return { editSucess: true };
    } catch (err) {
      return {
        error: {
          code: 500,
          message: 'There was an error editing this user',
        },
      };
    }
  }

  @Post('/deleteUser')
  async deleteAccount(@Req() req, @Headers() headers) {
    const acess = this.appService.verifyAcessToken(headers.acesstoken);
    if (!acess.allowedAccess) {
      return acess;
    }

    const userId = req.body.userId;
    try {
      await User.findOneAndDelete({ id: userId });
      return { deleteSucess: true };
    } catch (err) {
      return {
        error: {
          code: 500,
          message: 'There was an error delete this user',
        },
      };
    }
  }

  @Post('/searchUser')
  async searchUser(@Req() req, @Headers() headers) {
    const acess = this.appService.verifyAcessToken(headers.acesstoken);
    if (!acess.allowedAccess) {
      return acess;
    }

    const search = req.body.search;

    const allUsers = await User.find({});
    const users = allUsers.filter(
      (u) =>
        u.id === search ||
        u.profile.name.includes(search) ||
        u.profile.username.includes(search),
    );

    return users.map((u) => this.appService.publicUserProps(u));
  }

  @Post('/verifyUsername')
  async verifyUsername(@Req() req, @Headers() headers) {
    const acess = this.appService.verifyAcessToken(headers.acesstoken);
    if (!acess.allowedAccess) {
      return acess;
    }

    const username = req.body.username;
    const verify = await User.findOne({ 'profile.username': username });

    if (verify) {
      return { exists: true };
    } else return { exists: false };
  }
}
