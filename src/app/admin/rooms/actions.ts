"use server";

import { db } from "@/db";
import { LoaiPhong, AnhLoaiPhong, Phong, TinhTrang, PhieuDatPhong, chiTietPhieuDatPhong } from "@/db/schema";
import { eq, and, lte, gte } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function addRoomTypeAction(formData: {
    tenLoaiPhong: string;
    moTa: string;
    gia: number;
    dienTich: number | null;
    soNguoi: number | null;
    anhChinh: string;
    anhPhu: string[];
}) {
    try {
        const newRoom = await db.insert(LoaiPhong).values({
            tenLoaiPhong: formData.tenLoaiPhong,
            moTa: formData.moTa,
            gia: formData.gia,
            dienTich: formData.dienTich,
            soNguoi: formData.soNguoi,
            anhChinh: formData.anhChinh,
        }).returning({ maLoaiPhong: LoaiPhong.maLoaiPhong });

        const maLoaiPhong = newRoom[0].maLoaiPhong;

        // Thêm ảnh phụ nếu có
        if (formData.anhPhu.length > 0) {
            const validImages = formData.anhPhu.filter((url) => url.trim() !== "");
            if (validImages.length > 0) {
                await db.insert(AnhLoaiPhong).values(
                    validImages.map((url) => ({ maLoaiPhong, imageUrl: url }))
                );
            }
        }

        revalidatePath("/admin");
        revalidatePath("/admin/rooms");
        return { success: true };
    } catch (error: any) {
        console.error("Lỗi thêm loại phòng:", error);
        return { success: false, message: error.message || "Đã xảy ra lỗi." };
    }
}

export async function deleteRoomTypeAction(maLoaiPhong: number) {
    try {
        await db.delete(AnhLoaiPhong).where(eq(AnhLoaiPhong.maLoaiPhong, maLoaiPhong));
        await db.delete(LoaiPhong).where(eq(LoaiPhong.maLoaiPhong, maLoaiPhong));
        revalidatePath("/admin");
        revalidatePath("/admin/rooms");
        return { success: true };
    } catch (error: any) {
        console.error("Lỗi xóa loại phòng:", error);
        return { success: false, message: error.message || "Đã xảy ra lỗi." };
    }
}

export async function getPhongByLoaiAction(maLoaiPhong: number) {
    try {
        const phongs = await db
            .select({
                maPhong: Phong.maPhong,
                soPhong: Phong.soPhong,
                maTinhTrang: Phong.maTinhTrang,
                tenTinhTrang: TinhTrang.tenTinhTrang,
            })
            .from(Phong)
            .leftJoin(TinhTrang, eq(Phong.maTinhTrang, TinhTrang.maTinhTrang))
            .where(eq(Phong.maLoaiPhong, maLoaiPhong))
            .orderBy(Phong.soPhong);

        const now = new Date();
        const offset = now.getTimezoneOffset() * 60000;
        const localISOTime = (new Date(now.getTime() - offset)).toISOString().split('T')[0];

        const bookings = await db
            .select({
                soLuong: chiTietPhieuDatPhong.soLuongPhong,
            })
            .from(chiTietPhieuDatPhong)
            .innerJoin(PhieuDatPhong, eq(chiTietPhieuDatPhong.maPhieuDatPhong, PhieuDatPhong.maPhieuDatPhong))
            .where(and(
                eq(chiTietPhieuDatPhong.maLoaiPhong, maLoaiPhong),
                eq(PhieuDatPhong.trangThai, "da_duyet"),
                lte(PhieuDatPhong.ngayNhanPhong, localISOTime),
                gte(PhieuDatPhong.ngayTraPhong, localISOTime)
            ));

        let totalBookedCount = bookings.reduce((sum, b) => sum + b.soLuong, 0);

        const modifiedPhongs = phongs.map(p => {
            const tenTT = p.tenTinhTrang?.toLowerCase() || "";
            const isAvailable = tenTT.includes("trống") || tenTT.includes("available") || tenTT.includes("sẵn") || tenTT.includes("không có khách");

            if (isAvailable && totalBookedCount > 0) {
                totalBookedCount--;
                return { ...p, tenTinhTrang: "Đã đặt phòng" };
            }
            return p;
        });

        return { success: true, data: modifiedPhongs };
    } catch (error: any) {
        console.error("Lỗi lấy danh sách phòng:", error);
        return { success: false, data: [], message: error.message };
    }
}

export async function addPhongAction(maLoaiPhong: number, soPhong: string, maTinhTrang: number) {
    try {
        await db.insert(Phong).values({ maLoaiPhong, soPhong, maTinhTrang });
        return { success: true };
    } catch (error: any) {
        console.error("Lỗi thêm phòng:", error);
        return { success: false, message: error.message || "Đã xảy ra lỗi (có thể số phòng đã tồn tại)." };
    }
}

export async function deletePhongAction(maPhong: number) {
    try {
        await db.delete(Phong).where(eq(Phong.maPhong, maPhong));
        return { success: true };
    } catch (error: any) {
        console.error("Lỗi xóa phòng:", error);
        return { success: false, message: error.message || "Đã xảy ra lỗi." };
    }
}

export async function getAllTinhTrangAction() {
    try {
        const data = await db.select().from(TinhTrang);
        return { success: true, data };
    } catch (error: any) {
        return { success: false, data: [], message: error.message };
    }
}
