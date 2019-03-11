import { socketService } from '../socketService';
import { GAMEPLAY_SCENE_ID } from './gameplayScene';

const LOBBY_SCENE_ID = 'LobbyScene';

class LobbyScene extends Phaser.Scene {
  constructor() {
    super({
      key: LOBBY_SCENE_ID,
    });
  }

  public create() {
    // TODO: remove facebook plugin calls in favor to platform plugin
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
      socketService.init(contextID, this.facebook.playerID).then(game => {
        this.scene.start(GAMEPLAY_SCENE_ID, game);
        this.scene.stop(LOBBY_SCENE_ID);
      });
    });
  }
}

export { LobbyScene, LOBBY_SCENE_ID };
