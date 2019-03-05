import { Graph } from './graph';

interface BoardPoint {
  isInGate: boolean;
  isBand: boolean;
}

const HEIGHT = 11;  // has to be odd
const WIDTH = 9; // has to be odd
const graph = new Graph<BoardPoint>();
let index = -1; // first vertex is of index 0

function createBoard(): Graph<BoardPoint> {
  createUpperGate();
  createUpperFirstLine();
  createBody();
  createLowerFirstLine();
  createLowerGate();

  return graph;
}

function createUpperGate() {
  addVertex({ isInGate: true, isBand: true });
}

function createUpperFirstLine() {
  const fromSideBandToGoalPost = Math.floor(WIDTH / 2);

  for (let i = 0; i < fromSideBandToGoalPost; i++) {
    addVertex({ isInGate: false, isBand: true });
  }

  addVertex({ isInGate: false, isBand: false });
  addEdge('left');
  graph.addEdge(index, 0); // "addEdge" won't work here

  for (let i = 0; i < fromSideBandToGoalPost; i++) {
    addVertex({ isInGate: false, isBand: true });

    if (i === 0) {
      addEdge('left');
    }
  }
}

function createBody() {
  for (let i = 0; i < HEIGHT - 2; i++) {
    for (let j = 0; j < WIDTH; j++) {
      let isBand = false;

      if (j === 0 || j === WIDTH - 1) {
        isBand = true;
      }

      addVertex({ isInGate: false, isBand });

      if (j === 0) {
        addEdge('top-right');
      } else if (j === WIDTH - 1) {
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
  const fromSideBandToGoalPost = Math.floor(WIDTH / 2);

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
  const fromSideBandToGoalPost = Math.floor(WIDTH / 2);

  addVertex({ isInGate: true, isBand: true });

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
     return index - WIDTH - 1;
   case 'top':
     return index - WIDTH;
   case 'top-right':
     return index - WIDTH + 1;
   case 'right':
     return index + 1;
 }
}

export { createBoard };
