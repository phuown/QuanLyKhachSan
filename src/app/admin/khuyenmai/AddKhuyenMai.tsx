"use client";

import { useState, useTransition, useEffect } from "react";
import { addKhuyenMaiAction, getAllLoaiPhongAction } from "./actions";

interface LoaiPhong {
    maLoaiPhong: number;
    tenLoaiPhong: string;
}

export default function AddKhuyenMai({ onClose }: { onClose: () => void }) {
    const [isPending, startTransition] = useTransition();

    const [maCode, setMaCode] = useState("");
    const [tenKhuyenMai, setTenKhuyenMai] = useState("");
    const [noiDung, setNoiDung] = useState("");
    const [ngayBatDau, setNgayBatDau] = useState("");
    const [ngayKetThuc, setNgayKetThuc] = useState("");
    const [loaiPhongs, setLoaiPhongs] = useState<LoaiPhong[]>([]);
    const [selectedDetails, setSelectedDetails] = useState<{ maLoaiPhong: number; giamGia: number; trangThai: boolean }[]>([]);

    useEffect(() => {
        async function fetchLoaiPhong() {
            const res = await getAllLoaiPhongAction();
            if (res.success && res.data) {
                setLoaiPhongs(res.data);
            }
        }
        fetchLoaiPhong();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!ngayBatDau || !ngayKetThuc) {
            alert("Vui lòng điền đầy đủ các trường bắt buộc.");
            return;
        }

        if (selectedDetails.length === 0) {
            alert("Vui lòng chọn ít nhất một loại phòng được áp dụng khuyến mãi.");
            return;
        }

        startTransition(async () => {
            const result = await addKhuyenMaiAction({
                maCode,
                tenKhuyenMai,
                noiDung,
                ngayBatDau,
                ngayKetThuc,
                chiTiet: selectedDetails
            });
            if (result.success) {
                onClose();
            } else {
                alert("Lỗi: " + result.message);
            }
        });
    };

    const handleAddDetail = () => {
        setSelectedDetails([...selectedDetails, { maLoaiPhong: loaiPhongs[0]?.maLoaiPhong || 0, giamGia: 10, trangThai: true }]);
    };

    const handleRemoveDetail = (idx: number) => {
        setSelectedDetails(selectedDetails.filter((_, i) => i !== idx));
    };

    const updateDetail = (idx: number, field: string, value: any) => {
        const updated = [...selectedDetails];
        updated[idx] = { ...updated[idx], [field]: value };
        setSelectedDetails(updated);
    };

    const formatDateDisplay = (dateString: string) => {
        if (!dateString) return "";
        const [year, month, day] = dateString.split("-");
        return `${day}/${month}/${year}`;
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-[9999]">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 mx-4">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-blue-600">Thêm chương trình khuyến mãi</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-normal text-gray-700">Mã code <span className="text-red-500">*</span></label>
                            <input
                                type="text" required
                                placeholder="Vd: SUMMER2024"
                                value={maCode}
                                onChange={(e) => setMaCode(e.target.value)}
                                className="w-full p-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 outline-none text-slate-800"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-normal text-gray-700">Tên chương trình</label>
                            <input
                                type="text" required
                                placeholder="Vd: Khuyến mãi Hè 2024"
                                value={tenKhuyenMai}
                                onChange={(e) => setTenKhuyenMai(e.target.value)}
                                className="w-full p-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 outline-none text-slate-800"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-normal text-gray-700">Nội dung</label>
                        <textarea
                            required rows={3}
                            placeholder="Mô tả nội dung khuyến mãi..."
                            value={noiDung}
                            onChange={(e) => setNoiDung(e.target.value)}
                            className="w-full p-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 outline-none text-slate-800 resize-none"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-normal text-gray-700">Ngày bắt đầu <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <input
                                    type="date" required
                                    value={ngayBatDau}
                                    onChange={(e) => setNgayBatDau(e.target.value)}
                                    onClick={(e) => { try { (e.currentTarget as any).showPicker() } catch { } }}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                />
                                <div className="w-full p-3 border-2 border-slate-200 rounded-xl bg-white flex justify-between items-center min-h-[50px]">
                                    <span className={ngayBatDau ? "text-slate-800" : "text-gray-400"}>
                                        {ngayBatDau ? formatDateDisplay(ngayBatDau) : "dd/mm/yyyy"}
                                    </span>
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-normal text-gray-700">Ngày kết thúc <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <input
                                    type="date" required
                                    value={ngayKetThuc}
                                    onChange={(e) => setNgayKetThuc(e.target.value)}
                                    onClick={(e) => { try { (e.currentTarget as any).showPicker() } catch { } }}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                />
                                <div className="w-full p-3 border-2 border-slate-200 rounded-xl bg-white flex justify-between items-center min-h-[50px]">
                                    <span className={ngayKetThuc ? "text-slate-800" : "text-gray-400"}>
                                        {ngayKetThuc ? formatDateDisplay(ngayKetThuc) : "dd/mm/yyyy"}
                                    </span>
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-normal text-gray-700">Chi tiết giảm giá cho từng loại phòng</label>
                        {selectedDetails.map((detail, idx) => (
                            <div key={idx} className="flex gap-3 items-end p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <div className="flex-1 space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Loại phòng</label>
                                    <select
                                        value={detail.maLoaiPhong}
                                        onChange={(e) => updateDetail(idx, "maLoaiPhong", parseInt(e.target.value))}
                                        className="w-full p-2.5 border-2 border-slate-200 rounded-lg focus:border-blue-500 outline-none text-slate-800 bg-white"
                                    >
                                        {loaiPhongs.map((lp) => (
                                            <option key={lp.maLoaiPhong} value={lp.maLoaiPhong}>{lp.tenLoaiPhong}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="w-32 space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Giảm giá (%)</label>
                                    <input
                                        type="number" min="0" max="100"
                                        value={detail.giamGia}
                                        onChange={(e) => updateDetail(idx, "giamGia", parseInt(e.target.value))}
                                        className="w-full p-2.5 border-2 border-slate-200 rounded-lg focus:border-blue-500 outline-none text-slate-800"
                                    />
                                </div>
                                <button type="button" onClick={() => handleRemoveDetail(idx)} className="text-red-400 hover:text-red-600 transition p-2 bg-white border border-gray-200 rounded-lg shadow-sm">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                </button>
                            </div>
                        ))}
                        <button type="button" onClick={handleAddDetail} className="w-full py-3 border-2 border-dashed border-gray-300 text-gray-500 rounded-xl hover:border-blue-400 hover:text-blue-500 transition font-medium flex justify-center items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                            Thêm áp dụng cho loại phòng
                        </button>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition">
                            Hủy bỏ
                        </button>
                        <button
                            type="submit"
                            disabled={isPending}
                            className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl font-bold shadow-sm transition"
                        >
                            {isPending ? "Đang lưu..." : "Lưu khuyến mãi"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
