import {
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { SocketService } from './socket.service';
import { Logger } from '@nestjs/common';

@WebSocketGateway()
export class SocketGateway implements OnGatewayConnection, OnGatewayInit {
  @WebSocketServer()
  private server: Socket;

  constructor(private readonly socketService: SocketService) {}

  afterInit(server: Socket): void {
    Logger.log('Socket Gateway initialized');
  }

  handleConnection(socket: Socket): void {
    this.socketService.handleConnection(socket);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(socket: Socket): void {
    this.socketService.handleJoinRoom(socket);
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(socket: Socket): void {
    this.socketService.handleLeaveRoom(socket);
  }

  @SubscribeMessage('messageToRoom')
  handleMessageToRoom(@MessageBody() data: string, client?: Socket): void {
    this.server.to('myRoom').emit('messageToRoom', data); // Broadcast message to the myRoom
  }
}
