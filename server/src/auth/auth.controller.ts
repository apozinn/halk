import { Controller, Post, Req } from '@nestjs/common';
import User from '../../middleware/database/schemas/user';
import { v4 as uuidv4 } from 'uuid';
import * as argon2 from "argon2";

@Controller('auth')
export class AuthController {
    @Post('/signIn')
    async login(@Req() req) {
        try {
            const username: string = req.body.username;
            const password: string = req.body.password;

            const user = await User.findOne({ 'profile.username': username });

            if (user) {
                const fetchedUserObject = {
                    id: user.id,
                    following: user.following,
                    profile: user.profile,
                };

                if (await argon2.verify(user.password, password)) {
                    return {
                        logged: true,
                        user: fetchedUserObject,
                    };
                } else {
                    return {
                        logged: false,
                        reason: "Invalid password.",
                    };
                }
            } else {
                return {
                    logged: false,
                    reason: "Could not find a user with this username.",
                };
            }
        } catch (err) {
            return {
                logged: false,
                reason: "There was an error executing the signIn process."
            }
        }
    }

    @Post('/signUp')
    async createAccount(@Req() req) {
        try {
            const username: string = req.body.username;
            const password: string = req.body.password;

            const userAlreadyExists = await User.findOne({ 'profile.username': username });

            if (userAlreadyExists) {
                return {
                    created: false,
                    reason: "There is already a user with this username.",
                }
            } else {
                const password_hash = await argon2.hash(password, { raw: false });

                const newUserObject = {
                    id: uuidv4(),
                    password: password_hash,
                    profile: {
                        username
                    },
                };

                const user = await User.create(newUserObject);

                if (user) {
                    const userObject = {
                        id: user.id,
                        following: user.following,
                        profile: user.profile,
                    };
                    return {
                        created: true,
                        user: userObject,
                    };
                } else {
                    return {
                        created: false,
                        reason: "An error occurred while creating the account"
                    };
                }
            }
        } catch (err) {
            return {
                created: false,
                reason: "There was an error executing the signUp process."
            }
        }
    }
}
