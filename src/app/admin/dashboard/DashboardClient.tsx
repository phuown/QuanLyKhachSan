"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Users, DoorOpen, Home, CreditCard, LayoutGrid, CalendarCheck, BedDouble, Tag, ChevronRight } from "lucide-react";
import Link from "next/link";

interface DashboardProps {
    stats: {
        totalGuests: number;
        totalBookingGuests: number;
        roomStats: { name: string; value: number; color: string }[];
        totalRooms: number;
    }
}

export default function DashboardClient({ stats }: DashboardProps) {
    return (
        <main className="flex-1 p-8 bg-gray-50/50">
            <header className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Bảng điều khiển</h1>
                    <p className="text-gray-500 mt-1">Tổng quan hoạt động và phím tắt quản lý hệ thống</p>
                </div>
                <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 text-sm font-medium text-blue-600">
                    Hôm nay: {new Date().toLocaleDateString('vi-VN')}
                </div>
            </header>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                    <div className="p-4 bg-blue-100 text-blue-600 rounded-xl">
                        <Users size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Khách đang ở</p>
                        <p className="text-2xl font-bold text-gray-800">{stats.totalGuests}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                    <div className="p-4 bg-amber-100 text-amber-600 rounded-xl">
                        <Users size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Khách đặt phòng</p>
                        <p className="text-2xl font-bold text-gray-800">{stats.totalBookingGuests}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                    <div className="p-4 bg-emerald-100 text-emerald-600 rounded-xl">
                        <Home size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Phòng thực tế</p>
                        <p className="text-2xl font-bold text-gray-800">{stats.totalRooms}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                    <div className="p-4 bg-purple-100 text-purple-600 rounded-xl">
                        <CreditCard size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Doanh thu dự kiến</p>
                        <p className="text-2xl font-bold text-gray-800">--</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                {/* Phím tắt Danh mục Quản lý */}
                <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                            <LayoutGrid size={22} className="text-blue-600" />
                            Quản lý Hệ thống
                        </h3>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <Link href="/admin/bookings" className="group p-6 bg-slate-50 hover:bg-white hover:shadow-xl hover:shadow-blue-50 border border-slate-100 hover:border-blue-200 rounded-3xl transition-all duration-300">
                            <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                <CalendarCheck size={28} />
                            </div>
                            <h4 className="font-bold text-gray-800 mb-2">Đặt phòng</h4>
                            <p className="text-sm text-gray-500 mb-4 line-clamp-2">Quản lý các đơn đặt lịch, duyệt nhận phòng và trả phòng.</p>
                            <div className="flex items-center text-blue-600 text-xs font-bold uppercase tracking-wider">
                                Xem chi tiết <ChevronRight size={14} />
                            </div>
                        </Link>

                        <Link href="/admin/rooms" className="group p-6 bg-slate-50 hover:bg-white hover:shadow-xl hover:shadow-emerald-50 border border-slate-100 hover:border-emerald-200 rounded-3xl transition-all duration-300">
                            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                                <BedDouble size={28} />
                            </div>
                            <h4 className="font-bold text-gray-800 mb-2">Loại phòng</h4>
                            <p className="text-sm text-gray-500 mb-4 line-clamp-2">Điều chỉnh giá, mô tả và quản lý danh sách phòng thực tế.</p>
                            <div className="flex items-center text-emerald-600 text-xs font-bold uppercase tracking-wider">
                                Xem chi tiết <ChevronRight size={14} />
                            </div>
                        </Link>

                        <Link href="/admin/khuyenmai" className="group p-6 bg-slate-50 hover:bg-white hover:shadow-xl hover:shadow-amber-50 border border-slate-100 hover:border-amber-200 rounded-3xl transition-all duration-300">
                            <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-amber-600 group-hover:text-white transition-all">
                                <Tag size={28} />
                            </div>
                            <h4 className="font-bold text-gray-800 mb-2">Khuyến mãi</h4>
                            <p className="text-sm text-gray-500 mb-4 line-clamp-2">Tạo các chương trình ưu đãi, mã giảm giá cho khách hàng.</p>
                            <div className="flex items-center text-amber-600 text-xs font-bold uppercase tracking-wider">
                                Xem chi tiết <ChevronRight size={14} />
                            </div>
                        </Link>
                    </div>
                </div>

                {/* Biểu đồ tròn Trạng thái phòng */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <h3 className="text-lg font-bold text-gray-800 mb-6">Trạng thái phòng</h3>
                    <div className="relative h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={stats.roomStats}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={90}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {stats.roomStats.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                />
                                <Legend
                                    verticalAlign="bottom"
                                    height={36}
                                    iconType="circle"
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-[-15%]">
                            <span className="text-3xl font-bold text-gray-800">{stats.totalRooms}</span>
                            <span className="text-xs text-gray-400 font-medium">Tổng phòng</span>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
