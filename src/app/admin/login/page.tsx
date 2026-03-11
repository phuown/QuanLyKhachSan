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
            <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-md w-full space-y-6">
                <div className="text-center">
                    <div className="mx-auto w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4 shadow-sm">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-extrabold text-gray-900">Admin Login</h2>
                    <p className="text-gray-500 mt-2">Dành riêng cho hệ thống quản trị khách sạn</p>
                </div>

                {error && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm text-center font-medium">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="text-sm font-bold text-gray-800 block mb-1">Tài khoản</label>
                        <input
                            type="text"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full p-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition font-bold text-gray-900 bg-gray-50 text-base"
                            placeholder="Nhập tên đăng nhập"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-bold text-gray-800 block mb-1">Mật khẩu</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition font-bold text-gray-900 bg-gray-50 text-base tracking-widest"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl font-bold transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? "Đang xử lý..." : "Đăng nhập hệ thống"}
                    </button>
                </form>

                <div className="text-center pt-4 border-t border-gray-100">
                    <a href="/" className="text-sm font-medium text-gray-500 hover:text-blue-600 transition">
                        &larr; Quay lại trang chủ
                    </a>
                </div>
            </div>
        </div>
    );
}
