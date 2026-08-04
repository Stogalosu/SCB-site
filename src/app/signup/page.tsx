import styles from "./page.module.css";
import NavBar from "@/components/NavBar/NavBar";
import Spacer from "@/components/Spacer";
import SignupForm from "@/components/SignupForm/SignupForm";

export default function Signup() {
    return(
        <>
            <NavBar selectedPage="/signup"></NavBar>
            <main className={styles.main}>
                <div className={styles.card}>
                    <div className={styles.title}>Sign up</div>
                    <Spacer height={30} width={1}/>
                    <SignupForm/>
                    <Spacer height={1} width={1}/>
                </div>
            </main>
        </>
    )
}