import { Server } from './serverPlugin';

type player = string;

type moveType = 'progress' | 'win' | 'loss';

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
  won: boolean;
  opponent: player | null;
}

class SceneExtended extends Phaser.Scene {
  public server!: Server;
}

export { Context, Game, moveType, player, PlayerContext, SceneExtended };
