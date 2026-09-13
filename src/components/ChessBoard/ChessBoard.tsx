"use client";

import styles from "./ChessBoard.module.css";
import { useState, useRef } from "react";
import Image from "next/image";
import Popover from "@/components/Popover/Popover";
import { getInitialBoard, getPossibleMoves, isKingInCheck, isInCheckmate } from './chessEngine';
import { Type, Color, Pos, Piece, Move, Board } from "@/types";

function getIcons(piece: Piece | null) {
    if(piece == null) return <></>;
    const color = piece.color;
    switch(piece.type) {
        case 'pawn':
            return color == Color.White ?
                <Image src="/images/pawn_white.svg" fill alt="white pawn" className={styles.whitePiece}/> :
                <Image src="/images/pawn_black.svg" fill alt="black pawn" className={styles.blackPiece}/>;
            break;
        case 'bishop':
            return color == Color.White ?
                <Image src="/images/bishop_white.svg" fill alt="white bishop" className={styles.whitePiece}/> :
                <Image src="/images/bishop_black.svg" fill alt="black bishop" className={styles.blackPiece}/>
            break;
        case 'knight':
            return color == Color.White ?
                <Image src="/images/knight_white.svg" fill alt="white knight" className={styles.whitePiece}/> :
                <Image src="/images/knight_black.svg" fill alt="black knight" className={styles.blackPiece}/>;
            break;
        case 'rook':
            return color == Color.White ?
                <Image src="/images/rook_white.svg" fill alt="white rook" className={styles.whitePiece}/> :
                <Image src="/images/rook_black.svg" fill alt="black rook" className={styles.blackPiece}/>;
            break;
        case 'queen':
            return color == Color.White ?
                <Image src="/images/queen_white.svg" fill alt="white queen" className={styles.whitePiece}/> :
                <Image src="/images/queen_black.svg" fill alt="black queen" className={styles.blackPiece}/>;
        default:
            return color == Color.White ?
                <Image src="/images/king_white.svg" fill alt="white king" className={styles.whitePiece}/> :
                <Image src="/images/king_black.svg" fill alt="black king" className={styles.blackPiece}/>;
            break;
    }
}

function PromotionOptions({ row, onClick }: { row: number, onClick: (piece: Piece) => void }) {
    const pieces: Piece[] = [
        { type: Type.Queen, color: row === 7 ? Color.White: Color.Black, position: { i:0, j:0 } },
        { type: Type.Rook, color: row === 7 ? Color.White: Color.Black, position: { i:0, j:0 } },
        { type: Type.Bishop, color: row === 7 ? Color.White: Color.Black, position: { i:0, j:0 } },
        { type: Type.Knight, color: row === 7 ? Color.White: Color.Black, position: { i:0, j:0 } },
    ]

    return (
        <div className={styles.promotionContainer}>
            {pieces.map((piece) => (
                <div
                    key={piece.type}
                    className={styles.promotionOption}
                    onClick={() => {
                        onClick(piece);
                    }}
                >
                    {getIcons(piece)}
                </div>
            ))}
        </div>
    );
}

