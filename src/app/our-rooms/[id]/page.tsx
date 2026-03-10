import { db } from "@/db";
import { LoaiPhong, AnhLoaiPhong } from "@/db/schema";
import { eq } from "drizzle-orm";
import Image from "next/image";
import Header from "@/components/Header";
import { notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { SignInButton } from "@clerk/nextjs";

export const dynamic = "force-dynamic";

interface RoomDetailPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function RoomDetailPage({ params }: RoomDetailPageProps) {
    const { id } = await params;
    const maLoaiPhong = parseInt(id);

    if (isNaN(maLoaiPhong)) {
        notFound();
    }

    // Fetch room details
    const roomResults = await db.select()
        .from(LoaiPhong)
        .where(eq(LoaiPhong.maLoaiPhong, maLoaiPhong))
        .limit(1);

    const roomDetails = roomResults[0];

    if (!roomDetails) {
        notFound();
    }

    // Fetch all related images
    const roomImages = await db.select()
        .from(AnhLoaiPhong)
        .where(eq(AnhLoaiPhong.maLoaiPhong, maLoaiPhong));

    // Consolidate images (anhChinh + other images)
    const allImages = [
        { imageUrl: roomDetails.anhChinh },
        ...roomImages
    ].filter(img => img.imageUrl);

    const { userId } = await auth();

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="max-w-7xl mx-auto py-12 px-6">
                <div className="mb-8">
                    <Link href="/our-rooms" className="text-blue-600 hover:text-blue-800 flex items-center gap-2 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Quay lại danh sách phòng
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Left Side: Description & Info */}
                    <div className="space-y-8 animate-in fade-in slide-in-from-left duration-700">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                                {roomDetails.tenLoaiPhong}
                            </h1>
                            <div className="flex items-center gap-6 text-gray-500">
                                <div className="flex items-center gap-2">
                                    <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-semibold">
                                        {roomDetails.dienTich} m²
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-semibold">
                                        Tối đa {roomDetails.soNguoi} người
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="prose prose-lg text-gray-600 max-w-none">
                            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Mô tả chi tiết</h3>
                            <p className="leading-relaxed whitespace-pre-line">
                                {roomDetails.moTa}
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <p className="text-gray-500 text-sm uppercase tracking-wider">Giá mỗi đêm</p>
                                    <p className="text-3xl font-bold text-blue-600">
                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(roomDetails.gia)}
                                    </p>
                                </div>
                                {userId ? (
                                    <Link
                                        href={`/booking/${roomDetails.maLoaiPhong}`}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg inline-block"
                                    >
                                        Đặt phòng ngay
                                    </Link>
                                ) : (
                                    <SignInButton mode="modal">
                                        <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg">
                                            Đăng nhập để đặt phòng
                                        </button>
                                    </SignInButton>
                                )}
                            </div>
                            <div className="border-t pt-6 grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-3 text-gray-600">
                                    <span className="text-xl">🛡️</span>
                                    <span className="text-sm">Đảm bảo giá tốt nhất</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-600">
                                    <span className="text-xl">✨</span>
                                    <span className="text-sm">Dịch vụ cao cấp</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Images Gallery */}
                    <div className="space-y-4 animate-in fade-in slide-in-from-right duration-700">
                        <div className="grid grid-cols-1 gap-4">
                            {allImages.length > 0 ? (
                                <>
                                    {/* Main Large Image */}
                                    <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                                        <Image
                                            src={allImages[0].imageUrl}
                                            alt={roomDetails.tenLoaiPhong}
                                            fill
                                            className="object-cover hover:scale-105 transition-transform duration-700"
                                            priority
                                        />
                                    </div>

                                    {/* Thumbnail Grid */}
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {allImages.slice(1).map((img, index) => (
                                            <div key={index} className="relative h-32 md:h-40 rounded-xl overflow-hidden shadow-md group cursor-pointer">
                                                <Image
                                                    src={img.imageUrl}
                                                    alt={`${roomDetails.tenLoaiPhong} ${index + 2}`}
                                                    fill
                                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                                            </div>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <div className="h-[500px] bg-gray-200 rounded-2xl flex items-center justify-center text-gray-400">
                                    Không có ảnh hiển thị
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
