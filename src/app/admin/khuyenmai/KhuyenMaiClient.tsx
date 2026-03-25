"use client";

import { useState } from "react";
import AddKhuyenMai from "./AddKhuyenMai";
import EditKhuyenMai from "./EditKhuyenMai";
import { deleteKhuyenMaiAction } from "./actions";

interface KhuyenMai {
    maKhuyenMai: number;
    maCode: string;
    tenKhuyenMai: string;
    noiDung: string;
    ngayBatDau: string;
    ngayKetThuc: string;
}

export default function KhuyenMaiClient({ promotions }: { promotions: KhuyenMai[] }) {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingPromotionId, setEditingPromotionId] = useState<number | null>(null);

    const handleDelete = async (id: number) => {
        if (confirm("Bạn có chắc chắn muốn xóa khuyến mãi này?")) {
            const res = await deleteKhuyenMaiAction(id);
            if (!res.success) {
                alert(res.message);
            }
        }
    };

    const formatDate = (date: string) => {
        if (!date) return "";
        const d = new Date(date);
        return d.toLocaleDateString("vi-VN");
    };

    return (
        <>
            <main className="flex-1 p-8">
                <header className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Quản lý Khuyến Mãi</h1>
                        <p className="text-gray-500 mt-1 italic opacity-75">Các chương trình ưu đãi đang và sắp diễn ra</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="bg-white px-4 py-2 rounded-2xl shadow-sm font-bold text-xs text-blue-600 border border-blue-50 tracking-wide uppercase">
                            Tổng: {promotions.length}
                        </div>
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="px-4 py-2 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl shadow-lg shadow-blue-100 font-bold text-sm hover:from-blue-600 hover:to-blue-700 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                            </svg>
                            Thêm chương trình
                        </button>
                    </div>
                </header>

                <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/80 text-gray-400 text-[11px] font-bold uppercase tracking-[0.15em] border-b border-gray-100">
                                    <th className="px-8 py-6 font-bold">Tên chương trình</th>
                                    <th className="px-6 py-6 font-bold text-center">Thời gian</th>
                                    <th className="px-6 py-6 font-bold">Nội dung</th>
                                    <th className="px-8 py-6 font-bold text-center w-32">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {promotions.map((p) => (
                                    <tr key={p.maKhuyenMai} className="hover:bg-blue-50/20 transition-all border-b border-gray-50/50 last:border-0 group">
                                        <td className="px-8 py-6">
                                            <p className="font-bold text-gray-900 text-lg tracking-tight mb-1">{p.tenKhuyenMai}</p>
                                            <div className="flex gap-2 items-center">
                                                <span className="px-2.5 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-black rounded-full uppercase tracking-widest border border-blue-100/50">{p.maCode}</span>
                                                <span className="text-[10px] font-mono font-bold text-gray-300">#KM{p.maKhuyenMai}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6 whitespace-nowrap">
                                            <div className="flex flex-col items-center gap-1">
                                                <div className="flex items-center gap-2 text-[13px] font-medium text-gray-600">
                                                    <span className="text-[10px] uppercase font-black text-gray-300 w-8">Từ:</span>
                                                    <span className="font-bold">{formatDate(p.ngayBatDau)}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-[13px] font-medium text-gray-600">
                                                    <span className="text-[10px] uppercase font-black text-gray-300 w-8">Đến:</span>
                                                    <span className="font-bold">{formatDate(p.ngayKetThuc)}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6 max-w-md">
                                            <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed italic">{p.noiDung}</p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex justify-center items-center gap-2">
                                                <button
                                                    onClick={() => setEditingPromotionId(p.maKhuyenMai)}
                                                    className="p-2 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition"
                                                    title="Sửa chương trình"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(p.maKhuyenMai)}
                                                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition"
                                                    title="Xóa chương trình"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {promotions.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-8 py-24 text-center">
                                            <div className="flex flex-col items-center justify-center text-gray-300">
                                                <svg className="w-20 h-20 mb-6 opacity-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
                                                </svg>
                                                <p className="text-2xl font-light italic">Chưa có khuyến mãi</p>
                                                <p className="text-sm mt-2 opacity-60">Nhấn &ldquo;Thêm chương trình&rdquo; để bắt đầu.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            {isAddModalOpen && <AddKhuyenMai onClose={() => setIsAddModalOpen(false)} />}
            {editingPromotionId !== null && (
                <EditKhuyenMai 
                    maKhuyenMai={editingPromotionId} 
                    onClose={() => setEditingPromotionId(null)} 
                />
            )}
        </>
    );
}
