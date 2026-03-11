import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { LoaiPhong, AnhLoaiPhong } from "@/db/schema";
import { asc } from "drizzle-orm";
import Link from "next/link";
import LogoutButton from "../LogoutButton";
import RoomsClient from "./RoomsClient";

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
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-white min-h-screen flex-col hidden md:flex">
                <div className="p-6 text-2xl font-bold border-b border-slate-700">
                    Admin Panel
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    <Link href="/admin" className="block px-4 py-2 text-slate-300 hover:bg-slate-800 rounded-lg transition">
                        Quản lý đặt phòng
                    </Link>
                    <Link href="/admin/rooms" className="block px-4 py-2 bg-blue-600 rounded-lg shadow">
                        Quản lý loại phòng
                    </Link>
                    <div className="pt-4 mt-4 border-t border-slate-700">
                        <LogoutButton />
                    </div>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8">
                <RoomsClient rooms={allRooms} images={allImages} />
            </main>
        </div>
    );
}
