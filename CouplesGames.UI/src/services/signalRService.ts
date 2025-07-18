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

    const cleanApiUrl = apiUrl.replace(/\/$/, '');
    const url = `${cleanApiUrl}/gameHub?token=${token}`;

    try {
      this.hubConnection = new signalR.HubConnectionBuilder()
        .withUrl(url, {
          skipNegotiation: true,
          transport: signalR.HttpTransportType.WebSockets
        })
        .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
        .configureLogging(signalR.LogLevel.Warning)
        .build();

      this.hubConnection.onreconnecting(error => {
        logger.error(error || 'SignalR reconnecting', {
          component: 'SignalRService',
          action: 'onreconnecting'
        });
      });

      this.hubConnection.onreconnected(connectionId => {
        logger.log('SignalR reconnected', {
          component: 'SignalRService',
          action: 'onreconnected',
          connectionId
        });
      });

      this.hubConnection.onclose(error => {
        logger.error(error || 'SignalR connection closed', {
          component: 'SignalRService',
          action: 'onclose'
        });
      });

      await this.hubConnection.start();
      logger.log('SignalR connected', {
        component: 'SignalRService',
        action: 'initialize'
      });
    } catch (error) {
      logger.error(error instanceof Error ? error : String(error), {
        component: 'SignalRService',
        action: 'initialize'
      });
    }
  }

  public async joinRoom(roomId: string): Promise<void> {
    if (!this.hubConnection) throw new Error('Hub connection not initialized');
    try {
      await this.hubConnection.invoke('JoinRoom', roomId);
      logger.log(`Joined room: ${roomId}`, {
        component: 'SignalRService',
        action: 'joinRoom'
      });
    } catch (error) {
      logger.error(error instanceof Error ? error : String(error), {
        component: 'SignalRService',
        action: 'joinRoom'
      });
    }
  }

  public async leaveRoom(roomId: string): Promise<void> {
    if (!this.hubConnection) throw new Error('Hub connection not initialized');
    try {
      await this.hubConnection.invoke('LeaveRoom', roomId);
      logger.log(`Left room: ${roomId}`, {
        component: 'SignalRService',
        action: 'leaveRoom'
      });
    } catch (error) {
      logger.error(error instanceof Error ? error : String(error), {
        component: 'SignalRService',
        action: 'leaveRoom'
      });
    }
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

  public async dispose(): Promise<void> {
    if (this.hubConnection) {
      try {
        this.clearListeners();
        await this.hubConnection.stop();
        logger.log('SignalR disconnected', {
          component: 'SignalRService',
          action: 'dispose'
        });
      } catch (error) {
        logger.error(error instanceof Error ? error : String(error), {
          component: 'SignalRService',
          action: 'dispose'
        });
      } finally {
        this.hubConnection = null;
      }
    }
  }
}

export const signalRService = new SignalRService();
