class GameEndScene extends Phaser.Scene {
  private infoText: Phaser.GameObjects.Text | null = null;

  constructor() {
    super({
      key: 'GameEndScene',
    });
  }

  public create() {
    const button = this.add.text(20, 20, 'Restart');
    button.setInteractive();
    button.on('pointerdown', () => {
      const scene = this.scene.get('GameplayScene');
      scene.scene.stop();
      this.scene.switch('GameplayScene');
    });
  }

  public setWin() {
    this.clear();
    this.infoText = this.add.text(0 , 0, 'YOU WON!');
  }

  public setLoss() {
    this.clear();
    this.infoText = this.add.text(0 , 0, 'YOU LOSE!');
  }

  private clear() {
    if (this.infoText) {
      this.infoText.destroy();
    }
  }
}

export { GameEndScene };
