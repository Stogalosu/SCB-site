"use client";

import styles from "./ChessBoard.module.css";
import { useState } from "react";

export default function ChessBoard() {
    const [board, setBoard] = useState([
        ["RW", "NW", "BW", "QW", "KW", "BW", "NW", "RW"],
        ["pW", "pW", "pW", "pW", "pW", "pW", "pW", "pW"],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        ["pB", "pB", "pB", "pB", "pB", "pB", "pB", "pB"],
        ["RB", "NB", "BB", "QB", "KB", "BB", "NB", "RB"]
    ]);

    return (
        <div className={styles.chessBoard}>
            {board.map((row, rowIndex) =>
                row.map((col, colIndex) => {
                    if((rowIndex + colIndex)%2 == 0)
                        return (
                            <div className={styles.blackSquare}>
                                {board[rowIndex][colIndex]}
                            </div>
                        );
                    else return (
                        <div className={styles.whiteSquare}>
                            {board[rowIndex][colIndex]}
                        </div>
                    );
                })
            )}
        </div>
    )
}