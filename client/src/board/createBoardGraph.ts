import { Graph } from '../graph';
import { BoardPoint } from './model';

function createBoardGraph(rows: number, columns: number): Graph<BoardPoint> {
  const ROWS = rows;
  const COLUMNS = columns;

  const graph = new Graph<BoardPoint>();
  let index = -1; // first vertex is of index 0

  createUpperGate();
  createUpperFirstLine();
  createBody();
  createLowerFirstLine();
  createLowerGate();

  return graph;

  function createUpperGate() {
    addVertex({ isInGate: true, gate: 2, isBand: true });
  }

  function createUpperFirstLine() {
    const fromSideBandToGoalPost = Math.floor(ROWS / 2);

    for (let i = 0; i < fromSideBandToGoalPost; i++) {
      addVertex({ isInGate: false, isBand: true });
      if (i === fromSideBandToGoalPost - 1) {
        graph.addEdge(index, 0); // "addEdge" won't work here
      }
    }

    addVertex({ isInGate: false, isBand: false });
    addEdge('left');
    graph.addEdge(index, 0); // "addEdge" won't work here

    for (let i = 0; i < fromSideBandToGoalPost; i++) {
      addVertex({ isInGate: false, isBand: true });

      if (i === 0) {
        addEdge('left');
        graph.addEdge(index, 0); // "addEdge" won't work here
      }
    }
  }

  function createBody() {
    for (let i = 0; i < COLUMNS - 4; i++) {
      for (let j = 0; j < ROWS; j++) {
        let isBand = false;

        if (j === 0 || j === ROWS - 1) {
          isBand = true;
        }

        addVertex({ isInGate: false, isBand });

        if (j === 0) {
          addEdge('top-right');
        } else if (j === ROWS - 1) {
          addEdge('left');
          addEdge('top-left');
        } else {
          addEdge('left');
          addEdge('top-left');
          addEdge('top');
          addEdge('top-right');
        }
      }
    }
  }

  function createLowerFirstLine() {
    const fromSideBandToGoalPost = Math.floor(ROWS / 2);

    for (let i = 0; i < fromSideBandToGoalPost; i++) {
      addVertex({ isInGate: false, isBand: true });

      if (i === 0) {
        addEdge('top-right');
      } else {
        addEdge('top-left');
        addEdge('top');
        addEdge('top-right');
      }
    }

    addVertex({ isInGate: false, isBand: false });
    addEdge('left');
    addEdge('top-left');
    addEdge('top');
    addEdge('top-right');

    for (let i = 0; i < fromSideBandToGoalPost; i++) {
      addVertex({ isInGate: false, isBand: true });
      if (i === 0) {
        addEdge('left');
        addEdge('top-left');
        addEdge('top');
        addEdge('top-right');
      } else if (i === fromSideBandToGoalPost - 1) {
        addEdge('top-left');
      } else {
        addEdge('top-left');
        addEdge('top');
        addEdge('top-right');
      }
    }
  }

  function createLowerGate() {
    const fromSideBandToGoalPost = Math.floor(ROWS / 2);

    addVertex({ isInGate: true, gate: 1, isBand: true });

    graph.addEdge(index, index - fromSideBandToGoalPost - 2); // "addEdge" function won't work here
    graph.addEdge(index, index - fromSideBandToGoalPost - 1); // "addEdge" function won't work here
    graph.addEdge(index, index - fromSideBandToGoalPost); // "addEdge" function won't work here
  }

  function addVertex(data: BoardPoint) {
    graph.addVertex(data);
    index++;
  }

  function addEdge(dir: direction) {
    graph.addEdge(index, adjVertex(dir));
  }

  type direction =
    'left' |
    'top-left' |
    'top' |
    'top-right' |
    'right';

  function adjVertex(dir: direction) {
    switch (dir) {
      case 'left':
        return index - 1;
      case 'top-left':
        return index - ROWS - 1;
      case 'top':
        return index - ROWS;
      case 'top-right':
        return index - ROWS + 1;
      case 'right':
        return index + 1;
    }
  }
}

export { createBoardGraph };
