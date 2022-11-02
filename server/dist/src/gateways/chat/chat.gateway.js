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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatGateway = void 0;
const common_1 = require("@nestjs/common");
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
let ChatGateway = class ChatGateway {
    constructor() {
        this.logger = new common_1.Logger('ChatGateway');
        this.connectedUsers = [];
        this.activeRooms = [];
        this.bufferMessages = [];
    }
    async sendEvent(event, user) { }
    joinRoom(client, payload) {
        var _a;
        client.join(payload.room);
        const otherUser = (_a = this.connectedUsers) === null || _a === void 0 ? void 0 : _a.filter((u) => u.userId === payload.otherUser)[0];
        if (otherUser)
            this.server
                .to(otherUser.socketId)
                .emit('readMessage', { chat: payload.room, readUser: payload.userId });
    }
    handleMessage(client, payload) {
        var _a, _b, _c, _d, _e;
        const userId = payload.toUser;
        const userReceive = (_a = this.connectedUsers) === null || _a === void 0 ? void 0 : _a.filter((u) => u.userId === userId)[0];
        if (userReceive) {
            this.server
                .to(userReceive.socketId)
                .emit('receiveMessage', payload.message);
        }
        else {
            this.server.to(payload.room).emit('receiveMessage', payload.message);
        }
        if ((_b = this.connectedUsers) === null || _b === void 0 ? void 0 : _b.some((u) => u.userId === userId)) {
            (_c = this.bufferMessages) === null || _c === void 0 ? void 0 : _c.push(payload);
        }
        if (payload.newChat) {
            const newChat = {
                id: payload.room,
                user: payload.message.author,
                messages: [],
                key: payload.key,
            };
            newChat.messages.push(payload.message);
            if ((_d = this.connectedUsers) === null || _d === void 0 ? void 0 : _d.some((u) => u.userId === userId)) {
                this.server.to(userReceive.socketId).emit('newChat', { newChat });
            }
            else {
                (_e = this.bufferMessages) === null || _e === void 0 ? void 0 : _e.push(newChat);
            }
        }
    }
    newChat(client, payload) {
        const chat = payload.chat;
        this.server.emit('roomCreated', chat);
    }
    getOnlineUsers(client, payload) {
        var _a;
        const isOnline = ((_a = this.connectedUsers) === null || _a === void 0 ? void 0 : _a.filter((u) => u.userId === payload.userId)[0])
            ? true
            : false;
        client.emit('receiveIfUserIsOnline', isOnline);
    }
    userTyping(client, payload) {
        this.server.to(payload.room).emit('userTyping', payload);
    }
    readMessage(client, payload) {
        if (!payload.otherUser)
            return;
        this.server
            .to(payload.otherUser)
            .emit('readMessage', { chat: payload.chat, user: payload.otherUser });
    }
    afterInit(server) {
        this.logger.log('Init');
    }
    handleConnection(client) {
        var _a, _b, _c, _d;
        const userId = client.handshake.auth.userId;
        const { id } = client;
        const exitisUserConnection = (_a = this.connectedUsers) === null || _a === void 0 ? void 0 : _a.filter((u) => u.userId === userId)[0];
        if (exitisUserConnection) {
            exitisUserConnection.socketId = id;
        }
        else {
            (_b = this.connectedUsers) === null || _b === void 0 ? void 0 : _b.push({
                socketId: id,
                userId: userId,
            });
        }
        if ((_c = this.bufferMessages) === null || _c === void 0 ? void 0 : _c.some((m) => m.toUser === userId)) {
            (_d = this.bufferMessages) === null || _d === void 0 ? void 0 : _d.filter((m) => m.toUser === userId).map((m) => {
                if (m.key) {
                    this.server.to(id).emit('newChat', { newChat: m });
                }
                else {
                    this.server.to(id).emit('receiveMessage', m);
                }
            });
        }
    }
    handleDisconnect(client) {
        var _a;
        this.connectedUsers = (_a = this.connectedUsers) === null || _a === void 0 ? void 0 : _a.filter((u) => u.socketId !== client.id);
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], ChatGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('joinRoom'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "joinRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('sendMessage'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "handleMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('newChat'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "newChat", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('verifyIfUserIsOnline'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "getOnlineUsers", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('userTyping'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "userTyping", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('readMessage'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "readMessage", null);
ChatGateway = __decorate([
    (0, websockets_1.WebSocketGateway)()
], ChatGateway);
exports.ChatGateway = ChatGateway;
//# sourceMappingURL=chat.gateway.js.map