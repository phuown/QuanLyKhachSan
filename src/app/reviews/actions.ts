"use server";

import { db } from "@/db";
import { DanhGia, KhachHang } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getReviewsAction() {
    try {
        const reviews = await db.select()
            .from(DanhGia)
            .orderBy(desc(DanhGia.ngayDanhGia));
        return { success: true, data: reviews };
    } catch (error) {
        console.error("Error fetching reviews:", error);
        return { success: false, error: "Không thể tải danh sách đánh giá" };
    }
}

export async function submitReviewAction(formData: {
    tenKhachHang: string;
    email: string;
    noiDung: string;
    soSao: number;
}) {
    try {
        // Tìm khách hàng theo email
        const khachhangList = await db.select().from(KhachHang).where(eq(KhachHang.email, formData.email));

        if (khachhangList.length === 0) {
            return { success: false, error: "Bạn cần đặt phòng ít nhất một lần để có thể đánh giá." };
        }

        const khachHang = khachhangList[0];

        await db.insert(DanhGia).values({
            tenKhachHang: formData.tenKhachHang,
            email: formData.email,
            noiDung: formData.noiDung,
            soSao: formData.soSao,
            maKhachHang: khachHang.maKhachHang,
        });

        revalidatePath("/reviews");
        return { success: true };
    } catch (error) {
        console.error("Error submitting review:", error);
        return { success: false, error: "Không thể gửi đánh giá. Vui lòng thử lại sau." };
    }
}
