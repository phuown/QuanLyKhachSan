"use server";
import { cookies } from "next/headers";
import { db } from "@/db";
import { KhachHang, Phong, TinhTrang, PhieuDatPhong } from "@/db/schema";
import { eq, count, and } from "drizzle-orm";

export async function adminLoginAction(username: string, password: string) {
    // Thông tin tài khoản đăng nhập admin
    const ADMIN_USER = "admin";
    const ADMIN_PASS = "123456";

    if (username === ADMIN_USER && password === ADMIN_PASS) {
        const cookieStore = await cookies();
        cookieStore.set("admin_session", "true", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24,
            path: "/",
        });
        return { success: true };
    }
    return { success: false, message: "Tài khoản hoặc mật khẩu không chính xác!" };
}

export async function adminLogoutAction() {
    const cookieStore = await cookies();
    cookieStore.delete("admin_session");
}

export async function getDashboardStatsAction() {
    try {
        // 1. Tổng số lượng khách hàng đang ở (tổng soLuongKhach từ phiếu 'da_nhan_phong')
        const activeBookings = await db
            .select({ soLuongKhach: PhieuDatPhong.soLuongKhach })
            .from(PhieuDatPhong)
            .where(eq(PhieuDatPhong.trangThai, "da_nhan_phong"));

        const totalGuests = activeBookings.reduce((sum, b) => sum + (b.soLuongKhach || 0), 0);

        // 1.1 Tổng số lượng khách đặt phòng (tổng soLuongKhach từ phiếu 'da_duyet')
        const reservedBookings = await db
            .select({ soLuongKhach: PhieuDatPhong.soLuongKhach })
            .from(PhieuDatPhong)
            .where(eq(PhieuDatPhong.trangThai, "da_duyet"));
        
        const totalBookingGuests = reservedBookings.reduce((sum, b) => sum + (b.soLuongKhach || 0), 0);

        // 2. Lấy danh sách tình trạng để phân loại
        const ttList = await db.select().from(TinhTrang);

        // Logic phân loại (tương tự bookingActions.ts)
        const emptyStatusIds = ttList.filter(t => {
            const name = t.tenTinhTrang.toLowerCase().trim();
            return name.includes("không có khách") || name.includes("trống") || name.includes("available");
        }).map(t => t.maTinhTrang);

        const occupiedStatusIds = ttList.filter(t => {
            const name = t.tenTinhTrang.toLowerCase().trim();
            return (name.includes("có khách") || name.includes("nhận") || name.includes("bận")) && !name.includes("không");
        }).map(t => t.maTinhTrang);

        // 3. Đếm số lượng phòng theo trạng thái
        const allRooms = await db.select().from(Phong);
        const totalRooms = allRooms.length;

        let occupiedCount = 0;
        let emptyCount = 0;

        allRooms.forEach(p => {
            if (occupiedStatusIds.includes(p.maTinhTrang)) occupiedCount++;
            else if (emptyStatusIds.includes(p.maTinhTrang)) emptyCount++;
        });

        // Những phòng không thuộc 2 trạng thái trên (ví dụ đang sửa chữa) có thể coi là bận hoặc category khác
        // Nhưng yêu cầu là "đang ở" và "trống" cho biểu đồ tròn.
        const otherCount = totalRooms - occupiedCount - emptyCount;

        return {
            success: true,
            data: {
                totalGuests,
                totalBookingGuests,
                roomStats: [
                    { name: "Phòng đang ở", value: occupiedCount, color: "#3B82F6" }, // Blue (Vibrant)
                    { name: "Phòng trống", value: emptyCount, color: "#10B981" },    // Green (Vibrant)
                    { name: "Khác (Bảo trì...)", value: otherCount, color: "#F59E0B" } // Amber/Orange
                ],
                totalRooms
            }
        };
    } catch (error: any) {
        console.error("Lỗi lấy thống kê:", error);
        return { success: false, message: error.message };
    }
}
