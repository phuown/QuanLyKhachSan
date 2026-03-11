"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AuthModal from "./AuthModal";
import { UserButton, useUser } from "@clerk/nextjs";

export default function Header() {
  const pathname = usePathname();
  const { isSignedIn, isLoaded } = useUser();

  const links = [
    { href: "/", label: "Trang chủ" },
    { href: "/our-rooms", label: "Loại phòng" },
    { href: "/about", label: "Giới thiệu" },
    // { href: "/pages", label: "Pages" },
    // { href: "/news", label: "Tin tức" },
    { href: "/contact", label: "Liên hệ" },
    { href: "/reviews", label: "Đánh giá" },
  ];

  return (
    <header className="w-full bg-white shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center p-4">
        <h1 className="text-xl font-semibold tracking-widest text-gray-600 flex items-center gap-2">
          🏨 ABC HOTEL
        </h1>

        <nav className="flex gap-6 text-sm text-gray-600">
          {links.map((link) => {
            if (link.label === "Giới thiệu") {
              const aboutSubLinks = ["/our-rooms", "/restaurant", "/entertainment", "/game"];
              const isAboutActive = aboutSubLinks.includes(pathname);

              return (
                <div key={link.href} className="relative group">
                  <div
                    className={`transition flex items-center gap-1 cursor-default ${isAboutActive ? "text-blue-400 font-semibold" : "hover:text-blue-300"
                      }`}
                  >
                    {link.label}
                    <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>

                  {/* Dropdown Menu */}
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-100 shadow-xl rounded-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                    <Link href="/our-rooms" className={`block px-4 py-2 hover:bg-blue-50 hover:text-blue-600 transition text-sm font-medium ${pathname === "/our-rooms" ? "text-blue-600 bg-blue-50" : ""}`}>
                      Hệ thống phòng
                    </Link>
                    <Link href="/restaurant" className={`block px-4 py-2 hover:bg-blue-50 hover:text-blue-600 transition text-sm font-medium ${pathname === "/restaurant" ? "text-blue-600 bg-blue-50" : ""}`}>
                      Nhà hàng & Quầy Bar
                    </Link>
                    <Link href="/entertainment" className={`block px-4 py-2 hover:bg-blue-50 hover:text-blue-600 transition text-sm font-medium ${pathname === "/entertainment" ? "text-blue-600 bg-blue-50" : ""}`}>
                      Hoạt động thư giãn
                    </Link>
                    <Link href="/game" className={`block px-4 py-2 hover:bg-blue-50 hover:text-blue-600 transition text-sm font-medium ${pathname === "/game" ? "text-blue-600 bg-blue-50" : ""}`}>
                      Thiên đường vui chơi
                    </Link>
                  </div>
                </div>
              );
            }

            return (
              <div key={link.href} className="relative group">
                <Link
                  href={link.href}
                  className={`transition ${pathname === link.href ? "text-blue-400 font-semibold" : "hover:text-blue-300"}`}
                >
                  {link.label}
                </Link>
              </div>
            );
          })}
        </nav>

        <div className="flex items-center gap-4">
          {!isLoaded ? (
            <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
          ) : isSignedIn ? (
            <div className="flex items-center gap-4">
              <Link href="/my-bookings" className="text-sm font-semibold text-blue-500 hover:text-blue-700 hover:underline">
                Lịch sử đặt phòng
              </Link>
              <UserButton />
            </div>
          ) : (
            <AuthModal />
          )}
        </div>
      </div>
    </header>
  );
}