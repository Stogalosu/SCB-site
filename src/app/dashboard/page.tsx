import { auth } from "@/lib/auth";
import Dashboard from "./Dashboard";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if(!session) {
        redirect("/login?error=unauthorized");
    }

    return(<Dashboard session={session}/>)
}