"use client";

import { useState, useTransition } from "react";
import { updateBookingStatusAction } from "./bookingActions";

const STATUS_OPTIONS = [
    { value: "da_duyet", label: "Đã duyệt", cls: "bg-green-100 text-green-800" },
    { value: "da_nhan_phong", label: "Đã nhận phòng", cls: "bg-blue-100 text-blue-800" },
    { value: "da_tra_phong", label: "Đã trả phòng", cls: "bg-slate-100 text-slate-600" },
    { value: "da_huy", label: "Đã hủy", cls: "bg-red-100 text-red-700" },
];

export default function BookingStatusSelect({
    maPhieu,
    currentStatus,
}: {
    maPhieu: number;
    currentStatus: string;
}) {
    const [status, setStatus] = useState(currentStatus);
    const [isPending, startTransition] = useTransition();

    const handleChange = (newStatus: string) => {
        setStatus(newStatus);
        startTransition(async () => {
            await updateBookingStatusAction(maPhieu, newStatus);
        });
    };

    const current = STATUS_OPTIONS.find((s) => s.value === status) ?? STATUS_OPTIONS[0];

    return (
        <div className="relative inline-block">
            <select
                value={status}
                onChange={(e) => handleChange(e.target.value)}
                disabled={isPending}
                className={`appearance-none cursor-pointer pl-4 pr-9 py-2 rounded-full text-sm font-black border-0 outline-none focus:ring-4 focus:ring-blue-100 transition shadow-sm ${current.cls} ${isPending ? "opacity-60" : ""}`}
            >
                {STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
            <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-current opacity-60 text-xs">▾</span>
        </div>
    );
}
