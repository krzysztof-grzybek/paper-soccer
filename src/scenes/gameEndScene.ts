import { GAMEPLAY_SCENE_ID } from './gameplayScene';

class GameEndScene extends Phaser.Scene {
  private infoText: Phaser.GameObjects.Text | null = null;

  constructor() {
    super({
      key: 'GameEndScene',
    });
  }

  public create() {
    const middleX = this.game.canvas.width / 2;
    const middleY = this.game.canvas.height / 2;
    const button = this.add.text(middleX, middleY + 40, 'Restart');
    button.setInteractive();
    button.on('pointerdown', () => {
      const scene = this.scene.get(GAMEPLAY_SCENE_ID);
      scene.scene.stop();
      this.scene.switch(GAMEPLAY_SCENE_ID);
    });
  }

  public setWin() {
    const middleX = this.game.canvas.width / 2;
    const middleY = this.game.canvas.height / 2;
    this.clear();
    this.infoText = this.add.text(middleX , middleY, 'YOU WON!');
  }

  public setLoss() {
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
}

export { GameEndScene };
