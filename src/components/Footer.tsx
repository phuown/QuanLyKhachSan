import Link from "next/link";
import { Facebook, Instagram, Twitter, Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-slate-900 text-slate-300 py-10">
            <div className="max-w-5xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Brand Info */}
                    <div className="space-y-4 flex flex-col items-center text-center">
                        <div className="flex items-center gap-2">
                            <span className="text-xl font-black text-white tracking-tighter">🏨 ABC Hotel</span>
                        </div>
                        <p className="text-sm leading-relaxed opacity-70">
                            Trải nghiệm sự sang trọng và tiện nghi bậc nhất tại khách sạn của chúng tôi. Chúng tôi cam kết mang đến những kỳ nghỉ khó quên cho mọi khách hàng.
                        </p>
                        <div className="flex gap-4 justify-center">
                            <a href="#" className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all"><Facebook size={16} /></a>
                            <a href="#" className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all"><Instagram size={16} /></a>
                            <a href="#" className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all"><Twitter size={16} /></a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4 flex flex-col items-center text-center">
                        <h4 className="text-white font-bold uppercase tracking-widest text-[10px]">Liên kết nhanh</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/our-rooms" className="hover:text-blue-400 transition-colors">Loại phòng</Link></li>
                            <li><Link href="/about" className="hover:text-blue-400 transition-colors">Giới thiệu</Link></li>
                            <li><Link href="/khuyenmai" className="hover:text-blue-400 transition-colors">Khuyến mãi</Link></li>
                            <li><Link href="/contact" className="hover:text-blue-400 transition-colors">Liên hệ</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-4 flex flex-col items-center text-center">
                        <h4 className="text-white font-bold uppercase tracking-widest text-[10px]">Thông tin liên hệ</h4>
                        <ul className="space-y-2 text-sm">
                            <li className="flex gap-3 justify-center"><MapPin size={16} className="text-blue-500 shrink-0" /> <span>Vũng Tàu, Việt Nam</span></li>
                            <li className="flex gap-3 justify-center"><Phone size={16} className="text-blue-500 shrink-0" /> <span>0987654321</span></li>
                            <li className="flex gap-3 justify-center"><Mail size={16} className="text-blue-500 shrink-0" /> <span>info@hotelux.com</span></li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    );
}
