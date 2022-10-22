"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
    id: { type: String },
    phone: { type: String },
    profile: {
        name: { type: String },
        username: { type: String },
        avatar: { type: String },
        bio: { type: String },
    },
    chats: { type: Array, default: [] },
});
const User = (0, mongoose_1.model)('User', UserSchema);
exports.default = User;
//# sourceMappingURL=user.js.map