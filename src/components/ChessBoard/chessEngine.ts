function makePiece(type: Type, color: Color, position: Pos): Piece {
    return { type, color, position };
}

function makeStartingRow(color: Color): Piece[] {
    row = color == Color.White ? 0 : 7;
    return [
        makePiece(Type.Rook, color, { row, col: 0 }),
        makePiece(Type.Knight, color, { row, col: 1 }),
        makePiece(Type.Bishop, color, { row, col: 2 }),
        makePiece(Type.Queen, color, { row, col: 3 }),
        makePiece(Type.King, color, { row, col: 4 }),
        makePiece(Type.Bishop, color, { row, col: 5 }),
        makePiece(Type.Knight, color, { row, col: 6 }),
        makePiece(Type.Rook, color, { row, col: 7 }),
    ];
}

function getInitialBoard(): Board {
    const board: Board = Array(64).fill(null);
    const whiteRow = makeStartingRow(Color.White);
    for(let j=0; j<=7; j++) {
        board[j] = whiteRow[j];
        board[8+j] = makePiece(Type.Pawn, Color.White, { row: 1, col: j });
    }
    const blackRow = makeStartingRow(Color.Black);
    for(let j=0; j<=7; j++) {
        board[7*8+j] = blackRow[j];
        board[6*8+j] = makePiece(Type.Pawn, Color.Black, { row: 6, col: j });
    }
    return board;
}