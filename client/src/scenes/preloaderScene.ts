import { SceneExtended } from '../model';
import { GAME_END_SCENE_ID, gameEndSceneState } from './gameEndScene';
import { GAMEPLAY_SCENE_ID } from './gameplayScene';
import { LOBBY_SCENE_ID } from './lobbyScene';
import { UI_SCENE_ID } from './uiScene';

const PRELOADER_SCENE_ID = 'PreloaderScene';

class PreloaderScene extends SceneExtended {

  constructor() {
    super(PRELOADER_SCENE_ID);
  }

  public preload() {
    this.facebook.once('startgame', this.startGame, this);
    this.facebook.showLoadProgress(this);

    this.load.image('msngr-icon', './assets/ball.png');
  }

  private startGame() {
    if (this.facebook.contextType === 'THREAD') {
      this.server.initSession(this.facebook.contextID, this.facebook.playerID).then(context => {
        this.scene.start(UI_SCENE_ID);
        if (context.game.state === 'progress') {
          this.scene.start(GAMEPLAY_SCENE_ID, context);
        } else if (context.game.state === 'end') {
          const state = this.getGameEndState(
            context.game.challengedAgainBy,
            this.facebook.getPlayerID(),
            context.opponent!,
          );
          this.scene.start(GAME_END_SCENE_ID, { won: context.won, state });
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
