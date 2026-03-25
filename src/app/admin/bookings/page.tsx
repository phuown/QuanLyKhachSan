import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { KhachHang, PhieuDatPhong, chiTietPhieuDatPhong, LoaiPhong } from "@/db/schema";
import { eq, asc, lt, and, isNotNull, inArray, or, isNull, like } from "drizzle-orm";
import Sidebar from "../Sidebar";
import Link from "next/link";
import BookingStatusSelect from "../BookingStatusSelect";
import StatusFilter from "../StatusFilter";

export default async function AdminBookingsPage(props: {
    searchParams?: Promise<{ status?: string; search?: string }>;
}) {
    const searchParams = await props.searchParams;
    const statusFilter = searchParams?.status;
    const searchQuery = searchParams?.search || "";

    const cookieStore = await cookies();
    const isAdmin = cookieStore.get("admin_session");

    if (!isAdmin) {
        redirect("/admin/login");
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

    const whereConditions = [];
    if (statusFilter && statusFilter !== "all") {
        whereConditions.push(eq(PhieuDatPhong.trangThai, statusFilter));
    }
    if (searchQuery) {
        whereConditions.push(like(KhachHang.hoten, `%${searchQuery}%`));
    }

    if (whereConditions.length > 0) {
        query.where(and(...whereConditions));
    }

    const allBookings = await query.orderBy(asc(PhieuDatPhong.maPhieuDatPhong));

    const formatDate = (date: Date | string) => {
        if (!date) return "";
        const d = new Date(date);
        return d.toLocaleDateString("vi-VN");
    };

    return (
        <div className="min-h-screen bg-gray-50 flex font-['Times_New_Roman'] text-gray-800">
            <Sidebar />

            {/* Main Content */}
            <main className="flex-1 p-6 md:p-10">
                <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 tracking-tight mb-1">Quản lý Đặt Phòng</h1>
                        <p className="text-sm text-gray-500 font-medium italic opacity-75">Theo dõi và quản lý dữ liệu đặt phòng khách sạn</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-4">
                        <form className="relative group min-w-[300px]">
                            <input
                                type="text"
                                name="search"
                                defaultValue={searchQuery}
                                placeholder="Tìm tên khách hàng..."
                                className="w-full pl-11 pr-5 py-2.5 bg-white border border-gray-200 rounded-2xl text-sm focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all shadow-sm group-hover:shadow-md"
                            />
                            <svg className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            {statusFilter && <input type="hidden" name="status" value={statusFilter} />}
                        </form>

                        <div className="bg-white px-4 py-2.5 rounded-2xl shadow-sm font-bold text-xs text-blue-700 border border-blue-50 flex items-center gap-2 uppercase tracking-wide">
                            <span className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></span>
                            Tổng: {allBookings.length}
                        </div>

                        <div className="flex items-center">
                            <StatusFilter initialStatus={statusFilter} />
                        </div>

                        <Link href="/admin/add" className="px-2 py-2 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl shadow-lg shadow-blue-100 font-bold text-sm hover:from-blue-700 hover:to-blue-800 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                            </svg>
                            Thêm mới
                        </Link>
                    </div>
                </header>

                <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/80 text-gray-400 text-[11px] font-bold uppercase tracking-[0.15em] border-b border-gray-100">
                                    <th className="px-8 py-6">Mã Phiếu</th>
                                    <th className="px-6 py-6 font-bold">Thông tin Khách hàng</th>
                                    <th className="px-6 py-6 font-bold">Loại Phòng & SL</th>
                                    <th className="px-6 py-6 font-bold">Thời gian lưu trú</th>
                                    <th className="px-6 py-6 font-bold">Ngày đặt</th>
                                    <th className="px-6 py-6 text-center font-bold">Tình trạng đơn</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {allBookings.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-8 py-24 text-center">
                                            <div className="flex flex-col items-center justify-center text-gray-300">
                                                <svg className="w-20 h-20 mb-6 opacity-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
                                                </svg>
                                                <p className="text-2xl font-light italic">Yêu cầu không tìm thấy kết quả</p>
                                                <p className="text-sm mt-2 opacity-60">Hệ thống hiện chưa ghi nhận đơn nào phù hợp với tìm kiếm của bạn.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    allBookings.map((booking) => (
                                        <tr key={booking.maPhieu} className="hover:bg-blue-50/20 transition-all border-b border-gray-50/50 last:border-0 group">
                                            <td className="px-8 py-6">
                                                <span className="font-mono font-black text-sm text-blue-600 px-3 py-1.5 bg-blue-50/60 rounded-lg border border-blue-100/50 shadow-sm transition-transform group-hover:scale-105 inline-block">#{booking.maPhieu}</span>
                                            </td>
                                            <td className="px-6 py-6">
                                                <p className="text-lg font-bold text-gray-900 tracking-tight leading-none mb-1.5">{booking.hoten}</p>
                                                <div className="flex flex-col gap-0.5 opacity-60">
                                                    <p className="text-xs font-medium flex items-center gap-1.5 tracking-wide">
                                                        <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                                                        {booking.sdt}
                                                    </p>
                                                    <p className="text-[11px] font-medium lowercase tracking-wider flex items-center gap-1.5 italic">
                                                        <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                                                        {booking.email}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-6">
                                                <p className="text-base font-bold text-gray-800 tracking-tight">{booking.tenLoaiPhong}</p>
                                                <div className="inline-flex mt-1.5 px-2.5 py-0.5 bg-slate-100/80 text-slate-500 text-[10px] font-black rounded-full uppercase tracking-widest border border-slate-200/50">
                                                    {booking.soLuongPhong} phòng
                                                </div>
                                            </td>
                                            <td className="px-6 py-6">
                                                <div className="flex flex-col gap-1.5">
                                                    <div className="text-[13px] font-bold text-gray-700 flex items-center gap-2">
                                                        <span className="text-[9px] font-black text-gray-300 uppercase w-7 bg-gray-50 px-1 rounded border border-gray-100">Vào</span>
                                                        {formatDate(booking.ngayNhanPhong)}
                                                    </div>
                                                    <div className="text-[13px] font-bold text-gray-700 flex items-center gap-2">
                                                        <span className="text-[9px] font-black text-gray-300 uppercase w-7 bg-gray-50 px-1 rounded border border-gray-100">Ra</span>
                                                        {formatDate(booking.ngayTraPhong)}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-6 text-sm font-semibold text-gray-500 italic">
                                                {formatDate(booking.ngayDat)}
                                            </td>
                                            <td className="px-6 py-6 text-center">
                                                <div className="inline-block transform transition-transform group-hover:scale-105">
                                                    <BookingStatusSelect
                                                        maPhieu={booking.maPhieu}
                                                        currentStatus={booking.trangThai ?? "da_duyet"}
                                                    />
                                                </div>
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
