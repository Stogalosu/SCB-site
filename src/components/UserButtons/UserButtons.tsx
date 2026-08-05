"use client";

import { LogOut, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import styles from "./UserButtons.module.css";
import LinkButton from "@/components/LinkButton/LinkButton";

export default function UserButtons({ selectedPage }: { selectedPage: string }) {
    const { data: session, isPending } = authClient.useSession();

    const router = useRouter();

    async function onLogout() {
        const logoutPromise = authClient.signOut()

        toast.promise(logoutPromise, {
            loading: "Logging out...",
            success: async (data) => {
                const { data: session, error } = await authClient.getSession()
                console.log(session);
                return `Successfully logged out!`
            },
            error: (err) => `Error: ${err.message}`,
        });
    }

    if(session)
        return (
            <div className={styles.userButtonsRow}>
                { session.user.name }
                <User/>
                <LogOut onClick={onLogout}/>
            </div>
        );
    else
        return (
            <LinkButton
                text="Login"
                link={"/login"}
                selected={selectedPage === "/login"}
            />
        );
}