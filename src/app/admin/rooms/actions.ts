"use server";

import { db } from "@/db";
import { LoaiPhong, AnhLoaiPhong, Phong, TinhTrang, PhieuDatPhong, chiTietPhieuDatPhong } from "@/db/schema";
import { eq, and, lte, gte, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import fs from "fs/promises";
import path from "path";

//Lưu file ảnh loại phòng khi thêm mới
async function saveFile(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
    const relativePath = `/uploads/anh_loai_phong/${fileName}`;
    const fullPath = path.join(process.cwd(), "public", "uploads", "anh_loai_phong", fileName);

    await fs.writeFile(fullPath, buffer);
    return relativePath;
}

// Thêm loại phòng
export async function addRoomTypeAction(formData: FormData) {
    try {
        const tenLoaiPhong = formData.get("tenLoaiPhong") as string;
        const moTa = formData.get("moTa") as string;
        const gia = parseInt(formData.get("gia") as string);
        const dienTich = formData.get("dienTich") ? parseInt(formData.get("dienTich") as string) : null;
        const soNguoi = formData.get("soNguoi") ? parseInt(formData.get("soNguoi") as string) : null;

        const anhChinhFile = formData.get("anhChinh") as File;
        const anhPhuFiles = formData.getAll("anhPhu") as File[];

        let anhChinhUrl = "";
        if (anhChinhFile && anhChinhFile.size > 0) {
            anhChinhUrl = await saveFile(anhChinhFile);
        }

        const newRoom = await db.insert(LoaiPhong).values({
            tenLoaiPhong,
            moTa,
            gia,
            dienTich,
            soNguoi,
            anhChinh: anhChinhUrl,
        }).returning({ maLoaiPhong: LoaiPhong.maLoaiPhong });

        const maLoaiPhong = newRoom[0].maLoaiPhong;

        const anhPhuUrls: string[] = [];
        for (const file of anhPhuFiles) {
            if (file && file.size > 0) {
                const url = await saveFile(file);
                anhPhuUrls.push(url);
            }
        }

        if (anhPhuUrls.length > 0) {
            await db.insert(AnhLoaiPhong).values(
                anhPhuUrls.map((url) => ({ maLoaiPhong, imageUrl: url }))
            );
        }

        revalidatePath("/admin");
        revalidatePath("/admin/rooms");
        return { success: true };
    } catch (error: any) {
        console.error("Lỗi thêm loại phòng:", error);
        return { success: false, message: error.message || "Đã xảy ra lỗi." };
    }
}

// Cập nhật loại phòng
export async function updateRoomTypeAction(maLoaiPhong: number, formData: FormData) {
    try {
        const tenLoaiPhong = formData.get("tenLoaiPhong") as string;
        const moTa = formData.get("moTa") as string;
        const gia = parseInt(formData.get("gia") as string);
        const dienTich = formData.get("dienTich") ? parseInt(formData.get("dienTich") as string) : null;
        const soNguoi = formData.get("soNguoi") ? parseInt(formData.get("soNguoi") as string) : null;

        const anhChinhFile = formData.get("anhChinh") as File;
        const anhPhuFiles = formData.getAll("anhPhu") as File[];

        const existingAnhChinh = formData.get("existingAnhChinh") as string;
        const existingAnhPhu = formData.getAll("existingAnhPhu") as string[];

        let anhChinhUrl = existingAnhChinh;
        if (anhChinhFile && anhChinhFile.size > 0) {
            anhChinhUrl = await saveFile(anhChinhFile);
        }

        await db.update(LoaiPhong).set({
            tenLoaiPhong,
            moTa,
            gia,
            dienTich,
            soNguoi,
            anhChinh: anhChinhUrl,
        }).where(eq(LoaiPhong.maLoaiPhong, maLoaiPhong));

        await db.delete(AnhLoaiPhong).where(eq(AnhLoaiPhong.maLoaiPhong, maLoaiPhong));

        const allAnhPhuUrls = [...existingAnhPhu];

        for (const file of anhPhuFiles) {
            if (file && file.size > 0) {
                const url = await saveFile(file);
                allAnhPhuUrls.push(url);
            }
        }

        if (allAnhPhuUrls.length > 0) {
            await db.insert(AnhLoaiPhong).values(
                allAnhPhuUrls.map((url) => ({ maLoaiPhong, imageUrl: url }))
            );
        }

        revalidatePath("/admin");
        revalidatePath("/admin/rooms");
        return { success: true };
    } catch (error: any) {
        console.error("Lỗi cập nhật loại phòng:", error);
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
                maLoaiPhong: Phong.maLoaiPhong,
                tenLoaiPhong: LoaiPhong.tenLoaiPhong,
                maTinhTrang: Phong.maTinhTrang,
                tenTinhTrang: TinhTrang.tenTinhTrang,
            })
            .from(Phong)
            .leftJoin(TinhTrang, eq(Phong.maTinhTrang, TinhTrang.maTinhTrang))
            .leftJoin(LoaiPhong, eq(Phong.maLoaiPhong, LoaiPhong.maLoaiPhong))
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

//Thêm mới phòng trong loại phòng
export async function addPhongAction(maLoaiPhong: number, soPhong: string, maTinhTrang: number) {
    try {
        await db.execute(sql`SELECT setval(pg_get_serial_sequence('"Phong"', 'maPhong'), (SELECT MAX("maPhong") FROM "Phong"))`);

        const result = await db.insert(Phong).values({ maLoaiPhong, soPhong, maTinhTrang }).returning({ maPhong: Phong.maPhong });
        return { success: true, maPhong: result[0].maPhong };
    } catch (error: any) {
        console.error("Lỗi thêm phòng:", error);
        return { success: false, message: error.message || "Đã xảy ra lỗi (có thể số phòng đã tồn tại)." };
    }
}

//Xóa phòng
export async function deletePhongAction(maPhong: number) {
    try {
        await db.delete(Phong).where(eq(Phong.maPhong, maPhong));
        return { success: true };
    } catch (error: any) {
        console.error("Lỗi xóa phòng:", error);
        return { success: false, message: error.message || "Đã xảy ra lỗi." };
    }
}

//Cập nhật phòng
export async function updatePhongAction(maPhong: number, soPhong: string, maTinhTrang: number) {
    try {
        const result = await db.update(Phong)
            .set({ soPhong, maTinhTrang })
            .where(eq(Phong.maPhong, maPhong))
            .returning({ maPhong: Phong.maPhong });
        return { success: true, maPhong: result[0].maPhong };
    } catch (error: any) {
        console.error("Lỗi cập nhật phòng:", error);
        return { success: false, message: error.message || "Đã xảy ra lỗi." };
    }
}

//Lấy tình trạng phòng
export async function getAllTinhTrangAction() {
    try {
        const data = await db.select().from(TinhTrang);
        return { success: true, data };
    } catch (error: any) {
        return { success: false, data: [], message: error.message };
    }
}