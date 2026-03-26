import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Sidebar from "../../Sidebar";
import { getPhieuNhapAction, getDichVuAction } from "../actions";
import NhapKhoClient from "./NhapKhoClient";

export default async function NhapKhoPage() {
    const cookieStore = await cookies();
    const isAdmin = cookieStore.get("admin_session");

    if (!isAdmin) {
        redirect("/admin/login");
    }

    const phieuNhaps = await getPhieuNhapAction();
    const services = await getDichVuAction();
    
    return (
        <div className="min-h-screen bg-gray-100 flex">
            <Sidebar />
            <NhapKhoClient phieuNhaps={phieuNhaps} services={services} />
        </div>
    );
}
