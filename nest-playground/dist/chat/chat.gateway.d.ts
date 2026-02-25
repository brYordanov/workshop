import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server } from 'ws';
interface ChatClient extends WebSocket {
    clientId: string;
    username: string;
    room: string;
}
export declare class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    server: Server;
    private rooms;
    handleConnection(client: ChatClient): void;
    handleDisconnect(client: ChatClient): void;
    handleJoin(client: ChatClient, data: {
        room: string;
        username: string;
    }): void;
    handleMessage(client: ChatClient, data: {
        text: string;
    }): void;
    private sendTo;
    handleTyping(client: ChatClient, data: {
        isTyping: boolean;
    }): void;
    private broadcastToRoom;
    private leaveRoom;
}
export {};
