import { Injectable, Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class SocketService {
  constructor(private authService: AuthService) {}

  private readonly connectedClients: Map<string, Socket> = new Map();

  async handleConnection(socket: Socket): Promise<void> {
    let authToken = socket.handshake.headers.authorization;

    if (!authToken) {
      socket.disconnect();
    } else {
      authToken = authToken?.split(' ')[1];
      const user =
        await this.authService.getUserFromAuthenticationToken(authToken);

      if (!user) {
        socket.disconnect();
      } else {
        const clientId = socket.id;
        Logger.log(`Client Connected: ${clientId}`);
        this.connectedClients.set(clientId, socket);

        socket.on('disconnect', () => {
          Logger.log(`Client Disconnected: ${clientId}`);
          this.connectedClients.delete(clientId);
        });
      }
    }
  }

  handleJoinRoom(socket: Socket): void {
    socket.join('myRoom'); // Join the specified room
    Logger.log(`Client ${socket.id} joined room: myRoom`);
  }

  handleLeaveRoom(socket: Socket): void {
    socket.leave('myRoom'); // Leave the specified room
    Logger.log(`Client ${socket.id} left room: myRoom`);
  }
}
