import { Schema, model } from 'mongoose';

const UserSchema = new Schema({
    id: {type: String},
    phone: {type: String},
    chats: {type: Array, default: []},
    following: {type: Array, default: []},
    status: {type: Array, default: []},
    profile: {
        name: {type: String},
        username: {type: String},
        avatar: {type: String},
        bio: {type: String},
    },
});

const User = model('User', UserSchema);
export default User;
