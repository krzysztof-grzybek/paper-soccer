import { createBoardGraph } from './createBoardGraph';

const ROWS = 9;
const COLUMNS = 11;

class Board {
  private graph = createBoardGraph(ROWS, COLUMNS);

  public getSize() {
    return { ROWS, COLUMNS };
  }

  public getStartingPointIndex() {
    return Math.floor(this.graph.getVerticiesAmount() / 2);
  }

  public getAdjacentPoints(pointIndex: number) {
    return this.graph.getAdjacentVerticies(pointIndex);
  }
}

export { Board };
