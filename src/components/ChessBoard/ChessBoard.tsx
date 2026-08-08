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
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        ["pB", "pB", "pB", "pB", "pB", "pB", "pB", "pB"],
        ["RB", "NB", "BB", "QB", "KB", "BB", "NB", "RB"]
    ]);

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
                            <div key={`${rowIndex}-${colIndex}`} className={styles.blackSquare}>
                                {icons[board[rowIndex][colIndex] ?? "null"]}
                            </div>

                        );
                    else return (
                        <div key={`${rowIndex}-${colIndex}`} className={styles.whiteSquare}>
                            {icons[board[rowIndex][colIndex] ?? "null"]}
                        </div>
                    );
                })
            )}
        </div>
    )
}