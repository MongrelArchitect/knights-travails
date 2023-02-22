function isOnBoard(coord) {
  if (coord[0] < 0 || coord[0] > 7 || coord[1] < 0 || coord[1] > 7) {
    return false;
  }
  return true;
}

function getValidMoves(start) {
  const validMoves = [];
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
    if (isOnBoard(attempt)) {
      validMoves.push(attempt);
    }
  });
  return validMoves;
}

console.log(getValidMoves([6, 6]));
