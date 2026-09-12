declare enum PieceType {
    Pawn = 'pawn',
    Bishop = 'bishop',
    Knight = 'knight',
    Rook = 'rook',
    Queen = 'queen',
    King = 'king'
}

declare enum PieceColor {
    White = 'white',
    Black = 'black'
}

interface Pos {
    row: number;
    col: number;
}

interface Piece {
    type: PieceType,
    color: PieceColor,
    position: Pos,
    lastPosition: Pos
}

interface Move {
    piece: Piece;
    from: Pos;
    to: Pos;
    captured?: Piece;
    promotion?: PieceType;
    isCastle?: boolean;
    isEnPassant?: boolean;
}