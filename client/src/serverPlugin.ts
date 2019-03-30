import io from 'socket.io-client';
import { config } from './config';
import { Context, moveType, player, PlayerContext } from './model';

const URL = config.serverBaseUrl;

class Server extends Phaser.Plugins.BasePlugin {
  private socket: SocketIOClient.Socket;

  constructor(pluginManager: Phaser.Plugins.PluginManager) {
    super(pluginManager);
    this.socket = io(URL, { transports: ['websocket', 'polling', 'flashsocket']});
  }

  public initSession(contextId: string, playerId: string): Promise<PlayerContext> {
    this.socket.emit('init', { contextId, playerId });

    return new Promise((resolve) => {
      this.socket.once('game-loaded', (context: Context) => {
        resolve(this.decorateContext(context));
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
      callback(this.decorateContext(context));
    });
  }

  public onChallenge(callback: () => void) {
    this.socket.on('challenged', () => {
      callback();
    });
  }

  public onNewGameStarted(callback: (context: PlayerContext) => void) {
    this.socket.on('new-game-started', (context: Context) => {
      callback(this.decorateContext(context));
    });
  }

  private decorateContext(context: Context): PlayerContext {
    const isFirstPlayer = context.player1 === this.game.facebook.playerID;
    return {
      ...context,
      isPlayerTurn: context.game.currentTurn === this.game.facebook.playerID,
      isFirstPlayer,
      won: context.game.winner === this.game.facebook.playerID,
      opponent: isFirstPlayer ? context.player2 : context.player1,
    };
  }
}

const serverProvider = {
  key: 'server',
  plugin: Server,
  start: true,
  sceneKey: 'server',
  mapping: 'server',
};

export { PlayerContext, player, Server, serverProvider };
