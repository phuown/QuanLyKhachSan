"use server";
import { cookies } from "next/headers";

export async function adminLoginAction(username: string, password: string) {
    // Thông tin tài khoản đăng nhập admin
    const ADMIN_USER = "admin";
    const ADMIN_PASS = "123456";

    if (username === ADMIN_USER && password === ADMIN_PASS) {
        const cookieStore = await cookies();
        cookieStore.set("admin_session", "true", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24, 
            path: "/",
        });
        return { success: true };
    }
    return { success: false, message: "Tài khoản hoặc mật khẩu không chính xác!" };
}

export async function adminLogoutAction() {
    const cookieStore = await cookies();
    cookieStore.delete("admin_session");
}
