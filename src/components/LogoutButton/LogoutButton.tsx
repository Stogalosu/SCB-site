"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

export default function LogoutButton() {
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

    return (<LogOut onClick={onLogout}/>)
}