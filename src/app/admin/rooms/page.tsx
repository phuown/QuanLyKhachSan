import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { LoaiPhong, AnhLoaiPhong } from "@/db/schema";
import { asc } from "drizzle-orm";
import Link from "next/link";
import LogoutButton from "../LogoutButton";
import RoomsClient from "./RoomsTypeClient";

import Sidebar from "../Sidebar";

export default async function AdminRoomsPage() {
    const cookieStore = await cookies();
    const isAdmin = cookieStore.get("admin_session");

    if (!isAdmin) {
        redirect("/admin/login");
    }

    const allRooms = await db.select().from(LoaiPhong).orderBy(asc(LoaiPhong.maLoaiPhong));
    const allImages = await db.select({
        maLoaiPhong: AnhLoaiPhong.maLoaiPhong,
        imageUrl: AnhLoaiPhong.imageUrl,
    }).from(AnhLoaiPhong);

    return (
        <div className="min-h-screen bg-gray-100 flex">
            <Sidebar />

            {/* Main Content */}
            <main className="flex-1 p-8">
                <RoomsClient rooms={allRooms} images={allImages} />
            </main>
        </div>
    );
}
