interface PointData {
  index: number;
  position: {
    x: number;
    y: number;
  };
}

class Trail {
  private history: PointData[] = [];
  private graphics: Phaser.GameObjects.Graphics;
  private adjacentList: number[][] = [];

  constructor(private scene: Phaser.Scene, initialPoint: PointData) {
    this.graphics = scene.add.graphics({ x: 0, y: 0 });
    this.graphics.lineStyle(3, 0x0b0694);

    this.history.push(initialPoint);
    this.adjacentList[initialPoint.index] = [];
  }

  public next(pointData: PointData) {
    const lastPoint = this.getLastPoint();

    if (!this.adjacentList[lastPoint.index]) {
      this.adjacentList[lastPoint.index] = [];
    }
    this.adjacentList[lastPoint.index].push(pointData.index);

    if (!this.adjacentList[pointData.index]) {
      this.adjacentList[pointData.index] = [];
    }
    this.adjacentList[pointData.index].push(lastPoint.index);

    this.history.push(pointData);
    this.graphics.lineBetween(lastPoint.position.x, lastPoint.position.y, pointData.position.x, pointData.position.y);
  }

  public canGoTo(point: PointData) {
    const lastPoint = this.getLastPoint();

    if (this.adjacentList[lastPoint.index].find(p => p === point.index)) {
      return false;
    }

    return true;
  }

  public wasPointVisited(pointIndex: number) {
    return this.adjacentList[pointIndex] && this.adjacentList[pointIndex].length;
  }

  private getLastPoint() {
    return this.history[this.history.length - 1];
  }
}

export { Trail };
