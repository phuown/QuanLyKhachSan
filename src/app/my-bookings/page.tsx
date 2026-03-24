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
    const historyData = await db
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
                return { label: "Đã nhận phòng", cls: "bg-blue-100 text-blue-700" };
            case "da_tra_phong":
                return { label: "Hoàn thành chuyến đi ✅", cls: "bg-slate-100 text-slate-600" };
            case "da_huy":
                return { label: "Đã hủy", cls: "bg-red-100 text-red-600" };
            default:
                return { label: "Đã duyệt", cls: "bg-green-100 text-green-700" };
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="max-w-4xl mx-auto py-8 px-6">
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 p-5">
                    <h1 className="text-xl font-bold text-gray-800 mb-5">Lịch sử đặt phòng</h1>

                    {historyData.length === 0 ? (
                        <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                            <span className="text-4xl block mb-3">🏨</span>
                            <h3 className="text-xl font-semibold text-gray-600">Bạn chưa có đặt phòng nào</h3>
                            <p className="text-gray-500 mt-2">Dường như bạn chưa thực hiện chuyến đi nào cùng chúng tôi tới thời điểm này.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {historyData.map((booking, index) => {
                                const nights = countNights(booking.ngayNhanPhong, booking.ngayTraPhong);
                                const total = nights * booking.gia * booking.soLuongPhong;

                                return (
                                    <div key={`${booking.maPhieu}-${index}`} className="flex flex-col md:flex-row justify-between items-center p-4 border border-gray-100 rounded-xl hover:shadow-md transition-shadow bg-blue-50/30">
                                        <div className="space-y-1.5 w-full md:w-2/3">
                                            <div className="flex items-center gap-2">
                                                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 font-bold rounded text-[10px]">
                                                    #{booking.maPhieu}
                                                </span>
                                                <span className="text-[10px] text-gray-400">
                                                    Ngày đặt: {formatDate(booking.ngayDat)}
                                                </span>
                                            </div>
                                            <h3 className="text-lg font-bold text-gray-800">
                                                {booking.tenLoaiPhong}
                                            </h3>
                                            <p className="text-gray-500 text-xs">
                                                <strong>Lưu trú:</strong> {formatDate(booking.ngayNhanPhong)} - {formatDate(booking.ngayTraPhong)} ({nights} đêm)
                                            </p>
                                            <p className="text-gray-500 text-xs">
                                                <strong>Số lượng:</strong> {booking.soLuongPhong} phòng
                                            </p>
                                        </div>

                                        <div className="w-full md:w-1/3 text-left md:text-right mt-3 md:mt-0 flex flex-col justify-between h-full space-y-2 border-t md:border-t-0 md:border-l pt-3 md:pt-0 md:pl-4 border-gray-200">
                                            <div>
                                                <p className="text-[10px] text-gray-400 mb-0.5 uppercase font-bold">Tổng tiền</p>
                                                <p className="text-lg font-bold text-blue-600">
                                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total)}
                                                </p>
                                            </div>
                                            <div className="flex flex-col gap-1.5">
                                                {(() => {
                                                    const { label, cls } = getStatusDisplay(booking.trangThai);
                                                    return (
                                                        <div className={`px-3 py-1 font-bold text-[10px] rounded text-center uppercase tracking-wider ${cls}`}>
                                                            {label}
                                                        </div>
                                                    );
                                                })()}
                                                {/* Chỉ hiển thị nút Hủy khi đơn chưa được nhận phòng */}
                                                {(!booking.trangThai || booking.trangThai === "da_duyet") && (
                                                    <CancelBookingButton maPhieu={booking.maPhieu} />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
