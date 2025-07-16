import * as signalR from '@microsoft/signalr';
import type { Room } from '../features/games/wouldyourather/multiplayer/api';
import { logger } from '../utils/logger';

class SignalRService {
  private hubConnection: signalR.HubConnection | null = null;

  public async initialize(token: string): Promise<void> {
    const apiUrl = import.meta.env.VITE_API_URL;
    if (!apiUrl) {
      throw new Error('VITE_API_URL environment variable is not defined');
    }

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${apiUrl}gameHub?token=${token}`, {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
      })
      .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
      .configureLogging(signalR.LogLevel.Information)
      .build();

    // Set up connection event handlers
    this.hubConnection.onreconnecting(error => {
      logger.log('Reconnecting to game hub...', error);
    });

    this.hubConnection.onreconnected(connectionId => {
      logger.log('Reconnected to game hub', connectionId);
    });

    this.hubConnection.onclose(error => {
      logger.log('Connection closed', error);
    });

    await this.hubConnection.start();
  }

  public async joinRoom(roomId: string): Promise<void> {
    if (!this.hubConnection) throw new Error('Hub connection not initialized');
    await this.hubConnection.invoke('JoinRoom', roomId);
  }

  public async leaveRoom(roomId: string): Promise<void> {
    if (!this.hubConnection) throw new Error('Hub connection not initialized');
    await this.hubConnection.invoke('LeaveRoom', roomId);
  }

  public onPlayerJoined(callback: (userId: string) => void): void {
    if (!this.hubConnection) throw new Error('Hub connection not initialized');
    this.hubConnection.on('PlayerJoined', callback);
  }

  public onQuestionUpdated(callback: (room: Room) => void): void {
    if (!this.hubConnection) throw new Error('Hub connection not initialized');
    this.hubConnection.on('QuestionUpdated', callback);
  }

  public onQuestionReset(callback: (room: Room) => void): void {
    if (!this.hubConnection) throw new Error('Hub connection not initialized');
    this.hubConnection.on('QuestionReset', callback);
  }

  public onAnswerSubmitted(callback: (data: { userId: string; answer: string; roomState: Room }) => void): void {
    if (!this.hubConnection) throw new Error('Hub connection not initialized');
    this.hubConnection.on('AnswerSubmitted', callback);
  }

  public clearListeners(): void {
    if (!this.hubConnection) return;
    this.hubConnection.off('PlayerJoined');
    this.hubConnection.off('AnswerSubmitted');
    this.hubConnection.off('QuestionUpdated');
    this.hubConnection.off('QuestionReset');
  }

  public dispose(): void {
    if (this.hubConnection) {
      this.clearListeners();
      this.hubConnection.stop();
      this.hubConnection = null;
    }
  }
}

export const signalRService = new SignalRService();