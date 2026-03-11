CREATE TABLE "KhachHang" (
	"maKhachHang" serial PRIMARY KEY NOT NULL,
	"hoten" varchar(255) NOT NULL,
	"sdt" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"diaChi" varchar(255) NOT NULL,
	"ngaySinh" date NOT NULL,
	"gioiTinh" boolean NOT NULL
);
--> statement-breakpoint
CREATE TABLE "PhieuDatPhong" (
	"maPhieuDatPhong" serial PRIMARY KEY NOT NULL,
	"maKhachHang" integer NOT NULL,
	"ngayDat" timestamp NOT NULL,
	"ngayNhanPhong" date NOT NULL,
	"ngayTraPhong" date NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Phong" (
	"maPhong" serial PRIMARY KEY NOT NULL,
	"maLoaiPhong" integer NOT NULL,
	"soPhong" varchar(255) NOT NULL,
	"maTinhTrang" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "TinhTrang" (
	"maTinhTrang" serial PRIMARY KEY NOT NULL,
	"tenTinhTrang" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chiTietPhieuDatPhong" (
	"maPhieuDatPhong" integer NOT NULL,
	"maLoaiPhong" integer NOT NULL,
	"soLuongPhong" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "LoaiPhong" ALTER COLUMN "anhChinh" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "PhieuDatPhong" ADD CONSTRAINT "PhieuDatPhong_maKhachHang_KhachHang_maKhachHang_fk" FOREIGN KEY ("maKhachHang") REFERENCES "public"."KhachHang"("maKhachHang") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Phong" ADD CONSTRAINT "Phong_maLoaiPhong_LoaiPhong_maLoaiPhong_fk" FOREIGN KEY ("maLoaiPhong") REFERENCES "public"."LoaiPhong"("maLoaiPhong") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Phong" ADD CONSTRAINT "Phong_maTinhTrang_TinhTrang_maTinhTrang_fk" FOREIGN KEY ("maTinhTrang") REFERENCES "public"."TinhTrang"("maTinhTrang") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chiTietPhieuDatPhong" ADD CONSTRAINT "chiTietPhieuDatPhong_maPhieuDatPhong_PhieuDatPhong_maPhieuDatPhong_fk" FOREIGN KEY ("maPhieuDatPhong") REFERENCES "public"."PhieuDatPhong"("maPhieuDatPhong") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chiTietPhieuDatPhong" ADD CONSTRAINT "chiTietPhieuDatPhong_maLoaiPhong_LoaiPhong_maLoaiPhong_fk" FOREIGN KEY ("maLoaiPhong") REFERENCES "public"."LoaiPhong"("maLoaiPhong") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "unique_sdt" ON "KhachHang" USING btree ("sdt");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_email" ON "KhachHang" USING btree ("email");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_soPhong" ON "Phong" USING btree ("soPhong");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_phieu_loaiphong" ON "chiTietPhieuDatPhong" USING btree ("maPhieuDatPhong","maLoaiPhong");