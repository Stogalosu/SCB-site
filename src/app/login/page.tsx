import styles from "./page.module.css";
import NavBar from "@/components/NavBar/NavBar";
import Spacer from "@/components/Spacer";
import LoginForm from "@/components/LoginForm/LoginForm";
import { Suspense } from "react";

export default function Login() {
    return(
        <>
            <NavBar selectedPage="/login"></NavBar>
            <main className={styles.main}>
                <div className={styles.card}>
                    <div className={styles.title}>Login</div>
                    <Spacer height={30} width={1}/>
                    <Suspense fallback={null}>
                        <LoginForm/>
                    </Suspense>
                    <Spacer height={1} width={1}/>
                </div>
            </main>
        </>
    )
}