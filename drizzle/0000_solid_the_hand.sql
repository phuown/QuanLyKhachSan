CREATE TABLE "LoaiPhong" (
	"maLoaiPhong" serial PRIMARY KEY NOT NULL,
	"tenLoaiPhong" varchar(255) NOT NULL,
	"moTa" text NOT NULL,
	"gia" integer NOT NULL,
	"image_url" varchar(255)
);
