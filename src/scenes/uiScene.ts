import { playerService } from '../playerService';
import { GAMEPLAY_SCENE_ID } from './gameplayScene';

const UI_SCENE_ID = 'UiScene';

interface PlayerInfo {
  name: string;
  image: string;
}
class UiScene extends Phaser.Scene {
  private playerInfo: PlayerInfo | null = null;
  private oponentInfo: PlayerInfo | null = null;

  constructor() {
    super({
      key: UI_SCENE_ID,
    });
  }

  public preload() {
    this.playerInfo = playerService.getCurrentPlayerInfo();
    this.load.image('player', this.playerInfo.image);
    playerService.getOponentinfo().then(oponent => {
      this.oponentInfo = oponent;
      this.load.image('oponent', this.oponentInfo.image);
    });

  }

  public create() {
    const x = this.game.canvas.width / 2;
    const text = this.add.text(x, 0, 'Paper soccer');
    text.setOrigin(0.5, 0);
    this.displayPlayersInfo();

    const gameplayScene = this.scene.get(GAMEPLAY_SCENE_ID);
    gameplayScene.events.on('player-change', this.onPlayerChange.bind(this));
  }

  private displayPlayersInfo() {
    if (this.playerInfo) {
      this.add.text(0, 0, this.playerInfo.name);
      const image = this.add.image(0, 30, 'player');
      image.setDisplaySize(50, 50);
      image.setOrigin(0, 0);
    }

    if (this.oponentInfo) {
      const text = this.add.text(this.game.canvas.width , 0, this.oponentInfo.name);
      text.setOrigin(1, 0);
      const image = this.add.image(this.game.canvas.width, 30, 'oponent');
      image.setDisplaySize(50, 50);
      image.setOrigin(1, 0);
    }
  }

  private onPlayerChange() {
    // TODO: implement
    // tslint:disable-next-line no-console
    console.log('player change');
  }
}

export { UiScene, UI_SCENE_ID };
