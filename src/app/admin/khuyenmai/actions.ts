"use server";

import { db } from "@/db";
import { KhuyenMai, ChiTietKhuyenMai, LoaiPhong } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function addKhuyenMaiAction(formData: {
    maCode: string;
    tenKhuyenMai: string;
    noiDung: string;
    ngayBatDau: string;
    ngayKetThuc: string;
    chiTiet: { maLoaiPhong: number; giamGia: number; trangThai: boolean }[];
}) {
    try {
        const newKhuyenMai = await db.insert(KhuyenMai).values({
            maCode: formData.maCode,
            tenKhuyenMai: formData.tenKhuyenMai,
            noiDung: formData.noiDung,
            ngayBatDau: formData.ngayBatDau,
            ngayKetThuc: formData.ngayKetThuc,
        }).returning({ maKhuyenMai: KhuyenMai.maKhuyenMai });

        const maKhuyenMai = newKhuyenMai[0].maKhuyenMai;

        if (formData.chiTiet.length > 0) {
            await db.insert(ChiTietKhuyenMai).values(
                formData.chiTiet.map((ct) => ({
                    maKhuyenMai,
                    maLoaiPhong: ct.maLoaiPhong,
                    giamGia: ct.giamGia,
                    trangThai: ct.trangThai,
                }))
            );
        }

        revalidatePath("/admin/khuyenmai");
        return { success: true };
    } catch (error: any) {
        console.error("Lỗi thêm khuyến mãi:", error);
        return { success: false, message: error.message || "Đã xảy ra lỗi." };
    }
}

export async function deleteKhuyenMaiAction(maKhuyenMai: number) {
    try {
        await db.delete(ChiTietKhuyenMai).where(eq(ChiTietKhuyenMai.maKhuyenMai, maKhuyenMai));
        await db.delete(KhuyenMai).where(eq(KhuyenMai.maKhuyenMai, maKhuyenMai));
        revalidatePath("/admin/khuyenmai");
        return { success: true };
    } catch (error: any) {
        console.error("Lỗi xóa khuyến mãi:", error);
        return { success: false, message: error.message || "Đã xảy ra lỗi." };
    }
}

export async function getAllLoaiPhongAction() {
    try {
        const data = await db.select().from(LoaiPhong);
        return { success: true, data };
    } catch (error: any) {
        return { success: false, data: [], message: error.message };
    }
}
