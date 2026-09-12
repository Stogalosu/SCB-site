declare enum Type {
    Pawn = 'pawn',
    Bishop = 'bishop',
    Knight = 'knight',
    Rook = 'rook',
    Queen = 'queen',
    King = 'king'
}

declare enum Color {
    White = 'white',
    Black = 'black'
}

interface Pos {
    row: number;
    col: number;
}

interface Piece {
    type: Type,
    color: Color,
    position: Pos,
    lastPosition?: Pos
}

interface Move {
    piece: Piece;
    from: Pos;
    to: Pos;
    captured?: Piece;
    promotion?: Type;
    isCastle?: boolean;
    isEnPassant?: boolean;
}

type Board = (Piece | null)[];