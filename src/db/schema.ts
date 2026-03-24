import {
  pgTable, serial, integer, varchar, text, timestamp, boolean, date,
  uniqueIndex
} from "drizzle-orm/pg-core";

export const LoaiPhong = pgTable("LoaiPhong", {
  maLoaiPhong: serial("maLoaiPhong").primaryKey(),
  tenLoaiPhong: varchar("tenLoaiPhong", { length: 255 }).notNull(),
  moTa: text("moTa").notNull(),
  gia: integer("gia").notNull(),
  dienTich: integer("dien_tich"),
  soNguoi: integer("so_nguoi"),
  anhChinh: varchar("anhChinh", { length: 255 }).notNull().default(""),
});

export const AnhLoaiPhong = pgTable("AnhLoaiPhong", {
  maAnh: serial("maAnh").primaryKey(),
  maLoaiPhong: integer("maLoaiPhong").notNull().references(() => LoaiPhong.maLoaiPhong),
  imageUrl: varchar("image_url", { length: 255 }).notNull(),
});

export const Phong = pgTable("Phong", {
  maPhong: serial("maPhong").primaryKey(),
  maLoaiPhong: integer("maLoaiPhong").notNull().references(() => LoaiPhong.maLoaiPhong),
  soPhong: varchar("soPhong", { length: 255 }).notNull(),
  maTinhTrang: integer("maTinhTrang").notNull().references(() => TinhTrang.maTinhTrang),
}, (table) => ({
  unique_soPhong: uniqueIndex("unique_soPhong").on(table.soPhong),
}));

export const TinhTrang = pgTable("TinhTrang", {
  maTinhTrang: serial("maTinhTrang").primaryKey(),
  tenTinhTrang: varchar("tenTinhTrang", { length: 255 }).notNull(),
});

export const PhieuDatPhong = pgTable("PhieuDatPhong", {
  maPhieuDatPhong: serial("maPhieuDatPhong").primaryKey(),
  maKhachHang: integer("maKhachHang").notNull().references(() => KhachHang.maKhachHang),
  ngayDat: timestamp("ngayDat").notNull(),
  ngayNhanPhong: date("ngayNhanPhong").notNull(),
  ngayTraPhong: date("ngayTraPhong").notNull(),
  trangThai: varchar("trangThai", { length: 50 }).default("da_duyet"),
  ngayHuy: timestamp("ngayHuy"),
  soLuongKhach: integer("so_luong_khach").notNull().default(1),
  maKhuyenMai: integer("maKhuyenMai").references(() => KhuyenMai.maKhuyenMai),
});

export const chiTietPhieuDatPhong = pgTable("chiTietPhieuDatPhong", {
  maPhieuDatPhong: integer("maPhieuDatPhong").notNull().references(() => PhieuDatPhong.maPhieuDatPhong),
  maLoaiPhong: integer("maLoaiPhong").notNull().references(() => LoaiPhong.maLoaiPhong),
  soLuongPhong: integer("soLuongPhong").notNull(),
}, table => ({
  unique_phieu_loaiphong: uniqueIndex("unique_phieu_loaiphong").on(table.maPhieuDatPhong, table.maLoaiPhong),
}));

export const KhachHang = pgTable("KhachHang", {
  maKhachHang: serial("maKhachHang").primaryKey(),
  hoten: varchar("hoten", { length: 255 }).notNull(),
  sdt: varchar("sdt", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  diaChi: varchar("diaChi", { length: 255 }).notNull(),
  ngaySinh: date("ngaySinh").notNull(),
  gioiTinh: boolean("gioiTinh").notNull(),
}, (table) => {
  return {
    unique_sdt: uniqueIndex("unique_sdt").on(table.sdt),
    unique_email: uniqueIndex("unique_email").on(table.email),
  };
});

export const DanhGia = pgTable("DanhGia", {
  maDanhGia: serial("maDanhGia").primaryKey(),
  tenKhachHang: varchar("tenKhachHang", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }),
  noiDung: text("noiDung").notNull(),
  soSao: integer("soSao").notNull().default(5),
  ngayDanhGia: timestamp("ngayDanhGia").defaultNow().notNull(),
  maKhachHang: integer("maKhachHang").notNull().references(() => KhachHang.maKhachHang),
});

export const KhuyenMai = pgTable("KhuyenMai", {
  maKhuyenMai: serial("maKhuyenMai").primaryKey(),
  maCode: varchar("maCode", { length: 255 }).notNull(),
  tenKhuyenMai: varchar("tenKhuyenMai", { length: 255 }).notNull(),
  noiDung: text("noiDung").notNull(),
  ngayBatDau: date("ngayBatDau").notNull(),
  ngayKetThuc: date("ngayKetThuc").notNull(),
}, (table) => {
  return {
    unique_maCode: uniqueIndex("unique_maCode").on(table.maCode),
  };
});

export const ChiTietKhuyenMai = pgTable("ChiTietKhuyenMai", {
  maKhuyenMai: integer("maKhuyenMai").notNull().references(() => KhuyenMai.maKhuyenMai),
  maLoaiPhong: integer("maLoaiPhong").notNull().references(() => LoaiPhong.maLoaiPhong),
  giamGia: integer("giamGia").notNull(),
  trangThai: boolean("trangThai").notNull(),
}, table => ({
  unique_khuyenmai_loaiphong: uniqueIndex("unique_khuyenmai_loaiphong").on(table.maKhuyenMai, table.maLoaiPhong),
}));


