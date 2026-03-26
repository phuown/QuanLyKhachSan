import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Header from "@/components/Header";
import { db } from "@/db";
import { KhachHang, PhieuDatPhong, chiTietPhieuDatPhong, LoaiPhong } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import CancelBookingButton from "./CancelBookingButton";

export default async function MyBookingsPage() {
    const { userId } = await auth();
    if (!userId) {
        redirect("/sign-in");
    }

    const user = await currentUser();
    const userEmail = user?.emailAddresses[0]?.emailAddress;

    if (!userEmail) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <main className="max-w-4xl mx-auto py-12 px-6">
                    <div className="bg-white rounded-3xl p-8 text-center text-red-500">
                        Không tìm thấy địa chỉ email trong tài khoản của bạn.
                    </div>
                </main>
            </div>
        );
    }

    // Lookup bookings by matching email
    const rawData = await db
        .select({
            maPhieu: PhieuDatPhong.maPhieuDatPhong,
            ngayDat: PhieuDatPhong.ngayDat,
            ngayNhanPhong: PhieuDatPhong.ngayNhanPhong,
            ngayTraPhong: PhieuDatPhong.ngayTraPhong,
            trangThai: PhieuDatPhong.trangThai,
            soLuongPhong: chiTietPhieuDatPhong.soLuongPhong,
            tenLoaiPhong: LoaiPhong.tenLoaiPhong,
            gia: LoaiPhong.gia,
        })
        .from(PhieuDatPhong)
        .innerJoin(KhachHang, eq(PhieuDatPhong.maKhachHang, KhachHang.maKhachHang))
        .innerJoin(chiTietPhieuDatPhong, eq(PhieuDatPhong.maPhieuDatPhong, chiTietPhieuDatPhong.maPhieuDatPhong))
        .innerJoin(LoaiPhong, eq(chiTietPhieuDatPhong.maLoaiPhong, LoaiPhong.maLoaiPhong))
        .where(eq(KhachHang.email, userEmail))
        .orderBy(desc(PhieuDatPhong.ngayDat));

    const groupedBookings = rawData.reduce((acc, current) => {
        const existing = acc.find(item => item.maPhieu === current.maPhieu);
        if (existing) {
            existing.rooms.push({
                tenLoaiPhong: current.tenLoaiPhong,
                soLuongPhong: current.soLuongPhong,
                gia: current.gia
            });
            existing.totalAmount += current.soLuongPhong * current.gia;
        } else {
            acc.push({
                ...current,
                rooms: [{
                    tenLoaiPhong: current.tenLoaiPhong,
                    soLuongPhong: current.soLuongPhong,
                    gia: current.gia
                }],
                totalAmount: current.soLuongPhong * current.gia
            });
        }
        return acc;
    }, [] as any[]);

    const formatDate = (date: Date | string) => {
        if (!date) return "";
        const d = new Date(date);
        return d.toLocaleDateString("vi-VN");
    };

    const countNights = (inDate: string, outDate: string) => {
        const d1 = new Date(inDate);
        const d2 = new Date(outDate);
        const diff = d2.getTime() - d1.getTime();
        const nights = Math.ceil(diff / (1000 * 60 * 60 * 24));
        return nights > 0 ? nights : 1;
    };

    const getStatusDisplay = (trangThai: string | null) => {
        switch (trangThai) {
            case "da_nhan_phong":
                return { label: "Đã nhận phòng", cls: "bg-blue-50 text-blue-600 border-blue-100" };
            case "da_tra_phong":
                return { label: "Hoàn thành chuyến đi ✅", cls: "bg-gray-50 text-gray-500 border-gray-100 italic" };
            case "da_huy":
                return { label: "Đã hủy", cls: "bg-red-50 text-red-500 border-red-100" };
            default:
                return { label: "Đã duyệt - Chờ nhận phòng", cls: "bg-green-50 text-green-600 border-green-100" };
        }
    };

    return (
        <div className="min-h-screen bg-[#fcfcfc] font-['Times_New_Roman'] text-gray-800">
            <Header />
            <main className="max-w-4xl mx-auto py-12 px-6">
                <header className="mb-10">
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Lịch sử Chuyến đi</h1>
                    <p className="text-gray-500 mt-2 italic opacity-80">Xem lại tất cả các đơn đặt phòng bạn đã thực hiện</p>
                </header>

                <div className="space-y-6">
                    {groupedBookings.length === 0 ? (
                        <div className="text-center py-24 bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100">
                            <span className="text-6xl block mb-6 opacity-20">🧳</span>
                            <h3 className="text-2xl font-bold text-gray-400">Bạn chưa có đặt phòng nào</h3>
                            <p className="text-gray-400 mt-3 max-w-md mx-auto italic">Bắt đầu khám phá các phòng cao cấp của chúng tôi để tạo nên những kỷ niệm tuyệt vời.</p>
                            <a href="/our-rooms" className="mt-8 inline-block px-8 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-100">
                                Đặt phòng ngay
                            </a>
                        </div>
                    ) : (
                        groupedBookings.map((booking) => {
                            const nights = countNights(booking.ngayNhanPhong, booking.ngayTraPhong);
                            const totalAmount = booking.totalAmount * nights;
                            const { label, cls } = getStatusDisplay(booking.trangThai);

                            return (
                                <div key={booking.maPhieu} className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/40 border border-gray-100 overflow-hidden hover:shadow-2xl hover:shadow-gray-300/50 transition-all duration-300 transform hover:-translate-y-1">
                                    <div className="p-8">
                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-6 border-b border-gray-50">
                                            <div className="flex items-center gap-3">
                                                <span className="font-mono font-black text-sm text-blue-600 px-3 py-1 bg-blue-50 rounded-lg border border-blue-100">
                                                    #{booking.maPhieu}
                                                </span>
                                                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${cls}`}>
                                                    {label}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] uppercase font-black text-gray-300 tracking-tighter mb-0.5">Thời gian đặt</p>
                                                <p className="text-sm font-bold text-gray-500 italic">{formatDate(booking.ngayDat)}</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                                            <div className="space-y-4">
                                                <div>
                                                    <p className="text-[10px] uppercase font-black text-gray-300 tracking-tighter mb-2">Chi tiết phòng</p>
                                                    <div className="space-y-2">
                                                        {booking.rooms.map((room: any, idx: number) => (
                                                            <div key={idx} className="flex justify-between items-center bg-gray-50/50 p-3 rounded-xl border border-gray-100">
                                                                <span className="font-bold text-gray-800">{room.tenLoaiPhong}</span>
                                                                <span className="text-xs font-bold text-gray-400 italic">SL: {room.soLuongPhong}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-6 pt-2">
                                                    <div className="flex-1 p-3 bg-blue-50/30 rounded-2xl border border-blue-50/50">
                                                        <p className="text-[9px] uppercase font-black text-blue-300 mb-1">Nhận phòng</p>
                                                        <p className="text-sm font-bold text-blue-900">{formatDate(booking.ngayNhanPhong)}</p>
                                                    </div>
                                                    <div className="flex-1 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                                                        <p className="text-[9px] uppercase font-black text-slate-300 mb-1">Trả phòng</p>
                                                        <p className="text-sm font-bold text-slate-900">{formatDate(booking.ngayTraPhong)}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-col items-center md:items-end justify-center h-full">
                                                <div className="text-center md:text-right mb-6">
                                                    <p className="text-[10px] uppercase font-black text-gray-300 mb-1">Tổng cộng ({nights} đêm)</p>
                                                    <p className="text-4xl font-black text-blue-600 tracking-tighter">
                                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalAmount)}
                                                    </p>
                                                </div>

                                                {(!booking.trangThai || booking.trangThai === "da_duyet") && (
                                                    <div className="w-full md:w-auto">
                                                        <CancelBookingButton maPhieu={booking.maPhieu} />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </main>
        </div>
    );
}
