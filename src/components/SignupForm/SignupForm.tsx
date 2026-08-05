"use client";

import Spacer from "@/components/Spacer";
import styles from "./SignupForm.module.css";
import { Mail, KeyRound, User } from "lucide-react";
import Form from "next/form";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { delay } from "@/app/delay";
import { useRouter } from "next/navigation";

export default function SignupForm() {
    const router = useRouter();

    async function onSignup(formData: FormData) {
        const username = String(formData.get("username") ?? "");
        const email = String(formData.get("email") ?? "");
        const password = String(formData.get("password") ?? "");

        const signupPromise = authClient.signUp.email({
            email,
            password,
            name: username,
        }).then(({ data, error }) => {
            if (error)
                throw new Error(error.message);
            return data;
        });

        toast.promise(signupPromise, {
            loading: "Signing up...",
            success: (data) => `Success! You are now logged in!`,
            error: (err) => `Error: ${err.message}`,
        });

        let redirect = true;
        await signupPromise.catch(() => { redirect = false });
        if(redirect) {
            await delay(500);
            router.push("/");
        }
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
                <Spacer height={5} width={1}/>
                <a href="/login" className={styles.link}>
                    Already have an account?
                </a>
            </div>
        </Form>
    )
}