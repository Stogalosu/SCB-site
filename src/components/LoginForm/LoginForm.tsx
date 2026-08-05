"use client";

import styles from "./LoginForm.module.css";
import Spacer from "@/components/Spacer";
import { Mail, KeyRound } from "lucide-react";
import Form from "next/form";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { delay } from "@/app/delay";
import { useRouter } from "next/navigation";

export default function LoginForm() {
    const router = useRouter();

    async function onLogin(formData: FormData) {
        const email = String(formData.get("email") ?? "");
        const password = String(formData.get("password") ?? "");

        const loginPromise = authClient.signIn.email({
            email,
            password,
            rememberMe: false
        }).then(({ data, error }) => {
            if (error)
                throw new Error(error.message);
            return data;
        })

        toast.promise(loginPromise, {
            loading: "Signing in...",
            success: (data) => `Success!`,
            error: (err) => `Error: ${err.message}`,
        });

        let redirect = true;
        await loginPromise.catch(() => { redirect = false });
        if(redirect) {
            await delay(500);
            router.push("/");
        }
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