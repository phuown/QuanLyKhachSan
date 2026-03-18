import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { KhuyenMai } from "@/db/schema";
import { asc } from "drizzle-orm";
import Link from "next/link";
import LogoutButton from "../LogoutButton";
import KhuyenMaiClient from "./KhuyenMaiClient";

import Sidebar from "../Sidebar";

export default async function AdminKhuyenMaiPage() {
    const cookieStore = await cookies();
    const isAdmin = cookieStore.get("admin_session");

    if (!isAdmin) {
        redirect("/admin/login");
    }

    const allPromotions = await db.select().from(KhuyenMai).orderBy(asc(KhuyenMai.maKhuyenMai));

    return (
        <div className="min-h-screen bg-gray-100 flex">
            <Sidebar />

            {/* Main Content */}
            <KhuyenMaiClient promotions={allPromotions} />
        </div>
    );
}
