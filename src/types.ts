export enum Type {
    Pawn = 'pawn',
    Bishop = 'bishop',
    Knight = 'knight',
    Rook = 'rook',
    Queen = 'queen',
    King = 'king'
}

export enum Color {
    White = 'white',
    Black = 'black'
}

export interface Pos {
    i: number;
    j: number;
}

export interface Piece {
    type: Type,
    color: Color,
    position: Pos,
    lastPosition?: Pos
}

export interface Move {
    piece: Piece;
    from: Pos;
    to: Pos;
    captured?: Piece;
    promotion?: Type;
    isCastle?: boolean;
    isEnPassant?: boolean;
}

export type Board = (Piece | null)[];