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
        code: string;
        id: string;
        codeSend: boolean;
    }>;
    verifyCode(req: any): Promise<{
        verify: boolean;
    }>;
}
