import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Sidebar from "../Sidebar";
import { getDashboardStatsAction } from "../actions";
import DashboardClient from "./DashboardClient";

export default async function AdminDashboardPage() {
    const cookieStore = await cookies();
    const isAdmin = cookieStore.get("admin_session");

    if (!isAdmin) {
        redirect("/admin/login");
    }

    const res = await getDashboardStatsAction();
    const stats = res.success && res.data ? res.data : { totalGuests: 0, totalBookingGuests: 0, roomStats: [], totalRooms: 0 };

    return (
        <div className="min-h-screen bg-gray-100 flex">
            <Sidebar />

            {/* Main Content */}
            <DashboardClient stats={stats} />
        </div>
    );
}
