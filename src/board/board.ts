import { BoardView } from './boardView';
import { createBoardGraph } from './createBoardGraph';

const ROWS = 9;
const COLUMNS = 11;

class Board {
  private graph = createBoardGraph(ROWS, COLUMNS);
  private view!: BoardView;

  constructor(private scene: Phaser.Scene, size: { width: number, height: number }) {
    this.view = new BoardView(scene, ROWS, COLUMNS, size);
    this.view.render();
  }

  public getStartingPoint() {
    return Math.floor(this.graph.getVerticiesAmount() / 2);
  }

  public getPositionAt(pointIndex: number) {
    return this.view.getPositionAt(pointIndex);
  }

  public getAdjacentPoints(pointIndex: number) {
    const adjacentPoints = this.graph.getAdjacentVerticies(pointIndex);
    return adjacentPoints.map(index => {
      const position = this.view.getPositionAt(index);
      return {
        index,
        position,
      };
    });
  }

  public isOnBand(pointIndex: number) {
    const vertex = this.graph.getVertexData(pointIndex);
    return vertex.isBand;
  }

  public isInGate(pointIndex: number, gate: 1 | 2) {
    const vertex = this.graph.getVertexData(pointIndex);
    return vertex.isInGate && vertex.gate === gate;
  }
}

export { Board };
