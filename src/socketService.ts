import io from 'socket.io-client';
import { config } from './config';

const URL = config.serverBaseUrl;

type Game = any; // TODO: make common interface between fe and be

class SocketService {
  private socket: SocketIOClient.Socket;

  constructor() {
    this.socket = io(URL);
  }

  public init(contextId: string, playerId: string): Promise<Game> {
    this.socket.emit('init', { contextId, playerId });

    return new Promise((resolve) => {
      this.socket.once('game-loaded', (game: Game) => {
        resolve(game);
      });
    });
  }

  // public sendMove() {}

  // public onOponentMove() {
  //
  // }
}

const socketService = new SocketService();
export { socketService };
