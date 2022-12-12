import { Injectable } from '@nestjs/common';
import { decrypt, encrypt } from '../middleware/crypto';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class AppService {
  verifyAcessToken(acessToken): any {
    const secretphrase = process.env.API_SECRET_PHRASE;
    const key = process.env.API_KEY;
    const decryptedToken = decrypt(acessToken, key);

    if (decryptedToken) {
      if (decryptedToken === secretphrase) {
        return {
          allowedAccess: true,
        };
      }
    }

    return {
      error: {
        code: 403,
        message:
          'Access is denied, only requests from the main application are accepted.',
      },
    };
  }

  publicUserProps(user) {
    return {
      id: user.id,
      phone: user.phone,
      createdAt: user.createdAt,
      profile: user.profile,
    };
  }
}
