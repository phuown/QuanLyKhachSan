"use server";

import { db } from "@/db";
import { PhieuDatPhong, chiTietPhieuDatPhong } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function cancelBookingAction(maPhieu: number) {
    try {
        // Cần xóa chi tiết phiếu trước (foreign key rành buộc)
        await db.delete(chiTietPhieuDatPhong).where(eq(chiTietPhieuDatPhong.maPhieuDatPhong, maPhieu));
        // Xóa phiếu booking chính
        await db.delete(PhieuDatPhong).where(eq(PhieuDatPhong.maPhieuDatPhong, maPhieu));

        revalidatePath("/my-bookings");
        revalidatePath("/admin");
        return { success: true };
    } catch (error: any) {
        console.error("Lỗi xóa đặt phòng: ", error);
        return { success: false, message: error.message || "Đã xảy ra lỗi hệ thống." };
    }
}
