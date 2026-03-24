import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { KhachHang, PhieuDatPhong, chiTietPhieuDatPhong, LoaiPhong } from "@/db/schema";
import { eq, asc, lt, and, isNotNull, inArray, or, isNull } from "drizzle-orm";
import Sidebar from "../Sidebar";
import Link from "next/link";
import BookingStatusSelect from "../BookingStatusSelect";
import StatusFilter from "../StatusFilter";

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
        const bookingsToDelete = await db
            .select({ maPhieu: PhieuDatPhong.maPhieuDatPhong })
            .from(PhieuDatPhong)
            .where(
                or(
                    and(
                        isNotNull(PhieuDatPhong.ngayHuy),
                        lt(PhieuDatPhong.ngayHuy, oneDayAgo)
                    ),
                    and(
                        isNull(PhieuDatPhong.ngayHuy),
                        inArray(PhieuDatPhong.trangThai, ["da_huy", "da_tra_phong"])
                    )
                )
            );

        if (bookingsToDelete.length > 0) {
            const ids = bookingsToDelete.map(b => b.maPhieu);
            await db.delete(chiTietPhieuDatPhong).where(inArray(chiTietPhieuDatPhong.maPhieuDatPhong, ids));
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
            <Sidebar />

            {/* Main Content */}
            <main className="flex-1 p-6 md:p-8">
                <header className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Quản lý Đặt Phòng</h1>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-0.5">Hệ thống quản trị khách sạn</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="bg-white px-3 py-1.5 rounded-xl shadow-sm font-bold text-xs text-blue-600 border border-blue-50 flex items-center gap-2 uppercase">
                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span>
                            Tổng đơn: {allBookings.length}
                        </div>
                        <StatusFilter initialStatus={statusFilter} />
                        <Link href="/admin/add" className="px-2 py-1.5 bg-blue-500 text-white rounded-xl shadow-md font-bold text-sm hover:bg-blue-600 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2 uppercase tracking-wider">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4"></path>
                            </svg>
                            Thêm mới
                        </Link>
                    </div>
                </header>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50 text-gray-500 text-xs font-black uppercase tracking-widest border-b border-gray-100">
                                    <th className="px-6 py-5">Mã Phiếu</th>
                                    <th className="px-6 py-4">Khách hàng</th>
                                    <th className="px-6 py-4">Phòng & Số lượng</th>
                                    <th className="px-6 py-4">Thời gian lưu trú</th>
                                    <th className="px-6 py-4">Ngày đặt</th>
                                    <th className="px-6 py-4 text-center">Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {allBookings.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-20 text-center">
                                            <div className="flex flex-col items-center justify-center text-gray-400">
                                                <svg className="w-16 h-16 mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
                                                </svg>
                                                <p className="text-xl font-medium">Chưa có người đặt phòng</p>
                                                <p className="text-sm mt-1">Hệ thống hiện chưa ghi nhận đơn đặt phòng nào{statusFilter && statusFilter !== 'all' ? ' với trạng thái này' : ''}.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    allBookings.map((booking) => (
                                        <tr key={booking.maPhieu} className="hover:bg-blue-50/30 transition-colors border-b border-gray-50 last:border-0">
                                            <td className="px-6 py-5">
                                                <span className="font-mono font-bold text-base text-blue-600 px-2 py-1 bg-blue-50 rounded">#{booking.maPhieu}</span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <p className="text-base font-black text-gray-800 tracking-tight">{booking.hoten}</p>
                                                <div className="flex flex-col mt-1">
                                                    <p className="text-xs font-medium text-gray-400">{booking.sdt}</p>
                                                    <p className="text-xs font-medium text-gray-400 lowercase">{booking.email}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <p className="text-base font-bold text-gray-700 tracking-tight">{booking.tenLoaiPhong}</p>
                                                <span className="inline-block mt-1 px-2.5 py-1 bg-gray-50 text-gray-500 text-xs font-bold rounded uppercase tracking-tighter">
                                                    {booking.soLuongPhong} phòng
                                                </span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="text-sm font-medium text-gray-700 whitespace-nowrap flex items-center gap-2">
                                                    <span className="text-[11px] font-black text-gray-300 uppercase w-9">In</span> {formatDate(booking.ngayNhanPhong)}
                                                </div>
                                                <div className="text-sm font-medium text-gray-700 whitespace-nowrap mt-1.5 flex items-center gap-2">
                                                    <span className="text-[11px] font-black text-gray-300 uppercase w-9">Out</span> {formatDate(booking.ngayTraPhong)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-sm font-medium text-gray-500">
                                                {formatDate(booking.ngayDat)}
                                            </td>
                                            <td className="px-6 py-5 text-center">
                                                <BookingStatusSelect
                                                    maPhieu={booking.maPhieu}
                                                    currentStatus={booking.trangThai ?? "da_duyet"}
                                                />
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}
