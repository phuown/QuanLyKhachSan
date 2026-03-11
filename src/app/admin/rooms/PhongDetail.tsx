"use client";

import { useState, useTransition, useEffect } from "react";
import { getPhongByLoaiAction, addPhongAction, deletePhongAction, getAllTinhTrangAction } from "./actions";

interface PhongItem {
    maPhong: number;
    soPhong: string;
    maTinhTrang: number;
    tenTinhTrang: string | null;
}

interface TinhTrangItem {
    maTinhTrang: number;
    tenTinhTrang: string;
}

interface Props {
    maLoaiPhong: number;
    tenLoaiPhong: string;
    onClose: () => void;
}

export default function PhongDetailModal({ maLoaiPhong, tenLoaiPhong, onClose }: Props) {
    const [phongs, setPhongs] = useState<PhongItem[]>([]);
    const [tinhTrangs, setTinhTrangs] = useState<TinhTrangItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isPending, startTransition] = useTransition();

    const [soPhong, setSoPhong] = useState("");
    const [maTinhTrang, setMaTinhTrang] = useState<number>(0);
    const [showAddForm, setShowAddForm] = useState(false);
    const [addError, setAddError] = useState("");

    const loadData = async () => {
        setIsLoading(true);
        const [phongResult, tinhTrangResult] = await Promise.all([
            getPhongByLoaiAction(maLoaiPhong),
            getAllTinhTrangAction(),
        ]);
        if (phongResult.success) setPhongs(phongResult.data as PhongItem[]);
        if (tinhTrangResult.success) {
            const ts = tinhTrangResult.data as TinhTrangItem[];
            setTinhTrangs(ts);
            if (ts.length > 0) setMaTinhTrang(ts[0].maTinhTrang);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        loadData();
    }, [maLoaiPhong]);

    const handleAdd = () => {
        if (!soPhong.trim()) {
            setAddError("Vui lòng nhập số phòng.");
            return;
        }
        setAddError("");
        startTransition(async () => {
            const result = await addPhongAction(maLoaiPhong, soPhong.trim(), maTinhTrang);
            if (result.success) {
                setSoPhong("");
                setShowAddForm(false);
                await loadData();
            } else {
                setAddError(result.message || "Lỗi thêm phòng.");
            }
        });
    };

    const handleDelete = (maPhong: number, soPhong: string) => {
        if (!confirm(`Xóa phòng số "${soPhong}"?`)) return;
        startTransition(async () => {
            const result = await deletePhongAction(maPhong);
            if (result.success) {
                await loadData();
            } else {
                alert("Lỗi: " + result.message);
            }
        });
    };

    const getTinhTrangColor = (tenTinhTrang: string | null) => {
        if (!tenTinhTrang) return "bg-gray-100 text-gray-600";
        const t = tenTinhTrang.toLowerCase();

        if (t.includes("không có khách") || t.includes("trống") || t.includes("sẵn") || t.includes("available")) {
            return "bg-green-100 text-green-700";
        }

        if (t.includes("đã đặt")) return "bg-orange-100 text-orange-700";

        if (t.includes("đang") || t.includes("bận") || t.includes("occupied") || t.includes("có khách") || t.includes("nhận")) {
            return "bg-red-100 text-red-700";
        }

        if (t.includes("bảo") || t.includes("dưỡng") || t.includes("maintenance")) {
            return "bg-yellow-100 text-yellow-700";
        }

        return "bg-blue-100 text-blue-700";
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-[9999]">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col mx-4">
                {/* Header */}
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">Danh sách phòng</h2>
                        <p className="text-sm text-blue-600 font-medium">{tenLoaiPhong}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => { setShowAddForm(!showAddForm); setAddError(""); }}
                            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 transition"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                            Thêm phòng
                        </button>
                        <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 transition">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Add form */}
                {showAddForm && (
                    <div className="px-6 py-4 bg-blue-50 border-b border-blue-100">
                        <h3 className="text-sm font-bold text-blue-800 mb-3">Thêm phòng mới vào loại phòng này</h3>
                        <div className="flex gap-3 items-end">
                            <div className="flex-1 space-y-1">
                                <label className="text-xs font-semibold text-gray-600">Số phòng</label>
                                <input
                                    type="text"
                                    placeholder="Vd: 101, A102..."
                                    value={soPhong}
                                    onChange={(e) => setSoPhong(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                                    className="w-full text-gray-500 px-3 py-2 border-2 border-slate-200 rounded-xl focus:border-blue-500 outline-none text-sm"
                                />
                            </div>
                            <div className="flex-1 space-y-1">
                                <label className="text-xs font-semibold text-gray-600">Tình trạng</label>
                                <select
                                    value={maTinhTrang}
                                    onChange={(e) => setMaTinhTrang(parseInt(e.target.value))}
                                    className="w-full text-gray-500 px-3 py-2 border-2 border-slate-200 rounded-xl focus:border-blue-500 outline-none text-sm"
                                >
                                    {tinhTrangs.map(t => (
                                        <option key={t.maTinhTrang} value={t.maTinhTrang}>{t.tenTinhTrang}</option>
                                    ))}
                                    {tinhTrangs.length === 0 && <option value={1}>Trống</option>}
                                </select>
                            </div>
                            <button
                                onClick={handleAdd}
                                disabled={isPending}
                                className="px-4 py-2 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 disabled:bg-blue-400 transition whitespace-nowrap"
                            >
                                {isPending ? "Đang lưu..." : "Thêm"}
                            </button>
                        </div>
                        {addError && <p className="text-red-600 text-xs mt-2 font-medium">{addError}</p>}
                    </div>
                )}

                {/* Room list */}
                <div className="flex-1 overflow-y-auto px-6 py-4">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-32 text-slate-400">
                            <span className="animate-pulse">Đang tải danh sách phòng...</span>
                        </div>
                    ) : phongs.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-32 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
                            <p className="font-medium">Chưa có phòng nào</p>
                            <p className="text-sm mt-1">Bấm &ldquo;Thêm phòng&rdquo; để bắt đầu.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {phongs.map((p) => (
                                <div key={p.maPhong} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl bg-gray-50 hover:bg-white hover:shadow-sm transition">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center font-bold text-blue-700 text-sm">
                                            {p.soPhong}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-800">Phòng {p.soPhong}</p>
                                            <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${getTinhTrangColor(p.tenTinhTrang)}`}>
                                                {p.tenTinhTrang || "Không rõ"}
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(p.maPhong, p.soPhong)}
                                        disabled={isPending}
                                        className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                        title="Xóa phòng này"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-3 border-t border-gray-100 text-sm text-gray-400 flex justify-between">
                    <span>Tổng: <strong className="text-gray-600">{phongs.length} phòng</strong></span>
                    <button onClick={onClose} className="text-blue-600 hover:underline font-medium">Đóng</button>
                </div>
            </div>
        </div>
    );
}
