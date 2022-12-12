import { AppService } from 'src/app.service';
export declare class RegisterController {
    private readonly appService;
    constructor(appService: AppService);
    sendSms(phone: string, code: string): Promise<boolean>;
    CreateUser(req: any, headers: any): Promise<any>;
    sendCode(req: any, headers: any): Promise<any>;
    verifyCode(req: any, headers: any): Promise<any>;
}
