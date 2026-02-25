import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets'
import { Server } from 'ws'
interface ChatClient extends WebSocket {
  clientId: string
  username: string
  room: string
}

@WebSocketGateway({ path: 'chat' })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server

  private rooms = new Map<string, Set<ChatClient>>()

  handleConnection(client: ChatClient) {
    client.clientId = Math.random().toString(36).slice(2, 9)
    console.log(`Client connected: ${client.clientId}`)
  }

  handleDisconnect(client: ChatClient) {
    console.log(`Client disconnected: ${client.clientId}`)
    if (client.room) this.leaveRoom(client)
  }

  @SubscribeMessage('join_room')
  handleJoin(
    @ConnectedSocket() client: ChatClient,
    @MessageBody() data: { room: string; username: string },
  ) {
    client.username = data.username
    client.room = data.room

    if (!this.rooms.has(data.room)) {
      this.rooms.set(data.room, new Set())
    }

    this.rooms.get(data.room)!.add(client)

    this.sendTo(client, { type: 'room_joined', room: data.room })
    this.broadcastToRoom(data.room, {
      type: 'presence',
      count: this.rooms.get(data.room)!.size,
    })
    this.broadcastToRoom(
      data.room,
      { type: 'system_message', text: `${data.username} joined` },
      client,
    )
  }

  @SubscribeMessage('send_message')
  handleMessage(
    @ConnectedSocket() client: ChatClient,
    @MessageBody() data: { text: string },
  ) {
    const message = {
      id: Date.now(),
      username: client.username,
      text: data.text,
      timestamp: new Date().toISOString(),
    }

    this.broadcastToRoom(client.room, { type: 'new_message', message })
  }

  private sendTo(client: WebSocket, data: object) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data))
    }
  }

  @SubscribeMessage('typing')
  handleTyping(
    @ConnectedSocket() client: ChatClient,
    @MessageBody() data: { isTyping: boolean },
  ) {
    this.broadcastToRoom(
      client.room,
      { type: 'typing', username: client.username, isTyping: data.isTyping },
      client,
    )
  }

  private broadcastToRoom(room: string, data: object, exclude?: ChatClient) {
    const clients = this.rooms.get(room)
    if (!clients) return
    clients.forEach((client) => {
      if (client !== exclude) this.sendTo(client, data)
    })
  }

  private leaveRoom(client: ChatClient) {
    const room = this.rooms.get(client.room)
    if (!room) return
    room.delete(client)

    if (room.size === 0) {
      this.rooms.delete(client.room)
    }

    this.broadcastToRoom(client.room, {
      type: 'system_message',
      text: `${client.username} left`,
    })

    this.broadcastToRoom(client.room, {
      type: 'presence',
      count: room.size,
    })
  }
}
