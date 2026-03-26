"use server";

import { db } from "@/db";
import { KhuyenMai, ChiTietKhuyenMai, LoaiPhong } from "@/db/schema";
import { eq, and, lte, gte } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// Tạo phiếu khuyến mại
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

// Xóa phiếu khuyến mại
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

// Lấy tất cả loại phòng
export async function getAllLoaiPhongAction() {
    try {
        const data = await db.select().from(LoaiPhong);
        return { success: true, data };
    } catch (error: any) {
        return { success: false, data: [], message: error.message };
    }
}

// Kiểm tra điều kiện của mã khuyến mại
export async function validatePromotionAction(maCode: string, maLoaiPhong: number) {
    try {
        const today = new Date().toISOString().split("T")[0];

        // Tìm mã khuyến mãi theo mã code và còn hạn sử dụng
        const promotions = await db.select()
            .from(KhuyenMai)
            .where(
                and(
                    eq(KhuyenMai.maCode, maCode),
                    lte(KhuyenMai.ngayBatDau, today),
                    gte(KhuyenMai.ngayKetThuc, today)
                )
            );

        if (promotions.length === 0) {
            return { success: false, message: "Mã khuyến mãi không tồn tại hoặc đã hết hạn." };
        }

        const promo = promotions[0];

        // Kiểm tra xem loại phòng này có được áp dụng khuyến mãi không
        const detail = await db.select()
            .from(ChiTietKhuyenMai)
            .where(
                and(
                    eq(ChiTietKhuyenMai.maKhuyenMai, promo.maKhuyenMai),
                    eq(ChiTietKhuyenMai.maLoaiPhong, maLoaiPhong),
                    eq(ChiTietKhuyenMai.trangThai, true)
                )
            );

        if (detail.length === 0) {
            return { success: false, message: "Mã khuyến mãi này không áp dụng cho loại phòng bạn chọn." };
        }

        return {
            success: true,
            data: {
                maKhuyenMai: promo.maKhuyenMai,
                giamGia: detail[0].giamGia, // Giảm theo %
                tenKhuyenMai: promo.tenKhuyenMai
            }
        };
    } catch (error: any) {
        console.error("Lỗi validate khuyến mãi:", error);
        return { success: false, message: "Lỗi hệ thống khi kiểm tra mã." };
    }
}

//  Lấy thông tin theo mã khuyến mại
export async function getKhuyenMaiByIdAction(maKhuyenMai: number) {
    try {
        const promotion = await db.select().from(KhuyenMai).where(eq(KhuyenMai.maKhuyenMai, maKhuyenMai));
        if (promotion.length === 0) return { success: false, message: "Không tìm thấy khuyến mãi." };

        const details = await db.select().from(ChiTietKhuyenMai).where(eq(ChiTietKhuyenMai.maKhuyenMai, maKhuyenMai));

        return { success: true, data: { ...promotion[0], chiTiet: details } };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}

// Cập nhật khuyến mại
export async function updateKhuyenMaiAction(maKhuyenMai: number, formData: {
    maCode: string;
    tenKhuyenMai: string;
    noiDung: string;
    ngayBatDau: string;
    ngayKetThuc: string;
    chiTiet: { maLoaiPhong: number; giamGia: number; trangThai: boolean }[];
}) {
    try {
        await db.update(KhuyenMai)
            .set({
                maCode: formData.maCode,
                tenKhuyenMai: formData.tenKhuyenMai,
                noiDung: formData.noiDung,
                ngayBatDau: formData.ngayBatDau,
                ngayKetThuc: formData.ngayKetThuc,
            })
            .where(eq(KhuyenMai.maKhuyenMai, maKhuyenMai));

        // Xóa chi tiết cũ và thêm mới (đơn giản nhất)
        await db.delete(ChiTietKhuyenMai).where(eq(ChiTietKhuyenMai.maKhuyenMai, maKhuyenMai));

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
        console.error("Lỗi cập nhật khuyến mãi:", error);
        return { success: false, message: error.message || "Đã xảy ra lỗi." };
    }
}