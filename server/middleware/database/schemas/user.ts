import { Schema, model } from 'mongoose';

const UserSchema = new Schema({
    id: {type: String},
    phone: {type: String},
    profile: {
        name: {type: String},
        username: {type: String},
        avatar: {type: String},
        bio: {type: String},
    },
    chats: {type: Array, default: []},
});

const User = model('User', UserSchema);
export default User;
