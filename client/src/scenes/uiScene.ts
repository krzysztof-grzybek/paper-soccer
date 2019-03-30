import { SceneExtended } from '../model';
import { GAMEPLAY_SCENE_ID } from './gameplayScene';

const UI_SCENE_ID = 'UiScene';

interface PlayerInfo {
  id: string;
  name: string;
  image: string;
}

class UiScene extends SceneExtended {
  private playerInfo: PlayerInfo | null = null;
  private opponentInfo: PlayerInfo | null = null;

  constructor() {
    super({
      key: UI_SCENE_ID,
      active: false,
    });
  }

  public preload() {
    this.playerInfo = this.getCurrentPlayerInfo();
    this.load.image('player', this.playerInfo.image);
  }

  public create() {
    const x = this.game.canvas.width / 2;
    const text = this.add.text(x, 0, 'Paper soccer');
    text.setOrigin(0.5, 0);
    this.displayPlayerInfo();

    this.loadOpponent();
    this.server.onOpponentConnect(this.loadOpponent.bind(this));

    const gameplayScene = this.scene.get(GAMEPLAY_SCENE_ID);
    gameplayScene.events.on('player-change', this.onPlayerChange.bind(this));
  }

  private displayPlayerInfo() {
    if (this.playerInfo) {
      this.add.text(0, 0, this.playerInfo.name);
      const image = this.add.image(0, 30, 'player');
      image.setDisplaySize(50, 50);
      image.setOrigin(0, 0);
    }
  }

  private loadOpponent() {
    this.getOpponentInfo().then(opponent => {
      this.opponentInfo = opponent;
      this.load.image('opponent', this.opponentInfo.image);

      this.load.once('filecomplete-image-opponent', () => {
        this.displayOpponentInfo();
      }, this);
      this.load.start();
    });
  }

  private displayOpponentInfo() {
    const text = this.add.text(this.game.canvas.width, 0, this.opponentInfo!.name);
    text.setOrigin(1, 0);
    const image = this.add.image(this.game.canvas.width, 30, 'opponent');

    image.setDisplaySize(50, 50);
    image.setOrigin(1, 0);
  }

  private onPlayerChange() {
    // TODO: implement
    // tslint:disable-next-line no-console
    console.log('player change');
  }

  private getCurrentPlayerInfo() {
    return {
      id: this.facebook.getPlayerID(),
      name: this.facebook.getPlayerName(),
      image: this.facebook.getPlayerPhotoURL(),
    };
  }
  private getOpponentInfo() {
    return new Promise<PlayerInfo>(resolve => {
      this.facebook.getPlayers();
      this.facebook.once('players', (players: FBInstant.ConnectedPlayer[]) => {
        const opponent = players.find(p => p.getID() !== this.facebook.getPlayerID());

        if (!opponent) {
          throw new Error('Opponent not found');
        }

        // TODO figure out when these values can be null
        resolve({
          id: opponent.getID(),
          name: opponent.getName()!,
          image: opponent.getPhoto()!,
        });
      });
    });
  }
}

export { UiScene, UI_SCENE_ID };
