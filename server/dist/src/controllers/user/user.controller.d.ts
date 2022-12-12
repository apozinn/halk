import { AppService } from 'src/app.service';
export declare class UserController {
    private readonly appService;
    constructor(appService: AppService);
    editUser(req: any, headers: any): Promise<any>;
    deleteAccount(req: any, headers: any): Promise<any>;
    searchUser(req: any, headers: any): Promise<any>;
    verifyUsername(req: any, headers: any): Promise<any>;
}
