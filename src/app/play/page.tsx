import NavBar from "@/components/NavBar/NavBar";
import ChessBoard from "@/components/ChessBoard/ChessBoard";
import styles from "./page.module.css";

export default function Play() {
    return (
        <>
            <NavBar selectedPage="/play"/>
            <div className={styles.main}>
                <ChessBoard/>
            </div>
        </>
    )
}