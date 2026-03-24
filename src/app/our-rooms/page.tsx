import { db } from "@/db";
import { LoaiPhong, AnhLoaiPhong } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";

export const dynamic = "force-dynamic";

export default async function OurRoomsPage() {
    const allRoomsWithImages = await db.select({
        maLoaiPhong: LoaiPhong.maLoaiPhong,
        tenLoaiPhong: LoaiPhong.tenLoaiPhong,
        moTa: LoaiPhong.moTa,
        gia: LoaiPhong.gia,
        dienTich: LoaiPhong.dienTich,
        soNguoi: LoaiPhong.soNguoi,
        anhChinh: LoaiPhong.anhChinh,
    })
        .from(LoaiPhong)
        .leftJoin(AnhLoaiPhong, eq(LoaiPhong.maLoaiPhong, AnhLoaiPhong.maLoaiPhong))
        .orderBy(asc(LoaiPhong.maLoaiPhong));

    const uniqueRoomsMap = new Map();
    allRoomsWithImages.forEach((item) => {
        if (!uniqueRoomsMap.has(item.maLoaiPhong)) {
            uniqueRoomsMap.set(item.maLoaiPhong, item);
        }
    });

    const rooms = Array.from(uniqueRoomsMap.values());

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            {/* Hero Banner for Our Rooms */}
            <div className="relative h-[250px] w-full">
                <Image
                    src="/uploads/anh_ks_ben_ngoai/Anh-mat-chinh-ks.jpg"
                    alt="Our Rooms Banner"
                    fill
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <h1 className="text-3xl md:text-4xl font-bold text-white tracking-wide">
                        Our Rooms
                    </h1>
                </div>
            </div>

            {/* Rooms List Section */}
            <section className="py-10 px-6 max-w-5xl mx-auto">
                <div className="text-center mb-10 space-y-3">
                    <h2 className="text-2xl font-bold text-gray-800">Không Gian Nghỉ Dưỡng Hoàn Hảo</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto text-base">
                        Khám phá sự kết hợp hoàn hảo giữa thiết kế hiện đại và sự tiện nghi tối đa trong hệ thống phòng nghỉ của chúng tôi.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {rooms.length > 0 ? (
                        rooms.map((room) => (
                            <div key={room.maLoaiPhong} className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300 group">
                                {/* Room Image */}
                                <div className="relative h-48 overflow-hidden">
                                    <Image
                                        src={room.anhChinh}
                                        alt={room.tenLoaiPhong}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm text-sm">
                                        <span className="text-blue-600 font-bold">
                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(room.gia)}
                                        </span>
                                        <span className="text-gray-500 text-sm">/đêm</span>
                                    </div>
                                </div>

                                {/* Room Info */}
                                <div className="p-5 space-y-3">
                                    <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-500 transition-colors">
                                        {room.tenLoaiPhong}
                                    </h3>
                                    <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
                                        {room.moTa}
                                    </p>

                                    <div className="pt-4 flex items-center justify-between">
                                        <div className="flex gap-4 text-gray-400 text-sm">
                                            <span className="flex items-center gap-1">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-10V4m0 10V4m-4 11h.01" /></svg>
                                                {room.dienTich}m²
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                                                {room.soNguoi} Người
                                            </span>
                                        </div>
                                        <Link href={`/our-rooms/${room.maLoaiPhong}`} className="text-blue-500 font-semibold hover:underline flex items-center gap-1">
                                            Chi tiết
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-20 bg-white rounded-xl shadow-inner border-2 border-dashed border-gray-200">
                            <p className="text-gray-400 text-xl font-medium">Hiện tại chưa có loại phòng nào được đăng ký.</p>
                            <p className="text-gray-400">Vui lòng quay lại sau.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Bottom CTA */}
            <section className="bg-gray-800 py-6 text-white text-center">
                <div className="max-w-4xl mx-auto px-6 space-y-3">
                    <h2 className="text-lg font-bold">Bạn đã sẵn sàng cho kỳ nghỉ trong mơ?</h2>
                    <p className="text-gray-400 text-sm">Liên hệ với chúng tôi ngay hôm nay để nhận được ưu đãi tốt nhất cho kỳ nghỉ của bạn.</p>
                    <Link href="/contact" className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold px-7 py-2.5 rounded-full transition duration-300 transform hover:-translate-y-1 text-sm">
                        Đặt Phòng Ngay
                    </Link>
                </div>
            </section>
        </div>
    );
}
