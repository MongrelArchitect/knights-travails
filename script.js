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

  const getKey = (coord) => {
    // Our graph vertices store their neighbors as integer keys, so we
    // need to convert coordinates to these keys when search starts
    const keys = Object.keys(graph);
    let result;
    keys.every((key) => {
      const vertex = graph[key];
      if (vertex.coord[0] === coord[0] && vertex.coord[1] === coord[1]) {
        result = key;
        return false;
      }
      return true;
    });
    return result;
  };

  const displayPath = (path) => {
    // For a somewhat cohert display of our final path
    const finalPath = [];
    path.forEach((key) => {
      finalPath.push(graph[key].coord);
    });
    console.log(`Start: [${finalPath[0]}]`);
    console.log(`  End: [${finalPath[finalPath.length - 1]}]`);
    console.log('');
    console.log(`MADE IT IN ${finalPath.length - 1} MOVES`);
    console.log('==================');
    finalPath.forEach((coord) => {
      console.log(` [${coord}]`);
    });
  };

  const getPath = (visited, origins) => {
    // Start at our destination and backtrack where each visited vertex
    // came from to find our shortest path
    const end = visited[[visited.length - 1]];
    const reversePath = [end];
    let previous = origins[[origins.length - 1]];
    while (previous) {
      reversePath.push(previous);
      const visitedIndex = visited.indexOf(previous);
      previous = origins[visitedIndex];
    }
    // Flip our path around to the correct order
    return reversePath.reverse();
  };

  const knightMoves = (start, end) => {
    const destination = getKey(end);
    const queue = [getKey(start)];

    // Need to keep track of visited vertices and their origins
    const visited = [];
    const origins = [];
    let shortestPath;

    // First one to search has no origin vertex
    graph[queue[0]].cameFrom = null;

    while (queue.length > 0) {
      const key = queue[0];
      // Don't need to check this vertex again
      if (!visited.includes(key)) {
        visited.push(key);
        // Keep track of where this vertex came from
        origins.push(graph[key].cameFrom);
      }

      if (key === destination) {
        // Found it! Time to wrap it up and backtrack to find our path
        shortestPath = getPath(visited, origins);
        break;
      }

      // Enqueue all current vertex neighbors for breadth first search
      graph[key].neighbors.forEach((neighbor) => {
        // Don't enqueue if already visited or currently in queue
        if (!visited.includes(neighbor) && !queue.includes(neighbor)) {
          // Enqueue & keep track of where it came from
          queue.push(neighbor);
          graph[neighbor].cameFrom = key;
        }
      });

      // All done with this vertex
      queue.shift();
    }

    // Display our path using coordinates instead of graph keys
    displayPath(shortestPath);
  };

  return { knightMoves };
};

const board = Graph();
board.knightMoves([1, 0], [7, 6]);
