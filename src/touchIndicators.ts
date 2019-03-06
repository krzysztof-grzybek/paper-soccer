interface IndicatorData {
  pointIndex: number;
  x: number;
  y: number;
}

class TouchIndicators {
  constructor(private graphics: Phaser.GameObjects.Graphics) {
    this.graphics.lineStyle(3, 0xffff34, 1.0);
  }

  public render(data: IndicatorData[]) {
    data.forEach(d => {
      this.graphics.strokeCircle(d.x, d.y, 5);
    });
  }

  public clear() {

  }
}

export { TouchIndicators };