// export const TienNghi = pgTable("TienNghi", {
//   maTienNghi: serial("maTienNghi").primaryKey(),
//   tenTienNghi: varchar("tenTienNghi", { length: 255 }).notNull(),
//   moTa: text("moTa").notNull(),
//   maNhanVien: integer("maNhanVien").notNull().references(() => NhanVien.maNhanVien),
// });

// export const ChiTietTienNghi = pgTable("ChiTietTienNghi", {
//   maPhong: integer("maPhong").notNull().references(() => Phong.maPhong),
//   maTienNghi: integer("maTienNghi").notNull().references(() => TienNghi.maTienNghi),
// }, (table) => ({
//   unique_phong_tienNghi: uniqueIndex("unique_phong_tienNghi").on(table.maPhong, table.maTienNghi),
// }));


// export const PhieuThanhToan = pgTable("PhieuThanhToan", {
//   maPhieuThanhToan: serial("maPhieuThanhToan").primaryKey(),
//   maNhanVien: integer("maNhanVien").notNull().references(() => NhanVien.maNhanVien),
//   ngayThanhToan: timestamp("ngayThanhToan").notNull(),
//   tongTien: integer("tongTien").notNull(),
// });

// export const chiTietPhieuThanhToan = pgTable("chiTietPhieuThanhToan", {
//   maPhieuThanhToan: integer("maPhieuThanhToan").notNull().references(() => PhieuThanhToan.maPhieuThanhToan),
//   maKhachHang: integer("maKhachHang").notNull().references(() => KhachHang.maKhachHang),
//   maPhong: integer("maPhong").notNull().references(() => Phong.maPhong),
//   maKhuyenMai: integer("maKhuyenMai").references(() => KhuyenMai.maKhuyenMai),
//   maNhanVien: integer("maNhanVien").notNull().references(() => NhanVien.maNhanVien),
//   ngayDen: date("ngayDen").notNull(),
//   ngayDi: date("ngayDi").notNull(),
//   gioDen: timestamp("gioDen").notNull(),
//   gioTra: timestamp("gioTra").notNull(),
//   soLuongPhong: integer("soLuongPhong").notNull(),
// }, (table) => ({
//   unique_phieu_phong: uniqueIndex("unique_phieu_phong").on(table.maPhieuThanhToan, table.maPhong),
// }));

// export const DichVu = pgTable("DichVu", {
//   maDichVu: serial("maDichVu").primaryKey(),
//   tenDichVu: varchar("tenDichVu", { length: 255 }).notNull(),
//   donVi: text("donVi").notNull(),
//   gia: integer("gia").notNull(),
// });

// export const SuDungDichVu = pgTable("SuDungDichVu", {
//   maPhieuThanhToan: integer("maPhieuThanhToan").notNull().references(() => PhieuThanhToan.maPhieuThanhToan),
//   maDichVu: integer("maDichVu").notNull().references(() => DichVu.maDichVu),
//   soLuong: integer("soLuong").notNull(),
//   ngaySuDung: timestamp("ngaySuDung").notNull(),
// }, (table) => ({
//   unique_phieu_dichvu: uniqueIndex("unique_phieu_dichvu").on(table.maPhieuThanhToan, table.maDichVu),
// }));

// export const PhieuNhapKho = pgTable("PhieuNhapKho", {
//   maPhieuNhapKho: serial("maPhieuNhapKho").primaryKey(),
//   maNhanVien: integer("maNhanVien").notNull().references(() => NhanVien.maNhanVien),
//   ngayNhap: timestamp("ngayNhap").notNull(),
//   tongTien: integer("tongTien").notNull(),
// });

// export const ChiTietPhieuNhapKho = pgTable("ChiTietPhieuNhapKho", {
//   maPhieuNhapKho: integer("maPhieuNhapKho").notNull().references(() => PhieuNhapKho.maPhieuNhapKho),
//   maDichVu: integer("maDichVu").notNull().references(() => DichVu.maDichVu),
//   soLuong: integer("soLuong").notNull(),
//   gia: integer("gia").notNull(),
// }, table => ({
//   unique_phieu_dichvu: uniqueIndex("unique_phieu_dichvu").on(table.maPhieuNhapKho, table.maDichVu),
// }));

// export const PhieuXuatKho = pgTable("PhieuXuatKho", {
//   maPhieuXuatKho: serial("maPhieuXuatKho").primaryKey(),
//   maNhanVien: integer("maNhanVien").notNull().references(() => NhanVien.maNhanVien),
//   ngayXuat: timestamp("ngayXuat").notNull(),
//   tongTien: integer("tongTien").notNull(),
// });

// export const ChiTietPhieuXuatKho = pgTable("ChiTietPhieuXuatKho", {
//   maPhieuXuatKho: integer("maPhieuXuatKho").notNull().references(() => PhieuXuatKho.maPhieuXuatKho),
//   maDichVu: integer("maDichVu").notNull().references(() => DichVu.maDichVu),
//   soLuong: integer("soLuong").notNull(),
//   gia: integer("gia").notNull(),
//   lyDo: text("lyDo").notNull(),
// }, table => ({
//   unique_phieu_dichvu: uniqueIndex("unique_phieu_dichvu").on(table.maPhieuXuatKho, table.maDichVu),
// }));
