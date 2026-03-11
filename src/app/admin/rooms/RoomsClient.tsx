"use client";

import { useState, useTransition } from "react";
import { deleteRoomTypeAction } from "./actions";
import AddRoomModal from "./AddLoaiPhong";
import PhongDetailModal from "./PhongDetail";
import Image from "next/image";

interface Room {
    maLoaiPhong: number;
    tenLoaiPhong: string;
    moTa: string;
    gia: number;
    dienTich: number | null;
    soNguoi: number | null;
    anhChinh: string;
}

interface RoomImage {
    maLoaiPhong: number;
    imageUrl: string;
}

export default function RoomsClient({ rooms, images }: { rooms: Room[], images: RoomImage[] }) {
    const [showModal, setShowModal] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [selectedRoom, setSelectedRoom] = useState<{ maLoaiPhong: number; tenLoaiPhong: string } | null>(null);

    const imagesByRoom = images.reduce<Record<number, string[]>>((acc, img) => {
        if (!acc[img.maLoaiPhong]) acc[img.maLoaiPhong] = [];
        acc[img.maLoaiPhong].push(img.imageUrl);
        return acc;
    }, {});

    const handleDelete = (maLoaiPhong: number, tenLoaiPhong: string) => {
        if (!confirm(`Bạn có chắc muốn xóa loại phòng "${tenLoaiPhong}" không? Toàn bộ ảnh kèm theo cũng sẽ bị xóa.`)) return;
        setDeletingId(maLoaiPhong);
        startTransition(async () => {
            const result = await deleteRoomTypeAction(maLoaiPhong);
            if (!result.success) alert("Lỗi: " + result.message);
            setDeletingId(null);
        });
    };

    return (
        <>
            {/* Header section with Title, Total count and Add button */}
            <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Quản lý Loại Phòng</h1>
                    <p className="text-gray-500 mt-1">Danh sách và hình ảnh các loại phòng trong khách sạn</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="bg-white px-4 py-2.5 rounded-xl shadow-sm font-semibold text-blue-600 border border-blue-100 flex items-center gap-2">
                        <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 012-2H5a2 2 0 012 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        Tổng: <span className="text-blue-700">{rooms.length}</span> loại phòng
                    </div>

                    <button
                        onClick={() => setShowModal(true)}
                        className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-sm transition flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        Thêm mới
                    </button>
                </div>
            </header>

            {/* Room list */}
            <div className="grid grid-cols-1 gap-8">
                {rooms.map((room) => {
                    const roomImages = imagesByRoom[room.maLoaiPhong] || [];
                    const allImages = [
                        ...(room.anhChinh ? [{ url: room.anhChinh, isMain: true }] : []),
                        ...roomImages.map(u => ({ url: u, isMain: false })),
                    ];

                    return (
                        <div
                            key={room.maLoaiPhong}
                            className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
                        >
                            {/* Hiển thị danh sách phòng */}
                            <div
                                className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 cursor-pointer hover:bg-blue-50 transition-colors group"
                                onClick={() => setSelectedRoom({ maLoaiPhong: room.maLoaiPhong, tenLoaiPhong: room.tenLoaiPhong })}
                                title="Nhấn để xem danh sách phòng"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="font-mono text-sm text-blue-500 bg-blue-50 px-2 py-1 rounded-md">#{room.maLoaiPhong}</span>
                                    <h2 className="text-xl font-bold text-gray-800 group-hover:text-blue-700 transition-colors">{room.tenLoaiPhong}</h2>
                                    <button
                                        onClick={() => setSelectedRoom({ maLoaiPhong: room.maLoaiPhong, tenLoaiPhong: room.tenLoaiPhong })}
                                    > </button>
                                </div>
                                <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                                    <span className="text-blue-700 font-bold text-lg">
                                        {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(room.gia)}
                                        <span className="text-sm font-normal text-gray-400"> / đêm</span>
                                    </span>
                                    <button
                                        onClick={() => handleDelete(room.maLoaiPhong, room.tenLoaiPhong)}
                                        disabled={isPending && deletingId === room.maLoaiPhong}
                                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                        title="Xóa loại phòng này"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Info */}
                                <div className="space-y-3">
                                    <h3 className="font-semibold text-gray-500 text-xs uppercase tracking-wider">Thông tin chi tiết</h3>
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center py-1.5 border-b border-gray-100">
                                            <span className="text-gray-500 text-sm">Diện tích:</span>
                                            <span className="font-bold text-gray-500 text-base">{room.dienTich ? `${room.dienTich} m²` : "—"}</span>
                                        </div>
                                        <div className="flex justify-between items-center py-1.5 border-b border-gray-100">
                                            <span className="text-gray-500 text-sm">Sức chứa:</span>
                                            <span className="font-bold text-gray-500 text-base">{room.soNguoi ? `${room.soNguoi} người` : "—"}</span>
                                        </div>
                                    </div>
                                    {room.moTa && (
                                        <div className="pt-2">
                                            <h3 className="font-semibold text-gray-500 text-xs uppercase tracking-wider mb-1">Mô tả</h3>
                                            <p className="text-sm text-gray-600 leading-relaxed line-clamp-5">{room.moTa}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Images */}
                                <div className="md:col-span-2">
                                    <h3 className="font-semibold text-gray-500 text-xs uppercase tracking-wider mb-3">
                                        Hình ảnh ({allImages.length} ảnh)
                                    </h3>
                                    {allImages.length === 0 ? (
                                        <div className="flex items-center justify-center h-36 bg-gray-50 rounded-xl text-gray-400 text-sm border-2 border-dashed border-gray-200">
                                            Chưa có hình ảnh nào
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                            {allImages.map((img, idx) => (
                                                <div key={idx} className={`relative aspect-video rounded-xl overflow-hidden ${img.isMain ? "border-2 border-blue-300" : "border border-gray-200"}`}>
                                                    <Image
                                                        src={img.url}
                                                        alt={`Ảnh ${idx + 1} - ${room.tenLoaiPhong}`}
                                                        fill
                                                        className="object-cover"
                                                        sizes="(max-width: 768px) 50vw, 25vw"
                                                    />
                                                    {img.isMain && (
                                                        <div className="absolute bottom-1 left-1 bg-blue-600 text-white text-xs px-2 py-0.5 rounded-md font-medium">
                                                            Ảnh chính
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}

                {rooms.length === 0 && (
                    <div className="bg-white rounded-2xl p-16 text-center text-gray-400 border-2 border-dashed border-gray-200">
                        <p className="text-lg font-medium">Chưa có loại phòng nào</p>
                        <p className="text-sm mt-1">Bấm &ldquo;Thêm loại phòng mới&rdquo; để bắt đầu.</p>
                    </div>
                )}
            </div>

            {showModal && <AddRoomModal onClose={() => setShowModal(false)} />}
            {selectedRoom && (
                <PhongDetailModal
                    maLoaiPhong={selectedRoom.maLoaiPhong}
                    tenLoaiPhong={selectedRoom.tenLoaiPhong}
                    onClose={() => setSelectedRoom(null)}
                />
            )}
        </>
    );
}
