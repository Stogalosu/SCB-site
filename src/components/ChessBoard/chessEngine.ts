function getPieceMoves(type: Type, color?: Color) {
    switch(type) {
        case 'pawn':
            if(!color) return [];
            else if(color == Color.White)
                return [[1, -1], [1, 1]];
            else return [[-1, -1], [-1, 1]];
            break;
        case 'bishop':
            return [[1, 1], [-1, 1], [-1, -1], [1, -1]];
            break;
        case 'knight':
            return [[-2, 1], [-1, 2], [1, 2], [2, 1], [2, -1], [1, -2], [-1, -2], [-2, -1]];
            break;
        case 'rook':
            return [[1, 0], [0, 1], [-1, 0], [0, -1]];
            break;
        case 'queen':
        case 'king':
            return [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]];
            break;
        default:
            return [];
            break;
    }
};

// Create initial board logic
function makePiece(type: Type, color: Color, position: Pos): Piece {
    return { type, color, position };
}

function makeStartingRow(color: Color): Piece[] {
    const i = color == Color.White ? 0 : 7;
    return [
        makePiece(Type.Rook, color, { i, j: 0 }),
        makePiece(Type.Knight, color, { i, j: 1 }),
        makePiece(Type.Bishop, color, { i, j: 2 }),
        makePiece(Type.Queen, color, { i, j: 3 }),
        makePiece(Type.King, color, { i, j: 4 }),
        makePiece(Type.Bishop, color, { i, j: 5 }),
        makePiece(Type.Knight, color, { i, j: 6 }),
        makePiece(Type.Rook, color, { i, j: 7 }),
    ];
}

export function getInitialBoard(): Board {
    const board: Board = Array(64).fill(null);
    const whiteRow = makeStartingRow(Color.White);
    for(let j=0; j<=7; j++) {
        board[j] = whiteRow[j];
        board[8+j] = makePiece(Type.Pawn, Color.White, { i: 1, j });
    }
    const blackRow = makeStartingRow(Color.Black);
    for(let j=0; j<=7; j++) {
        board[7*8+j] = blackRow[j];
        board[6*8+j] = makePiece(Type.Pawn, Color.Black, { i: 6, j });
    }
    return board;
}

// Check if position is out of bounds
export function inBounds(pos: Pos) {
    return 0<=pos.i && pos.i<=7 && 0<=pos.j && pos.j<=7;
}

// Check if a square is in between two pieces
export function isInBetween(king: Pos, sq: Pos, att: Pos) {
    const collinear = (sq.j - king.j) * (att.i - king.i) == (att.j - king.j) * (sq.i - king.i);
    const between =
        Math.min(king.i, att.i) <= sq.i &&
        sq.i <= Math.max(king.i, att.i) &&
        Math.min(king.j, att.j) <= sq.j &&
        sq.j <= Math.max(king.j, att.j);

    return collinear && between;
}

function getPossiblePathBRQ(board: Board, piece: Piece, possibleMoves: Move[]) {
    const moves = getPieceMoves(piece.type) ?? [];
    const pos = piece.position;
    for(const move of moves) {
        let poss = { i: pos.i+move[0], j: pos.j+move[1] };
        if(inBounds(poss)) {
            for (; inBounds(poss) && board[8*poss.i + poss.j] == null; poss = { i: poss.i + move[0], j: poss.j + move[1] }) {
                possibleMoves.push({
                    piece,
                    from: pos,
                    to: poss
                });
            }
            if(inBounds(poss))
                if (board[8*poss.i + poss.j]?.color != piece.color)
                    possibleMoves.push({
                        piece,
                        from: pos,
                        to: poss,
                        captured: board[8*poss.i + poss.j] ?? piece
                    });
        }
    }
}

export function isKingInCheck(boardVal: Board, piece: Piece, check: boolean = false) {
    const board = (pos: Pos) => boardVal[8*pos.i + pos.j];

    const movesP = getPieceMoves(Type.Pawn, piece.color) ;
    const movesN = getPieceMoves(Type.Knight);
    const movesBRQ = getPieceMoves(Type.Queen);
    const pos = piece.position;
    const color = piece.color

    for (const move of movesP) {
        const poss = { i: pos.i+move[0], j: pos.j+move[1] };
        if (inBounds(poss))
            if (board(poss)?.type == Type.Pawn && board(poss)?.color != color)
                    return move;
    }
    for (const move of movesN) {
        const poss = { i: pos.i+move[0], j: pos.j+move[1] };
        if (inBounds(poss))
            if (board(poss)?.type == Type.Knight && board(poss)?.color != color)
                return move;
    }
    for(const move of movesBRQ) {
        const poss = { i: pos.i+move[0], j: pos.j+move[1] };
        if(inBounds(poss)) {
            if(!check && board(poss)?.type == Type.King && board(poss)?.color != color)
                return [poss.i-pos.i, poss.j-pos.j];
            for (;
                inBounds(poss) &&
                (board(poss)==null ||
                    board(poss)?.type == Type.King &&
                    board(poss)?.color == color);
                poss = { i: poss.i+move[0], j: poss.j+move[1] }
            );
            if(inBounds(poss)) {
                const ind = movesBRQ.indexOf(move);

                if (board(poss)?.type == Type.Queen && board(poss)?.color != color)
                    return [ii-i, jj-j];
                if(ind%2 == 0) {
                    if (board(poss)?.type == Type.Rook && board(poss)?.color != color)
                        return [ii-i, jj-j];
                }
                else
                if (board(poss)?.type == Type.Bishop && board(poss)?.color != color)
                    return [ii-i, jj-j];
            }
        }
    }
    return null;
}