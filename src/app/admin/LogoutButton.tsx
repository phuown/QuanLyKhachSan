"use client";

import { adminLogoutAction } from "./actions";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
    const router = useRouter();

    const handleLogout = async () => {
        await adminLogoutAction();
        router.push("/admin/login");
        router.refresh();
    };

    return (
        <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 text-red-400 hover:bg-slate-800 hover:text-red-300 rounded-lg transition"
        >
            Đăng xuất
        </button>
    );
}
