"use client";

import { useEffect, useState } from "react";
import { Tag, Calendar, Copy, Info, CheckCircle2, Loader2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface Promotion {
    maKhuyenMai: number;
    maCode: string;
    tenKhuyenMai: string;
    noiDung: string;
    ngayBatDau: string;
    ngayKetThuc: string;
    details: {
        tenLoaiPhong: string;
        giamGia: number;
        trangThai: boolean;
    }[];
}

export default function KhuyenMaiPage() {
    const [promotions, setPromotions] = useState<Promotion[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPromotions = async () => {
            try {
                const res = await fetch("/api/promotions/active");
                const data = await res.json();
                setPromotions(data);
            } catch (error) {
                console.error("Error fetching promotions:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPromotions();
    }, []);

    const formatDate = (date: string | Date) => {
        const d = new Date(date);
        return d.toLocaleDateString('vi-VN');
    };

    const handleCopy = (code: string) => {
        navigator.clipboard.writeText(code);
        alert(`Đã sao chép mã: ${code}`);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />

            {/* Hero Section */}
            <div className="bg-blue-900 text-white pt-32 pb-16">
                <div className="container mx-auto px-4 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-800/50 rounded-full text-blue-200 text-sm font-bold mb-6 backdrop-blur-sm border border-blue-700">
                        <Tag size={16} />
                        <span>ƯU ĐÃI ĐẶC BIỆT</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">Kỳ nghỉ trong mơ,<br />Giá cả bất ngờ</h1>
                    <p className="text-blue-100 text-lg max-w-2xl mx-auto leading-relaxed">
                        Khám phá những chương trình khuyến mãi hấp dẫn nhất dành riêng cho kỳ nghỉ của bạn tại Khách sạn chúng tôi.
                    </p>
                </div>
            </div>

            <main className="container mx-auto px-4 py-16 flex-1">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
                        <p className="text-gray-500 font-medium">Đang tải danh sách ưu đãi...</p>
                    </div>
                ) : promotions.length === 0 ? (
                    <div className="text-center py-24 bg-white rounded-[2rem] shadow-sm border border-gray-100">
                        <div className="bg-gray-50 p-8 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                            <Tag className="text-gray-300" size={40} />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-800">Hiện không có mã ưu đãi nào</h2>
                        <p className="text-gray-500 mt-2 max-w-md mx-auto">Chúng tôi sẽ sớm cập nhật các chương trình mới. Hãy quay lại thường xuyên để không bỏ lỡ nhé!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        {promotions.map((promo) => (
                            <div key={promo.maKhuyenMai} className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden group hover:-translate-y-1 transition-all duration-500 flex flex-col md:flex-row">
                                {/* Left side: Discount badge */}
                                <div className="md:w-1/3 bg-blue-600 text-white p-10 flex flex-col items-center justify-center text-center relative overflow-hidden shrink-0">
                                    <div className="absolute top-[-20%] left-[-20%] w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700"></div>
                                    <div className="absolute bottom-[-20%] right-[-20%] w-48 h-48 bg-blue-400/20 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700"></div>

                                    <Tag size={44} className="mb-6 text-blue-200" />
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold tracking-[0.2em] opacity-80 mb-2">GIẢM ĐẾN</span>
                                        <div className="flex items-start">
                                            <span className="text-6xl font-black">{Math.max(...promo.details.map(d => d.giamGia), 0)}</span>
                                            <span className="text-2xl font-bold mt-2">%</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Right side: Info */}
                                <div className="md:w-2/3 p-10 flex flex-col relative">
                                    <div className="flex justify-between items-start mb-6">
                                        <h3 className="text-2xl font-bold text-gray-800 leading-tight group-hover:text-blue-600 transition-colors">{promo.tenKhuyenMai}</h3>
                                        <div className="p-2 bg-green-50 text-green-600 rounded-full shrink-0">
                                            <CheckCircle2 size={24} />
                                        </div>
                                    </div>

                                    <div className="p-4 bg-gray-50 rounded-2xl mb-8 border border-gray-100 flex items-start gap-3">
                                        <Info size={18} className="text-blue-500 mt-0.5" />
                                        <p className="text-gray-600 text-sm italic italic leading-relaxed">"{promo.noiDung}"</p>
                                    </div>

                                    {/* Rooms Applied */}
                                    <div className="mb-8">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] mb-4">Loại phòng áp dụng</p>
                                        <div className="flex flex-wrap gap-2">
                                            {promo.details.map((d, i) => (
                                                <div key={i} className="px-4 py-2 bg-blue-50/50 border border-blue-100/50 rounded-xl text-xs font-bold text-gray-700 flex items-center gap-2">
                                                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                                                    {d.tenLoaiPhong}: <span className="text-blue-600">-{d.giamGia}%</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-6 mt-auto">
                                        {/* Validity Dates */}
                                        <div className="flex items-center gap-3 text-xs font-medium text-gray-500">
                                            <Calendar size={16} className="text-blue-500" />
                                            <span>
                                                Thời hạn: <span className="text-gray-800">{formatDate(promo.ngayBatDau)}</span>
                                                <span className="mx-2 text-gray-300">→</span>
                                                <span className="text-gray-800">{formatDate(promo.ngayKetThuc)}</span>
                                            </span>
                                        </div>

                                        {/* Promo Code Section */}
                                        <div className="flex items-center justify-between gap-4 p-5 bg-slate-900 rounded-[1.5rem] shadow-lg shadow-slate-900/20">
                                            <div>
                                                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-1.5">MÃ ƯU ĐÃI</p>
                                                <p className="text-2xl font-mono font-black text-white tracking-widest uppercase">{promo.maCode}</p>
                                            </div>
                                            <button
                                                onClick={() => handleCopy(promo.maCode)}
                                                className="flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-2xl text-sm font-bold shadow-lg shadow-blue-500/30 hover:bg-blue-400 hover:scale-105 active:scale-95 transition-all"
                                            >
                                                <Copy size={18} /> SAO CHÉP
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* FAQ Section */}
                <div className="mt-24 max-w-4xl mx-auto bg-white rounded-[3rem] p-12 shadow-xl shadow-gray-100 border border-gray-100">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-bold text-gray-800">Điều kiện áp dụng</h2>
                        <div className="w-20 h-1 bg-blue-600 mx-auto mt-4 rounded-full"></div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <h4 className="font-bold text-gray-800 flex items-center gap-2">
                                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xs">1</div>
                                Đặt phòng trực tuyến
                            </h4>
                            <p className="text-gray-500 text-sm leading-relaxed">Mã khuyến mãi chỉ có hiệu lực khi khách hàng thực hiện đặt phòng trực tiếp thông qua hệ thống website chính thức của khách sạn.</p>
                        </div>
                        <div className="space-y-4">
                            <h4 className="font-bold text-gray-800 flex items-center gap-2">
                                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xs">2</div>
                                Chính sách cộng dồn
                            </h4>
                            <p className="text-gray-500 text-sm leading-relaxed">Mỗi đơn đặt phòng (mỗi mã phiếu) chỉ được áp dụng một mã duy nhất, không áp dụng đồng thời với các chương trình khác.</p>
                        </div>
                        <div className="space-y-4">
                            <h4 className="font-bold text-gray-800 flex items-center gap-2">
                                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xs">3</div>
                                Thời gian hiệu lực
                            </h4>
                            <p className="text-gray-500 text-sm leading-relaxed">Mã ưu đãi phải được sử dụng trong đúng khoảng thời gian diễn ra chương trình. Sau thời hạn này, mã sẽ tự động mất hiệu lực.</p>
                        </div>
                        <div className="space-y-4">
                            <h4 className="font-bold text-gray-800 flex items-center gap-2">
                                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xs">4</div>
                                Hỗ trợ từ khách sạn
                            </h4>
                            <p className="text-gray-500 text-sm leading-relaxed">Mọi thắc mắc về việc áp dụng mã, quý khách vui lòng liên hệ hotline hoặc quầy lễ tân để được hỗ trợ nhanh nhất.</p>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
