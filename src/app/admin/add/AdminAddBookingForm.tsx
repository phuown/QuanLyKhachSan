"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { checkRoomAvailability, createBookingAction } from "@/app/api/checkRoom/booking";
import { validatePromotionAction } from "@/app/admin/khuyenmai/actions";

interface RoomData {
    maLoaiPhong: number;
    tenLoaiPhong: string;
    moTa: string | null;
    gia: number;
    dienTich: number | null;
    soNguoi: number | null;
    anhChinh: string | null;
}

const formatDateObj = (dateString?: string) => {
    if (!dateString) return "";
    const [y, m, d] = dateString.split("-");
    return `${d}/${m}/${y}`;
};

export default function AdminAddBookingForm({ rooms }: { rooms: RoomData[] }) {
    const router = useRouter();

    // Form fields
    const [maLoaiPhong, setMaLoaiPhong] = useState<number>(rooms[0]?.maLoaiPhong || 0);
    const [checkIn, setCheckIn] = useState("");
    const [checkOut, setCheckOut] = useState("");
    const [guests, setGuests] = useState(1);
    const [roomsCount, setRoomsCount] = useState(1);

    // Customer Info
    const [hoten, setHoten] = useState("");
    const [sdt, setSdt] = useState("");
    const [email, setEmail] = useState("");
    const [diaChi, setDiaChi] = useState("");
    const [ngaySinh, setNgaySinh] = useState("");
    const [gioiTinh, setGioiTinh] = useState(true);

    // States
    const [isChecking, setIsChecking] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [availability, setAvailability] = useState<{ available: boolean, remaining: number, message: string } | null>(null);

    // Promotion states
    const [promoCode, setPromoCode] = useState("");
    const [promoData, setPromoData] = useState<{ maKhuyenMai: number, giamGia: number, tenKhuyenMai: string } | null>(null);
    const [promoError, setPromoError] = useState("");
    const [isValidatingPromo, setIsValidatingPromo] = useState(false);

    const [selectedRoomPrice, setSelectedRoomPrice] = useState<number>(rooms[0]?.gia || 0);

    // Update price when room changes
    useEffect(() => {
        const room = rooms.find(r => r.maLoaiPhong === maLoaiPhong);
        if (room) {
            setSelectedRoomPrice(room.gia);
        }
    }, [maLoaiPhong, rooms]);

    // Recheck availability when core variables change
    useEffect(() => {
        if (checkIn && checkOut && maLoaiPhong) {
            handleCheckAvailability();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [checkIn, checkOut, maLoaiPhong, guests, roomsCount]);

    const handleCheckAvailability = async () => {
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);

        if (checkOutDate <= checkInDate) {
            setAvailability({ available: false, remaining: 0, message: "Ngày trả phòng phải sau ngày nhận phòng." });
            return;
        }

        setIsChecking(true);
        const result = await checkRoomAvailability(maLoaiPhong, checkIn, checkOut, guests, roomsCount);
        setAvailability(result);
        setIsChecking(false);
    };

    const calculateNights = () => {
        if (!checkIn || !checkOut) return 0;
        const start = new Date(checkIn);
        const end = new Date(checkOut);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const nights = calculateNights();
    const originalPrice = nights * selectedRoomPrice * roomsCount;
    const discountAmount = promoData ? (originalPrice * promoData.giamGia) / 100 : 0;
    const totalPrice = originalPrice - discountAmount;

    const handleApplyPromo = async () => {
        if (!promoCode.trim()) return;
        setIsValidatingPromo(true);
        setPromoError("");
        const result = await validatePromotionAction(promoCode, maLoaiPhong);
        if (result.success && result.data) {
            setPromoData(result.data);
            setPromoError("");
        } else {
            setPromoData(null);
            setPromoError(result.message || "Mã không hợp lệ.");
        }
        setIsValidatingPromo(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (availability && roomsCount > availability.remaining) {
            alert(`Lỗi! Không đủ phòng trống. Chỉ còn ${availability.remaining} phòng.`);
            return;
        }

        if (!hoten || !sdt || !email || !diaChi || !ngaySinh) {
            alert("Vui lòng điền đủ mọi thông tin liên hệ của khách hàng.");
            return;
        }

        setIsSubmitting(true);
        const result = await createBookingAction(
            maLoaiPhong,
            checkIn,
            checkOut,
            guests,
            roomsCount,
            { hoten, sdt, email, diaChi, ngaySinh, gioiTinh },
            promoData?.maKhuyenMai
        );
        setIsSubmitting(false);

        if (result.success) {
            alert("Thêm phiếu đặt phòng thành công!");
            router.push("/admin");
            router.refresh();
        } else {
            alert(`Lỗi: ${result.message}`);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {/* Section 1: Room Config */}
            <div>
                <h2 className="text-sm font-black border-b pb-1.5 mb-3 text-gray-900 uppercase tracking-tight">1. Loại phòng & Thời gian</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1 md:col-span-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Chọn loại phòng</label>
                        <select
                            required
                            value={maLoaiPhong}
                            onChange={(e) => setMaLoaiPhong(parseInt(e.target.value))}
                            className="w-full py-2 px-3 border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none text-slate-800 font-bold text-sm bg-gray-50/50"
                        >
                            {rooms.map(r => (
                                <option key={r.maLoaiPhong} value={r.maLoaiPhong}>
                                    {r.tenLoaiPhong} ({new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(r.gia)} / đêm)
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Ngày nhận phòng</label>
                        <div className="relative">
                            <input
                                type="date"
                                required
                                min={new Date().toISOString().split("T")[0]}
                                value={checkIn}
                                onChange={(e) => setCheckIn(e.target.value)}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                onClick={(e) => (e.target as HTMLInputElement).showPicker()}
                            />
                            <div className={`w-full py-2 px-3 border border-slate-200 rounded-xl flex items-center justify-between min-h-[40px] ${checkIn ? 'text-slate-900 font-bold bg-white text-sm' : 'text-slate-500 bg-white text-sm'}`}>
                                <span>{checkIn ? formatDateObj(checkIn) : "Chọn ngày nhận"}</span>
                                <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Ngày trả phòng</label>
                        <div className="relative">
                            <input
                                type="date"
                                required
                                min={checkIn || new Date().toISOString().split("T")[0]}
                                value={checkOut}
                                onChange={(e) => setCheckOut(e.target.value)}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                onClick={(e) => (e.target as HTMLInputElement).showPicker()}
                            />
                            <div className={`w-full py-2 px-3 border border-slate-200 rounded-xl flex items-center justify-between min-h-[40px] ${checkOut ? 'text-slate-900 font-bold bg-white text-sm' : 'text-slate-500 bg-white text-sm'}`}>
                                <span>{checkOut ? formatDateObj(checkOut) : "Chọn ngày trả"}</span>
                                <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Khách (Lớn & Trẻ em)</label>
                        <select
                            value={guests}
                            onChange={(e) => setGuests(parseInt(e.target.value))}
                            className="w-full py-2 px-3 border border-slate-200 rounded-xl focus:border-blue-500 outline-none text-slate-800 text-sm font-bold min-h-[40px] bg-white"
                        >
                            {[1, 2, 3, 4, 5, 6].map(num => (
                                <option key={num} value={num}>{num} khách</option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Số lượng phòng</label>
                        <select
                            value={roomsCount}
                            onChange={(e) => setRoomsCount(parseInt(e.target.value))}
                            className="w-full py-2 px-3 border border-slate-200 rounded-xl focus:border-blue-500 outline-none text-slate-800 text-sm font-bold min-h-[40px] bg-white"
                        >
                            {[1, 2, 3, 4, 5, 6].map(num => (
                                <option key={num} value={num}>{num} phòng</option>
                            ))}
                        </select>
                    </div>
                </div>

                {checkIn && checkOut && (
                    <div className="mt-4 p-3.5 rounded-xl bg-blue-50/50 border border-blue-100 flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="w-full md:w-3/5">
                            {isChecking ? (
                                <span className="text-[10px] uppercase font-black text-blue-400 animate-pulse tracking-widest">Đang kiểm tra...</span>
                            ) : availability ? (
                                <div className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider ${availability.available ? 'text-green-700 bg-green-50' : 'text-red-700 bg-red-50'}`}>
                                    {availability.message}
                                </div>
                            ) : null}
                        </div>
                        <div className="w-full md:w-2/5 text-right font-bold">
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Tạm tính: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(originalPrice)}</p>
                            {promoData && (
                                <p className="text-[10px] text-green-600 font-black italic uppercase">-{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(discountAmount)} ({promoData.giamGia}%)</p>
                            )}
                            <div className="pt-1 mt-1 border-t border-blue-100">
                                <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Tổng thanh toán ({nights} đêm)</p>
                                <p className="text-xl text-blue-800 font-black tracking-tight leading-tight">
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice)}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Section 1.5: Promotion */}
            <div className="bg-slate-50/50 p-4 rounded-xl border border-dashed border-slate-200">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2.5">Áp dụng mã khuyến mãi</h3>
                <div className="flex gap-3 items-start">
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="Mã KM (tùy chọn)"
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                            className="w-full py-2 px-3 border border-slate-200 rounded-xl focus:border-blue-500 outline-none uppercase font-bold text-sm bg-white"
                        />
                        {promoError && <p className="text-[10px] text-red-500 mt-1 font-bold">{promoError}</p>}
                    </div>
                    <button
                        type="button"
                        onClick={handleApplyPromo}
                        disabled={isValidatingPromo || !promoCode}
                        className="px-6 py-2 bg-gray-900 text-white rounded-xl font-bold text-xs hover:bg-black disabled:bg-slate-300 transition-all uppercase tracking-widest"
                    >
                        {isValidatingPromo ? "..." : "Áp dụng"}
                    </button>
                </div>
                {promoData && (
                    <div className="mt-2.5 p-2 bg-green-50 border border-green-100 rounded-lg flex items-center gap-2 text-green-700 text-[10px] font-bold uppercase tracking-wider">
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                        <span>Hợp lệ: {promoData.tenKhuyenMai} (-{promoData.giamGia}%)</span>
                    </div>
                )}
            </div>

            {/* Section 2: Customer Input */}
            <div>
                <h2 className="text-sm font-black border-b pb-1.5 mb-3 text-gray-900 uppercase tracking-tight">2. Hồ sơ khách hàng</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Họ và tên</label>
                        <input
                            type="text"
                            required
                            placeholder="Họ tên khách hàng"
                            value={hoten}
                            onChange={(e) => setHoten(e.target.value)}
                            className="w-full py-2 px-3 border border-slate-200 rounded-xl focus:border-blue-500 outline-none text-slate-800 text-sm font-bold bg-white"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Giới tính</label>
                        <select
                            required
                            value={gioiTinh ? "true" : "false"}
                            onChange={(e) => setGioiTinh(e.target.value === "true")}
                            className="w-full py-2 px-3 border border-slate-200 rounded-xl focus:border-blue-500 outline-none text-slate-800 text-sm font-bold bg-white"
                        >
                            <option value="true">Nam</option>
                            <option value="false">Nữ</option>
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Số điện thoại</label>
                        <input
                            type="tel"
                            required
                            placeholder="Nhập SĐT"
                            value={sdt}
                            onChange={(e) => setSdt(e.target.value)}
                            className="w-full py-2 px-3 border border-slate-200 rounded-xl focus:border-blue-500 outline-none text-slate-800 text-sm font-bold bg-white"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email</label>
                        <input
                            type="email"
                            required
                            placeholder="user@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full py-2 px-3 border border-slate-200 rounded-xl focus:border-blue-500 outline-none text-slate-800 text-sm font-bold bg-white"
                        />
                    </div>
                    <div className="space-y-1 md:col-span-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Địa chỉ</label>
                        <input
                            type="text"
                            required
                            placeholder="Nhập địa chỉ"
                            value={diaChi}
                            onChange={(e) => setDiaChi(e.target.value)}
                            className="w-full py-2 px-3 border border-slate-200 rounded-xl focus:border-blue-500 outline-none text-slate-800 text-sm font-bold bg-white"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Ngày sinh</label>
                        <div className="relative">
                            <input
                                type="date"
                                required
                                max={new Date().toISOString().split("T")[0]}
                                value={ngaySinh}
                                onChange={(e) => setNgaySinh(e.target.value)}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                onClick={(e) => (e.target as HTMLInputElement).showPicker()}
                            />
                            <div className={`w-full py-2 px-3 border border-slate-200 rounded-xl flex items-center justify-between min-h-[40px] ${ngaySinh ? 'text-slate-900 font-bold bg-white text-sm' : 'text-slate-500 bg-white text-sm'}`}>
                                <span>{ngaySinh ? formatDateObj(ngaySinh) : "Chọn ngày sinh"}</span>
                                <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="border-t pt-5 text-right space-x-3">
                <button
                    type="button"
                    onClick={() => router.push("/admin")}
                    className="px-5 py-2 text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-50 hover:bg-slate-100 rounded-xl transition"
                >
                    Hủy bỏ
                </button>
                <button
                    type="submit"
                    disabled={
                        !checkIn || !checkOut || nights <= 0 ||
                        isChecking || isSubmitting || !availability?.available || roomsCount > (availability?.remaining || 0)
                    }
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-500/20 transition-all transform active:scale-95 disabled:scale-100"
                >
                    {isSubmitting ? "Đang lưu..." : (availability?.available ? "Xác nhận đặt phòng" : "Kiểm tra thông tin")}
                </button>
            </div>
        </form>
    );
}
