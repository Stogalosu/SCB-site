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
    const [isInCheck, setCheck] = useState<number[] | null>(null);
    const [isCheckmate, setCheckmate] = useState(false);
    const [board, setBoard] = useState<Board>(getInitialBoard());
    const [highlight, setHighlight] = useState([-1, -1]);

    const kingsRef = useRef<Record<Color, number[]>>({ W: [0, 4], B: [7, 4] });
    const kingsMovedRef = useRef<Record<Color, boolean>>({ W: false, B: false });
    const rooksMovedRef = useRef<Record<Color, [boolean, boolean]>>({
        W: [false, false],
        B: [false, false],
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

    function isKingInCheck(board1: (Piece | null)[][], i: number, j: number, color: Color, check: boolean = false) {
        let movesP = [];
        if(color == "W") movesP = [[1, -1], [1, 1]];
        else movesP = [[-1, -1], [-1, 1]];
        const movesN = [[-2, 1], [-1, 2], [1, 2], [2, 1], [2, -1], [1, -2], [-1, -2], [-2, -1]];
        const movesBRQ = [[-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1], [-1, -1]];

        for (const move of movesP) {
            const ii = i+move[0], jj = j+move[1];
            if (inBounds(ii, jj))
                if (board1[ii][jj]?.startsWith("p") && board1[ii][jj]?.endsWith(opp(color)))
                    return move;
        }
        for (const move of movesN) {
            const ii = i+move[0], jj = j+move[1];
            if (inBounds(ii, jj))
                if (board1[ii][jj]?.startsWith("N") && board1[ii][jj]?.endsWith(opp(color)))
                    return move;
        }
        for(const move of movesBRQ) {
            let ii = i+move[0], jj = j+move[1];
            if(inBounds(ii, jj)) {
                if(!check && board1[ii][jj]?.startsWith("K") && board1[ii][jj]?.endsWith(opp(color)))
                    return [ii-i, jj-j];
                for (; inBounds(ii, jj) && (board1[ii][jj]==null || board1[ii][jj] == "K"+color); ii+=move[0], jj+=move[1]);
                if(inBounds(ii, jj)) {
                    const ind = movesBRQ.indexOf(move);

                    if (board1[ii][jj]?.startsWith("Q") && board1[ii][jj]?.endsWith(opp(color)))
                        return [ii-i, jj-j];
                    if(ind%2 == 0) {
                        if (board1[ii][jj]?.startsWith("R") && board1[ii][jj]?.endsWith(opp(color)))
                            return [ii-i, jj-j];
                    }
                    else
                    if (board1[ii][jj]?.startsWith("B") && board1[ii][jj]?.endsWith(opp(color)))
                        return [ii-i, jj-j];
                }
            }
        }
        return null;
    }

    function isCastlingPossible(board1: (Piece | null)[][], i: number, j: number) {
        let rooks = [], color: Color, cast: (false | number[])[] = [[i, j-2], [i, j+2]];
        const moves = [-1, 1];
        if(i==0 && j==4) {
            rooks = [[0, 0], [0, 7]];
            color = "W";
        }
        else if(i==7 && j==4) {
            rooks = [[7, 0], [7, 7]];
            color = "B";
        }
        else return [false, false];

        for(let k=0; k<=1; k++) {
            if(!rooksMovedRef.current[color][k] && !kingsMovedRef.current[color]) {
                for(let jj=j; jj!=rooks[k][1] && cast[k] != false; jj+=moves[k]) {
                    if((board1[i][jj] != null && jj!=4 && jj!=0 && jj!= 7) || isKingInCheck(board1, i, jj, color))
                        cast[k] = false;
                }
            } else return [false, false];
        }
        return cast;
    }

    function getPossibleMoves(i: number, j: number) {
        let possibleMoves = Array.from({ length: 8 }, () => Array(8).fill(false));
        let promotionMoves = Array.from({ length: 8 }, () => Array(8).fill(false));
        const last = board[i][j]?.charAt(1) as Color;

        switch (board[i][j]) {
            case "pW":
                if(!board[i+1][j]) {
                    possibleMoves[i+1][j] = true;
                    if(i+1==7)
                        promotionMoves[i+1][j] = true;
                    if(i==1 && !board[i+2][j])
                        possibleMoves[i+2][j] = true;
                }
                if(board[i+1][j+1] != null && board[i+1][j+1]?.endsWith("B")) {
                    possibleMoves[i+1][j+1] = true;
                    if(i+1==7)
                        promotionMoves[i+1][j+1] = true;
                }
                if(board[i+1][j-1] != null && board[i+1][j-1]?.endsWith("B")) {
                    possibleMoves[i+1][j-1] = true;
                    if(i+1==7)
                        promotionMoves[i+1][j-1] = true;
                }
                setPromotionSqs(promotionMoves);
                break;
            case "pB":
                if(!board[i-1][j]) {
                    possibleMoves[i-1][j] = true;
                    if(i-1==0)
                        promotionMoves[i-1][j] = true;
                    if(i==6 && !board[i-2][j])
                        possibleMoves[i-2][j] = true;
                }
                if(board[i-1][j+1] != null && board[i-1][j+1]?.endsWith("W")) {
                    possibleMoves[i-1][j+1] = true;
                    if(i-1==0)
                        promotionMoves[i-1][j+1] = true;
                }
                if(board[i-1][j-1] != null && board[i-1][j-1]?.endsWith("W")) {
                    possibleMoves[i-1][j-1] = true;
                    if(i-1==0)
                        promotionMoves[i-1][j-1] = true;
                }
                setPromotionSqs(promotionMoves);
                break;
            case "NW":
            case "NB":
                const movesN = [[-2, 1], [-1, 2], [1, 2], [2, 1], [2, -1], [1, -2], [-1, -2], [-2, -1]];
                for(const move of movesN) {
                    const ii = i+move[0], jj = j+move[1];
                    if(inBounds(ii, jj)) {
                        if (board[ii][jj] == null) possibleMoves[ii][jj] = true;
                        else if (board[ii][jj].endsWith(opp(last))) possibleMoves[ii][jj] = true;
                    }
                }
                break;
            case "BW":
            case "BB":
                const movesB = [[-1, 1], [1, 1], [1, -1], [-1, -1]];
                getPossiblePathBRQ(board, i, j, last, movesB, possibleMoves);
                break;
            case "RW":
            case "RB":
                const movesR = [[-1, 0], [0, 1], [1, 0], [0, -1]];
                getPossiblePathBRQ(board, i, j, last, movesR, possibleMoves);
                break;
            case "QW":
            case "QB":
                const movesQ = [[-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1], [-1, -1]];
                getPossiblePathBRQ(board, i, j, last, movesQ, possibleMoves);
                break;
            case "KW":
            case "KB":
                const movesK = [[-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1], [-1, -1]];
                for(const move of movesK) {
                    const ii = i+move[0], jj = j+move[1];
                    if(inBounds(ii, jj)) {
                        if(board[ii][jj] == null) {
                            if (!isKingInCheck(board, ii, jj, last))
                                possibleMoves[ii][jj] = true;
                        }
                        else if(board[ii][jj].endsWith(opp(last)))
                            if(!isKingInCheck(board, ii, jj, last))
                                possibleMoves[ii][jj] = true;
                    }
                }

                // Castling
                const castling = isCastlingPossible(board, i, j);
                for(let k=0; k<=1; k++)
                    if(castling[k] != false) {
                        const cast = castling[k] as number[];
                        possibleMoves[cast[0]][cast[1]] = true;
                    }

                break;
        }

        //Blocking check (if the piece is not a king)
        if(isInCheck && board[i][j] != "KW" && board[i][j] != "KB") {
            let king = kingsRef.current[last];

            const movesN = [[-2, 1], [-1, 2], [1, 2], [2, 1], [2, -1], [1, -2], [-1, -2], [-2, -1]];
            if(!movesN.find(elem => elem[0]==isInCheck[0] && elem[1]==isInCheck[1])) { //You cannot block a check from a knight
                for(let i=0; i<=7; i++) {
                    for(let j=0; j<=7; j++) {
                        if(possibleMoves[i][j] != false && !isInBetween(king[0], king[1], i, j, king[0] + isInCheck[0], king[1] + isInCheck[1]))
                            possibleMoves[i][j] = false;
                    }
                }
            } else {
                // If check is from knight
                const ii = king[0] + isInCheck[0], jj = king[1] + isInCheck[1]
                if(possibleMoves[ii][jj] == true) {
                    //If you can capture the knight, that is the only possible move
                    possibleMoves = Array.from({length: 8}, () => Array(8).fill(false));
                    possibleMoves[ii][jj] = true;
                } else //If you can't, you can't move!
                    possibleMoves = Array.from({length: 8}, () => Array(8).fill(false));
            }
        }

        // Check if piece is pinned
        if(board[i][j] != "KW" && board[i][j] != "KB") {
            const king = kingsRef.current[last];

            for(let ii=0; ii<=7; ii++)
                for(let jj=0; jj<=7; jj++)
                    if(possibleMoves[ii][jj]) {
                        const newBoard = board.map(r => [...r]);
                        newBoard[ii][jj] = board[i][j];
                        newBoard[i][j] = null;
                        if(isKingInCheck(newBoard, king[0], king[1], last))
                            possibleMoves[ii][jj] = false;
                    }
        }

        setDottedSquares(possibleMoves);
    }

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