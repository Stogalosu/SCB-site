"use client";

import styles from "./ChessBoard.module.css";
import { useState, useRef } from "react";
import Image from "next/image";
import Popover from "@/components/Popover/Popover";
import { getInitialBoard } from './chessEngine';

function opp(color: Color): Color {
    return color === "W" ? "B" : "W";
}

const icons: Record<Piece | "null", React.ReactElement | null> = {
    "pW": <Image src="/images/pawn_white.svg" fill alt="white pawn" className={styles.whitePiece}/>,
    "BW": <Image src="/images/bishop_white.svg" fill alt="white bishop" className={styles.whitePiece}/>,
    "NW": <Image src="/images/knight_white.svg" fill alt="white knight" className={styles.whitePiece}/>,
    "RW": <Image src="/images/rook_white.svg" fill alt="white rook" className={styles.whitePiece}/>,
    "QW": <Image src="/images/queen_white.svg" fill alt="white queen" className={styles.whitePiece}/>,
    "KW": <Image src="/images/king_white.svg" fill alt="white king" className={styles.whitePiece}/>,
    "pB": <Image src="/images/pawn_black.svg" fill alt="black pawn" className={styles.blackPiece}/>,
    "BB": <Image src="/images/bishop_black.svg" fill alt="black bishop" className={styles.blackPiece}/>,
    "NB": <Image src="/images/knight_black.svg" fill alt="black knight" className={styles.blackPiece}/>,
    "RB": <Image src="/images/rook_black.svg" fill alt="black rook" className={styles.blackPiece}/>,
    "QB": <Image src="/images/queen_black.svg" fill alt="black queen" className={styles.blackPiece}/>,
    "KB": <Image src="/images/king_black.svg" fill alt="black king" className={styles.blackPiece}/>,
    "null": null
}

function PromotionOptions({ row, onClick }: { row: number, onClick: (piece: Piece) => void }) {
    const pieces: Piece[] = row === 7 ? ["QW", "RW", "BW", "NW"] : ["QB", "RB", "BB", "NB"];

    return (
        <div className={styles.promotionContainer}>
            {pieces.map((piece) => (
                <div
                    key={piece}
                    className={styles.promotionOption}
                    onClick={() => {
                        onClick(piece);
                    }}
                >
                    {icons[piece]}
                </div>
            ))}
        </div>
    );
}

