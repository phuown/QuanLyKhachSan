"use client";

import { useState, useTransition, ChangeEvent } from "react";
import { addRoomTypeAction } from "./actions";

export default function AddRoomModal({ onClose }: { onClose: () => void }) {
    const [isPending, startTransition] = useTransition();

    const [tenLoaiPhong, setTenLoaiPhong] = useState("");
    const [moTa, setMoTa] = useState("");
    const [gia, setGia] = useState("");
    const [dienTich, setDienTich] = useState("");
    const [soNguoi, setSoNguoi] = useState("");

    const [anhChinh, setAnhChinh] = useState<File | null>(null);
    const [anhPhu, setAnhPhu] = useState<(File | null)[]>([null]);

    const [anhChinhPreview, setAnhChinhPreview] = useState("");
    const [anhPhuPreviews, setAnhPhuPreviews] = useState<string[]>([""]);

    const handleAnhChinhChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAnhChinh(file);
            setAnhChinhPreview(URL.createObjectURL(file));
        }
    };

    const handleAnhPhuChange = (idx: number, e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const updatedFiles = [...anhPhu];
            updatedFiles[idx] = file;
            setAnhPhu(updatedFiles);

            const updatedPreviews = [...anhPhuPreviews];
            updatedPreviews[idx] = URL.createObjectURL(file);
            setAnhPhuPreviews(updatedPreviews);
        }
    };

    const addImageField = () => {
        setAnhPhu([...anhPhu, null]);
        setAnhPhuPreviews([...anhPhuPreviews, ""]);
    };

    const removeImageField = (idx: number) => {
        setAnhPhu(anhPhu.filter((_, i) => i !== idx));
        setAnhPhuPreviews(anhPhuPreviews.filter((_, i) => i !== idx));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!tenLoaiPhong || !gia) {
            alert("Vui lòng điền đầy đủ các trường bắt buộc.");
            return;
        }

        const formData = new FormData();
        formData.append("tenLoaiPhong", tenLoaiPhong);
        formData.append("moTa", moTa);
        formData.append("gia", gia);
        if (dienTich) formData.append("dienTich", dienTich);
        if (soNguoi) formData.append("soNguoi", soNguoi);
        if (anhChinh) formData.append("anhChinh", anhChinh);

        anhPhu.forEach((file) => {
            if (file) formData.append("anhPhu", file);
        });

        startTransition(async () => {
            const result = await addRoomTypeAction(formData);
            if (result.success) {
                onClose();
            } else {
                alert("Lỗi: " + result.message);
            }
        });
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
                        <label className="text-sm font-semibold text-gray-700">Mô tả</label>
                        <textarea
                            rows={3}
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
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Ảnh chính (Từ máy tính)</label>
                        <div className="flex items-center gap-4">
                            <label className="cursor-pointer flex-1">
                                <div className="flex items-center justify-center gap-2 p-3 border-2 border-dashed border-slate-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition">
                                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                                    <span className="text-sm font-medium text-slate-600">{anhChinh ? anhChinh.name : "Chọn ảnh từ PC"}</span>
                                </div>
                                <input type="file" accept="image/*" className="hidden" onChange={handleAnhChinhChange} />
                            </label>
                        </div>
                        {anhChinhPreview && (
                            <div className="relative mt-2 rounded-xl overflow-hidden border-2 border-blue-100 h-48 w-full">
                                <img src={anhChinhPreview} alt="Preview chính" className="w-full h-full object-cover" />
                                <button type="button" onClick={() => { setAnhChinh(null); setAnhChinhPreview(""); }} className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full shadow-lg hover:bg-red-600 transition">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Ảnh phụ */}
                    <div className="space-y-3">
                        <label className="text-sm font-semibold text-gray-700">Ảnh phụ (Từ máy tính)</label>
                        <div className="grid grid-cols-1 gap-3">
                            {anhPhu.map((_, idx) => (
                                <div key={idx} className="space-y-2">
                                    <div className="flex gap-2 items-center">
                                        <label className="cursor-pointer flex-1">
                                            <div className="flex items-center justify-center gap-2 p-2.5 border-2 border-dashed border-slate-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition">
                                                <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                                                <span className="text-xs font-medium text-slate-600 truncate max-w-[200px]">{anhPhu[idx] ? anhPhu[idx]?.name : `Chọn ảnh phụ ${idx + 1}`}</span>
                                            </div>
                                            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleAnhPhuChange(idx, e)} />
                                        </label>
                                        {anhPhu.length > 1 && (
                                            <button type="button" onClick={() => removeImageField(idx)} className="text-red-400 hover:text-red-600 transition p-2 bg-red-50 rounded-lg">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                            </button>
                                        )}
                                    </div>
                                    {anhPhuPreviews[idx] && (
                                        <div className="relative rounded-lg overflow-hidden border border-slate-100 h-24 w-40 group">
                                            <img src={anhPhuPreviews[idx]} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                                                <button type="button" onClick={() => {
                                                    const upF = [...anhPhu]; upF[idx] = null; setAnhPhu(upF);
                                                    const upP = [...anhPhuPreviews]; upP[idx] = ""; setAnhPhuPreviews(upP);
                                                }} className="bg-red-500 text-white p-1 rounded-full">
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        <button type="button" onClick={addImageField} className="text-sm text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1.5 transition bg-blue-50 px-4 py-2 rounded-xl">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                            Thêm ảnh phụ mới
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
