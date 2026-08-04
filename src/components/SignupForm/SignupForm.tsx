"use client";

import Spacer from "@/components/Spacer";
import styles from "./SignupForm.module.css";
import { Mail, KeyRound, User } from "lucide-react";
import Form from "next/form";
import { toast } from "sonner";
import { redirect } from "next/navigation";

export default function SignupForm() {
    async function onSignup(formData: FormData) {

    }

    return (
        <Form id="signup-form" action={onSignup}>
            <div className={styles.loginForm}>
                <div className={styles.loginField}>
                    <User className={styles.icon}/>
                    <input
                        name="username"
                        placeholder="Username"
                        className={styles.searchInput}
                    />
                </div>
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
                    form="signup-form"
                    className={styles.primaryButton}
                >
                    Sign up!
                </button>
            </div>
        </Form>
    )
}