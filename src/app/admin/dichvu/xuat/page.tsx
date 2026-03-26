import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Sidebar from "../../Sidebar";
import { getPhieuXuatAction, getDichVuAction } from "../actions";
import XuatKhoClient from "./XuatKhoClient";

export default async function XuatKhoPage() {
    const cookieStore = await cookies();
    const isAdmin = cookieStore.get("admin_session");

    if (!isAdmin) {
        redirect("/admin/login");
    }

    const phieuXuats = await getPhieuXuatAction();
    const services = await getDichVuAction();
    
    return (
        <div className="min-h-screen bg-gray-100 flex">
            <Sidebar />
            <XuatKhoClient phieuXuats={phieuXuats} services={services} />
        </div>
    );
}
