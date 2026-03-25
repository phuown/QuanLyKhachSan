"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function StatusFilter({ initialStatus }: { initialStatus?: string }) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleChange = (status: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (status === "all") {
            params.delete("status");
        } else {
            params.set("status", status);
        }
        router.push(`?${params.toString()}`);
    };

    return (
        <div className="relative group">
            <select
                key={initialStatus || "all"}
                defaultValue={initialStatus || "all"}
                onChange={(e) => handleChange(e.target.value)}
                className="appearance-none bg-white border border-gray-200 text-gray-500 py-2 pl-4 pr-9 rounded-2xl leading-tight focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all shadow-sm group-hover:shadow-md cursor-pointer font-bold text-xs"
            >
                <option value="all">Tất cả trạng thái</option>
                <option value="da_duyet">Đã duyệt</option>
                <option value="da_nhan_phong">Đã nhận phòng</option>
                <option value="da_tra_phong">Đã trả phòng</option>
                <option value="da_huy">Hủy</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 group-hover:text-blue-500 transition-colors">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
            </div>
        </div>
    );
}
