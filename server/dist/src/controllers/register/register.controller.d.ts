import { AppService } from 'src/app.service';
export declare class RegisterController {
    private readonly appService;
    constructor(appService: AppService);
    sendSms(phone: string, code: string): Promise<boolean>;
    CreateUser(req: any): Promise<{
        err: {
            code: number;
            message: string;
        };
        created?: undefined;
    } | {
        created: boolean;
        err?: undefined;
    }>;
    sendCode(req: any): Promise<{
        phone: any;
        id: string;
        codeSend: boolean;
    }>;
    verifyCode(req: any): Promise<{
        user: import("mongoose").Document<unknown, any, {
            chats: any[];
            following: any[];
            status: any[];
            id?: string;
            phone?: string;
            profile?: {
                name?: string;
                username?: string;
                avatar?: string;
                bio?: string;
            };
        }> & {
            chats: any[];
            following: any[];
            status: any[];
            id?: string;
            phone?: string;
            profile?: {
                name?: string;
                username?: string;
                avatar?: string;
                bio?: string;
            };
        } & {
            _id: import("mongoose").Types.ObjectId;
        };
        chats: any[];
        verify: boolean;
        invalidCode?: undefined;
    } | {
        verify: boolean;
        user?: undefined;
        chats?: undefined;
        invalidCode?: undefined;
    } | {
        invalidCode: boolean;
        user?: undefined;
        chats?: undefined;
        verify?: undefined;
    }>;
}
