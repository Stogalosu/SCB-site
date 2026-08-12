"use client";

import styles from "./page.module.css";
import NavBar from "@/components/NavBar/NavBar";
import { toast } from "sonner";

type Session = {
    user: {
        name?: string | null;
    };
};

export default function Dashboard({ session }: { session: Session }) {
    return (
        <>
            <NavBar selectedPage="/dashboard"/>
            <div className={styles.main}>
                <div className={styles.content}>
                    <h1>Welcome back, {session.user.name}</h1>
                    <p>Your games will appear here.</p>
                    <p>(Not yet tho, it's still WIP)</p>
                </div>
            </div>
        </>
    )
}