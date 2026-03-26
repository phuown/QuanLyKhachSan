import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Sidebar from "../Sidebar";
import { getDichVuAction } from "./actions";
import DichVuClient from "./DichVuClient";

export default async function DichVuPage() {
    const cookieStore = await cookies();
    const isAdmin = cookieStore.get("admin_session");

    if (!isAdmin) {
        redirect("/admin/login");
    }

    const services = await getDichVuAction();
    return (
        <div className="min-h-screen bg-gray-100 flex">
            <Sidebar />
            <DichVuClient services={services} />
        </div>
    );
}