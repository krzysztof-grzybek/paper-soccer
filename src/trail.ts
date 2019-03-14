import { Board } from './board/board';

interface PointData {
  index: number;
}

class Trail {
  private history: number[] = [];
  private graphics: Phaser.GameObjects.Graphics;
  private adjacentList: number[][] = [];

  constructor(private scene: Phaser.Scene, private board: Board) {
    this.graphics = scene.add.graphics({ x: 0, y: 0 });
    this.graphics.lineStyle(3, 0x0b0694);

    this.history.push(this.board.getStartingPoint());
    this.adjacentList[this.board.getStartingPoint()] = [];
  }

  public next(pointIndex: number) {
    const lastPointIndex = this.getLastPointIndex();

    if (!this.adjacentList[lastPointIndex]) {
      this.adjacentList[lastPointIndex] = [];
    }
    this.adjacentList[lastPointIndex].push(pointIndex);

    if (!this.adjacentList[pointIndex]) {
      this.adjacentList[pointIndex] = [];
    }
    this.adjacentList[pointIndex].push(lastPointIndex);

    this.history.push(pointIndex);
    const lastPosition = this.board.getPositionAt(lastPointIndex);
    const nextPosition = this.board.getPositionAt(pointIndex);
    this.graphics.lineBetween(lastPosition.x, lastPosition.y, nextPosition.x, nextPosition.y);
  }

  public canGoTo(point: PointData) {
    const lastPointIndex = this.getLastPointIndex();

    if (this.adjacentList[lastPointIndex].find(p => p === point.index)) {
      return false;
    }

    return true;
  }

  public wasPointVisited(pointIndex: number) {
    return this.adjacentList[pointIndex] && this.adjacentList[pointIndex].length;
  }

  public getHistory() {
    return this.history;
  }

  public addMissing(trail: number[]) {
    const firstMissingIndex = this.history.length;
    const missingTrail = trail.slice(firstMissingIndex, trail.length);
    missingTrail.forEach(point => {
      this.next(point);
    });
  }

  public getLastPoint(): number | null {
    return this.history.length > 1 ? this.history[this.history.length - 1] : null;
  }

  private getLastPointIndex() {
    return this.history[this.history.length - 1];
  }
}

export { Trail };
