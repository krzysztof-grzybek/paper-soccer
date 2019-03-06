import { createBoardGraph } from './createBoardGraph';

const ROWS = 9;
const COLUMNS = 11;

class Board {
  private graph = createBoardGraph(ROWS, COLUMNS);

  public getSize() {
    return { ROWS, COLUMNS };
  }
}

export { Board };
