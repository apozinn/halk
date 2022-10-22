import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
export declare class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    server: Server;
    private logger;
    private connectedUsers;
    private activeRooms;
    private bufferMessages;
    private sendEvent;
    joinRoom(client: Socket, payload: any): void;
    handleMessage(client: Socket, payload: any): void;
    newChat(client: Socket, payload: any): void;
    getOnlineUsers(client: Socket, payload: any): void;
    userTyping(client: Socket, payload: any): void;
    afterInit(server: Server): void;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
}
