interface IndicatorData {
  index: number;
  position: {
    x: number
    y: number;
  };
}

class TouchIndicators {
  private graphics: Phaser.GameObjects.Graphics;

  constructor(private scene: Phaser.Scene) {
    this.graphics = this.scene.add.graphics();
    this.graphics.lineStyle(3, 0xffff34, 1.0);
  }

  public render(data: IndicatorData[]) {
    data.forEach(d => {
      this.graphics.strokeCircle(d.position.x, d.position.y, 5);
    });
  }

  public clear() {

  }
}

export { TouchIndicators };
