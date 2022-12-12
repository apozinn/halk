import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PayloadMessage } from '../../../types';
import { AppService } from 'src/app.service';
export declare class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private readonly appService;
    constructor(appService: AppService);
    server: Server;
    private logger;
    sendMessage(client: Socket, payload: PayloadMessage): Promise<void>;
    pullOnlineUsers(client: Socket, payload: any): Promise<void>;
    readMessage(client: Socket, payload: any): Promise<void>;
    afterInit(server: Server): void;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
}
