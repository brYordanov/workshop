"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const ws_1 = require("ws");
let ChatGateway = class ChatGateway {
    server;
    rooms = new Map();
    handleConnection(client) {
        client.clientId = Math.random().toString(36).slice(2, 9);
        console.log(`Client connected: ${client.clientId}`);
    }
    handleDisconnect(client) {
        console.log(`Client disconnected: ${client.clientId}`);
        if (client.room)
            this.leaveRoom(client);
    }
    handleJoin(client, data) {
        client.username = data.username;
        client.room = data.room;
        if (!this.rooms.has(data.room)) {
            this.rooms.set(data.room, new Set());
        }
        this.rooms.get(data.room).add(client);
        this.sendTo(client, { type: 'room_joined', room: data.room });
        this.broadcastToRoom(data.room, {
            type: 'presence',
            count: this.rooms.get(data.room).size,
        });
        this.broadcastToRoom(data.room, { type: 'system_message', text: `${data.username} joined` }, client);
    }
    handleMessage(client, data) {
        const message = {
            id: Date.now(),
            username: client.username,
            text: data.text,
            timestamp: new Date().toISOString(),
        };
        this.broadcastToRoom(client.room, { type: 'new_message', message });
    }
    sendTo(client, data) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    }
    handleTyping(client, data) {
        this.broadcastToRoom(client.room, { type: 'typing', username: client.username, isTyping: data.isTyping }, client);
    }
    broadcastToRoom(room, data, exclude) {
        const clients = this.rooms.get(room);
        if (!clients)
            return;
        clients.forEach((client) => {
            if (client !== exclude)
                this.sendTo(client, data);
        });
    }
    leaveRoom(client) {
        const room = this.rooms.get(client.room);
        if (!room)
            return;
        room.delete(client);
        if (room.size === 0) {
            this.rooms.delete(client.room);
        }
        this.broadcastToRoom(client.room, {
            type: 'system_message',
            text: `${client.username} left`,
        });
        this.broadcastToRoom(client.room, {
            type: 'presence',
            count: room.size,
        });
    }
};
exports.ChatGateway = ChatGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", ws_1.Server)
], ChatGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('join_room'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "handleJoin", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('send_message'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "handleMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('typing'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "handleTyping", null);
exports.ChatGateway = ChatGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({ path: 'chat' })
], ChatGateway);
//# sourceMappingURL=chat.gateway.js.map