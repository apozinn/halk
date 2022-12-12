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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const app_service_1 = require("../../app.service");
const user_1 = require("../../../middleware/database/schemas/user");
let UserController = class UserController {
    constructor(appService) {
        this.appService = appService;
    }
    async editUser(req, headers) {
        const acess = this.appService.verifyAcessToken(headers.acesstoken);
        if (!acess.allowedAccess) {
            return acess;
        }
        const userId = req.body.userId;
        const edits = req.body.edits;
        try {
            await edits.forEach(async (edit) => {
                const { editName, editValue } = edit;
                await user_1.default.findOneAndUpdate({ id: userId }, {
                    $set: { editName: editValue },
                });
            });
            return { editSucess: true };
        }
        catch (err) {
            return {
                error: {
                    code: 500,
                    message: 'There was an error editing this user',
                },
            };
        }
    }
    async deleteAccount(req, headers) {
        const acess = this.appService.verifyAcessToken(headers.acesstoken);
        if (!acess.allowedAccess) {
            return acess;
        }
        const userId = req.body.userId;
        try {
            await user_1.default.findOneAndDelete({ id: userId });
            return { deleteSucess: true };
        }
        catch (err) {
            return {
                error: {
                    code: 500,
                    message: 'There was an error delete this user',
                },
            };
        }
    }
    async searchUser(req, headers) {
        const acess = this.appService.verifyAcessToken(headers.acesstoken);
        if (!acess.allowedAccess) {
            return acess;
        }
        const search = req.body.search;
        const allUsers = await user_1.default.find({});
        const users = allUsers.filter((u) => u.id === search ||
            u.profile.name.includes(search) ||
            u.profile.username.includes(search));
        return users.map((u) => this.appService.publicUserProps(u));
    }
    async verifyUsername(req, headers) {
        const acess = this.appService.verifyAcessToken(headers.acesstoken);
        if (!acess.allowedAccess) {
            return acess;
        }
        const username = req.body.username;
        const verify = await user_1.default.findOne({ 'profile.username': username });
        if (verify) {
            return { exists: true };
        }
        else
            return { exists: false };
    }
};
__decorate([
    (0, common_1.Post)('/editUser'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Headers)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "editUser", null);
__decorate([
    (0, common_1.Post)('/deleteUser'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Headers)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "deleteAccount", null);
__decorate([
    (0, common_1.Post)('/searchUser'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Headers)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "searchUser", null);
__decorate([
    (0, common_1.Post)('/verifyUsername'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Headers)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "verifyUsername", null);
UserController = __decorate([
    (0, common_1.Controller)('user'),
    __metadata("design:paramtypes", [app_service_1.AppService])
], UserController);
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map