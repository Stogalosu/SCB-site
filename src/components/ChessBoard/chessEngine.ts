const p = (i: number, j: number) => ({ i, j });

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
        let poss = { i: pos.i+move[0], j: pos.j+move[1] };
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
                    return [poss.i-pos.i, poss.j-pos.j];
                if(ind%2 == 0) {
                    if (board(poss)?.type == Type.Rook && board(poss)?.color != color)
                        return [poss.i-pos.i, poss.j-pos.j];
                }
                else
                if (board(poss)?.type == Type.Bishop && board(poss)?.color != color)
                    return [poss.i-pos.i, poss.j-pos.j];
            }
        }
    }
    return null;
}

export function isCastlingPossible(
    boardVal: Board,
    piece: Piece,
    kingsMovedRef: React.RefObject<Record<Color, boolean>>,
    rooksMovedRef: React.RefObject<Record<Color, [boolean, boolean]>>
) {
    const board = (pos: Pos) => boardVal[8*pos.i + pos.j];

    let rooks: Pos[] = [], castling: Move[] = [];
    const color = piece.color;
    const pos = piece.position;
    const to = [{i: pos.i, j: pos.j-2}, {i: pos.i, j: pos.j+2}];

    const moves = [-1, 1];
    if(color == Color.White)
        rooks = [{i: 0, j: 0}, {i: 0, j: 7}];
    else rooks = [{i: 7, j: 0}, {i: 7, j: 7}];

    for(let k=0; k<=1; k++) {
        if(!rooksMovedRef.current[color][k] && !kingsMovedRef.current[color]) {
            let cast = true
            for(let poss={ i: pos.i, j: pos.j }; poss.j != rooks[k].j && cast; pos.j+=moves[k])
                if((board(poss) != null && poss.j!=4 && poss.j!=0 && poss.j!= 7) || isKingInCheck(boardVal, piece))
                    cast = false;
            if(cast)
                castling.push({
                    piece,
                    from: pos,
                    to: to[k],
                    isCastle: true
                });
        } else return [];
    }
    return castling;
}

export function getPossibleMoves(
    boardVal: Board,
    piece: Piece,
    isInCheck: Pos | null,
    kingsRef: React.RefObject<Record<Color, Piece>>,
    kingsMovedRef: React.RefObject<Record<Color, boolean>>,
    rooksMovedRef: React.RefObject<Record<Color, [boolean, boolean]>>
) {
    const board = (pos: Pos) => boardVal[8*pos.i + pos.j];
    const color = piece.color;
    const pos = piece.position;
    const i=pos.i, j=pos.j;

    let moves: Move[] = [];

    switch (piece.type) {
        case 'pawn':
            let i1 = 0;
            if(color == Color.White) i1=i+1;
            else i1=i-1;
            
            if(!board(p(i1, j))) {
                moves.push({
                    piece,
                    from: pos,
                    to: p(i1, j),
                    promotion: (i1==7 && color == Color.White) || (i1==0 && color == Color.Black) ? Type.Pawn : undefined
                });
                if(i==1 && color == Color.White && !board(p(i+2, j)))
                    moves.push({piece, from: pos, to: p(i+2, j)});
                if(i==6 && color == Color.Black && !board(p(i-2, j)))
                    moves.push({piece, from: pos, to: p(i-2, j)});
            }
            if(board(p(i1, j+1)) != null && board(p(i1, j+1))?.color != color)
                moves.push({
                    piece,
                    from: pos,
                    to: p(i1, j+1),
                    captured: board(p(i1, j+1)) ?? undefined,
                    promotion: (i1==7 && color == Color.White) || (i1==0 && color == Color.Black) ? Type.Pawn : undefined
                });
            if(board(p(i1, j-1)) != null && board(p(i1, j-1))?.color != color)
                moves.push({
                    piece,
                    from: pos,
                    to: p(i1, j-1),
                    captured: board(p(i1, j-1)) ?? undefined,
                    promotion: (i1==7 && color == Color.White) || (i1==0 && color == Color.Black) ? Type.Pawn : undefined
                });
            break;
        case 'knight':
            const movesN = getPieceMoves(piece.type);
            for(const move of movesN) {
                const poss = { i: i+move[0], j: j+move[1] };
                if(inBounds(poss)) {
                    if (board(poss) == null)
                        moves.push({piece, from: pos, to: poss});
                    else if (board(poss)?.color != color)
                        moves.push({piece, from: pos, to: poss, captured: board(poss) ?? undefined});
                }
            }
            break;
        case 'bishop':
        case 'rook':
        case 'queen':
            getPossiblePathBRQ(boardVal, piece, moves);
            break;
        case 'king':
            const movesK = getPieceMoves(piece.type);
            for(const move of movesK) {
                const poss = { i: i+move[0], j: j+move[1] };
                if(inBounds(poss)) {
                    if(board(poss) == null) {
                        if (!isKingInCheck(boardVal, piece))
                            moves.push({piece, from: pos, to: poss});
                    }
                    else if(board(poss)?.color != color)
                        if(!isKingInCheck(boardVal, piece))
                            moves.push({piece, from: pos, to: poss, captured: board(poss) ?? undefined});
                }
            }

            // Castling
            const castling = isCastlingPossible(boardVal, piece, kingsMovedRef, rooksMovedRef);
            for(const move of castling) moves.push(move);

            break;
    }

    //Blocking check (if the piece is not a king)
    if(isInCheck && board(pos)?.type != Type.King) {
        const kingPos = kingsRef.current[color].position;
        const attPos = { i: kingPos.i + isInCheck.i, j: kingPos.j + isInCheck.j };
        let tempMoves: Move[] = [];

        const movesN = getPieceMoves(Type.Knight);
        const isKnightCheck = movesN.find(elem => elem[0]==isInCheck.i && elem[1]==isInCheck.j)
        if(!isInCheck) //You cannot block a check from a knight
            tempMoves = moves.filter(move => isInBetween(kingPos, move.to, attPos));
        else
            // If check is from knight, the only legal move is to capture it
            tempMoves = moves.filter(move => move.to.i === attPos.i && move.to.j === attPos.j);
        moves = tempMoves;
    }

    // Check if piece is pinned
    if(board(pos)?.type != Type.King) {
        const king = kingsRef.current[color];
        const tempMoves = moves.filter(move => {
            const newBoard: Board = [...boardVal];
            newBoard[8*move.to.i + move.to.j] = newBoard[8*move.from.i + move.from.j];
            newBoard[8*move.from.i + move.from.j] = null;
            return !isKingInCheck(newBoard, king)
        });
        moves = tempMoves;
    }

    return moves;
}