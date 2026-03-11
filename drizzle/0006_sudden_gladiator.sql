CREATE TABLE "DanhGia" (
	"maDanhGia" serial PRIMARY KEY NOT NULL,
	"tenKhachHang" varchar(255) NOT NULL,
	"email" varchar(255),
	"noiDung" text NOT NULL,
	"soSao" integer DEFAULT 5 NOT NULL,
	"ngayDanhGia" timestamp DEFAULT now() NOT NULL,
	"maKhachHang" integer NOT NULL
);
--> statement-breakpoint
--ALTER TABLE "PhieuDatPhong" ADD COLUMN "ngayHuy" timestamp;--> statement-breakpoint
ALTER TABLE "DanhGia" ADD CONSTRAINT "DanhGia_maKhachHang_KhachHang_maKhachHang_fk" FOREIGN KEY ("maKhachHang") REFERENCES "public"."KhachHang"("maKhachHang") ON DELETE no action ON UPDATE no action;