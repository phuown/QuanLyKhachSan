"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { checkRoomAvailability, createBookingAction } from "@/app/api/checkRoom/booking";

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
    const totalPrice = nights * selectedRoomPrice * roomsCount;

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
            { hoten, sdt, email, diaChi, ngaySinh, gioiTinh }
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
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* Section 1: Room Config */}
            <div>
                <h2 className="text-xl font-bold border-b pb-2 mb-4 text-gray-800">1. Đặt loại phòng & Ngày giờ</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-semibold text-gray-700">Chọn loại phòng</label>
                        <select
                            required
                            value={maLoaiPhong}
                            onChange={(e) => setMaLoaiPhong(parseInt(e.target.value))}
                            className="w-full p-3 border-2 border-slate-300 rounded-xl focus:border-blue-500 focus:ring-0 outline-none text-slate-800 font-medium"
                        >
                            {rooms.map(r => (
                                <option key={r.maLoaiPhong} value={r.maLoaiPhong}>
                                    {r.tenLoaiPhong} ({new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(r.gia)} / đêm)
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Ngày nhận phòng</label>
                        <div className="relative">
                            <input
                                type="date"
                                required
                                min={new Date().toISOString().split("T")[0]}
                                value={checkIn}
                                onChange={(e) => setCheckIn(e.target.value)}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                onClick={(e) => (e.target as HTMLInputElement).showPicker()}
                            />
                            <div className={`w-full p-3 border-2 border-slate-300 rounded-xl flex items-center justify-between ${checkIn ? 'text-slate-900 font-bold bg-white' : 'text-slate-500 bg-white'}`}>
                                <span>{checkIn ? formatDateObj(checkIn) : "Ngày/tháng/năm"}</span>
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Ngày trả phòng</label>
                        <div className="relative">
                            <input
                                type="date"
                                required
                                min={checkIn || new Date().toISOString().split("T")[0]}
                                value={checkOut}
                                onChange={(e) => setCheckOut(e.target.value)}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                onClick={(e) => (e.target as HTMLInputElement).showPicker()}
                            />
                            <div className={`w-full p-3 border-2 border-slate-300 rounded-xl flex items-center justify-between ${checkOut ? 'text-slate-900 font-bold bg-white' : 'text-slate-500 bg-white'}`}>
                                <span>{checkOut ? formatDateObj(checkOut) : "Ngày/tháng/năm"}</span>
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Người lớn & Trẻ em</label>
                        <select
                            value={guests}
                            onChange={(e) => setGuests(parseInt(e.target.value))}
                            className="w-full p-3 border-2 border-slate-300 rounded-xl focus:border-blue-500 outline-none text-slate-800"
                        >
                            {[1, 2, 3, 4, 5, 6].map(num => (
                                <option key={num} value={num}>{num} khách</option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Số lượng phòng khách cần</label>
                        <select
                            value={roomsCount}
                            onChange={(e) => setRoomsCount(parseInt(e.target.value))}
                            className="w-full p-3 border-2 border-slate-300 rounded-xl focus:border-blue-500 outline-none text-slate-800"
                        >
                            {[1, 2, 3, 4, 5, 6].map(num => (
                                <option key={num} value={num}>{num} phòng</option>
                            ))}
                        </select>
                    </div>
                </div>

                {checkIn && checkOut && (
                    <div className="mt-6 p-4 rounded-xl bg-blue-50 border border-blue-100 flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="w-full md:w-3/5">
                            {isChecking ? (
                                <span className="text-slate-600 animate-pulse text-sm">Đang kiểm tra...</span>
                            ) : availability ? (
                                <div className={`px-4 py-3 rounded-xl text-sm font-bold ${availability.available ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'}`}>
                                    {availability.message}
                                </div>
                            ) : null}
                        </div>
                        <div className="w-full md:w-2/5 text-right font-bold space-y-1">
                            <p className="text-sm text-slate-500 font-normal">Tổng thanh toán dự kiến ({nights} đêm)</p>
                            <p className="text-2xl text-blue-700">
                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice)}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Section 2: Customer Input */}
            <div>
                <h2 className="text-xl font-bold border-b pb-2 mb-4 text-gray-800">2. Hồ sơ khách hàng</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-200">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Họ và tên</label>
                        <input
                            type="text"
                            required
                            placeholder="Nhập họ tên đầy đủ"
                            value={hoten}
                            onChange={(e) => setHoten(e.target.value)}
                            className="w-full p-3 border-2 border-slate-300 rounded-xl focus:border-blue-500 outline-none text-slate-800 bg-white"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Giới tính</label>
                        <select
                            required
                            value={gioiTinh ? "true" : "false"}
                            onChange={(e) => setGioiTinh(e.target.value === "true")}
                            className="w-full p-3 border-2 border-slate-300 rounded-xl focus:border-blue-500 outline-none text-slate-800 bg-white"
                        >
                            <option value="true">Nam</option>
                            <option value="false">Nữ</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Số điện thoại</label>
                        <input
                            type="tel"
                            required
                            placeholder="Nhập SĐT"
                            value={sdt}
                            onChange={(e) => setSdt(e.target.value)}
                            className="w-full p-3 border-2 border-slate-300 rounded-xl focus:border-blue-500 outline-none text-slate-800 bg-white"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Email khách hàng</label>
                        <input
                            type="email"
                            required
                            placeholder="user@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 border-2 border-slate-300 rounded-xl focus:border-blue-500 outline-none text-slate-800 bg-white"
                        />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-semibold text-gray-700">Địa chỉ</label>
                        <input
                            type="text"
                            required
                            placeholder="Nhập địa chỉ"
                            value={diaChi}
                            onChange={(e) => setDiaChi(e.target.value)}
                            className="w-full p-3 border-2 border-slate-300 rounded-xl focus:border-blue-500 outline-none text-slate-800 bg-white"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Ngày sinh</label>
                        <div className="relative">
                            <input
                                type="date"
                                required
                                max={new Date().toISOString().split("T")[0]}
                                value={ngaySinh}
                                onChange={(e) => setNgaySinh(e.target.value)}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                onClick={(e) => (e.target as HTMLInputElement).showPicker()}
                            />
                            <div className={`w-full p-3 border-2 border-slate-300 rounded-xl flex items-center justify-between ${ngaySinh ? 'text-slate-900 font-bold bg-white' : 'text-slate-500 bg-white'}`}>
                                <span>{ngaySinh ? formatDateObj(ngaySinh) : "Ngày/tháng/năm"}</span>
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="border-t pt-6 text-right space-x-4">
                <button
                    type="button"
                    onClick={() => router.push("/admin")}
                    className="px-6 py-3 font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
                >
                    Hủy bỏ
                </button>
                <button
                    type="submit"
                    disabled={
                        !checkIn || !checkOut || nights <= 0 ||
                        isChecking || isSubmitting || !availability?.available || roomsCount > (availability?.remaining || 0)
                    }
                    className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white rounded-xl font-bold shadow-lg transition-transform transform active:scale-95 disabled:scale-100"
                >
                    {isSubmitting ? "Đang lưu..." : (availability?.available ? "Tạo hóa đơn hoàn tất" : "Mời chọn phòng/tuỳ chỉnh")}
                </button>
            </div>
        </form>
    );
}
