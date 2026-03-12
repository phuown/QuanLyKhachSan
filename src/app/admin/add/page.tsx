import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { LoaiPhong } from "@/db/schema";
import Link from "next/link";
import LogoutButton from "../LogoutButton";
import AdminAddBookingForm from "@/app/admin/add/AdminAddBookingForm";

export default async function AdminAddBookingPage() {
    const cookieStore = await cookies();
    const isAdmin = cookieStore.get("admin_session");

    if (!isAdmin) {
        redirect("/admin/login");
    }

    const rooms = await db.select().from(LoaiPhong);

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-white min-h-screen flex flex-col hidden md:flex">
                <div className="p-6 text-2xl font-bold border-b border-slate-700">
                    Admin Panel
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    <Link href="/admin" className="block px-4 py-2 bg-blue-600 text-white rounded-lg shadow">
                        Quản lý đặt phòng
                    </Link>
                    <div className="pt-4 mt-4 border-t border-slate-700">
                        <LogoutButton />
                    </div>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8">
                <header className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Thêm mới Đặt phòng</h1>
                        <p className="text-gray-500 mt-1">Tạo phiếu đặt phòng cho khách hàng trực tiếp trên hệ thống</p>
                    </div>
                    <Link href="/admin" className="px-5 py-2 bg-white text-gray-600 border border-gray-200 rounded-lg shadow-sm font-semibold hover:bg-gray-50 transition">
                        &larr; Quay lại danh sách
                    </Link>
                </header>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden p-8">
                    <AdminAddBookingForm rooms={rooms} />
                </div>
            </main>
        </div>
    );
}
