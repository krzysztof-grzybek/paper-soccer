import { playerService } from '../playerService';
import { socketService } from '../socketService';
import { GAMEPLAY_SCENE_ID } from './gameplayScene';

const UI_SCENE_ID = 'UiScene';

interface PlayerInfo {
  name: string;
  image: string;
}
class UiScene extends Phaser.Scene {
  private playerInfo: PlayerInfo | null = null;
  private opponentInfo: PlayerInfo | null = null;

  constructor() {
    super({
      key: UI_SCENE_ID,
      active: false,
    });
  }

  public preload() {
    this.playerInfo = playerService.getCurrentPlayerInfo();
    this.load.image('player', this.playerInfo.image);
    playerService.getOponentinfo().then(opponent => {
      this.opponentInfo = opponent;
      this.load.image('oponent', this.opponentInfo.image);
      this.load.once('filecomplete-image-oponent', () => {
        this.displayOpponentInfo();
      }, this);
      this.load.start();
    });
  }

  public create() {
    const x = this.game.canvas.width / 2;
    const text = this.add.text(x, 0, 'Paper soccer');
    text.setOrigin(0.5, 0);
    this.displayPlayersInfo();

    const gameplayScene = this.scene.get(GAMEPLAY_SCENE_ID);
    gameplayScene.events.on('player-change', this.onPlayerChange.bind(this));

    socketService.onOpponentConnect(() => {
      playerService.getOponentinfo().then(opponent => {
        this.opponentInfo = opponent;
        this.load.image('oponent', this.opponentInfo.image);

        this.load.once('filecomplete-image-oponent', () => {
          this.displayOpponentInfo();
        }, this);
        this.load.start();
      });
    });
  }

  private displayPlayersInfo() {
    if (this.playerInfo) {
      this.add.text(0, 0, this.playerInfo.name);
      const image = this.add.image(0, 30, 'player');
      image.setDisplaySize(50, 50);
      image.setOrigin(0, 0);
    }

    if (this.opponentInfo) {
      this.displayOpponentInfo();
    }
  }

  private displayOpponentInfo() {
    const text = this.add.text(this.game.canvas.width, 0, this.opponentInfo!.name);
    text.setOrigin(1, 0);
    const image = this.add.image(this.game.canvas.width, 30, 'oponent');

    image.setDisplaySize(50, 50);
    image.setOrigin(1, 0);
  }

  private onPlayerChange() {
    // TODO: implement
    // tslint:disable-next-line no-console
    console.log('player change');
  }
}

export { UiScene, UI_SCENE_ID };
