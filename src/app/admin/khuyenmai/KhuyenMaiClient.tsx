"use client";

import { useState } from "react";
import AddKhuyenMai from "./AddKhuyenMai";
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
                        <h1 className="text-3xl font-bold text-gray-800">Quản lý Khuyến Mãi</h1>
                        <p className="text-gray-500 mt-1">Các chương trình ưu đãi đang và sắp diễn ra</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="bg-white px-4 py-2 rounded-lg shadow-sm font-semibold text-blue-600 border border-blue-100">
                            Tổng chương trình: {promotions.length}
                        </div>
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-sm font-semibold hover:bg-blue-700 transition flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                            </svg>
                            Thêm chương trình
                        </button>
                    </div>
                </header>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider border-b">
                                    <th className="px-6 py-4 font-semibold">Tên chương trình</th>
                                    <th className="px-6 py-4 font-semibold text-center">Thời gian</th>
                                    <th className="px-6 py-4 font-semibold">Nội dung</th>
                                    <th className="px-6 py-4 font-semibold text-center">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {promotions.map((p) => (
                                    <tr key={p.maKhuyenMai} className="hover:bg-blue-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-gray-800 text-lg">{p.tenKhuyenMai}</p>
                                            <div className="flex gap-2 items-center">
                                                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-bold rounded uppercase tracking-wider">{p.maCode}</span>
                                                <span className="text-xs font-mono text-gray-400">ID: #{p.maKhuyenMai}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex flex-col items-center">
                                                <div className="flex items-center gap-2 text-sm">
                                                    <span className="text-gray-400">Bắt đầu:</span>
                                                    <span className="font-medium text-gray-700">{formatDate(p.ngayBatDau)}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm mt-1">
                                                    <span className="text-gray-400">Kết thúc:</span>
                                                    <span className="font-medium text-gray-700">{formatDate(p.ngayKetThuc)}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 max-w-md">
                                            <p className="text-gray-600 line-clamp-2">{p.noiDung}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-center items-center">
                                                <button
                                                    onClick={() => handleDelete(p.maKhuyenMai)}
                                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
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
                                        <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                            Chưa có chương trình khuyến mãi nào.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            {isAddModalOpen && <AddKhuyenMai onClose={() => setIsAddModalOpen(false)} />}
        </>
    );
}
