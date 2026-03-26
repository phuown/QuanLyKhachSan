"use server";

import { db } from "@/db";
import { PhieuDatPhong, chiTietPhieuDatPhong, Phong, TinhTrang } from "@/db/schema";
import { eq, and, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// Cập nhật trạng thái phiếu đặt phòng
export async function updateBookingStatusAction(maPhieu: number, trangThai: string) {
    try {
        const updateData: any = { trangThai };

        if (trangThai === "da_huy" || trangThai === "da_tra_phong") {
            updateData.ngayHuy = new Date();
        } else {
            updateData.ngayHuy = null;
        }

        await db.update(PhieuDatPhong)
            .set(updateData)
            .where(eq(PhieuDatPhong.maPhieuDatPhong, maPhieu));

        if (trangThai === "da_nhan_phong" || trangThai === "da_tra_phong" || trangThai === "da_huy") {
            const details = await db.select().from(chiTietPhieuDatPhong).where(eq(chiTietPhieuDatPhong.maPhieuDatPhong, maPhieu));

            const ttList = await db.select().from(TinhTrang);

            const ttTrong = ttList.find(t => {
                const name = t.tenTinhTrang.toLowerCase().trim();
                return name.includes("không có khách") || name.includes("trống") || name.includes("available");
            })?.maTinhTrang;

            const ttDaNhan = ttList.find(t => {
                const name = t.tenTinhTrang.toLowerCase().trim();
                return (name.includes("có khách") || name.includes("nhận") || name.includes("bận")) && !name.includes("không");
            })?.maTinhTrang;

            if (ttTrong === undefined || ttDaNhan === undefined) {
                console.error("Không tìm thấy ID tình trạng phù hợp:", { ttTrong, ttDaNhan, list: ttList });
                return { success: false, message: "Cấu hình tình trạng phòng chưa đúng (phải có 'Không có khách' và 'Có khách đang ở')." };
            }

            console.log("Thực hiện gán phòng:", { maPhieu, trangThai, ttTrong, ttDaNhan });

            for (const detail of details) {
                if (trangThai === "da_nhan_phong") {
                    const roomsToBook = await db.select({ maPhong: Phong.maPhong })
                        .from(Phong)
                        .where(and(
                            eq(Phong.maLoaiPhong, detail.maLoaiPhong),
                            eq(Phong.maTinhTrang, ttTrong)
                        ))
                        .limit(detail.soLuongPhong);

                    if (roomsToBook.length > 0) {
                        const ids = roomsToBook.map(r => r.maPhong);
                        await db.update(Phong)
                            .set({ maTinhTrang: ttDaNhan })
                            .where(inArray(Phong.maPhong, ids));
                    }
                }
                else if (trangThai === "da_tra_phong" || trangThai === "da_huy") {
                    const roomsToRelease = await db.select({ maPhong: Phong.maPhong })
                        .from(Phong)
                        .where(and(
                            eq(Phong.maLoaiPhong, detail.maLoaiPhong),
                            eq(Phong.maTinhTrang, ttDaNhan)
                        ))
                        .limit(detail.soLuongPhong);

                    if (roomsToRelease.length > 0) {
                        const ids = roomsToRelease.map(r => r.maPhong);
                        await db.update(Phong)
                            .set({ maTinhTrang: ttTrong })
                            .where(inArray(Phong.maPhong, ids));
                    }
                }
            }
        }

        revalidatePath("/admin");
        revalidatePath("/admin/bookings");
        revalidatePath("/admin/rooms");
        return { success: true };
    } catch (error: any) {
        console.error("Lỗi cập nhật trạng thái:", error);
        return { success: false, message: error.message };
    }
}
