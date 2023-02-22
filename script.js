function isOnBoard(coord) {
  // Hard coded to check full chessboard (8 x 8 grid)
  if (coord[0] < 0 || coord[0] > 7 || coord[1] < 0 || coord[1] > 7) {
    return false;
  }
  return true;
}

function getValidMoves(start) {
  const validMoves = [];
  // Knight can move in the following ways:
  const movesToTry = [
    [-1, 2],
    [-2, 1],
    [-2, -1],
    [-1, -2],
    [1, -2],
    [2, -1],
    [2, 1],
    [1, 2],
  ];
  movesToTry.forEach((move) => {
    const attempt = [start[0] + move[0], start[1] + move[1]];
    // Make sure we're still within the board
    if (isOnBoard(attempt)) {
      validMoves.push(attempt);
    }
  });
  return validMoves;
}

const Vertex = (coord, neighbors = [], validMoves = getValidMoves(coord)) => ({
  // Keep track of coorinates, valid moves & graph keys of neighbors
  coord,
  neighbors,
  validMoves,
});

function buildGraph() {
  let key = 0;
  const graph = {};
  // Hard-coded to loop through a full 8 x 8 chessboard
  for (let x = 0; x < 8; x += 1) {
    for (let y = 0; y < 8; y += 1) {
      const newVertex = Vertex([x, y]);
      graph[key] = newVertex;
      // Unique key for each spot on the board
      key += 1;
    }
  }
  // Now we have to determine the keys for each vertex's neighbor(s)
  const graphKeys = Object.keys(graph);
  graphKeys.forEach((graphKey) => {
    // First loop through each vertex
    const vertex = graph[graphKey];
    const { validMoves } = vertex;
    validMoves.forEach((move) => {
      // Then loop through all the vertex's valid moves
      graphKeys.forEach((keyToCheck) => {
        // Finally check the whole graph again for matching coordinates
        const checkCoord = graph[keyToCheck].coord;
        if (checkCoord[0] === move[0] && checkCoord[1] === move[1]) {
          // Give each vertex the keys to it's neighbor(s)
          vertex.neighbors.push(keyToCheck);
        }
      });
    });
  });
  return graph;
}

const Graph = () => {
  const graph = buildGraph();
  return graph;
};

const knight = Graph();
console.log(knight);
