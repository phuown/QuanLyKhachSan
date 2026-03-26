"use client";

import { useState, Fragment } from "react";
import { Plus, Eye, ArrowLeft, Calendar, DollarSign, Package, Trash2 } from "lucide-react";
import Link from "next/link";
import { createPhieuNhapAction, getChiTietPhieuNhapAction, deletePhieuNhapAction } from "../actions";

interface PhieuNhap {
    maPhieuNhapKho: number;
    ngayNhap: Date;
    tongTien: number;
}

interface Service {
    maDichVu: number;
    tenDichVu: string;
    donVi: string;
    gia: number;
}

export default function NhapKhoClient({ phieuNhaps, services }: { phieuNhaps: any[]; services: Service[] }) {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
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
            const details = await getChiTietPhieuNhapAction(id);
            const enriched = details.map(d => ({
                ...d,
                service: services.find(s => s.maDichVu === d.maDichVu)
            }));
            setDetailsMap(prev => ({ ...prev, [id]: enriched }));
        }
        setExpandedId(id);
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Bạn có chắc chắn muốn xóa phiếu nhập này?")) return;
        const res = await deletePhieuNhapAction(id);
        if (!res.success) alert(res.message);
    };

    return (
        <main className="flex-1 p-8 font-['Times_New_Roman'] min-h-screen bg-[#fcfcfc]">
            <header className="mb-10 flex justify-between items-center">
                <div className="flex items-center gap-6">
                    <Link href="/admin/dichvu" className="p-4 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-blue-600 hover:border-blue-100 transition shadow-sm active:scale-90">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tight">Lịch sử Nhập kho</h1>
                        <p className="text-gray-500 mt-2 italic opacity-75 text-lg">Quản lý các phiếu nhập dịch vụ vào kho</p>
                    </div>
                </div>

                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-2xl font-bold text-sm shadow-xl shadow-blue-100/50 hover:bg-blue-700 transition-all active:scale-95 transform hover:-translate-y-1"
                >
                    <Plus size={20} />
                    Lập phiếu nhập
                </button>
            </header>

            <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-gray-100">
                            <th className="px-6 py-4 italic w-20">Mã</th>
                            <th className="px-6 py-4">Thời gian nhập</th>
                            <th className="px-6 py-4 text-right w-64">Tổng giá trị</th>
                            <th className="px-6 py-4 text-center w-40">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {phieuNhaps.map((p) => {
                            const isExpanded = expandedId === p.maPhieuNhapKho;
                            const details = detailsMap[p.maPhieuNhapKho];

                            return (
                                <Fragment key={p.maPhieuNhapKho}>
                                    <tr
                                        onClick={() => handleToggleDetails(p.maPhieuNhapKho)}
                                        className={`hover:bg-blue-50/30 transition-all group border-b border-gray-50 last:border-0 cursor-pointer ${isExpanded ? 'bg-blue-50/50 shadow-inner' : ''}`}
                                    >
                                        <td className="px-6 py-4 font-mono font-bold text-gray-400 text-xs">#{p.maPhieuNhapKho}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className={`p-3 rounded-2xl border transition-colors ${isExpanded ? 'bg-blue-600 text-white border-blue-600' : 'bg-blue-50 text-blue-600 border-blue-100/50'}`}>
                                                    <Calendar size={18} />
                                                </div>
                                                <span className={`font-bold text-base transition-colors ${isExpanded ? 'text-blue-700' : 'text-gray-900'}`}>{formatDate(p.ngayNhap)}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className={`font-black text-lg tracking-tighter transition-colors ${isExpanded ? 'text-blue-700' : 'text-blue-600'}`}>
                                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p.tongTien)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleToggleDetails(p.maPhieuNhapKho);
                                                    }}
                                                    className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all ${isExpanded ? 'bg-blue-600 text-white rotate-180' : 'bg-gray-50 text-gray-400 hover:text-blue-600 hover:bg-blue-50'}`}
                                                >
                                                    <Eye size={18} />
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDelete(p.maPhieuNhapKho);
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
                                                        <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 italic">Chi tiết sản phẩm</span>
                                                        <div className="h-px flex-1 bg-gray-200"></div>
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                                        {details ? details.map((d, i) => (
                                                            <div key={i} className="flex justify-between items-center p-3 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group/item">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 font-bold text-[10px] group-hover/item:bg-blue-600 group-hover/item:text-white transition-colors">{i + 1}</div>
                                                                    <div className="flex flex-col">
                                                                        <span className="font-bold text-gray-800 text-sm leading-none">{d.service?.tenDichVu}</span>
                                                                        <div className="flex items-center gap-3 mt-1.5">
                                                                            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-1">
                                                                                <Package size={10} />
                                                                                {d.soLuong} {d.service?.donVi}
                                                                            </span>
                                                                            <span className="text-[9px] text-blue-400 font-bold uppercase tracking-widest border-l border-gray-100 pl-3">
                                                                                Đơn giá: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(d.gia)}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="text-right">
                                                                    <p className="text-[8px] text-gray-300 font-black uppercase mb-0.5">Thành tiền</p>
                                                                    <p className="font-black text-blue-600 text-sm tracking-tighter">
                                                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(d.gia * d.soLuong)}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        )) : (
                                                            <div className="col-span-full py-6 flex flex-col items-center justify-center text-gray-300">
                                                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mb-2"></div>
                                                                <p className="font-bold italic text-xs">Đang tải chi tiết...</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="mt-4 flex justify-end">
                                                        <div className="px-4 py-2 bg-white border border-gray-100 rounded-xl shadow-sm">
                                                            <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-0.5 text-right">Tổng hóa đơn</p>
                                                            <p className="text-lg font-black text-blue-600 tracking-tighter">
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
                <AddPhieuNhapModal
                    services={services}
                    onClose={() => setIsAddModalOpen(false)}
                />
            )}
        </main>
    );
}

function AddPhieuNhapModal({ services, onClose }: { services: Service[], onClose: () => void }) {
    const [items, setItems] = useState<{ maDichVu: number; soLuong: number; gia: number }[]>(
        [{ maDichVu: 0, soLuong: 1, gia: 0 }]
    );

    const addItem = () => {
        setItems([...items, { maDichVu: 0, soLuong: 1, gia: 0 }]);
    };

    const removeItem = (idx: number) => {
        setItems(items.filter((_, i) => i !== idx));
    };

    const updateItem = (idx: number, field: string, value: any) => {
        const newItems = [...items];
        newItems[idx] = { ...newItems[idx], [field]: value };
        // If service changes, auto-update price
        if (field === "maDichVu") {
            const s = services.find(s => s.maDichVu === Number(value));
            if (s) newItems[idx].gia = (s as any).gia;
        }
        setItems(newItems);
    };

    const handleSubmit = async () => {
        if (items.length === 0) return alert("Vui lòng thêm ít nhất một sản phẩm");
        if (items.some(k => k.maDichVu === 0)) return alert("Vui lòng chọn dịch vụ cho tất cả các dòng");
        const res = await createPhieuNhapAction({ ngayNhap: new Date(), items });
        if (res.success) onClose();
        else alert(res.message);
    };

    const total = items.reduce((a, b) => a + (b.gia || 0) * (b.soLuong || 0), 0);

    return (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-6 z-50">
            <div className="bg-white rounded-[3rem] w-full max-w-4xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-300">
                <div className="p-10 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
                    <div>
                        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Lập Phiếu Nhập Kho</h2>
                        <p className="text-gray-400 italic">Chọn dịch vụ và số lượng để nhập vào kho hệ thống</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Tổng tiền dự kiến</p>
                        <p className="text-3xl font-black text-blue-600 tracking-tighter">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total)}
                        </p>
                    </div>
                </div>

                <div className="p-10 flex-1 overflow-y-auto space-y-6">
                    {items.map((item, idx) => (
                        <div key={idx} className="flex gap-4 items-end bg-gray-50/50 p-4 rounded-2xl border border-gray-100 transition-all hover:bg-white hover:border-blue-100 group">
                            <div className="flex-1">
                                <label className="block text-[9px] font-black text-gray-300 uppercase tracking-widest mb-2 ml-1">Chọn dịch vụ</label>
                                <select
                                    className="w-full px-4 py-2.5 bg-white border border-blue-100 rounded-xl focus:border-blue-300 focus:ring-4 focus:ring-blue-500/5 font-bold text-gray-700 text-sm transition-all outline-none appearance-none"
                                    value={item.maDichVu}
                                    onChange={(e) => updateItem(idx, "maDichVu", Number(e.target.value))}
                                >
                                    <option value={0} disabled className="text-gray-300 italic">--- Chọn dịch vụ ---</option>
                                    {services.map(s => <option key={s.maDichVu} value={s.maDichVu} className="text-gray-900 font-medium">{s.tenDichVu}</option>)}
                                </select>
                            </div>
                            <div className="w-32">
                                <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Số lượng</label>
                                <input
                                    type="number" min="1"
                                    className="w-full px-4 py-2.5 bg-white border border-blue-100 rounded-xl focus:border-blue-300 focus:ring-4 focus:ring-blue-500/5 font-bold text-gray-700 text-sm text-center transition-all outline-none"
                                    value={item.soLuong}
                                    onChange={(e) => updateItem(idx, "soLuong", Number(e.target.value))}
                                />
                            </div>
                            <div className="w-48">
                                <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Đơn giá nhập</label>
                                <input
                                    type="number"
                                    className="w-full px-4 py-2.5 bg-white border border-blue-100 rounded-xl focus:border-blue-300 focus:ring-4 focus:ring-blue-500/5 font-bold text-blue-600 text-sm text-right transition-all outline-none"
                                    value={item.gia}
                                    onChange={(e) => updateItem(idx, "gia", Number(e.target.value))}
                                />
                            </div>
                            <button
                                onClick={() => removeItem(idx)}
                                className="p-4 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition"
                            >
                                <Trash2 size={20} />
                            </button>
                        </div>
                    ))}

                    <button
                        onClick={addItem}
                        className="w-full py-3 border-2 border-dashed border-gray-200 rounded-[2rem] text-gray-300 hover:text-blue-500 hover:border-blue-300 hover:bg-blue-50/30 transition-all font-bold flex flex-col items-center gap-2 group"
                    >
                        <Plus size={32} className="group-hover:scale-110 transition-transform" />
                        <span>Nhấn để thêm dòng sản phẩm mới</span>
                    </button>
                </div>

                <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-center gap-4">
                    <button onClick={onClose} className="px-10 py-3 bg-white border border-gray-200 text-gray-500 rounded-2xl font-bold hover:bg-gray-100 transition shadow-sm text-sm">Hủy phiếu</button>
                    <button
                        onClick={handleSubmit}
                        className="px-12 py-3 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-2xl font-black text-base shadow-xl shadow-blue-100 hover:from-blue-700 hover:to-blue-800 transition active:scale-95"
                    >
                        Hoàn tất - {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total)}
                    </button>
                </div>
            </div>
        </div>
    );
}
