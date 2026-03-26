"use client";

import { useState, Fragment } from "react";
import { Plus, Edit2, Trash2, Package, ArrowDownCircle, ArrowUpCircle, Eye, Settings2 } from "lucide-react";
import { deleteDichVuAction, addDichVuAction, updateDichVuAction } from "./actions";
import Link from "next/link";

interface DichVu {
    maDichVu: number;
    tenDichVu: string;
    donVi: string;
    gia: number;
}

export default function DichVuClient({ services }: { services: DichVu[] }) {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingService, setEditingService] = useState<DichVu | null>(null);
    const [expandedId, setExpandedId] = useState<number | null>(null);

    const handleDelete = async (id: number) => {
        if (confirm("Bạn có chắc chắn muốn xóa dịch vụ này?")) {
            const res = await deleteDichVuAction(id);
            if (!res.success) alert(res.message);
        }
    };

    return (
        <main className="flex-1 p-8">
            <header className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-bold text-gray-900 tracking-tight mb-1">Quản lý Dịch vụ & Kho</h1>
                    <p className="text-sm text-gray-500 font-medium italic opacity-75">Danh mục dịch vụ và các hoạt động nhập xuất kho</p>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                    <div className="relative group min-w-[300px]">
                        <input
                            type="text"
                            name="search"
                            placeholder="Tìm tên dịch vụ..."
                            className="w-full pl-11 pr-5 py-2.5 bg-white border border-gray-200 rounded-2xl text-sm font-medium text-gray-900 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all shadow-sm group-hover:shadow-md"
                        />
                        <svg className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>

                    <div className="bg-white px-4 py-2.5 rounded-2xl shadow-sm font-bold text-xs text-blue-700 border border-blue-50 flex items-center gap-2 uppercase tracking-wide">
                        <span className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></span>
                        TỔNG: {services.length}
                    </div>

                    <div className="flex gap-2">
                        <Link href="/admin/dichvu/nhap" className="p-2.5 bg-white border border-blue-100 text-blue-600 rounded-xl shadow-sm hover:bg-blue-50 transition-all" title="Nhập kho">
                            <ArrowDownCircle size={18} />
                        </Link>
                        <Link href="/admin/dichvu/xuat" className="p-2.5 bg-white border border-red-100 text-red-600 rounded-xl shadow-sm hover:bg-red-50 transition-all" title="Xuất kho">
                            <ArrowUpCircle size={18} />
                        </Link>
                    </div>

                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="px-4 py-2 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl shadow-lg shadow-blue-100 font-bold text-sm hover:from-blue-700 hover:to-blue-800 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2"
                    >
                        <Plus size={16} />
                        Thêm mới
                    </button>
                </div>
            </header>

            <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/80 text-gray-400 text-[11px] font-bold uppercase tracking-[0.15em] border-b border-gray-100 italic">
                                <th className="px-4 py-3 font-bold w-24">MÃ DỊCH VỤ</th>
                                <th className="px-4 py-3 font-bold">THÔNG TIN DỊCH VỤ</th>
                                <th className="px-4 py-3 font-bold text-center">ĐƠN VỊ TÍNH</th>
                                <th className="px-4 py-3 font-bold text-right w-48">ĐƠN GIÁ NIÊM YẾT</th>
                                <th className="px-4 py-3 font-bold text-center w-28">THAO TÁC</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {services.map((s) => {
                                const isExpanded = expandedId === s.maDichVu;
                                return (
                                    <Fragment key={s.maDichVu}>
                                        <tr
                                            onClick={() => setExpandedId(isExpanded ? null : s.maDichVu)}
                                            className={`hover:bg-blue-50/20 transition-all border-b border-gray-50/50 last:border-0 group cursor-pointer ${isExpanded ? 'bg-blue-50/40 shadow-inner' : ''}`}
                                        >
                                            <td className="px-4 py-3">
                                                <span className="font-mono font-black text-[10px] text-blue-600 px-2 py-1 bg-blue-50/60 rounded-lg border border-blue-100/50 shadow-sm transition-transform group-hover:scale-105 inline-block">#{s.maDichVu}</span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-blue-50 text-blue-500 rounded-xl group-hover:rotate-12 transition-transform shadow-sm border border-blue-100/20">
                                                        <Package size={18} />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-gray-900 text-medium tracking-tight leading-none">{s.tenDichVu}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <span className="inline-flex px-3 py-1 bg-slate-100/80 text-slate-500 text-[9px] font-black rounded-full uppercase tracking-widest border border-slate-200/50 italic">
                                                    {s.donVi}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex flex-col items-end">
                                                    <span className="font-black text-blue-600 text-base tracking-tighter leading-none">
                                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(s.gia)}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-2">
                                                <div className="flex justify-center items-center gap-1.5">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setExpandedId(isExpanded ? null : s.maDichVu);
                                                        }}
                                                        className={`p-1.5 rounded-lg transition ${isExpanded ? 'bg-blue-600 text-white' : 'text-blue-400 hover:text-blue-600 hover:bg-blue-50'}`}
                                                    >
                                                        <Eye size={16} />
                                                    </button>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); setEditingService(s); }}
                                                        className="p-1.5 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleDelete(s.maDichVu); }}
                                                        className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                        {isExpanded && (
                                            <tr>
                                                <td colSpan={5} className="px-6 py-4 bg-gray-50/50 animate-in slide-in-from-top-2 duration-300">
                                                    <div className="flex flex-col md:flex-row justify-between items-center gap-6 p-6 bg-white rounded-[2rem] border border-blue-100 shadow-xl shadow-blue-50/50 relative overflow-hidden">
                                                        <div className="absolute top-0 right-0 p-8 opacity-[0.03] text-blue-900 rotate-12">
                                                            <Settings2 size={120} />
                                                        </div>
                                                        <div className="flex-1 space-y-4 relative">
                                                            <div className="flex items-center gap-4">
                                                                <div className="h-10 w-1 bg-blue-500 rounded-full"></div>
                                                                <div>
                                                                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-1">Thông tin chi tiết dịch vụ</p>
                                                                    <h3 className="text-2xl font-black text-gray-900 tracking-tight">{s.tenDichVu}</h3>
                                                                </div>
                                                            </div>
                                                            <div className="grid grid-cols-2 gap-8 pt-2">
                                                                <div>
                                                                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Đơn giá niêm yết</p>
                                                                    <p className="text-xl font-black text-blue-600">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(s.gia)} / {s.donVi}</p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Mã định danh</p>
                                                                    <p className="text-xl font-mono font-black text-gray-800">#SVC-{s.maDichVu.toString().padStart(4, '0')}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </Fragment>
                                );
                            })}
                            {services.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-8 py-24 text-center">
                                        <div className="flex flex-col items-center justify-center text-gray-300">
                                            <Package size={80} className="mb-6 opacity-10" />
                                            <p className="text-2xl font-light italic">Chưa có dịch vụ nào</p>
                                            <p className="text-sm mt-2 opacity-60">Nhấn &ldquo;Thêm mới&rdquo; để bắt đầu xây dựng danh mục.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {isAddModalOpen && (
                <ServiceModal
                    onClose={() => setIsAddModalOpen(false)}
                    onSubmit={async (data) => {
                        const res = await addDichVuAction(data);
                        if (res.success) setIsAddModalOpen(false);
                        else alert(res.message);
                    }}
                />
            )}

            {editingService && (
                <ServiceModal
                    initialData={editingService}
                    onClose={() => setEditingService(null)}
                    onSubmit={async (data) => {
                        const res = await updateDichVuAction(editingService.maDichVu, data);
                        if (res.success) setEditingService(null);
                        else alert(res.message);
                    }}
                />
            )}
        </main>
    );
}

