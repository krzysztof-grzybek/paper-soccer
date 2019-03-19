import io from 'socket.io-client';
import { config } from './config';

const URL = config.serverBaseUrl;

type Game = any; // TODO: make common interface between fe and be

type moveType = 'progress' | 'win' | 'loss';

class SocketService {
  private socket: SocketIOClient.Socket;

  constructor() {
    this.socket = io(URL, { transports: ['websocket', 'polling', 'flashsocket']});
  }

  public init(contextId: string, playerId: string): Promise<Game> {
    this.socket.emit('init', { contextId, playerId });

    return new Promise((resolve) => {
      this.socket.once('game-loaded', (game: Game) => {
        game.isPlayerTurn = game.game.currentTurn === playerId;
        game.isFirstPlayer = game.player1 === playerId;
        resolve(game);
      });
    });
  }

  public sendMove(moveData: { type: moveType, history: number[]}) {
    this.socket.emit('move', moveData);
  }

  public onOpponentMove(callback: (data: { type: moveType, history: number[]}) => void) {
    this.socket.on('opponent-moved', (moveData: { type: moveType, history: number[]}) => {
      callback(moveData);
    });
  }

  public onOpponentConnect(callback: (playerId: string) => void) {
    this.socket.on('opponent-connected', (playerId: string) => {
      callback(playerId);
    });
  }
}

const socketService = new SocketService();
export { socketService };
