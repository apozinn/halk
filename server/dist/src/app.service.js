"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("../middleware/crypto");
const dotenv = require("dotenv");
dotenv.config();
let AppService = class AppService {
    verifyAcessToken(acessToken) {
        const secretphrase = process.env.API_SECRET_PHRASE;
        const key = process.env.API_KEY;
        const decryptedToken = (0, crypto_1.decrypt)(acessToken, key);
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
                message: 'Access is denied, only requests from the main application are accepted.',
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
};
AppService = __decorate([
    (0, common_1.Injectable)()
], AppService);
exports.AppService = AppService;
//# sourceMappingURL=app.service.js.map