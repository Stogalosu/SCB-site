"use client";

import { LogOut, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import styles from "./UserButtons.module.css";
import LinkButton from "@/components/LinkButton/LinkButton";
import Popover from "@/components/Popover/Popover";
import PrimaryButton from "@/components/PrimaryButton/PrimaryButton";
import Spacer from "@/components/Spacer";

type Session = {
    user: {
        name?: string | null;
        email?: string | null;
    };
};

function UserDetails({ session }: { session: Session }) {
    const router = useRouter();

    async function onLogout() {
        const logoutPromise = authClient.signOut()

        toast.promise(logoutPromise, {
            loading: "Logging out...",
            success: async (data) => {
                return `Successfully logged out!`
            },
            error: (err) => `Error: ${err.message}`,
        });

        await logoutPromise;
        router.push("/");
    }

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
            <PrimaryButton onClick={onLogout}>
                <LogOut/>
                <span style={{ fontSize: "16px" }}>Logout</span>
            </PrimaryButton>
        </div>
    )
}

export default function UserButtons({ selectedPage }: { selectedPage: string }) {
    const { data: session, isPending } = authClient.useSession();

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