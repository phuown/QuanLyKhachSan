"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "./LogoutButton";
import { LayoutDashboard, CalendarCheck, BedDouble, Tag, PlusCircle, Package } from "lucide-react";

const navItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Quản lý đặt phòng", href: "/admin/bookings", icon: CalendarCheck },
    { name: "Quản lý loại phòng", href: "/admin/rooms", icon: BedDouble },
    { name: "Quản lý khuyến mãi", href: "/admin/khuyenmai", icon: Tag },
    { name: "Dịch vụ & Kho", href: "/admin/dichvu", icon: Package },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-72 bg-slate-900 text-white min-h-screen flex flex-col hidden md:flex shrink-0 border-r border-slate-800">
            <div className="p-6 border-b border-slate-800">
                <div className="flex items-center gap-2 mb-1">
                    <div className="w-8 h-8 bg-blue-400 rounded-lg flex items-center justify-center">
                        <Home className="text-white" size={18} />
                    </div>
                    <span className="text-xl font-bold tracking-tight">Admin</span>
                </div>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Hệ thống quản lý khách sạn</p>
            </div>

            <nav className="flex-1 p-4 mt-4">
                <div className="space-y-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href || (item.href !== "/admin/dashboard" && pathname.startsWith(item.href));
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                    ? "bg-blue-400 text-white shadow-lg shadow-blue-400/20"
                                    : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                                    }`}
                            >
                                <Icon size={20} className={isActive ? "text-white" : "text-slate-500 group-hover:text-slate-300"} />
                                <span className="font-medium text-sm">{item.name}</span>
                            </Link>
                        );
                    })}
                </div>
            </nav>

            <div className="p-4 border-t border-slate-800 bg-slate-900/50">
                <LogoutButton />
            </div>
        </aside>
    );
}

// Giả lập icon Home cho logo
function Home({ className, size }: { className?: string, size?: number }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size || 24}
            height={size || 24}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
    )
}
