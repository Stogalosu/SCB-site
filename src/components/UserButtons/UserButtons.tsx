"use client";

import { LogOut, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import styles from "./UserButtons.module.css";
import LinkButton from "@/components/LinkButton/LinkButton";
import Popover from "@/components/Popover/Popover";

function UserDetails({ session }: { session: object }) {
    return (
        <div className={styles.userDetContainer}>
            <div className={styles.userDet}>
                <span>Username</span>
                <b>{session.user.name}</b>
            </div>
            <div className={styles.userDet}>
                <span>Email</span>
                <b>{session.user.email}</b>
            </div>
            <div className={styles.userDet}>
                <span>Random stat</span>
                <b>{Math.floor(Math.random() * 1000)}</b>
            </div>
        </div>
    )
}

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
                <Popover
                    content={<UserDetails session={session}/>}
                    translateX="-90%"
                >
                    <User className={styles.clickable}/>
                </Popover>
                <LogOut className={styles.clickable} onClick={onLogout}/>
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