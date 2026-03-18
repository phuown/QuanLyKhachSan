CREATE TABLE "ChiTietKhuyenMai" (
	"maKhuyenMai" integer NOT NULL,
	"maLoaiPhong" integer NOT NULL,
	"giamGia" integer NOT NULL,
	"trangThai" boolean NOT NULL
);
--> statement-breakpoint
CREATE TABLE "KhuyenMai" (
	"maKhuyenMai" serial PRIMARY KEY NOT NULL,
	"tenKhuyenMai" varchar(255) NOT NULL,
	"noiDung" text NOT NULL,
	"ngayBatDau" date NOT NULL,
	"ngayKetThuc" date NOT NULL
);
--> statement-breakpoint
ALTER TABLE "ChiTietKhuyenMai" ADD CONSTRAINT "ChiTietKhuyenMai_maKhuyenMai_KhuyenMai_maKhuyenMai_fk" FOREIGN KEY ("maKhuyenMai") REFERENCES "public"."KhuyenMai"("maKhuyenMai") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ChiTietKhuyenMai" ADD CONSTRAINT "ChiTietKhuyenMai_maLoaiPhong_LoaiPhong_maLoaiPhong_fk" FOREIGN KEY ("maLoaiPhong") REFERENCES "public"."LoaiPhong"("maLoaiPhong") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "unique_khuyenmai_loaiphong" ON "ChiTietKhuyenMai" USING btree ("maKhuyenMai","maLoaiPhong");