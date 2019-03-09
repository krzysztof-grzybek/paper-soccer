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
    const index = Math.floor(this.graph.getVerticiesAmount() / 2);
    const position = this.view.getPositionAt(index);
    return { index, position };
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
}

export { Board };
