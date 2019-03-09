import { playerService } from '../playerService';

const UI_SCENE_ID = 'UiScene';

class UiScene extends Phaser.Scene {
  constructor() {
    super({
      key: UI_SCENE_ID,
      active: true,
    });
  }

  public create() {
    const x = this.game.canvas.width / 2;
    // const text = this.add.text(x, 0, 'Paper soccer');
    // text.setOrigin(0.5, 0);
    this.displayPlayersInfo();
  }

  private displayPlayersInfo() {
    const playerInfo = playerService.getCurrentPlayerInfo();
    const text = this.add.text(0, 0, playerInfo.name);
    text.setOrigin(0.5, 0);
  }
}

export { UiScene, UI_SCENE_ID };
