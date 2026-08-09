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
        [null, null, null, "BB", "QB", null, "RW", null],
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

    function getPossibleMoves(i: int, j: int) {
        const possibleMoves = Array.from({ length: 8 }, () => Array(8).fill(false));
        const opp = { "W": "B", "B": "W" };

        switch (board[i][j]) {
            case "pW":
                if(!board[i+1][j]) possibleMoves[i+1][j] = true;
                if(board[i+1][j+1] != null && board[i+1][j+1]?.endsWith("B")) possibleMoves[i+1][j+1] = true;
                if(board[i+1][j-1] != null && board[i+1][j-1]?.endsWith("B")) possibleMoves[i+1][j-1] = true;
                break;
            case "pB":
                if(!board[i-1][j]) possibleMoves[i-1][j] = true;
                if(board[i-1][j+1] != null && board[i-1][j+1]?.endsWith("W")) possibleMoves[i-1][j+1] = true;
                if(board[i-1][j-1] != null && board[i-1][j-1]?.endsWith("W")) possibleMoves[i-1][j-1] = true;
                break;
            case "NW":
            case "NB":
                const lastN = board[i][j].charAt(1);
                const movesN = [[-2, 1], [-1, 2], [1, 2], [2, 1], [2, -1], [1, -2], [-1, -2], [-2, -1]];
                for(const move of movesN) {
                    const ii = i+move[0];
                    const jj = j+move[1];
                    if(0<=ii && ii<=7 && 0<=jj && jj<=7) {
                        if (board[ii][jj] == null) possibleMoves[ii][jj] = true;
                        else if (board[ii][jj].endsWith(opp[lastN])) possibleMoves[ii][jj] = true;
                    }
                }
                break;
            case "BW":
            case "BB":
                const lastB = board[i][j].charAt(1);
                const movesB = [[-1, 1], [1, 1], [1, -1], [-1, -1]];
                getPossiblePathBRQ(i, j, lastB, movesB, possibleMoves);
                break;
            case "RW":
            case "RB":
                const lastR = board[i][j].charAt(1);
                const movesR = [[-1, 0], [0, 1], [1, 0], [0, -1]];
                getPossiblePathBRQ(i, j, lastR, movesR, possibleMoves);
                break;
            case "QW":
            case "QB":
                const lastQ = board[i][j].charAt(1);
                const movesQ = [[-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1], [-1, -1]];
                getPossiblePathBRQ(i, j, lastQ, movesQ, possibleMoves);
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