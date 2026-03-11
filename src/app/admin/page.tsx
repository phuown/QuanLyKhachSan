import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { KhachHang, PhieuDatPhong, chiTietPhieuDatPhong, LoaiPhong } from "@/db/schema";
import { eq, asc, lt, and, isNotNull, inArray } from "drizzle-orm";
import Link from "next/link";
import LogoutButton from "./LogoutButton";
import BookingStatusSelect from "./BookingStatusSelect";
import StatusFilter from "./StatusFilter";

export default async function AdminBookingsPage(props: {
    searchParams?: Promise<{ status?: string }>;
}) {
    const searchParams = await props.searchParams;
    const statusFilter = searchParams?.status;

    const cookieStore = await cookies();
    const isAdmin = cookieStore.get("admin_session");

    if (!isAdmin) {
        redirect("/admin/login");
    }

    // Tự động xóa phiếu đặt phòng đã hủy hoặc đã trả phòng sau 1 ngày
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    try {
        // Tìm các mã phiếu cần xóa
        const bookingsToDelete = await db
            .select({ maPhieu: PhieuDatPhong.maPhieuDatPhong })
            .from(PhieuDatPhong)
            .where(
                and(
                    isNotNull(PhieuDatPhong.ngayHuy),
                    lt(PhieuDatPhong.ngayHuy, oneDayAgo)
                )
            );

        if (bookingsToDelete.length > 0) {
            const ids = bookingsToDelete.map(b => b.maPhieu);
            // Xóa chi tiết trước
            await db.delete(chiTietPhieuDatPhong).where(inArray(chiTietPhieuDatPhong.maPhieuDatPhong, ids));
            // Xóa phiếu sau
            await db.delete(PhieuDatPhong).where(inArray(PhieuDatPhong.maPhieuDatPhong, ids));
        }
    } catch (error) {
        console.error("Lỗi khi tự động xóa phiếu cũ:", error);
    }

    const query = db
        .select({
            maPhieu: PhieuDatPhong.maPhieuDatPhong,
            ngayDat: PhieuDatPhong.ngayDat,
            ngayNhanPhong: PhieuDatPhong.ngayNhanPhong,
            ngayTraPhong: PhieuDatPhong.ngayTraPhong,
            trangThai: PhieuDatPhong.trangThai,
            soLuongPhong: chiTietPhieuDatPhong.soLuongPhong,
            tenLoaiPhong: LoaiPhong.tenLoaiPhong,
            hoten: KhachHang.hoten,
            sdt: KhachHang.sdt,
            email: KhachHang.email,
        })
        .from(PhieuDatPhong)
        .innerJoin(KhachHang, eq(PhieuDatPhong.maKhachHang, KhachHang.maKhachHang))
        .innerJoin(chiTietPhieuDatPhong, eq(PhieuDatPhong.maPhieuDatPhong, chiTietPhieuDatPhong.maPhieuDatPhong))
        .innerJoin(LoaiPhong, eq(chiTietPhieuDatPhong.maLoaiPhong, LoaiPhong.maLoaiPhong));

    if (statusFilter && statusFilter !== "all") {
        query.where(eq(PhieuDatPhong.trangThai, statusFilter));
    }

    const allBookings = await query.orderBy(asc(PhieuDatPhong.maPhieuDatPhong));

    const formatDate = (date: Date | string) => {
        if (!date) return "";
        const d = new Date(date);
        return d.toLocaleDateString("vi-VN");
    };

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-white min-h-screen flex flex-col hidden md:flex">
                <div className="p-6 text-2xl font-bold border-b border-slate-700">
                    Admin Panel
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    <Link href="/admin" className="block px-4 py-2 bg-blue-600 rounded-lg shadow">
                        Quản lý đặt phòng
                    </Link>
                    <Link href="/admin/rooms" className="block px-4 py-2 text-slate-300 hover:bg-slate-800 rounded-lg transition">
                        Quản lý loại phòng
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
                        <h1 className="text-3xl font-bold text-gray-800">Quản lý Đặt Phòng</h1>
                        <p className="text-gray-500 mt-1">Danh sách tất cả các đơn đặt phòng của khách sạn</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="bg-white px-4 py-2 rounded-lg shadow-sm font-semibold text-blue-600 border border-blue-100">
                            Tổng đơn: {allBookings.length}
                        </div>

                        {/* Status Filter */}
                        <StatusFilter initialStatus={statusFilter} />

                        <Link href="/admin/add" className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-sm font-semibold hover:bg-blue-700 transition flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                            </svg>
                            Thêm mới
                        </Link>
                    </div>
                </header>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider border-b">
                                    <th className="px-6 py-4 font-semibold">Mã Phiếu</th>
                                    <th className="px-6 py-4 font-semibold">Khách hàng</th>
                                    <th className="px-6 py-4 font-semibold">Phòng & Số lượng</th>
                                    <th className="px-6 py-4 font-semibold">Thời gian lưu trú</th>
                                    <th className="px-6 py-4 font-semibold">Ngày đặt</th>
                                    <th className="px-6 py-4 font-semibold text-center">Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {allBookings.map((booking) => (
                                    <tr key={booking.maPhieu} className="hover:bg-blue-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <span className="font-mono font-semibold text-blue-600">#{booking.maPhieu}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-gray-800">{booking.hoten}</p>
                                            <p className="text-sm text-gray-500">{booking.sdt}</p>
                                            <p className="text-sm text-gray-500">{booking.email}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-medium text-gray-800">{booking.tenLoaiPhong}</p>
                                            <span className="inline-block mt-1 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                                                {booking.soLuongPhong} phòng
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-800 whitespace-nowrap">
                                                <span className="text-gray-500 w-10 inline-block">Nhận:</span> {formatDate(booking.ngayNhanPhong)}
                                            </div>
                                            <div className="text-sm text-gray-800 whitespace-nowrap mt-1">
                                                <span className="text-gray-500 w-10 inline-block">Trả:</span> {formatDate(booking.ngayTraPhong)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {formatDate(booking.ngayDat)}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <BookingStatusSelect
                                                maPhieu={booking.maPhieu}
                                                currentStatus={booking.trangThai ?? "da_duyet"}
                                            />
                                        </td>
                                    </tr>
                                ))}
                                {allBookings.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                            Chưa có dữ liệu đặt phòng nào.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}
