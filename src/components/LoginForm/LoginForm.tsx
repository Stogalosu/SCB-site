"use client";

import styles from "./LoginForm.module.css";
import Spacer from "@/components/Spacer";
import { Mail, KeyRound } from "lucide-react";
import Form from "next/form";

export default function LoginForm() {
    async function onLogin(formData: FormData) {
        console.log("thios works!!");
    }

    return (
        <Form id="login-form" action={onLogin}>
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
                <Spacer height={20} width={1}/>
                <button
                    type="submit"
                    form="login-form"
                    className={styles.primaryButton}
                >
                    Log in
                </button>
            </div>
        </Form>
    )
}