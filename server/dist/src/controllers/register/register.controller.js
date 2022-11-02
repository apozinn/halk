"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterController = void 0;
const common_1 = require("@nestjs/common");
const app_service_1 = require("../../app.service");
const user_1 = require("../../../middleware/database/schemas/user");
const randomString = require("randomstring");
const twilio = require("twilio");
const dotenv = require("dotenv");
const uuid_1 = require("uuid");
const code_1 = require("../../../middleware/cache/code");
dotenv.config();
let RegisterController = class RegisterController {
    constructor(appService) {
        this.appService = appService;
    }
    async sendSms(phone, code) {
        const accountSid = process.env.TWILIO_ACCOUNT_SID;
        const authToken = process.env.TWILIO_AUTH_TOKEN;
        const twilio_phone = process.env.TWILIO_PHONE;
        const client = twilio(accountSid, authToken);
        const message = await client.messages.create({
            body: `Halk verification code: ${code}`,
            from: twilio_phone,
            to: phone,
        });
        return message.errorCode ? false : true;
    }
    async CreateUser(req) {
        const user = req.body.user;
        const verification = await user_1.default.findOne({ id: user.id });
        if (verification) {
            return {
                err: {
                    code: 406,
                    message: 'This user is alredy created',
                },
            };
        }
        await user_1.default.create(JSON.parse(JSON.stringify(user)));
        return {
            created: true,
        };
    }
    async sendCode(req) {
        const phone = req.body.phone;
        const code = randomString.generate({
            length: 6,
            charset: 'numeric',
        });
        const id = (0, uuid_1.v4)();
        (0, code_1.default)({ id, code, phone });
        const codeSend = await this.sendSms(phone, code);
        return { phone, id, codeSend };
    }
    async verifyCode(req) {
        const id = req.body.id;
        const code = req.body.code;
        const cache = (0, code_1.default)();
        const thisCode = cache.codes.filter((c) => c.id === id && c.code === code)[0];
        if (thisCode) {
            const existingAccount = await user_1.default.findOne({ phone: thisCode.phone });
            if (existingAccount) {
                const user = existingAccount;
                const chats = existingAccount.chats;
                delete user.chats;
                delete user.status;
                return { user, chats, verify: true };
            }
            else {
                return { verify: true };
            }
        }
        else
            return { invalidCode: true };
    }
};
__decorate([
    (0, common_1.Post)('/createUser'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RegisterController.prototype, "CreateUser", null);
__decorate([
    (0, common_1.Post)('/sendSms'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RegisterController.prototype, "sendCode", null);
__decorate([
    (0, common_1.Post)('/verifyCode'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RegisterController.prototype, "verifyCode", null);
RegisterController = __decorate([
    (0, common_1.Controller)('register'),
    __metadata("design:paramtypes", [app_service_1.AppService])
], RegisterController);
exports.RegisterController = RegisterController;
//# sourceMappingURL=register.controller.js.map