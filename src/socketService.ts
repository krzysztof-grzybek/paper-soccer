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
        game.isPlayerTurn = game.game.currentTurn === playerId;
        resolve(game);
      });
    });
  }

  public sendMove(trailHistory: number[]) {
    this.socket.emit('move', trailHistory);
  }

  public onOpponentMove(callback: (trail: number[]) => void) {
    this.socket.on('opponent-moved', (trail: number[]) => {
      callback(trail);
    });
  }
}

const socketService = new SocketService();
export { socketService };
