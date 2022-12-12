import { Schema, model } from 'mongoose';

const UserSchema = new Schema({
    id: {type: String},
    phone: {type: String},
    chats: {type: Array, default: []},
    following: {type: Array, default: []},
    status: {type: Array, default: []},
    createdAt: {type: Date, default: new Date().getTime()},
    profile: {
        name: {type: String},
        username: {type: String},
        avatar: {type: String},
        banner: {type: String},
        bio: {type: String},
    },
});

const User = model('User', UserSchema);
export default User;
