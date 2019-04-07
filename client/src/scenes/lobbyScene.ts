import { SceneExtended } from '../model';
import { GAME_END_SCENE_ID, gameEndSceneState } from './gameEndScene';
import { GAMEPLAY_SCENE_ID } from './gameplayScene';
import { UI_SCENE_ID } from './uiScene';

const LOBBY_SCENE_ID = 'LobbyScene';

class LobbyScene extends SceneExtended {
  constructor() {
    super({
      key: LOBBY_SCENE_ID,
    });
  }

  public create() {
    const text = this.add.text(
      this.cameras.main.centerX,
      this.cameras.main.centerY,
      'Choose opponent',
    );
    text.setInteractive();
    text.on('pointerdown', () => {
      // @ts-ignore
      this.facebook.chooseContext(); // TODO: fix type bug in fb plugin
    });

    this.facebook.on('choose', (contextID: string) => {
      // TODO: move repeated code (preloaderScene) to some common place
      this.server.initSession(contextID, this.facebook.playerID).then(context => {
        this.scene.start(UI_SCENE_ID);
        if (context.state === 'progress') {
          this.scene.start(GAMEPLAY_SCENE_ID, context);
        } else if (context.state === 'end') {
          const state = this.getGameEndState(
            context.challengedAgainBy,
            this.facebook.getPlayerID(),
            context.opponent!,
          );
          this.scene.start(GAME_END_SCENE_ID, { won: context.won, state });
        }

        this.scene.stop(LOBBY_SCENE_ID);
      });
    });
  }

  // TODO: move repeated code (preloaderScene) to some common place
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

export { LobbyScene, LOBBY_SCENE_ID };
