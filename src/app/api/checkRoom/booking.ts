"use server";

import { db } from "@/db";
import { PhieuDatPhong, chiTietPhieuDatPhong, Phong, LoaiPhong, KhachHang } from "@/db/schema";
import { eq, and, gte, lte, count, or } from "drizzle-orm";

export async function checkRoomAvailability(
    maLoaiPhong: number,
    checkIn: string,
    checkOut: string,
    guests?: number,
    roomsCount?: number
) {
    try {
        const totalRoomsResult = await db.select({ value: count() })
            .from(Phong)
            .where(eq(Phong.maLoaiPhong, maLoaiPhong));

        const totalRooms = totalRoomsResult[0].value;

        if (totalRooms === 0) {
            return { available: false, remaining: 0, message: "Loại phòng này hiện chưa có phòng thực tế nào trong hệ thống." };
        }

        if (guests && roomsCount) {
            const loaiPhongResult = await db.select({ soNguoi: LoaiPhong.soNguoi })
                .from(LoaiPhong)
                .where(eq(LoaiPhong.maLoaiPhong, maLoaiPhong));

            if (loaiPhongResult.length > 0) {
                const maxNguoi = loaiPhongResult[0].soNguoi || 1;
                if (guests > maxNguoi * roomsCount) {
                    return {
                        available: false,
                        remaining: totalRooms,
                        message: `Rất tiếc, vượt quá số lượng khách tối đa. Tối đa ${maxNguoi} người/phòng.`
                    };
                }
            }
        }

        const overlappingBookings = await db.select({
            soLuong: chiTietPhieuDatPhong.soLuongPhong
        })
            .from(chiTietPhieuDatPhong)
            .innerJoin(PhieuDatPhong, eq(chiTietPhieuDatPhong.maPhieuDatPhong, PhieuDatPhong.maPhieuDatPhong))
            .where(
                and(
                    eq(chiTietPhieuDatPhong.maLoaiPhong, maLoaiPhong),
                    and(
                        lte(PhieuDatPhong.ngayNhanPhong, checkOut),
                        gte(PhieuDatPhong.ngayTraPhong, checkIn)
                    )
                )
            );

        const bookedRoomsCount = overlappingBookings.reduce((sum, item) => sum + item.soLuong, 0);
        const remaining = totalRooms - bookedRoomsCount;

        return {
            available: remaining > 0,
            remaining: remaining,
            message: remaining > 0 ? `Còn trống ${remaining} phòng.` : "Rất tiếc, đã hết phòng trong thời gian này."
        };

    } catch (error) {
        console.error("Availability check error:", error);
        return { available: false, remaining: 0, message: "Lỗi khi kiểm tra tình trạng phòng." };
    }
}

export async function createBookingAction(
    maLoaiPhong: number,
    checkIn: string,
    checkOut: string,
    guests: number,
    roomsCount: number,
    customerInfo: { hoten: string, sdt: string, email: string, diaChi: string, ngaySinh: string, gioiTinh: boolean },
    maKhuyenMai?: number
) {
    try {
        const availability = await checkRoomAvailability(maLoaiPhong, checkIn, checkOut, guests, roomsCount);
        if (!availability.available) {
            return { success: false, message: availability.message };
        }

        let maKhachHang = -1;

        const khachHangList = await db.select().from(KhachHang).where(
            or(eq(KhachHang.sdt, customerInfo.sdt), eq(KhachHang.email, customerInfo.email))
        ).limit(1);

        if (khachHangList.length > 0) {
            maKhachHang = khachHangList[0].maKhachHang;
        } else {
            const newKh = await db.insert(KhachHang).values({
                hoten: customerInfo.hoten,
                sdt: customerInfo.sdt,
                email: customerInfo.email,
                diaChi: customerInfo.diaChi,
                ngaySinh: customerInfo.ngaySinh,
                gioiTinh: customerInfo.gioiTinh
            }).returning({ maKhachHang: KhachHang.maKhachHang });
            maKhachHang = newKh[0].maKhachHang;
        }

        const newPhieu = await db.insert(PhieuDatPhong).values({
            maKhachHang: maKhachHang,
            ngayDat: new Date(),
            ngayNhanPhong: checkIn,
            ngayTraPhong: checkOut,
            soLuongKhach: guests,
            maKhuyenMai: maKhuyenMai,
        }).returning({ maPhieuDatPhong: PhieuDatPhong.maPhieuDatPhong });

        const maPhieuDatPhong = newPhieu[0].maPhieuDatPhong;

        await db.insert(chiTietPhieuDatPhong).values({
            maPhieuDatPhong: maPhieuDatPhong,
            maLoaiPhong: maLoaiPhong,
            soLuongPhong: roomsCount
        });

        return { success: true, message: "Đặt phòng thành công!" };
    } catch (e: any) {
        console.error("Lỗi khi đặt phòng:", e);
        return { success: false, message: "Đã có lỗi xảy ra. " + (e.message || "") };
    }
}