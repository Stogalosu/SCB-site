"use client";

import styles from "./ChessBoard.module.css";
import { useState } from "react";
import { ChessPawn, ChessBishop, ChessKnight, ChessRook, ChessQueen, ChessKing } from "lucide-react";
import Image from "next/image";
import type { DetailedHTMLProps, HTMLAttributes } from "react";

type Color = "W" | "B";
function opp(color: Color): Color {
    return color === "W" ? "B" : "W";
}

type Piece =
    | "pW" | "BW" | "NW" | "RW" | "QW" | "KW"
    | "pB" | "BB" | "NB" | "RB" | "QB" | "KB";

export default function ChessBoard() {
    function inBounds(i: number, j: number) {
        return 0<=i && i<=7 && 0<=j && j<=7
    }

    function isInBetween(kingI: number, kingJ: number, sqI: number, sqJ: number, attI: number, attJ: number) {
        const collinear = (sqJ - kingJ) * (attI - kingI) == (attJ - kingJ) * (sqI - kingI);
        const between =
            Math.min(kingI, attI) <= sqI &&
            sqI <= Math.max(kingI, attI) &&
            Math.min(kingJ, attJ) <= sqJ &&
            sqJ <= Math.max(kingJ, attJ);

        return collinear && between;
    }

    const [isWhiteToMove, setWhiteToMove] = useState(true);
    const [kings, setKings] = useState([[0, 4], [7, 4]]);
    const [isInCheck, setCheck] = useState<number[] | null>(null);
    const [isCheckmate, setCheckmate] = useState(false);
    const [board, setBoard] = useState<(Piece | null)[][]>([
        ["RW", "NW", "BW", "QW", "KW", "BW", "NW", "RW"],
        ["pW", "pW", "pW", "pW", "pW", "pW", "pW", "pW"],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        ["pB", "pB", "pB", "pB", "pB", "pB", "pB", "pB"],
        ["RB", "NB", "BB", "QB", "KB", "BB", "NB", "RB"]
    ]);
    const [highlight, setHighlight] = useState([-1, -1]);

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

    function getPossiblePathBRQ(i: number, j: number, last: Color, moves: number[][], possibleMoves: boolean[][]) {
        for(const move of moves) {
            let ii = i+move[0], jj = j+move[1];
            if(inBounds(ii, jj)) {
                for (; inBounds(ii, jj) && board[ii][jj] == null; ii += move[0], jj += move[1]) {
                    possibleMoves[ii][jj] = true;
                }
                if(inBounds(ii, jj))
                    if (board[ii][jj]?.endsWith(opp(last)))
                        possibleMoves[ii][jj] = true;
            }
        }
    }

    function isKingInCheck(i: number, j: number, color: Color, check: boolean = false) {
        let movesP = [];
        if(color == "W") movesP = [[1, -1], [1, 1]];
        else movesP = [[-1, -1], [-1, 1]];
        const movesN = [[-2, 1], [-1, 2], [1, 2], [2, 1], [2, -1], [1, -2], [-1, -2], [-2, -1]];
        const movesBRQ = [[-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1], [-1, -1]];

        for (const move of movesP) {
            const ii = i+move[0], jj = j+move[1];
            if (inBounds(ii, jj))
                if (board[ii][jj]?.startsWith("p") && board[ii][jj]?.endsWith(opp(color)))
                    return move;
        }
        for (const move of movesN) {
            const ii = i+move[0], jj = j+move[1];
            if (inBounds(ii, jj))
                if (board[ii][jj]?.startsWith("N") && board[ii][jj]?.endsWith(opp(color)))
                    return move;
        }
        for(const move of movesBRQ) {
            let ii = i+move[0], jj = j+move[1];
            if(inBounds(ii, jj)) {
                if(!check && board[ii][jj]?.startsWith("K") && board[ii][jj]?.endsWith(opp(color)))
                    return [ii-i, jj-j];
                for (; inBounds(ii, jj) && (board[ii][jj]==null || board[ii][jj] == "K"+color); ii+=move[0], jj+=move[1]);
                if(inBounds(ii, jj)) {
                    const ind = movesBRQ.indexOf(move);

                    if (board[ii][jj]?.startsWith("Q") && board[ii][jj]?.endsWith(opp(color)))
                        return [ii-i, jj-j];
                    if(ind%2 == 0) {
                        if (board[ii][jj]?.startsWith("R") && board[ii][jj]?.endsWith(opp(color)))
                            return [ii-i, jj-j];
                    }
                    else
                        if (board[ii][jj]?.startsWith("B") && board[ii][jj]?.endsWith(opp(color)))
                            return [ii-i, jj-j];
                }
            }
        }
        return null;
    }

    function getPossibleMoves(i: number, j: number) {
        let possibleMoves = Array.from({ length: 8 }, () => Array(8).fill(false));
        const last = board[i][j]?.charAt(1) as Color;

        switch (board[i][j]) {
            case "pW":
                if(!board[i+1][j]) {
                    possibleMoves[i+1][j] = true;
                    if(i==1 && !board[i+2][j])
                        possibleMoves[i+2][j] = true;
                }
                if(board[i+1][j+1] != null && board[i+1][j+1]?.endsWith("B")) possibleMoves[i+1][j+1] = true;
                if(board[i+1][j-1] != null && board[i+1][j-1]?.endsWith("B")) possibleMoves[i+1][j-1] = true;
                break;
            case "pB":
                if(!board[i-1][j]) {
                    possibleMoves[i-1][j] = true;
                    if(i==6 && !board[i-2][j])
                        possibleMoves[i-2][j] = true;
                }
                if(board[i-1][j+1] != null && board[i-1][j+1]?.endsWith("W")) possibleMoves[i-1][j+1] = true;
                if(board[i-1][j-1] != null && board[i-1][j-1]?.endsWith("W")) possibleMoves[i-1][j-1] = true;
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
                getPossiblePathBRQ(i, j, last, movesB, possibleMoves);
                break;
            case "RW":
            case "RB":
                const movesR = [[-1, 0], [0, 1], [1, 0], [0, -1]];
                getPossiblePathBRQ(i, j, last, movesR, possibleMoves);
                break;
            case "QW":
            case "QB":
                const movesQ = [[-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1], [-1, -1]];
                getPossiblePathBRQ(i, j, last, movesQ, possibleMoves);
                break;
            case "KW":
            case "KB":
                const movesK = [[-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1], [-1, -1]];
                for(const move of movesK) {
                    const ii = i+move[0], jj = j+move[1];
                    if(inBounds(ii, jj)) {
                        if(board[ii][jj] == null) {
                            if (!isKingInCheck(ii, jj, last))
                                possibleMoves[ii][jj] = true;
                        }
                        else if(board[ii][jj].endsWith(opp(last)))
                            if(!isKingInCheck(ii, jj, last))
                                possibleMoves[ii][jj] = true;
                    }
                }
                break;
        }

        //Blocking check (if the piece is not a king)
        if(isInCheck && board[i][j] != "KW" && board[i][j] != "KB") {
            let king = [];
            if(last == "W")  king = kings[0];
            else king = kings[1];
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
        setDottedSquares(possibleMoves);
    }

    function resetPossibleMoves() {
        setDottedSquares(Array.from({ length: 8 }, () => Array(8).fill(false)));
    }

    function isInCheckmate(check: number[], kColor: Color) {
        let i, j;
        if(kColor == "W") {
            i = kings[0][0];
            j = kings[0][1];
        }
        else {
            i = kings[1][0];
            j = kings[1][1];
        }

        const movesK = [[-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1], [-1, -1]];
        for(const move of movesK) {
            const ii = i+move[0], jj = j+move[1];
            if(inBounds(ii, jj)) {
                if(board[ii][jj] == null) {
                    if(!isKingInCheck(ii, jj, kColor))
                        return false;
                }
                else if(board[ii][jj].endsWith(opp(kColor)))
                    if(!isKingInCheck(ii, jj, kColor))
                        return false;
            }
        }

        const movesN = [[-2, 1], [-1, 2], [1, 2], [2, 1], [2, -1], [1, -2], [-1, -2], [-2, -1]];
        if(movesN.find(elem => elem[0]==check[0] && elem[1]==check[1])) {
            const ii = i+check[0], jj = j+check[1];
            if(isKingInCheck(ii, jj, opp(kColor), true))
                return false;
        } else {
            const div = Math.max(check[0], check[1]);
            const move = [check[0]/div, check[1]/div];
            let movePi = -1;
            if(kColor == "B") movePi = 1;
            let ii = i+move[0], jj = j+move[1];

            for(; Math.abs(ii-i) <= Math.abs(check[0]) && Math.abs(jj-j) <= Math.abs(check[1]); ii+=move[0], jj+=move[1]) {
                if(isKingInCheck(ii, jj, opp(kColor), true))
                    return false;
                let iip = ii+movePi;
                for(let a=1; a<=2 && 0<=iip && iip<=7; a++, iip+=movePi) {
                    if(board[iip][jj]?.toString().startsWith('p'))
                        return false;
                }
            }
        }
        return true;
    }

    function movePiece(i1: number, j1: number, i2: number, j2: number) {
        setCheck(null);

        let newKings = kings;
        if(board[i1][j1] == "KW")
            newKings = [[i2, j2], kings[1]];
        if(board[i1][j1] == "KB")
            newKings = [kings[0], [i2, j2]];
        setKings(newKings);

        let newBoard = board;
        if(board[i1][j1] == "pW" && i2 == 7)
            newBoard[i2][j2] = "QW";
        else if(board[i1][j1] == "pB" && i2 == 0)
            newBoard[i2][j2] = "QB";
        else newBoard[i2][j2] = newBoard[i1][j1];
        newBoard[i1][j1] = null;
        setBoard(newBoard);
        setWhiteToMove(!isWhiteToMove);

        const checkW = isKingInCheck(newKings[0][0], newKings[0][1], "W");
        const checkB = isKingInCheck(newKings[1][0], newKings[1][1], "B");
        if(checkW) {
            setCheck(checkW);
            if(isInCheckmate(checkW, "W"))
                setCheckmate(true);
        }
        else if(checkB) {
            setCheck(checkB);
            if(isInCheckmate(checkB, "B"))
                setCheckmate(true);
        }
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

    return (
        <>
            <div className={styles.chessBoard}>
                {board.map((row, rowIndex) =>
                    row.map((col, colIndex) => {
                        if((rowIndex + colIndex)%2 == 0)
                            return (
                                <div
                                    role="button"
                                    onClick={() => onSquareClick(rowIndex, colIndex)}
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
                                    {dottedSquares[rowIndex][colIndex] == true && <div className={styles.dot}/> }
                                </div>

                            );
                        else return (
                            <div
                                role="button"
                                onClick={() => onSquareClick(rowIndex, colIndex)}
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
                                {dottedSquares[rowIndex][colIndex] == true && <div className={styles.dot}/>}
                            </div>
                        );
                    })
                )}
            </div>
            <span style={{ alignSelf: "center", paddingTop: "14px", fontSize: "20px" }}>
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