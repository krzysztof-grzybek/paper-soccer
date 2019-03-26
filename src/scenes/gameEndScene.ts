import { socketService } from '../socketService';
import { GAMEPLAY_SCENE_ID } from './gameplayScene';

const GAME_END_SCENE_ID = 'GameEndScene';

type state = 'initial' | 'waiting-for-opponent-accept' | 'challenged-by-opponent';

interface InitialData {
  state: state;
  won: boolean;
}
class GameEndScene extends Phaser.Scene {
  private infoText: Phaser.GameObjects.Text | null = null;
  private button!: Phaser.GameObjects.Text;
  private state: state = 'initial';

  constructor() {
    super({
      key: GAME_END_SCENE_ID,
    });
  }

  public create(data: InitialData) {
    const middleX = this.game.canvas.width / 2;
    const middleY = this.game.canvas.height / 2;
    this.button = this.add.text(middleX, middleY + 40, '');
    this.button.setInteractive();

    if (data.won) {
      this.setWin();
    } else {
      this.setLoss();
    }

    switch (data.state) {
      case 'initial':
        this.setInitialState();
      case 'challenged-by-opponent':
        this.setChallengedByOpponentState();
      case 'waiting-for-opponent-accept':
        this.setWaitingForOpponentAcceptState();
    }

    this.button.on('pointerdown', () => {
      if (this.state === 'initial') {
        socketService.challengeOpponent();
        this.setWaitingForOpponentAcceptState();
      }
      // const scene = this.scene.get(GAMEPLAY_SCENE_ID);
      // scene.scene.stop();
      // this.scene.switch(GAMEPLAY_SCENE_ID);
    });
  }

  private setWin() {
    const middleX = this.game.canvas.width / 2;
    const middleY = this.game.canvas.height / 2;
    this.clear();
    this.infoText = this.add.text(middleX , middleY, 'YOU WON!');
  }

  private setLoss() {
    const middleX = this.game.canvas.width / 2;
    const middleY = this.game.canvas.height / 2;
    this.clear();
    this.infoText = this.add.text(middleX , middleY, 'YOU LOSE!');
  }

  private clear() {
    if (this.infoText) {
      this.infoText.destroy();
    }
  }

  private setWaitingForOpponentAcceptState() {
    this.state = 'waiting-for-opponent-accept';
    this.button.setText('Waiting for opponent accept');
  }

  private setChallengedByOpponentState() {
    this.state = 'challenged-by-opponent';
    this.button.setText('Accept challenge');
  }

  private setInitialState() {
    this.state = 'initial';
    this.button.setText('Challenge opponent!');
  }
}

export { GameEndScene, GAME_END_SCENE_ID };
