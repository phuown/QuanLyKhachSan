"use client";

import { useState, Fragment } from "react";
import { Plus, Eye, ArrowLeft, Calendar, FileText, Package, Trash2, Edit2 } from "lucide-react";
import Link from "next/link";
import { createPhieuXuatAction, getChiTietPhieuXuatAction, deletePhieuXuatAction, updatePhieuXuatAction } from "../actions";

interface Service {
    maDichVu: number;
    tenDichVu: string;
    donVi: string;
    gia: number;
}

export default function XuatKhoClient({ phieuXuats, services }: { phieuXuats: any[]; services: Service[] }) {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingPhieu, setEditingPhieu] = useState<{ id: number; items: any[] } | null>(null);
    const [expandedId, setExpandedId] = useState<number | null>(null);
    const [detailsMap, setDetailsMap] = useState<Record<number, any[]>>({});

    const formatDate = (date: any) => {
        const d = new Date(date);
        return d.toLocaleString("vi-VN");
    };

    const handleToggleDetails = async (id: number) => {
        if (expandedId === id) {
            setExpandedId(null);
            return;
        }

        if (!detailsMap[id]) {
            const details = await getChiTietPhieuXuatAction(id);
            const enriched = details.map(d => ({
                ...d,
                service: services.find(s => s.maDichVu === d.maDichVu)
            }));
            setDetailsMap(prev => ({ ...prev, [id]: enriched }));
        }
        setExpandedId(id);
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Bạn có chắc chắn muốn xóa phiếu xuất này?")) return;
        const res = await deletePhieuXuatAction(id);
        if (!res.success) alert(res.message);
    };

    return (
        <main className="flex-1 p-8 font-['Times_New_Roman'] min-h-screen bg-[#fcfcfc]">
            <header className="mb-10 flex justify-between items-center">
                <div className="flex items-center gap-6">
                    <Link href="/admin/dichvu" className="p-4 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-red-600 hover:border-red-100 transition shadow-sm active:scale-90">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tight">Lịch sử Xuất kho</h1>
                        <p className="text-gray-500 mt-2 italic opacity-75 text-lg">Quản lý các phiếu xuất dịch vụ khỏi kho</p>
                    </div>
                </div>

                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-2xl font-bold text-sm shadow-xl shadow-red-100/50 hover:bg-red-700 transition-all active:scale-95 transform hover:-translate-y-1"
                >
                    <Plus size={20} />
                    Lập phiếu xuất
                </button>
            </header>

            <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-gray-100">
                            <th className="px-6 py-4 italic w-20">Mã</th>
                            <th className="px-6 py-4">Thời gian xuất</th>
                            <th className="px-6 py-4 text-right w-64">Tổng giá trị</th>
                            <th className="px-6 py-4 text-center w-40">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {phieuXuats.map((p) => {
                            const isExpanded = expandedId === p.maPhieuXuatKho;
                            const details = detailsMap[p.maPhieuXuatKho];

                            return (
                                <Fragment key={p.maPhieuXuatKho}>
                                    <tr
                                        onClick={() => handleToggleDetails(p.maPhieuXuatKho)}
                                        className={`hover:bg-red-50/30 transition-all group border-b border-gray-50 last:border-0 cursor-pointer ${isExpanded ? 'bg-red-50/50 shadow-inner' : ''}`}
                                    >
                                        <td className="px-6 py-4 font-mono font-bold text-gray-400 text-xs">#{p.maPhieuXuatKho}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className={`p-3 rounded-2xl border transition-colors ${isExpanded ? 'bg-red-600 text-white border-red-600' : 'bg-red-50 text-red-600 border-red-100/50'}`}>
                                                    <Calendar size={18} />
                                                </div>
                                                <span className={`font-bold text-base transition-colors ${isExpanded ? 'text-red-700' : 'text-gray-900'}`}>{formatDate(p.ngayXuat)}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className={`font-black text-lg tracking-tighter transition-colors ${isExpanded ? 'text-red-700' : 'text-red-600'}`}>
                                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p.tongTien)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleToggleDetails(p.maPhieuXuatKho);
                                                    }}
                                                    className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all ${isExpanded ? 'bg-red-600 text-white rotate-180' : 'bg-gray-50 text-gray-400 hover:text-red-600 hover:bg-red-50'}`}
                                                >
                                                    <Eye size={18} />
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDelete(p.maPhieuXuatKho);
                                                    }}
                                                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                    {isExpanded && (
                                        <tr>
                                            <td colSpan={4} className="p-0 border-b border-gray-100 bg-gray-50/30">
                                                <div className="px-8 py-6 animate-in fade-in slide-in-from-top-2 duration-300">
                                                    <div className="flex items-center gap-3 mb-4">
                                                        <div className="h-px w-10 bg-gray-200"></div>
                                                        <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 italic whitespace-nowrap">Chi tiết sản phẩm</span>
                                                        <div className="h-px flex-1 bg-gray-200"></div>
                                                        <button
                                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                if (details) setEditingPhieu({ id: p.maPhieuXuatKho, items: details });
                                                            }}
                                                        >
                                                            <Edit2 size={12} />
                                                            Chỉnh sửa
                                                        </button>
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                                        {details ? details.map((d, i) => (
                                                            <div key={i} className="flex flex-col p-3 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group/item">
                                                                <div className="flex justify-between items-start mb-2">
                                                                    <div className="flex items-center gap-2">
                                                                        <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center text-red-600 font-bold text-[10px] group-hover/item:bg-red-600 group-hover/item:text-white transition-colors">{i + 1}</div>
                                                                        <div className="flex flex-col">
                                                                            <span className="font-bold text-gray-800 text-sm leading-none">{d.service?.tenDichVu}</span>
                                                                            <div className="flex items-center gap-3 mt-1.5">
                                                                                <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-1">
                                                                                    <Package size={10} />
                                                                                    {d.soLuong} {d.service?.donVi}
                                                                                </span>
                                                                                <span className="text-[9px] text-red-400 font-bold uppercase tracking-widest border-l border-gray-100 pl-3">
                                                                                    Đơn giá: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(d.gia)}
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="text-right">
                                                                        <p className="text-[8px] text-gray-300 font-black uppercase mb-0.5">Thành tiền</p>
                                                                        <p className="font-black text-red-600 text-sm tracking-tighter">
                                                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(d.gia * d.soLuong)}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                <div className="mt-1 pt-2 border-t border-gray-50">
                                                                    <p className="text-[9px] font-bold text-gray-400 italic leading-tight line-clamp-1">"{d.lyDo}"</p>
                                                                </div>
                                                            </div>
                                                        )) : (
                                                            <div className="col-span-full py-6 flex flex-col items-center justify-center text-gray-300">
                                                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600 mb-2"></div>
                                                                <p className="font-bold italic text-xs">Đang tải chi tiết...</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="mt-4 flex justify-end">
                                                        <div className="px-4 py-2 bg-white border border-gray-100 rounded-xl shadow-sm">
                                                            <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-0.5 text-right">Tổng hóa đơn xuất</p>
                                                            <p className="text-lg font-black text-red-600 tracking-tighter">
                                                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p.tongTien)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </Fragment>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {isAddModalOpen && (
                <PhieuXuatModal
                    services={services}
                    onClose={() => setIsAddModalOpen(false)}
                />
            )}

            {editingPhieu && (
                <PhieuXuatModal
                    services={services}
                    initialData={editingPhieu}
                    onClose={() => setEditingPhieu(null)}
                />
            )}
        </main>
    );
}

function PhieuXuatModal({ services, onClose, initialData }: {
    services: Service[],
    onClose: () => void,
    initialData?: { id: number; items: any[] }
}) {
    const [items, setItems] = useState<{ maDichVu: number; soLuong: number; gia: number; lyDo: string }[]>(
        initialData ? initialData.items.map(i => ({
            maDichVu: i.maDichVu,
            soLuong: i.soLuong,
            gia: i.gia,
            lyDo: (i as any).lyDo || "Xuất kho định kỳ"
        })) : [{ maDichVu: 0, soLuong: 1, gia: 0, lyDo: "Xuất kho định kỳ" }]
    );

    const addItem = () => {
        setItems([...items, { maDichVu: 0, soLuong: 1, gia: 0, lyDo: "Xuất kho định kỳ" }]);
    };

    const removeItem = (idx: number) => {
        setItems(items.filter((_, i) => i !== idx));
    };

    const updateItem = (idx: number, field: string, value: any) => {
        const newItems = [...items];
        newItems[idx] = { ...newItems[idx], [field]: value };
        if (field === "maDichVu") {
            const s = services.find(s => s.maDichVu === Number(value));
            if (s) newItems[idx].gia = (s as any).gia;
        }
        setItems(newItems);
    };

    const handleSubmit = async () => {
        if (items.length === 0) return alert("Vui lòng thêm ít nhất một sản phẩm");
        if (items.some(k => k.maDichVu === 0)) return alert("Vui lòng chọn dịch vụ cho tất cả các dòng");

        const res = initialData
            ? await updatePhieuXuatAction(initialData.id, { ngayXuat: new Date(), items })
            : await createPhieuXuatAction({ ngayXuat: new Date(), items });

        if (res.success) onClose();
        else alert(res.message);
    };

    const total = items.reduce((a, b) => a + (b.gia || 0) * (b.soLuong || 0), 0);

    return (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-6 z-50">
            <div className="bg-white rounded-[3rem] w-full max-w-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-300">
                <div className="px-10 py-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/20">
                    <div>
                        <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                            {initialData ? `Sửa Phiếu #${initialData.id}` : "Lập Phiếu Xuất"}
                        </h2>
                        <p className="text-[11px] text-gray-400 italic">
                            {initialData ? "Cập nhật mặt hàng" : "Chọn dịch vụ & lý do"}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Tổng giá trị dự kiến</p>
                        <p className="text-2xl font-black text-red-600 tracking-tighter">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total)}
                        </p>
                    </div>
                </div>

                <div className="px-10 py-6 flex-1 overflow-y-auto space-y-4">
                    {items.map((item, idx) => (
                        <div key={idx} className="flex gap-2 items-end bg-gray-50/50 p-3 rounded-2xl border border-gray-100 transition-all hover:bg-white hover:border-red-100 group">
                            <div className="flex-1">
                                <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Dịch vụ</label>
                                <select
                                    className="w-full px-3 py-2 bg-white border border-blue-100 rounded-xl focus:border-blue-300 focus:ring-4 focus:ring-blue-500/5 font-bold text-gray-700 text-xs transition-all outline-none appearance-none"
                                    value={item.maDichVu}
                                    onChange={(e) => updateItem(idx, "maDichVu", Number(e.target.value))}
                                >
                                    <option value={0} disabled className="text-gray-300 italic">--- Chọn dịch vụ ---</option>
                                    {services.map(s => <option key={s.maDichVu} value={s.maDichVu} className="text-gray-900 font-medium">{s.tenDichVu}</option>)}
                                </select>
                            </div>
                            <div className="w-24">
                                <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Số lượng</label>
                                <input
                                    type="number" min="1"
                                    className="w-full px-3 py-2 bg-white border border-blue-100 rounded-xl focus:border-blue-300 focus:ring-4 focus:ring-blue-500/5 font-bold text-gray-700 text-xs text-center transition-all outline-none"
                                    value={item.soLuong}
                                    onChange={(e) => updateItem(idx, "soLuong", Number(e.target.value))}
                                />
                            </div>
                            <div className="flex-[1.5]">
                                <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Lý do xuất</label>
                                <input
                                    className="w-full px-3 py-2 bg-white border border-blue-100 rounded-xl focus:border-blue-300 focus:ring-4 focus:ring-blue-500/5 font-bold text-gray-700 text-xs italic transition-all outline-none"
                                    value={item.lyDo}
                                    onChange={(e) => updateItem(idx, "lyDo", e.target.value)}
                                    placeholder="Lý do..."
                                />
                            </div>
                            <button
                                onClick={() => removeItem(idx)}
                                className="p-3 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}

                    <button
                        onClick={addItem}
                        className="w-full py-1 border-2 border-dashed border-gray-100 rounded-[2.5rem] text-gray-300 hover:text-red-500 hover:border-red-300 hover:bg-red-50/30 transition-all font-bold flex flex-col items-center gap-2 group"
                    >
                        <Plus size={20} className="group-hover:scale-110 transition-transform" />
                        <span>Phiếu xuất kho</span>
                    </button>
                </div>

                <div className="px-10 py-4 bg-gray-50 border-t border-gray-100 flex justify-center gap-4">
                    <button onClick={onClose} className="px-10 py-3 bg-white border border-gray-200 text-gray-500 rounded-2xl font-bold hover:bg-gray-100 transition shadow-sm text-sm">Hủy phiếu</button>
                    <button
                        onClick={handleSubmit}
                        className="px-12 py-3 bg-gradient-to-br from-red-600 to-red-700 text-white rounded-2xl font-black text-base shadow-xl shadow-red-100 hover:from-red-700 hover:to-red-800 transition active:scale-95"
                    >
                        Hoàn tất - {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total)}
                    </button>
                </div>
            </div>
        </div>
    );
}
