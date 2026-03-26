CREATE TABLE "ChiTietPhieuNhapKho" (
	"maPhieuNhapKho" integer NOT NULL,
	"maDichVu" integer NOT NULL,
	"soLuong" integer NOT NULL,
	"gia" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ChiTietPhieuXuatKho" (
	"maPhieuXuatKho" integer NOT NULL,
	"maDichVu" integer NOT NULL,
	"soLuong" integer NOT NULL,
	"gia" integer NOT NULL,
	"lyDo" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "DichVu" (
	"maDichVu" serial PRIMARY KEY NOT NULL,
	"tenDichVu" varchar(255) NOT NULL,
	"donVi" text NOT NULL,
	"gia" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "PhieuNhapKho" (
	"maPhieuNhapKho" serial PRIMARY KEY NOT NULL,
	"ngayNhap" timestamp NOT NULL,
	"tongTien" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "PhieuThanhToan" (
	"maPhieuThanhToan" serial PRIMARY KEY NOT NULL,
	"ngayThanhToan" timestamp NOT NULL,
	"tongTien" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "PhieuXuatKho" (
	"maPhieuXuatKho" serial PRIMARY KEY NOT NULL,
	"ngayXuat" timestamp NOT NULL,
	"tongTien" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "SuDungDichVu" (
	"maPhieuThanhToan" integer NOT NULL,
	"maDichVu" integer NOT NULL,
	"soLuong" integer NOT NULL,
	"ngaySuDung" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chiTietPhieuThanhToan" (
	"maPhieuThanhToan" integer NOT NULL,
	"maKhachHang" integer NOT NULL,
	"maPhong" integer NOT NULL,
	"maKhuyenMai" integer,
	"ngayDen" date NOT NULL,
	"ngayDi" date NOT NULL,
	"gioDen" timestamp NOT NULL,
	"gioTra" timestamp NOT NULL,
	"soLuongPhong" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "LoaiPhong" ALTER COLUMN "moTa" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "ChiTietPhieuNhapKho" ADD CONSTRAINT "ChiTietPhieuNhapKho_maPhieuNhapKho_PhieuNhapKho_maPhieuNhapKho_fk" FOREIGN KEY ("maPhieuNhapKho") REFERENCES "public"."PhieuNhapKho"("maPhieuNhapKho") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ChiTietPhieuNhapKho" ADD CONSTRAINT "ChiTietPhieuNhapKho_maDichVu_DichVu_maDichVu_fk" FOREIGN KEY ("maDichVu") REFERENCES "public"."DichVu"("maDichVu") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ChiTietPhieuXuatKho" ADD CONSTRAINT "ChiTietPhieuXuatKho_maPhieuXuatKho_PhieuXuatKho_maPhieuXuatKho_fk" FOREIGN KEY ("maPhieuXuatKho") REFERENCES "public"."PhieuXuatKho"("maPhieuXuatKho") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ChiTietPhieuXuatKho" ADD CONSTRAINT "ChiTietPhieuXuatKho_maDichVu_DichVu_maDichVu_fk" FOREIGN KEY ("maDichVu") REFERENCES "public"."DichVu"("maDichVu") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "SuDungDichVu" ADD CONSTRAINT "SuDungDichVu_maPhieuThanhToan_PhieuThanhToan_maPhieuThanhToan_fk" FOREIGN KEY ("maPhieuThanhToan") REFERENCES "public"."PhieuThanhToan"("maPhieuThanhToan") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "SuDungDichVu" ADD CONSTRAINT "SuDungDichVu_maDichVu_DichVu_maDichVu_fk" FOREIGN KEY ("maDichVu") REFERENCES "public"."DichVu"("maDichVu") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chiTietPhieuThanhToan" ADD CONSTRAINT "chiTietPhieuThanhToan_maPhieuThanhToan_PhieuThanhToan_maPhieuThanhToan_fk" FOREIGN KEY ("maPhieuThanhToan") REFERENCES "public"."PhieuThanhToan"("maPhieuThanhToan") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chiTietPhieuThanhToan" ADD CONSTRAINT "chiTietPhieuThanhToan_maKhachHang_KhachHang_maKhachHang_fk" FOREIGN KEY ("maKhachHang") REFERENCES "public"."KhachHang"("maKhachHang") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chiTietPhieuThanhToan" ADD CONSTRAINT "chiTietPhieuThanhToan_maPhong_Phong_maPhong_fk" FOREIGN KEY ("maPhong") REFERENCES "public"."Phong"("maPhong") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chiTietPhieuThanhToan" ADD CONSTRAINT "chiTietPhieuThanhToan_maKhuyenMai_KhuyenMai_maKhuyenMai_fk" FOREIGN KEY ("maKhuyenMai") REFERENCES "public"."KhuyenMai"("maKhuyenMai") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "unique_phieu_nhapdichvu" ON "ChiTietPhieuNhapKho" USING btree ("maPhieuNhapKho","maDichVu");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_phieu_xuatdichvu" ON "ChiTietPhieuXuatKho" USING btree ("maPhieuXuatKho","maDichVu");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_phieu_sudungdichvu" ON "SuDungDichVu" USING btree ("maPhieuThanhToan","maDichVu");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_phieu_phong" ON "chiTietPhieuThanhToan" USING btree ("maPhieuThanhToan","maPhong");