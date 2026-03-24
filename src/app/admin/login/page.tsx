"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminLoginAction } from "../actions";

export default function AdminLoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const result = await adminLoginAction(username, password);
            if (result.success) {
                router.push("/admin");
                router.refresh();
            } else {
                setError(result.message || "Đăng nhập thất bại");
            }
        } catch (err) {
            setError("Có lỗi hệ thống xảy ra.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
            <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-sm w-full space-y-4">
                <div className="text-center">
                    <div className="mx-auto w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-3 shadow-sm">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 tracking-tight">Admin Login</h2>
                    <p className="text-[11px] text-gray-400 font-medium mt-1 uppercase tracking-wider">Hệ thống quản trị khách sạn</p>
                </div>

                {error && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm text-center font-medium">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-3">
                    <div>
                        <label className="text-[12px] font-black text-gray-900 uppercase tracking-widest ml-1 mb-1 block">Tài khoản</label>
                        <input
                            type="text"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition font-medium text-gray-900 bg-gray-50 text-sm"
                            placeholder="Tên đăng nhập"
                        />
                    </div>
                    <div>
                        <label className="text-[12px] font-black text-gray-900 uppercase tracking-widest ml-1 mb-1 block">Mật khẩu</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition font-medium text-gray-900 bg-gray-50 text-sm tracking-widest"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-500/30 disabled:opacity-70"
                    >
                        {isLoading ? "Đang xử lý..." : "Đăng nhập hệ thống"}
                    </button>
                </form>

                <div className="text-center pt-3 border-t border-gray-100">
                    <a href="/" className="text-[11px] font-bold text-gray-400 uppercase tracking-wider hover:text-blue-600 transition">
                        &larr; Quay lại trang chủ
                    </a>
                </div>
            </div>
        </div>
    );
}