function ServiceModal({ initialData, onClose, onSubmit }: {
    initialData?: DichVu;
    onClose: () => void;
    onSubmit: (data: { tenDichVu: string; donVi: string; gia: number }) => Promise<void>;
}) {
    const [name, setName] = useState(initialData?.tenDichVu || "");
    const [unit, setUnit] = useState(initialData?.donVi || "");
    const [price, setPrice] = useState(initialData?.gia || 0);

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-6 z-50">
            <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                <div className="p-10">
                    <h2 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">
                        {initialData ? "Sửa Dịch vụ" : "Thêm Dịch vụ mới"}
                    </h2>
                    <p className="text-gray-400 italic mb-8">Điền thông tin chi tiết cho dịch vụ của bạn</p>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Tên dịch vụ</label>
                            <input
                                value={name} onChange={(e) => setName(e.target.value)}
                                className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold text-gray-800"
                                placeholder="VD: Nước suối, Giặt ủi..."
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Đơn vị</label>
                                <input
                                    value={unit} onChange={(e) => setUnit(e.target.value)}
                                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold text-gray-800"
                                    placeholder="Chai, Lần..."
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Đơn giá</label>
                                <input
                                    type="number"
                                    value={price} onChange={(e) => setPrice(Number(e.target.value))}
                                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold text-gray-800"
                                />
                            </div>
                        </div>

                        <div className="flex gap-4 pt-6">
                            <button onClick={onClose} className="flex-1 py-4 bg-gray-50 text-gray-500 rounded-2xl font-bold hover:bg-gray-100 transition-all active:scale-95">Hủy</button>
                            <button
                                onClick={() => onSubmit({ tenDichVu: name, donVi: unit, gia: price })}
                                className="flex-1 py-4 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-2xl font-bold shadow-lg shadow-blue-100 hover:from-blue-700 hover:to-blue-800 transition-all active:scale-95"
                            >
                                Lưu dữ liệu
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}