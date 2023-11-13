import { Schema, model } from 'mongoose';

const UserSchema = new Schema({
    id: {type: String},
    following: {type: Array, default: []},
    status: {type: Array, default: []},
    password: {type: String},
    profile: {
        name: {type: String},
        username: {type: String},
        avatar: {type: String},
        bio: {type: String},
    },
});

const User = model('User', UserSchema);
export default User;
