import { db } from "@/db";
import { KhuyenMai, ChiTietKhuyenMai, LoaiPhong } from "@/db/schema";
import { eq, gte, lte, and } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const today = new Date().toISOString().split("T")[0];

        // Lấy danh sách các khuyến mãi đang còn hạn
        const promotions = await db.select().from(KhuyenMai).where(
            and(
                lte(KhuyenMai.ngayBatDau, today),
                gte(KhuyenMai.ngayKetThuc, today)
            )
        );

        // Lấy chi tiết cho từng khuyến mãi
        const promoWithDetails = await Promise.all(
            promotions.map(async (promo) => {
                const details = await db.select({
                    tenLoaiPhong: LoaiPhong.tenLoaiPhong,
                    giamGia: ChiTietKhuyenMai.giamGia,
                    trangThai: ChiTietKhuyenMai.trangThai
                })
                    .from(ChiTietKhuyenMai)
                    .innerJoin(LoaiPhong, eq(ChiTietKhuyenMai.maLoaiPhong, LoaiPhong.maLoaiPhong))
                    .where(eq(ChiTietKhuyenMai.maKhuyenMai, promo.maKhuyenMai));

                return {
                    ...promo,
                    details: details.filter(d => d.trangThai)
                };
            })
        );

        return NextResponse.json(promoWithDetails);
    } catch (error) {
        console.error("API Promotions Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
