import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { LoaiPhong } from "@/db/schema";
import Link from "next/link";
import LogoutButton from "../LogoutButton";
import AdminAddBookingForm from "@/app/admin/add/AdminAddBookingForm";

import Sidebar from "../Sidebar";

export default async function AdminAddBookingPage() {
    const cookieStore = await cookies();
    const isAdmin = cookieStore.get("admin_session");

    if (!isAdmin) {
        redirect("/admin/login");
    }

    const rooms = await db.select().from(LoaiPhong);

    return (
        <div className="min-h-screen bg-gray-100 flex">
            <Sidebar />

            {/* Main Content */}
            <main className="flex-1 p-8">
                <header className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Thêm mới Đặt phòng</h1>
                        <p className="text-gray-500 mt-1">Tạo phiếu đặt phòng cho khách hàng trực tiếp trên hệ thống</p>
                    </div>
                    <Link href="/admin/bookings" className="px-5 py-2 bg-white text-gray-600 border border-gray-200 rounded-lg shadow-sm font-semibold hover:bg-gray-50 transition">
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