export default function ChessBoard() {

    const [isWhiteToMove, setWhiteToMove] = useState(true);
    const [isInCheck, setCheck] = useState<Pos | null>(null);
    const [isCheckmate, setCheckmate] = useState(false);
    const [boardVal, setBoardVal] = useState<Board>(getInitialBoard());
    const [highlight, setHighlight] = useState<Pos>({i: -1, j: -1});

    const board = (pos: Pos) => boardVal[8*pos.i + pos.j];

    const kingsRef = useRef<Record<Color, Piece>>({
        'white': boardVal[4]!!,
        'black': boardVal[8*7 + 4]!!
    });
    const kingsMovedRef = useRef<Record<Color, boolean>>({ 'white': false, 'black': false });
    const rooksMovedRef = useRef<Record<Color, [boolean, boolean]>>({
        'white': [false, false],
        'black': [false, false],
    });

    function getDottedSquares(moves: Move[]) {
        let squares: boolean[][] = Array.from({ length: 8 }, () => Array(8).fill(false));
        for(const move of moves)
            squares[move.to.i][move.to.j] = true;
        return squares
    }

    function onSquareClick(pos: Pos) {
        if(board(pos) != null) {
            if (highlight.i != pos.i || highlight.j != pos.j) {
                const move = possibleMoves.find(m => m.to.i == pos.i && m.to.j == pos.j)
                if(move) {
                    movePiece(move!!);
                    setHighlight({i: -1, j: -1});
                    resetPossibleMoves();
                } else if ((board(pos)?.color == Color.White) == isWhiteToMove) {
                    setHighlight(pos);
                    const moves = getPossibleMoves(boardVal, board(pos)!!, isInCheck, kingsRef, kingsMovedRef, rooksMovedRef);
                    setPossibleMoves(moves);
                } else {
                    setHighlight({i: -1, j: -1});
                    resetPossibleMoves();
                }
            }
            else {
                setHighlight({i: -1, j: -1});
                resetPossibleMoves();
            }
        } else {
            const move = possibleMoves.find(m => m.to.i == pos.i && m.to.j == pos.j);
            if(move)
                movePiece(move);
            setHighlight({i: -1, j: -1});
            resetPossibleMoves();
        }
    }

    const [possibleMoves, setPossibleMoves] = useState<Move[]>([]);

    let promotePiece: Piece | null = null;

    function resetPossibleMoves() {
        setPossibleMoves([]);
    }

    function movePiece(move: Move) {
        setCheck(null);
        const newBoardVal = [...boardVal];
        const newBoard = (pos: Pos) => newBoardVal[8*pos.i + pos.j];
        const pos = (i: number, j: number) => ({ i, j } as Pos);

        // Pawn promotion and piece movement
        if(board(move.from)?.type == Type.Pawn && board(move.from)?.color == Color.White && move.to.i == 7)
            newBoardVal[8*move.to.i + move.to.j] = { ...promotePiece!!, position: move.to, lastPosition: move.from };
        else if(board(move.from)?.type == Type.Pawn && board(move.from)?.color == Color.Black && move.to.i == 0)
            newBoardVal[8*move.to.i + move.to.j] = { ...promotePiece!!, position: move.to, lastPosition: move.from };
        else {
            const piece = board(move.from)!!;
            newBoardVal[8*move.to.i + move.to.j] = { ...piece, position: move.to, lastPosition: move.from };
        }
        newBoardVal[8*move.from.i + move.from.j] = null;

        // Update kings and castling
        if(board(move.from)?.type == Type.King) {
            const king: Piece = board(move.from)!!;
            kingsRef.current[king.color] = king;
            if(!kingsMovedRef.current[king.color]) kingsMovedRef.current[king.color] = true;

            if (move.to.j - move.from.j == 2) {
                newBoardVal[8*move.to.i + 5] = newBoard(pos(move.to.i, 7));
                newBoardVal[8*move.to.i + 7] = null;
            } else if (move.to.j - move.from.j == -2) {
                newBoardVal[8*move.to.i + 3] = newBoard(pos(move.to.i, 0));
                newBoardVal[8*move.to.i + 0] = null;
            }
        }

        // Update rooks movement
        if(board(move.from)?.type == Type.Rook) {
            const color = board(move.from)?.color!!;
            if(move.from.i==0 && move.from.j==0 && !rooksMovedRef.current[color][0])
                rooksMovedRef.current[color][0] = true;
            else if(move.from.i==0 && move.from.j==7 && !rooksMovedRef.current[color][1])
                rooksMovedRef.current[color][1] = true;
            else if(move.from.i==7 && move.from.j==0 && !rooksMovedRef.current[color][0])
                rooksMovedRef.current[color][0] = true;
            else if(move.from.i==7 && move.from.j==7 && !rooksMovedRef.current[color][1])
                rooksMovedRef.current[color][1] = true;
        }

        // Update board
        setBoardVal(newBoardVal);
        setWhiteToMove(!isWhiteToMove);

        const checkW = isKingInCheck(newBoardVal, kingsRef.current[Color.White]);
        const checkB = isKingInCheck(newBoardVal, kingsRef.current[Color.White]);
        if(checkW) {
            setCheck(checkW);
            if(isInCheckmate(newBoardVal, checkW, kingsRef.current[Color.White]))
                setCheckmate(true);
        }
        else if(checkB) {
            setCheck(checkB);
            if(isInCheckmate(newBoardVal, checkB, kingsRef.current[Color.Black]))
                setCheckmate(true);
        }
    }

    const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    return (
        <>
            <div className={styles.rowLabels}>
                {Array.from({ length: 8 }).map((_, index) => (
                    <b key={index}>{index+1}</b>
                ))}
            </div>
            <div className={styles.columnLabels}>
                {letters.map((l, index) => (
                    <b key={index}>{l}</b>
                ))}
            </div>
            <div className={styles.chessBoard}>
                {boardVal.map((piece, i) => {
                    const colIndex = i/8;
                    const rowIndex = 7-(i - 8*colIndex);
                    const pos = { i: 7-rowIndex, j: colIndex };
                    const move = possibleMoves.find(m => m.to.i == pos.i && m.to.j == pos.j);

                    if((rowIndex + colIndex)%2 == 0)
                        return (
                            <div
                                role="button"
                                onClick={() => {
                                    if (!move?.promotion)
                                        onSquareClick(pos)
                                }}
                                key={`${rowIndex}-${colIndex}`}
                                className={
                                    (highlight.i == rowIndex && highlight.j == colIndex)
                                        ? styles.highlightedBlackSquare
                                        : (move && getIcons(board(pos)))
                                            ? styles.capSquare
                                            : styles.blackSquare
                                }
                            >
                                {getIcons(board(pos))}
                                {move && (
                                    move.promotion ? (
                                        <Popover
                                            content={
                                                <PromotionOptions
                                                    row={rowIndex}
                                                    onClick={(piece: Piece) => {
                                                        promotePiece = piece;
                                                        onSquareClick(pos);
                                                    }}
                                                />
                                            }
                                            translateX="-90%"
                                        >
                                            <div className={styles.dot}/>
                                        </Popover>
                                    ) : <div className={styles.dot}/>
                                )}
                            </div>

                        );
                    else return (
                        <div
                            role="button"
                            onClick={() => {
                                if (!move?.promotion)
                                    onSquareClick(pos)
                            }}
                            key={`${rowIndex}-${colIndex}`}
                            className={
                                (highlight.i == rowIndex && highlight.j == colIndex)
                                    ? styles.highlightedWhiteSquare
                                    : (move && getIcons(board(pos)))
                                        ? styles.capSquare
                                        : styles.whiteSquare
                            }
                        >
                            {getIcons(board(pos))}
                            {move && (
                                move.promotion ? (
                                    <Popover
                                        content={
                                            <PromotionOptions
                                                row={rowIndex}
                                                onClick={(piece: Piece) => {
                                                    promotePiece = piece;
                                                    onSquareClick(pos);
                                                }}
                                            />
                                        }
                                        translateX="-90%"
                                    >
                                        <div className={styles.dot}/>
                                    </Popover>
                                ) : <div className={styles.dot}/>
                            )}
                        </div>
                    );
                })}
            </div>
            <span style={{ alignSelf: "center", paddingTop: "32px", fontSize: "20px" }}>
                <b>
                    { (isCheckmate && isWhiteToMove) && "CHECKMATE! BLACK WINS! "}
                    { (isCheckmate && !isWhiteToMove) && "CHECKMATE! WHITE WINS! "}
                    { (isInCheck && !isCheckmate) && "Check! " }
                    { !isCheckmate && (isWhiteToMove ? "White" : "Black") }
                </b>
                { !isCheckmate && " to move."}
            </span>
        </>
    )
}