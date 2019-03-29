import io from 'socket.io-client';
import { config } from './config';

const URL = config.serverBaseUrl;

type player = string;

interface Game {
  initiator: player;
  currentTurn: player;
  state: 'progress' | 'end';
  winner: player | null;
  challengedAgainBy: player | null;
  trailState: number[];
}

interface Context {
  contextId: string;
  player1: player;
  player2: player | null;
  game: Game;
}

interface PlayerContext extends Context {
  isPlayerTurn: boolean;
  isFirstPlayer: boolean;
}

type moveType = 'progress' | 'win' | 'loss';

class SocketService {
  private socket: SocketIOClient.Socket;
  private playerId!: string;

  constructor() {
    this.socket = io(URL, { transports: ['websocket', 'polling', 'flashsocket']});
  }

  public init(contextId: string, playerId: string): Promise<PlayerContext> {
    this.playerId = playerId;
    this.socket.emit('init', { contextId, playerId });

    return new Promise((resolve) => {
      this.socket.once('game-loaded', (context: Context) => {
        resolve({
          ...context,
          isPlayerTurn: context.game.currentTurn === playerId,
          isFirstPlayer: context.player1 === playerId,
        });
      });
    });
  }

  public sendMove(moveData: { type: moveType, trailState: number[]}) {
    this.socket.emit('move', moveData);
  }

  public onOpponentMove(callback: (data: { type: moveType, trailState: number[]}) => void) {
    this.socket.on('opponent-moved', (moveData: { type: moveType, trailState: number[]}) => {
      callback(moveData);
    });
  }

  public onOpponentConnect(callback: (playerId: player) => void) {
    this.socket.on('opponent-connected', (playerId: player) => {
      callback(playerId);
    });
  }

  public challengeOpponent() {
    this.socket.emit('challenge');
  }

  public startNewGame(callback: (context: PlayerContext) => void) {
    this.socket.emit('start-new-game', (context: Context) => {
      callback({
        ...context,
        isPlayerTurn: context.game.currentTurn === this.playerId,
        isFirstPlayer: context.player1 === this.playerId,
      });
    });
  }

  public onChallenge(callback: () => void) {
    this.socket.on('challenged', () => {
      callback();
    });
  }

  public onNewGameStarted(callback: (context: PlayerContext) => void) {
    this.socket.on('new-game-started', (context: Context) => {
      callback({
        ...context,
        isPlayerTurn: context.game.currentTurn === this.playerId,
        isFirstPlayer: context.player1 === this.playerId,
      });
    });
  }
}

const socketService = new SocketService();
export { Context, Game, PlayerContext, player, socketService };
