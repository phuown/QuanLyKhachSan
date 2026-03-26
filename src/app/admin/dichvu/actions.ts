"use server";

import { db } from "@/db";
import { DichVu, PhieuNhapKho, ChiTietPhieuNhapKho, PhieuXuatKho, ChiTietPhieuXuatKho } from "@/db/schema";
import { eq, desc, asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// Lấy danh sách các dịch vụ
export async function getDichVuAction() {
    return await db.select().from(DichVu).orderBy(asc(DichVu.maDichVu));
}

// Thêm mới dịch vụ
export async function addDichVuAction(data: { tenDichVu: string; donVi: string; gia: number }) {
    try {
        await db.insert(DichVu).values(data);
        revalidatePath("/admin/dichvu");
        return { success: true };
    } catch (error) {
        console.error("AddDichVu Error:", error);
        return { success: false, message: "Không thể thêm dịch vụ" };
    }
}

// Cập nhật từng loại dịch vụ
export async function updateDichVuAction(id: number, data: { tenDichVu: string; donVi: string; gia: number }) {
    try {
        await db.update(DichVu).set(data).where(eq(DichVu.maDichVu, id));
        revalidatePath("/admin/dichvu");
        return { success: true };
    } catch (error) {
        console.error("UpdateDichVu Error:", error);
        return { success: false, message: "Không thể cập nhật dịch vụ" };
    }
}

// Xóa từng loại dịch vụ
export async function deleteDichVuAction(id: number) {
    try {
        await db.delete(DichVu).where(eq(DichVu.maDichVu, id));
        revalidatePath("/admin/dichvu");
        return { success: true };
    } catch (error) {
        console.error("DeleteDichVu Error:", error);
        return { success: false, message: "Không thể xóa dịch vụ vì có dữ liệu liên quan" };
    }
}

// Lấy danh sách phiếu nhập kho
export async function getPhieuNhapAction() {
    return await db.select().from(PhieuNhapKho).orderBy(desc(PhieuNhapKho.ngayNhap));
}

// Lấy chi tiết phiếu nhập kho
export async function getChiTietPhieuNhapAction(maPhieu: number) {
    return await db.select().from(ChiTietPhieuNhapKho).where(eq(ChiTietPhieuNhapKho.maPhieuNhapKho, maPhieu));
}

// Tạo phiếu nhập kho
export async function createPhieuNhapAction(data: { ngayNhap: Date; items: { maDichVu: number; soLuong: number; gia: number }[] }) {
    try {
        const tongTien = data.items.reduce((acc, item) => acc + item.soLuong * item.gia, 0);

        const [insertedPhieu] = await db.insert(PhieuNhapKho).values({
            ngayNhap: data.ngayNhap,
            tongTien: tongTien
        }).returning();

        if (data.items.length > 0) {
            await db.insert(ChiTietPhieuNhapKho).values(
                data.items.map(item => ({
                    maPhieuNhapKho: insertedPhieu.maPhieuNhapKho,
                    maDichVu: item.maDichVu,
                    soLuong: item.soLuong,
                    gia: item.gia
                }))
            );
        }

        revalidatePath("/admin/dichvu/nhap");
        return { success: true };
    } catch (error) {
        console.error("CreatePhieuNhap Error:", error);
        return { success: false, message: "Không thể tạo phiếu nhập" };
    }
}


// Cập nhật phiếu nhập kho
export async function updatePhieuNhapAction(id: number, data: { ngayNhap: Date; items: { maDichVu: number; soLuong: number; gia: number }[] }) {
    try {
        const tongTien = data.items.reduce((acc, item) => acc + item.soLuong * item.gia, 0);

        await db.update(PhieuNhapKho).set({
            ngayNhap: data.ngayNhap,
            tongTien: tongTien
        }).where(eq(PhieuNhapKho.maPhieuNhapKho, id));

        // Xóa chi tiết cũ và thêm chi tiết mới
        await db.delete(ChiTietPhieuNhapKho).where(eq(ChiTietPhieuNhapKho.maPhieuNhapKho, id));
        
        if (data.items.length > 0) {
            await db.insert(ChiTietPhieuNhapKho).values(
                data.items.map(item => ({
                    maPhieuNhapKho: id,
                    maDichVu: item.maDichVu,
                    soLuong: item.soLuong,
                    gia: item.gia
                }))
            );
        }

        revalidatePath("/admin/dichvu/nhap");
        return { success: true };
    } catch (error) {
        console.error("UpdatePhieuNhap Error:", error);
        return { success: false, message: "Không thể cập nhật phiếu nhập" };
    }
}


// Lấy danh sách phiếu xuất kho
export async function getPhieuXuatAction() {
    return await db.select().from(PhieuXuatKho).orderBy(desc(PhieuXuatKho.ngayXuat));
}

// Lấy chi tiết phiếu xuất kho
export async function getChiTietPhieuXuatAction(maPhieu: number) {
    return await db.select().from(ChiTietPhieuXuatKho).where(eq(ChiTietPhieuXuatKho.maPhieuXuatKho, maPhieu));
}

// Tạo phiếu xuất kho
export async function createPhieuXuatAction(data: { ngayXuat: Date; items: { maDichVu: number; soLuong: number; gia: number; lyDo: string }[] }) {
    try {
        const tongTien = data.items.reduce((acc, item) => acc + item.soLuong * item.gia, 0);

        const [insertedPhieu] = await db.insert(PhieuXuatKho).values({
            ngayXuat: data.ngayXuat,
            tongTien: tongTien
        }).returning();

        if (data.items.length > 0) {
            await db.insert(ChiTietPhieuXuatKho).values(
                data.items.map(item => ({
                    maPhieuXuatKho: insertedPhieu.maPhieuXuatKho,
                    maDichVu: item.maDichVu,
                    soLuong: item.soLuong,
                    gia: item.gia,
                    lyDo: item.lyDo
                }))
            );
        }

        revalidatePath("/admin/dichvu/xuat");
        return { success: true };
    } catch (error) {
        console.error("CreatePhieuXuat Error:", error);
        return { success: false, message: "Không thể tạo phiếu xuất" };
    }
}

// Cập nhật phiếu xuất kho
export async function updatePhieuXuatAction(id: number, data: { ngayXuat: Date; items: { maDichVu: number; soLuong: number; gia: number; lyDo: string }[] }) {
    try {
        const tongTien = data.items.reduce((acc, item) => acc + item.soLuong * item.gia, 0);

        await db.update(PhieuXuatKho).set({
            ngayXuat: data.ngayXuat,
            tongTien: tongTien
        }).where(eq(PhieuXuatKho.maPhieuXuatKho, id));

        // Xóa chi tiết cũ và thêm chi tiết mới
        await db.delete(ChiTietPhieuXuatKho).where(eq(ChiTietPhieuXuatKho.maPhieuXuatKho, id));

        if (data.items.length > 0) {
            await db.insert(ChiTietPhieuXuatKho).values(
                data.items.map(item => ({
                    maPhieuXuatKho: id,
                    maDichVu: item.maDichVu,
                    soLuong: item.soLuong,
                    gia: item.gia,
                    lyDo: item.lyDo
                }))
            );
        }

        revalidatePath("/admin/dichvu/xuat");
        return { success: true };
    } catch (error) {
        console.error("UpdatePhieuXuat Error:", error);
        return { success: false, message: "Không thể cập nhật phiếu xuất" };
    }
}


//Xóa phiếu nhập kho
export async function deletePhieuNhapAction(id: number) {
    try {
        await db.delete(ChiTietPhieuNhapKho).where(eq(ChiTietPhieuNhapKho.maPhieuNhapKho, id));
        await db.delete(PhieuNhapKho).where(eq(PhieuNhapKho.maPhieuNhapKho, id));
        revalidatePath("/admin/dichvu/nhap");
        return { success: true };
    } catch (error) {
        console.error("DeletePhieuNhap Error:", error);
        return { success: false, message: "Không thể xóa phiếu nhập" };
    }
}

//Xóa phiếu xuất kho
export async function deletePhieuXuatAction(id: number) {
    try {
        await db.delete(ChiTietPhieuXuatKho).where(eq(ChiTietPhieuXuatKho.maPhieuXuatKho, id));
        await db.delete(PhieuXuatKho).where(eq(PhieuXuatKho.maPhieuXuatKho, id));
        revalidatePath("/admin/dichvu/xuat");
        return { success: true };
    } catch (error) {
        console.error("DeletePhieuXuat Error:", error);
        return { success: false, message: "Không thể xóa phiếu xuất" };
    }
}