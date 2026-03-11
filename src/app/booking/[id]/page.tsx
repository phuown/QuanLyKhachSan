import Header from "@/components/Header";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { LoaiPhong } from "@/db/schema";
import { eq } from "drizzle-orm";
import BookingForm from "@/components/BookingForm";

export default async function BookingPage({ params }: { params: Promise<{ id: string }> }) {
    const { userId } = await auth();
    const { id } = await params;

    if (!userId) {
        redirect("/sign-in");
    }

    const maLoaiPhong = parseInt(id);
    const room = await db.select().from(LoaiPhong).where(eq(LoaiPhong.maLoaiPhong, maLoaiPhong)).limit(1);

    if (!room[0]) {
        redirect("/our-rooms");
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="max-w-4xl mx-auto py-12 px-6">
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                    <div className="bg-blue-600 p-8 text-white">
                        <h1 className="text-3xl font-bold">Hoàn tất đặt phòng</h1>
                        <p className="opacity-90 mt-2">Phòng: {room[0].tenLoaiPhong}</p>
                    </div>

                    <div className="p-8">
                        <BookingForm roomPrice={room[0].gia} maLoaiPhong={room[0].maLoaiPhong} />
                    </div>
                </div>
            </main>
        </div>
    );
}
