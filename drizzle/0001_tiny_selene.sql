CREATE TABLE "AnhLoaiPhong" (
	"maAnh" serial PRIMARY KEY NOT NULL,
	"maLoaiPhong" integer NOT NULL,
	"image_url" varchar(255) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "AnhLoaiPhong" ADD CONSTRAINT "AnhLoaiPhong_maLoaiPhong_LoaiPhong_maLoaiPhong_fk" FOREIGN KEY ("maLoaiPhong") REFERENCES "public"."LoaiPhong"("maLoaiPhong") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "LoaiPhong" DROP COLUMN "image_url";