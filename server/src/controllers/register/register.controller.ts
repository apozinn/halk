import { Controller, Post, Req, Headers } from '@nestjs/common';
import { AppService } from 'src/app.service';
import User from '../../../middleware/database/schemas/user';
import * as randomString from 'randomstring';
import * as twilio from 'twilio';
import * as dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import CodeCache from '../../../middleware/cache/code';
dotenv.config();

@Controller('register')
export class RegisterController {
  constructor(private readonly appService: AppService) {}

  async sendSms(phone: string, code: string) {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const twilio_phone = process.env.TWILIO_PHONE;

    const client = twilio(accountSid, authToken);
    const message = await client.messages.create({
      body: `Here is your halk verification code: ${code}`,
      from: twilio_phone,
      to: phone,
    });

    return message.errorCode ? false : true;
  }

  @Post('/createUser')
  async CreateUser(@Req() req, @Headers() headers) {
    const acess = this.appService.verifyAcessToken(headers.acesstoken);
    if (!acess.allowedAccess) {
      return acess;
    }

    const user = req.body.user;
    const verification = await User.findOne({ id: user.id });

    if (verification) {
      return {
        err: {
          code: 406,
          message: 'This user is alredy created',
        },
      };
    }

    await User.create(JSON.parse(JSON.stringify(user)));

    return {
      created: true,
    };
  }

  @Post('/sendSms')
  async sendCode(@Req() req, @Headers() headers) {
    const acess = this.appService.verifyAcessToken(headers.acesstoken);
    if (!acess.allowedAccess) {
      return acess;
    }

    const phone = req.body.phone;

    const code = randomString.generate({
      length: 6,
      charset: 'numeric',
    });
    const id = uuidv4();
    CodeCache({ id, code, phone });
    const codeSend = await this.sendSms(phone, code);
    return { phone, id, codeSend };
  }

  @Post('/verifyCode')
  async verifyCode(@Req() req, @Headers() headers) {
    const acess = this.appService.verifyAcessToken(headers.acesstoken);
    if (!acess.allowedAccess) {
      return acess;
    }

    const id = req.body.id;
    const code = req.body.code;
    const cache = CodeCache();
    const thisCode = cache.codes.filter(
      (c) => c.id === id && c.code === code,
    )[0];

    if (thisCode) {
      const existingAccount = await User.findOne({ phone: thisCode.phone });
      if (existingAccount) {
        const user = existingAccount;
        const chats = existingAccount.chats;
        delete user.chats;
        delete user.status;
        delete user._id;
        delete user.__v;
        return { user, chats, verify: true, existingAccount: true };
      } else {
        return { verify: true };
      }
    } else return { invalidCode: true };
  }
}
