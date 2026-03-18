"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { checkRoomAvailability, createBookingAction } from "@/app/api/checkRoom/booking";

import { useUser } from "@clerk/nextjs";

interface BookingFormProps {
    roomPrice: number;
    maLoaiPhong: number;
}

export default function BookingForm({ roomPrice, maLoaiPhong }: BookingFormProps) {
    const { user } = useUser();
    const [checkIn, setCheckIn] = useState("");
    const [checkOut, setCheckOut] = useState("");
    const [guests, setGuests] = useState(1);
    const [roomsCount, setRoomsCount] = useState(1);
    const [isChecking, setIsChecking] = useState(false);
    const [availability, setAvailability] = useState<{ available: boolean, remaining: number, message: string } | null>(null);

    const [hoten, setHoten] = useState("");
    const [sdt, setSdt] = useState("");
    const [email, setEmail] = useState("");
    const [diaChi, setDiaChi] = useState("");
    const [ngaySinh, setNgaySinh] = useState("");
    const [gioiTinh, setGioiTinh] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        if (user) {
            if (user.primaryEmailAddress?.emailAddress) {
                setEmail(user.primaryEmailAddress.emailAddress);
            }
        }
    }, [user]);

    useEffect(() => {
        if (checkIn && checkOut) {
            handleCheckAvailability();
        }
    }, [checkIn, checkOut, guests, roomsCount]);

    const handleCheckAvailability = async () => {
        setIsChecking(true);
        const result = await checkRoomAvailability(maLoaiPhong, checkIn, checkOut, guests, roomsCount);
        setAvailability(result);
        setIsChecking(false);
    };

    const calculateNights = () => {
        if (!checkIn || !checkOut) return 0;
        const start = new Date(checkIn);
        const end = new Date(checkOut);
        const diffTime = end.getTime() - start.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 0;
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return "";
        const [year, month, day] = dateString.split("-");
        return `${day}/${month}/${year}`;
    };

    const nights = calculateNights();
    const totalPrice = nights * roomPrice * roomsCount;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (availability && roomsCount > availability.remaining) {
            alert(`Rất tiếc, chỉ còn ${availability.remaining} phòng trống cho thời gian này.`);
            return;
        }

        if (!hoten || !sdt || !email || !diaChi || !ngaySinh) {
            alert("Vui lòng nhập đầy đủ thông tin liên hệ.");
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
            setIsSuccess(true);
        } else {
            alert(`Lỗi: ${result.message}`);
        }
    };

    if (isSuccess) {
        return (
            <div className="flex flex-col items-center justify-center p-8 space-y-6 bg-white rounded-2xl shadow-sm text-center">
                <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-2">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Đặt phòng thành công!</h2>
                    <p className="text-gray-600 mb-1">
                        Cảm ơn {hoten} đã lựa chọn khách sạn của chúng tôi.
                    </p>
                    <p className="text-gray-600">
                        Thông tin ({roomsCount} phòng, từ {formatDate(checkIn)} đến {formatDate(checkOut)}) đã được ghi nhận.
                    </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 w-full">
                    <div className="flex justify-between text-gray-700 text-sm mb-2">
                        <span>Số đêm lưu trú:</span>
                        <span className="font-medium">{nights} đêm</span>
                    </div>
                    <div className="flex justify-between text-gray-700 text-sm mb-2">
                        <span>Trạng thái:</span>
                        <span className="font-medium text-green-600">Chờ xác nhận</span>
                    </div>
                    <div className="flex justify-between text-gray-900 border-t pt-2 mt-2 font-bold">
                        <span>Tổng thanh toán:</span>
                        <span className="text-blue-600">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice)}</span>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4 w-full pt-4">
                    <button
                        onClick={() => window.location.reload()}
                        className="py-3 px-4 border border-blue-600 text-blue-600 rounded-xl font-medium hover:bg-blue-50 transition-colors"
                    >
                        Đặt thêm phòng
                    </button>
                    <Link
                        href="/"
                        className="py-3 px-4 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
                    >
                        Về trang chủ
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="mb-8 flex items-center gap-4 p-4 bg-yellow-50 rounded-xl border border-yellow-100">
                <span className="text-2xl">📝</span>
                <p className="text-sm text-yellow-800">
                    Vui lòng chọn ngày nhận/trả phòng để chúng tôi kiểm tra tình trạng phòng trống và tính toán tổng giá tiền.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Ngày nhận phòng</label>
                        <div className="relative">
                            <input
                                type="date"
                                required
                                min={new Date().toISOString().split("T")[0]}
                                value={checkIn}
                                onChange={(e) => setCheckIn(e.target.value)}
                                onClick={(e) => { try { e.currentTarget.showPicker() } catch { } }}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                            />
                            <div className="w-full p-3 border rounded-xl bg-white flex justify-between items-center min-h-[50px]">
                                <span className={checkIn ? "text-gray-900" : "text-gray-400"}>
                                    {checkIn ? formatDate(checkIn) : "Chọn ngày nhận"}
                                </span>
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
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
                                onClick={(e) => { try { e.currentTarget.showPicker() } catch { } }}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                            />
                            <div className="w-full p-3 border rounded-xl bg-white flex justify-between items-center min-h-[50px]">
                                <span className={checkOut ? "text-gray-900" : "text-gray-400"}>
                                    {checkOut ? formatDate(checkOut) : "Chọn ngày trả"}
                                </span>
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Số lượng khách</label>
                        <select
                            value={guests}
                            onChange={(e) => setGuests(parseInt(e.target.value))}
                            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white text-gray-900"
                        >
                            {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                                <option key={num} value={num}>{num} khách</option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Số lượng phòng</label>
                        <select
                            value={roomsCount}
                            onChange={(e) => setRoomsCount(parseInt(e.target.value))}
                            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white text-gray-900"
                        >
                            {[1, 2, 3, 4, 5].map(num => (
                                <option key={num} value={num}>{num} phòng</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="space-y-4 pt-4 border-t">
                    <h3 className="font-semibold text-gray-800">Thông tin liên hệ</h3>
                    <div className="space-y-4">
                        <input
                            type="text"
                            required
                            placeholder="Họ và tên"
                            value={hoten}
                            onChange={(e) => setHoten(e.target.value)}
                            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-900"
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                type="tel"
                                required
                                placeholder="Số điện thoại"
                                value={sdt}
                                onChange={(e) => setSdt(e.target.value)}
                                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-900"
                            />
                            <input
                                type="email"
                                required
                                placeholder="Email liên hệ"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-900"
                            />
                            <input
                                type="text"
                                required
                                placeholder="Địa chỉ"
                                value={diaChi}
                                onChange={(e) => setDiaChi(e.target.value)}
                                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-900"
                            />
                            <div className="relative">
                                <input
                                    type="date"
                                    required
                                    max={new Date().toISOString().split("T")[0]}
                                    value={ngaySinh}
                                    onChange={(e) => setNgaySinh(e.target.value)}
                                    onClick={(e) => { try { e.currentTarget.showPicker() } catch { } }}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                                />
                                <div className="w-full p-3 border rounded-xl bg-white flex justify-between items-center min-h-[50px]">
                                    <span className={ngaySinh ? "text-gray-900" : "text-gray-400"}>
                                        {ngaySinh ? formatDate(ngaySinh) : "Ngày sinh (DD/MM/YYYY)"}
                                    </span>
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                </div>
                            </div>
                            <select
                                required
                                value={gioiTinh ? "true" : "false"}
                                onChange={(e) => setGioiTinh(e.target.value === "true")}
                                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-900"
                            >
                                <option value="true">Nam</option>
                                <option value="false">Nữ</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="bg-blue-50 p-6 rounded-2xl space-y-3">
                    {isChecking ? (
                        <div className="flex items-center gap-2 text-sm text-blue-600 animate-pulse">
                            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeWidth="2" d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" /></svg>
                            Đang kiểm tra tình trạng phòng...
                        </div>
                    ) : availability && (
                        <div className={`text-sm font-medium p-3 rounded-lg ${availability.available ? "text-green-700 bg-green-100" : "text-red-700 bg-red-100"}`}>
                            {availability.message}
                        </div>
                    )}

                    <div className="flex justify-between text-gray-600">
                        <span>Giá mỗi đêm/phòng:</span>
                        <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(roomPrice)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                        <span>Thời gian:</span>
                        <span className="font-medium">
                            {checkIn ? formatDate(checkIn) : "..."} - {checkOut ? formatDate(checkOut) : "..."}
                        </span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                        <span>Số phòng:</span>
                        <span>{roomsCount} phòng</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                        <span>Số đêm:</span>
                        <span>{nights} đêm</span>
                    </div>
                    <div className="flex justify-between text-xl font-bold text-blue-900 pt-3 border-t border-blue-200">
                        <span>Tổng cộng:</span>
                        <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice)}</span>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={nights <= 0 || isChecking || isSubmitting || !availability?.available || roomsCount > (availability?.remaining || 0)}
                    className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] ${(nights > 0 && availability?.available && roomsCount <= (availability?.remaining || 0) && !isSubmitting) ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"
                        }`}
                >
                    {isSubmitting ? "Đang xử lý đặt phòng..." : isChecking ? "Đang kiểm tra..." : (nights > 0 ? (availability?.available ? "Xác nhận đặt phòng" : "Hết phòng") : "Vui lòng chọn ngày hợp lệ")}
                </button>
            </form>
        </>
    );
}
