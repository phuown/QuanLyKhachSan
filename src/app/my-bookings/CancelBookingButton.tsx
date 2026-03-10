"use client";

import { useState, useTransition } from "react";
import { cancelBookingAction } from "./actions";

export default function CancelBookingButton({ maPhieu }: { maPhieu: number }) {
    const [isPending, startTransition] = useTransition();
    const [showModal, setShowModal] = useState(false);

    const handleConfirmCancel = async () => {
        startTransition(async () => {
            const result = await cancelBookingAction(maPhieu);
            if (!result.success) {
                alert(result.message);
            }
            setShowModal(false);
        });
    };

    return (
        <>
            <button
                onClick={() => setShowModal(true)}
                disabled={isPending}
                className={`mt-3 w-full py-2 px-4 rounded-lg text-sm font-semibold transition ${isPending
                    ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                    : "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 hover:text-red-700"
                    }`}
            >
                {isPending ? "Đang xử lý..." : "Hủy đặt phòng"}
            </button>

            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-[9999]">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 transform transition-all text-center">
                        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Xác nhận hủy phiếu đặt phòng?</h3>
                        <p className="text-gray-500 mb-6 text-sm">
                            Bạn có chắc chắn muốn hủy phiếu đặt phòng của bạn không? Hành động này sẽ không thể hoàn tác lại.
                        </p>
                        <div className="flex justify-center gap-3">
                            <button
                                onClick={() => setShowModal(false)}
                                disabled={isPending}
                                className="px-5 py-2.5 rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition w-1/2"
                            >
                                Hủy bỏ
                            </button>
                            <button
                                onClick={handleConfirmCancel}
                                disabled={isPending}
                                className="px-5 py-2.5 rounded-xl font-semibold text-white bg-red-600 hover:bg-red-700 shadow-sm shadow-red-200 transition focus:ring-2 focus:ring-red-500 focus:outline-none disabled:bg-red-400 w-1/2"
                            >
                                {isPending ? "Đang xóa..." : "Đồng ý"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
