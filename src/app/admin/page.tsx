import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import LogoutButton from "./LogoutButton";
import { getDashboardStatsAction } from "./actions";
import DashboardClient from "./dashboard/DashboardClient";

export default async function AdminDashboardPage() {
    const cookieStore = await cookies();
    const isAdmin = cookieStore.get("admin_session");

    if (!isAdmin) {
        redirect("/admin/login");
    }

    redirect("/admin/dashboard");
}
