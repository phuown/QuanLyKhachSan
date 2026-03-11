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
        <div className="relative">
            <select
                defaultValue={initialStatus || "all"}
                onChange={(e) => handleChange(e.target.value)}
                className="appearance-none bg-white border border-gray-300 text-gray-700 py-2 pl-4 pr-10 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-blue-500 transition shadow-sm cursor-pointer font-medium"
            >
                <option value="all">Tất cả trạng thái</option>
                <option value="da_duyet">Đã duyệt</option>
                <option value="da_nhan_phong">Đã nhận phòng</option>
                <option value="da_tra_phong">Đã trả phòng</option>
                <option value="da_huy">Đã hủy</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
            </div>
        </div>
    );
}