export default function ChessBoard() {

    const [isWhiteToMove, setWhiteToMove] = useState(true);
    const [isInCheck, setCheck] = useState<Pos | null>(null);
    const [isCheckmate, setCheckmate] = useState(false);
    const [board, setBoard] = useState<Board>(getInitialBoard());
    const [highlight, setHighlight] = useState({i: -1, j: -1});

    const kingsRef = useRef<Record<Color, Piece>>({
        'white': board[4]!!,
        'black': board[8*7 + 4]!!
    });
    const kingsMovedRef = useRef<Record<Color, boolean>>({ 'white': false, 'black': false });
    const rooksMovedRef = useRef<Record<Color, [boolean, boolean]>>({
        'white': [false, false],
        'black': [false, false],
    });

    function onSquareClick(rowIndex: number, colIndex: number) {
        if(board[rowIndex][colIndex] != null) {
            if (highlight[0] != rowIndex || highlight[1] != colIndex) {
                if(dottedSquares[rowIndex][colIndex] == true) {
                    movePiece(highlight[0], highlight[1], rowIndex, colIndex);
                    setHighlight([-1, -1]);
                    resetPossibleMoves();
                } else if (board[rowIndex][colIndex].endsWith("W") == isWhiteToMove) {
                    setHighlight([rowIndex, colIndex]);
                    getPossibleMoves(rowIndex, colIndex);
                } else {
                    setHighlight([-1, -1]);
                    resetPossibleMoves();
                }
            }
            else {
                setHighlight([-1, -1]);
                resetPossibleMoves();
            }
        } else {
            if(dottedSquares[rowIndex][colIndex] == true)
                movePiece(highlight[0], highlight[1], rowIndex, colIndex);
            setHighlight([-1, -1]);
            resetPossibleMoves();
        }
    }

    const [dottedSquares, setDottedSquares] = useState(
        Array.from({ length: 8 }, () => Array(8).fill(false))
    );
    const [promotionSqs, setPromotionSqs] = useState(
        Array.from({ length: 8 }, () => Array(8).fill(false))
    );

    let promotePiece: Piece | null = null;

    function resetPossibleMoves() {
        setDottedSquares(Array.from({ length: 8 }, () => Array(8).fill(false)));
        setPromotionSqs(Array.from({ length: 8 }, () => Array(8).fill(false)));
    }

    function isInCheckmate(testBoard: (Piece | null)[][], check: number[], kColor: Color) {
        const i = kingsRef.current[kColor][0], j = kingsRef.current[kColor][1];

        const movesK = [[-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1], [-1, -1]];
        for(const move of movesK) {
            const ii = i+move[0], jj = j+move[1];
            if(inBounds(ii, jj)) {
                if(testBoard[ii][jj] == null) {
                    if(!isKingInCheck(testBoard, ii, jj, kColor))
                        return false;
                }
                else if(testBoard[ii][jj].endsWith(opp(kColor)))
                    if(!isKingInCheck(testBoard, ii, jj, kColor))
                        return false;
            }
        }

        const movesN = [[-2, 1], [-1, 2], [1, 2], [2, 1], [2, -1], [1, -2], [-1, -2], [-2, -1]];
        if(movesN.find(elem => elem[0]==check[0] && elem[1]==check[1])) {
            const ii = i+check[0], jj = j+check[1];
            if(isKingInCheck(testBoard, ii, jj, opp(kColor), true))
                return false;
        } else {
            const div = Math.max(Math.abs(check[0]), Math.abs(check[1]));
            const move = [check[0]/div, check[1]/div];
            let movePi = -1;
            if(kColor == "B") movePi = 1;
            let ii = i+move[0], jj = j+move[1];

            for(; Math.abs(ii-i) <= Math.abs(check[0]) && Math.abs(jj-j) <= Math.abs(check[1]); ii+=move[0], jj+=move[1]) {
                if(isKingInCheck(testBoard, ii, jj, opp(kColor), true))
                    return false;
                let iip = ii+movePi;
                for(let a=1; a<=2 && 0<=iip && iip<=7; a++, iip+=movePi) {
                    if(testBoard[iip][jj]?.toString().startsWith('p'))
                        return false;
                }
            }
        }
        return true;
    }

    function movePiece(i1: number, j1: number, i2: number, j2: number) {
        setCheck(null);
        const newBoard = board.map(r => [...r]);

        // Update kings and castling
        if(board[i1][j1]?.startsWith('K')) {
            if (board[i1][j1] == "KW") {
                kingsRef.current["W"] = [i2, j2];
                if (!kingsMovedRef.current["W"]) kingsMovedRef.current["W"] = true;
            } else if (board[i1][j1] == "KB") {
                kingsRef.current["B"] = [i2, j2];
                if (!kingsMovedRef.current["B"]) kingsMovedRef.current["B"] = true;
            }
            if (j2 - j1 == 2) {
                newBoard[i2][5] = newBoard[i2][7];
                newBoard[i2][7] = null;
            } else if (j2 - j1 == -2) {
                newBoard[i2][3] = newBoard[i2][0];
                newBoard[i2][0] = null;
            }
        }

        // Pawn promotion and piece movement
        if(board[i1][j1] == "pW" && i2 == 7)
            newBoard[i2][j2] = promotePiece;
        else if(board[i1][j1] == "pB" && i2 == 0)
            newBoard[i2][j2] = promotePiece;
        else newBoard[i2][j2] = newBoard[i1][j1];
        newBoard[i1][j1] = null;

        // Update rooks movement
        if(board[i1][j1] == "RW") {
            if(i1==0 && j1==0 && !rooksMovedRef.current["W"][0])
                rooksMovedRef.current["W"][0] = true;
            else if(i1==0 && j1==7 && !rooksMovedRef.current["W"][1])
                rooksMovedRef.current["W"][1] = true;
        } else if(board[i1][j1] == "RB") {
            if(i1==7 && j1==0 && !rooksMovedRef.current["B"][0])
                rooksMovedRef.current["B"][0] = true;
            else if(i1==7 && j1==7 && !rooksMovedRef.current["B"][1])
                rooksMovedRef.current["B"][1] = true;
        }

        // Update board
        setBoard(newBoard);
        setWhiteToMove(!isWhiteToMove);

        const checkW = isKingInCheck(newBoard, kingsRef.current["W"][0], kingsRef.current["W"][1], "W");
        const checkB = isKingInCheck(newBoard, kingsRef.current["B"][0], kingsRef.current["B"][1], "B");
        if(checkW) {
            setCheck(checkW);
            if(isInCheckmate(newBoard, checkW, "W"))
                setCheckmate(true);
        }
        else if(checkB) {
            setCheck(checkB);
            if(isInCheckmate(newBoard, checkB, "B"))
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
                {board.map((row, rowI) =>
                    row.map((col, colI) => {
                        const rowIndex = 7-rowI;
                        const colIndex = colI;

                        if((rowIndex + colIndex)%2 == 0)
                            return (
                                <div
                                    role="button"
                                    onClick={() => {
                                        if(!promotionSqs[rowIndex][colIndex])
                                            onSquareClick(rowIndex, colIndex)
                                    }}
                                    key={`${rowIndex}-${colIndex}`}
                                    className={
                                        (highlight[0] == rowIndex && highlight[1] == colIndex)
                                            ? styles.highlightedBlackSquare
                                            : (dottedSquares[rowIndex][colIndex] == true && icons[board[rowIndex][colIndex] ?? "null"])
                                                ? styles.capSquare
                                                : styles.blackSquare
                                    }
                                >
                                    {icons[board[rowIndex][colIndex] ?? "null"]}
                                    {dottedSquares[rowIndex][colIndex] == true && (
                                        promotionSqs[rowIndex][colIndex] ? (
                                            <Popover
                                                content={
                                                    <PromotionOptions
                                                        row={rowIndex}
                                                        onClick={(piece: Piece) => {
                                                            promotePiece = piece;
                                                            onSquareClick(rowIndex, colIndex);
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
                                    if(!promotionSqs[rowIndex][colIndex])
                                        onSquareClick(rowIndex, colIndex)
                                }}
                                key={`${rowIndex}-${colIndex}`}
                                className={
                                    (highlight[0] == rowIndex && highlight[1] == colIndex)
                                        ? styles.highlightedWhiteSquare
                                        : (dottedSquares[rowIndex][colIndex] == true && icons[board[rowIndex][colIndex] ?? "null"])
                                            ? styles.capSquare
                                            : styles.whiteSquare
                                }
                            >
                                {icons[board[rowIndex][colIndex] ?? "null"]}
                                {dottedSquares[rowIndex][colIndex] == true && (
                                    promotionSqs[rowIndex][colIndex] ? (
                                        <Popover
                                            content={
                                                <PromotionOptions
                                                    row={rowIndex}
                                                    onClick={(piece: Piece) => {
                                                        promotePiece = piece;
                                                        onSquareClick(rowIndex, colIndex);
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
                    })
                )}
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