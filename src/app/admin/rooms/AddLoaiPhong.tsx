"use client";

import { useState, useTransition } from "react";
import { addRoomTypeAction } from "./actions";

export default function AddRoomModal({ onClose }: { onClose: () => void }) {
    const [isPending, startTransition] = useTransition();

    const [tenLoaiPhong, setTenLoaiPhong] = useState("");
    const [moTa, setMoTa] = useState("");
    const [gia, setGia] = useState("");
    const [dienTich, setDienTich] = useState("");
    const [soNguoi, setSoNguoi] = useState("");
    const [anhChinh, setAnhChinh] = useState("");
    const [anhPhu, setAnhPhu] = useState<string[]>([""]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!tenLoaiPhong || !moTa || !gia) {
            alert("Vui lòng điền đầy đủ các trường bắt buộc.");
            return;
        }
        startTransition(async () => {
            const result = await addRoomTypeAction({
                tenLoaiPhong,
                moTa,
                gia: parseInt(gia),
                dienTich: dienTich ? parseInt(dienTich) : null,
                soNguoi: soNguoi ? parseInt(soNguoi) : null,
                anhChinh,
                anhPhu,
            });
            if (result.success) {
                onClose();
            } else {
                alert("Lỗi: " + result.message);
            }
        });
    };

    const addImageField = () => setAnhPhu([...anhPhu, ""]);
    const removeImageField = (idx: number) => setAnhPhu(anhPhu.filter((_, i) => i !== idx));
    const updateImageField = (idx: number, val: string) => {
        const updated = [...anhPhu];
        updated[idx] = val;
        setAnhPhu(updated);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-[9999]">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 mx-4">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Thêm loại phòng mới</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Tên loại phòng */}
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-700">Tên loại phòng <span className="text-red-500">*</span></label>
                        <input
                            type="text" required
                            placeholder="Vd: Phòng Deluxe, Suite..."
                            value={tenLoaiPhong}
                            onChange={(e) => setTenLoaiPhong(e.target.value)}
                            className="w-full p-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 outline-none text-slate-800"
                        />
                    </div>

                    {/* Mô tả */}
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-700">Mô tả <span className="text-red-500">*</span></label>
                        <textarea
                            required rows={3}
                            placeholder="Mô tả chi tiết về loại phòng..."
                            value={moTa}
                            onChange={(e) => setMoTa(e.target.value)}
                            className="w-full p-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 outline-none text-slate-800 resize-none"
                        />
                    </div>

                    {/* Giá - Diện tích - Số người */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-gray-700">Giá/đêm (VND) <span className="text-red-500">*</span></label>
                            <input
                                type="number" required min="0"
                                placeholder="Vd: 500000"
                                value={gia}
                                onChange={(e) => setGia(e.target.value)}
                                className="w-full p-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 outline-none text-slate-800"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-gray-700">Diện tích (m²)</label>
                            <input
                                type="number" min="0"
                                placeholder="Vd: 35"
                                value={dienTich}
                                onChange={(e) => setDienTich(e.target.value)}
                                className="w-full p-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 outline-none text-slate-800"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-gray-700">Số người tối đa</label>
                            <input
                                type="number" min="1"
                                placeholder="Vd: 2"
                                value={soNguoi}
                                onChange={(e) => setSoNguoi(e.target.value)}
                                className="w-full p-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 outline-none text-slate-800"
                            />
                        </div>
                    </div>

                    {/* Ảnh chính */}
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-700">Ảnh chính</label>
                        <input
                            type="text"
                            placeholder="/uploads/..."
                            value={anhChinh}
                            onChange={(e) => setAnhChinh(e.target.value)}
                            className="w-full p-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 outline-none text-slate-800"
                        />
                        {anhChinh && (
                            <img src={anhChinh} alt="Preview ảnh chính" className="mt-2 rounded-xl w-full h-40 object-cover border" onError={(e) => (e.currentTarget.style.display = "none")} />
                        )}
                    </div>

                    {/* Ảnh phụ */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Ảnh phụ (từ bảng AnhLoaiPhong)</label>
                        {anhPhu.map((url, idx) => (
                            <div key={idx} className="flex gap-2 items-center">
                                <input
                                    type="text"
                                    placeholder={`Ảnh phụ ${idx + 1}`}
                                    value={url}
                                    onChange={(e) => updateImageField(idx, e.target.value)}
                                    className="flex-1 p-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 outline-none text-slate-800"
                                />
                                {anhPhu.length > 1 && (
                                    <button type="button" onClick={() => removeImageField(idx)} className="text-red-400 hover:text-red-600 transition p-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                    </button>
                                )}
                            </div>
                        ))}
                        <button type="button" onClick={addImageField} className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 transition">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                            Thêm ảnh phụ
                        </button>
                    </div>

                    {/* Action buttons */}
                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition">
                            Hủy bỏ
                        </button>
                        <button
                            type="submit"
                            disabled={isPending}
                            className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl font-bold shadow-sm transition"
                        >
                            {isPending ? "Đang lưu..." : "Thêm loại phòng"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
