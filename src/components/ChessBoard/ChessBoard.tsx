"use client";

import styles from "./ChessBoard.module.css";
import { useState } from "react";
import { ChessPawn, ChessBishop, ChessKnight, ChessRook, ChessQueen, ChessKing } from "lucide-react";
import Image from "next/image";

export default function ChessBoard() {
    const [board, setBoard] = useState([
        ["RW", "NW", "BW", "QW", "KW", "BW", "NW", "RW"],
        ["pW", "pW", "pW", "pW", "pW", "pW", "pW", "pW"],
        [null, null, null, null, null, null, null, null],
        [null, "KB", null, "BB", "QB", null, "RW", null],
        [null, null, null, null, "NW", null, null, null],
        [null, "pW", "NW", null, null, null, null, null],
        ["pB", "pB", "pB", "pB", "pB", "pB", "pB", "pB"],
        ["RB", "NB", "BB", "QB", "KB", "BB", "NB", "RB"]
    ]);
    const [highlight, setHighlight] = useState([-1, -1]);

    function onSquareClick(rowIndex: int, colIndex: int) {
        if(board[rowIndex][colIndex] != null) {
            if (highlight[0] != rowIndex || highlight[1] != colIndex) {
                setHighlight([rowIndex, colIndex]);
                getPossibleMoves(rowIndex, colIndex);
            }
            else {
                setHighlight([-1, -1]);
                resetPossibleMoves();
            }
        } else {
            setHighlight([-1, -1]);
            resetPossibleMoves();
        }
    }

    const [dottedSquares, setDottedSquares] = useState(
        Array.from({ length: 8 }, () => Array(8).fill(false))
    );

    function getPossiblePathBRQ(i: number, j: number, last: string, moves: number[][], possibleMoves: number[][]) {
        const opp = { "W": "B", "B": "W" };

        for(const move of moves) {
            let ii = i+move[0], jj = j+move[1];
            if(0<=ii && ii<=7 && 0<=jj && jj<=7) {
                for (; board[ii][jj] == null && 0 <= ii && ii <= 7 && 0 <= jj && jj <= 7; ii += move[0], jj += move[1]) {
                    possibleMoves[ii][jj] = true;
                }
                if (board[ii][jj]?.endsWith(opp[last]))
                    possibleMoves[ii][jj] = true;
            }
        }
    }

    function isKingInCheck(i: number, j: number, color: string) {
        const opp = { "W": "B", "B": "W" };
        let movesP = [];
        if(color == "W") movesP = [[1, -1], [1, 1]];
        else movesP = [[-1, -1], [-1, 1]];
        const movesN = [[-2, 1], [-1, 2], [1, 2], [2, 1], [2, -1], [1, -2], [-1, -2], [-2, -1]];
        const movesBRQ = [[-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1], [-1, -1]];

        for (const move of movesP) {
            const ii = i+move[0], jj = j+move[1];
            if (0<=ii && ii<=7 && 0<=jj && jj<=7)
                if (board[ii][jj]?.startsWith("p") && board[ii][jj]?.endsWith(opp[color]))
                    return true;
        }
        for (const move of movesN) {
            const ii = i+move[0], jj = j+move[1];
            if (0<=ii && ii<=7 && 0<=jj && jj<=7)
                if (board[ii][jj]?.startsWith("N") && board[ii][jj]?.endsWith(opp[color]))
                    return true;
        }
        for(const move of movesBRQ) {
            let ii = i+move[0], jj = j+move[1];
            if(0<=ii && ii<=7 && 0<=jj && jj<=7) {
                for (; board[ii][jj]==null && 0<=ii && ii<=7 && 0<=jj && jj<=7; ii+=move[0], jj+=move[1]);
                const ind = movesBRQ.indexOf(move);

                if (board[ii][jj]?.startsWith("Q") && board[ii][jj]?.endsWith(opp[color]))
                    return true;
                if(ind%2 == 0) {
                    if (board[ii][jj]?.startsWith("R") && board[ii][jj]?.endsWith(opp[color]))
                        return true;
                }
                else
                    if (board[ii][jj]?.startsWith("B") && board[ii][jj]?.endsWith(opp[color]))
                        return true;
            }
        }
        return false;
    }

    function getPossibleMoves(i: int, j: int) {
        const possibleMoves = Array.from({ length: 8 }, () => Array(8).fill(false));
        const opp = { "W": "B", "B": "W" };
        const last = board[i][j].charAt(1);

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
                    if(0<=ii && ii<=7 && 0<=jj && jj<=7) {
                        if (board[ii][jj] == null) possibleMoves[ii][jj] = true;
                        else if (board[ii][jj].endsWith(opp[last])) possibleMoves[ii][jj] = true;
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
                    if(0<=ii && ii<=7 && 0<=jj && jj<=7) {
                        if(board[ii][jj] == null) {
                            if (!isKingInCheck(ii, jj, last))
                                possibleMoves[ii][jj] = true;
                        }
                        else if(board[ii][jj].endsWith(opp[last]))
                            if(!isKingInCheck(ii, jj, last))
                                possibleMoves[ii][jj] = true;
                    }
                }
                break;
        }

        setDottedSquares(possibleMoves);
    }

    function resetPossibleMoves() {
        setDottedSquares(Array.from({ length: 8 }, () => Array(8).fill(false)));
    }

    const icons = {
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
    )
}