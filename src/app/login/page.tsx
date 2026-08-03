import styles from "./page.module.css";
import NavBar from "@/components/NavBar/NavBar";
import Spacer from "@/components/Spacer";
import { Mail, KeyRound } from "lucide-react";
import Form from "next/form";

export default function Login() {
    return(
        <>
            <NavBar selectedPage="/login"></NavBar>
            <main className={styles.main}>
                <div className={styles.card}>
                    <div className={styles.title}>Login</div>
                    <Spacer height={30} width={1}/>
                    <Form id="login-form" action="">
                        <div className={styles.loginForm}>
                            <div className={styles.loginField}>
                                <Mail className={styles.icon}/>
                                <input
                                    name="email"
                                    placeholder="Email"
                                    className={styles.searchInput}
                                />
                            </div>
                            <div className={styles.loginField}>
                                <KeyRound className={styles.icon}/>
                                <input
                                    name="password"
                                    placeholder="Password"
                                    className={styles.searchInput}
                                />
                            </div>
                        </div>
                    </Form>
                    <Spacer height={30} width={1}/>
                    <div className={styles.ctas}>
                        <a
                            className={styles.primary}
                            href="/"
                        >
                            Sign in
                        </a>
                    </div>
                </div>
            </main>
        </>
    )
}