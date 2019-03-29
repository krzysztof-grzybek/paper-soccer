import { socketService } from '../socketService';
import { GAMEPLAY_SCENE_ID } from './gameplayScene';
import { LOBBY_SCENE_ID } from './lobbyScene';
import { UI_SCENE_ID } from './uiScene';
import { GAME_END_SCENE_ID, gameEndSceneState } from './gameEndScene';

const PRELOADER_SCENE_ID = 'PreloaderScene';

class PreloaderScene extends Phaser.Scene {

  constructor() {
    super(PRELOADER_SCENE_ID);
  }

  public preload() {
    this.facebook.once('startgame', this.startGame, this);
    this.facebook.showLoadProgress(this);

    this.load.image('ball', './assets/ball.png');
  }

  private startGame() {
    if (this.facebook.contextType === 'THREAD') {
      socketService.init(this.facebook.contextID, this.facebook.playerID).then(context => {
        this.scene.start(UI_SCENE_ID);
        if (context.game.state === 'progress') {
          this.scene.start(GAMEPLAY_SCENE_ID, context);
        } else if (context.game.state === 'end') {
          const won = context.game.winner === this.facebook.getPlayerID();
          const opponentId = context.player1 === this.facebook.getPlayerID() ? context.player2! : context.player1!;
          const state = this.getGameEndState(context.game.challengedAgainBy, this.facebook.getPlayerID(), opponentId);
          this.scene.start(GAME_END_SCENE_ID, { won, state });
        }

        this.scene.stop(PRELOADER_SCENE_ID);
      });
    } else {
      this.scene.start(LOBBY_SCENE_ID);
      this.scene.stop(PRELOADER_SCENE_ID);
    }
   }

  private getGameEndState(challengedAgainBy: string | null, playerId: string, opponentId: string): gameEndSceneState {
      if (challengedAgainBy === null) {
          return 'initial';
      } else if (challengedAgainBy === playerId) {
          return 'waiting-for-opponent-accept';
      } else if (challengedAgainBy === opponentId) {
          return 'challenged-by-opponent';
      } else {
          throw new Error('Something went wrong');
      }
  }
}

export { PreloaderScene };
