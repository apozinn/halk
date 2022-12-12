"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
    id: { type: String },
    phone: { type: String },
    chats: { type: Array, default: [] },
    following: { type: Array, default: [] },
    status: { type: Array, default: [] },
    createdAt: { type: Date, default: new Date().getTime() },
    profile: {
        name: { type: String },
        username: { type: String },
        avatar: { type: String },
        banner: { type: String },
        bio: { type: String },
    },
});
const User = (0, mongoose_1.model)('User', UserSchema);
exports.default = User;
//# sourceMappingURL=user.js.map