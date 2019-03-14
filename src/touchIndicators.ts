interface IndicatorData {
  index: number;
  position: {
    x: number
    y: number;
  };
}

const RADIUS = 10;

class TouchIndicators {
  private touchEventEmitter = new Phaser.Events.EventEmitter();
  private indicators: Phaser.GameObjects.Graphics[] = [];

  constructor(private scene: Phaser.Scene) {
  }

  public render(data: IndicatorData[]) {
    data.forEach(d => {
      this.createIndicators(d);
    });
  }

  public clear() {
    this.indicators.forEach(i => {
      i.removeAllListeners();
      i.clear();
    });
  }

  public onChoose(callback: (pointIndex: number) => void) {
    this.touchEventEmitter.on('touch', (point: IndicatorData) => {
      callback(point.index);
    });
  }

  private createIndicators(data: IndicatorData) {
    const indicator = this.scene.add.graphics();
    const shape = new Phaser.Geom.Circle(data.position.x, data.position.y, RADIUS);

    indicator.lineStyle(3, 0xffff34, 1.0);
    indicator.strokeCircle(data.position.x, data.position.y, RADIUS);
    indicator.setInteractive(shape, Phaser.Geom.Circle.Contains);

    indicator.on('pointerdown', (i: Phaser.GameObjects.Graphics) => {
      this.touchEventEmitter.emit('touch', data);
    });

    this.indicators.push(indicator);
  }
}

export { TouchIndicators };
