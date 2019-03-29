import { socketService } from '../socketService';
import { GAMEPLAY_SCENE_ID } from './gameplayScene';
import { UI_SCENE_ID } from './uiScene';

const LOBBY_SCENE_ID = 'LobbyScene';

class LobbyScene extends Phaser.Scene {
  constructor() {
    super({
      key: LOBBY_SCENE_ID,
    });
  }

  public create() {
    const text = this.add.text(
      this.cameras.main.centerX,
      this.cameras.main.centerY,
      'Choose oponent',
    );
    text.setInteractive();
    text.on('pointerdown', () => {
      // @ts-ignore
      this.facebook.chooseContext(); // TODO: fix type bug in fb plugin
    });

    this.facebook.on('choose', (contextID: string) => {
      socketService.init(contextID, this.facebook.playerID).then(context => {
        this.scene.start(UI_SCENE_ID);
        this.scene.start(GAMEPLAY_SCENE_ID, context);
        this.scene.stop(LOBBY_SCENE_ID);
      });
    });
  }
}

export { LobbyScene, LOBBY_SCENE_ID };
