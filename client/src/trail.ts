import { Board } from './board/board';

interface PointData {
  index: number;
}

class Trail {
  private state: number[] = [];
  private graphics: Phaser.GameObjects.Graphics;
  private adjacentList: number[][] = [];

  constructor(private scene: Phaser.Scene, private board: Board) {
    this.graphics = scene.add.graphics({ x: 0, y: 0 });
    this.graphics.lineStyle(3, 0x0b0694);

    this.state.push(this.board.getStartingPoint());
    this.adjacentList[this.board.getStartingPoint()] = [];
  }

  public next(pointIndex: number) {
    const lastPointIndex = this.getLastPointIndex();

    this.adjacentList[lastPointIndex].push(pointIndex);
    if (!this.adjacentList[pointIndex]) {
      this.adjacentList[pointIndex] = [];
    }
    this.adjacentList[pointIndex].push(lastPointIndex);

    this.state.push(pointIndex);
    this.draw(lastPointIndex, pointIndex);
  }

  public canGoTo(point: PointData) {
    const lastPointIndex = this.getLastPointIndex();
    return !this.adjacentList[lastPointIndex].includes(point.index);
  }

  public wasPointVisited(pointIndex: number) {
    return this.adjacentList[pointIndex] && this.adjacentList[pointIndex].length;
  }

  public getState() {
    return this.state;
  }

  public addMissing(trail: number[]) {
    const firstMissingIndex = this.state.length;
    const missingTrail = trail.slice(firstMissingIndex, trail.length);
    missingTrail.forEach(point => {
      this.next(point);
    });
  }

  public getLastPoint(): number | null {
    return this.state.length > 1 ? this.state[this.state.length - 1] : null;
  }

  private draw(indexA: number, indexB: number) {
    const lastPosition = this.board.getPositionAt(indexA);
    const nextPosition = this.board.getPositionAt(indexB);
    this.graphics.lineBetween(lastPosition.x, lastPosition.y, nextPosition.x, nextPosition.y);
  }

  private getLastPointIndex() {
    return this.state[this.state.length - 1];
  }
}

export { Trail };
