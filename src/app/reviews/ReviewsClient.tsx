"use client";

import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { getReviewsAction, submitReviewAction } from "./actions";

interface Review {
    maDanhGia: number;
    tenKhachHang: string;
    email: string | null;
    noiDung: string;
    soSao: number;
    ngayDanhGia: Date;
    maKhachHang: number;
}

const StarIcon = ({ fill = "none", className = "" }: { fill?: string, className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill={fill}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
    </svg>
);

export default function ReviewsClient() {
    const { user, isSignedIn } = useUser();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        tenKhachHang: "",
        email: "",
        noiDung: "",
        soSao: 5,
    });

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                tenKhachHang: user.fullName || "",
                email: user.primaryEmailAddress?.emailAddress || "",
            }));
        }
    }, [user]);

    useEffect(() => {
        const fetchReviews = async () => {
            const result = await getReviewsAction();
            if (result.success && result.data) {
                setReviews(result.data as Review[]);
            }
            setIsLoading(false);
        };
        fetchReviews();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isSignedIn) {
            setError("Vui lòng đăng nhập để gửi đánh giá.");
            return;
        }

        setIsSubmitting(true);
        setError(null);
        setSuccess(false);

        const result = await submitReviewAction(formData);

        if (result.success) {
            setSuccess(true);
            setFormData(prev => ({ ...prev, noiDung: "", soSao: 5 }));
            // Refresh reviews
            const newResult = await getReviewsAction();
            if (newResult.success && newResult.data) {
                setReviews(newResult.data as Review[]);
            }
        } else {
            setError(result.error || "Có lỗi xảy ra");
        }
        setIsSubmitting(false);
    };

    return (
        <div className="max-w-4xl mx-auto py-12 px-4">
            <h1 className="text-4xl font-bold text-center text-gray-800 mb-12 animate-slideDown">Đánh Giá Từ Khách Hàng</h1>

            {/* Submit Review Form */}
            <div className="bg-white rounded-3xl shadow-xl p-8 mb-16 border border-gray-100 transform transition-all hover:shadow-2xl">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <span className="bg-blue-100 p-2 rounded-lg text-blue-600">✍️</span>
                    Gửi đánh giá của bạn
                </h2>

                {!isSignedIn ? (
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 p-6 rounded-2xl border border-blue-100 shadow-inner">
                        <p className="flex items-center gap-3">
                            <span className="text-2xl">ℹ️</span>
                            Hãy đăng nhập để chia sẻ trải nghiệm tuyệt vời của bạn tại ABC Hotel
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Họ tên của bạn</label>
                                <input
                                    type="text"
                                    value={formData.tenKhachHang}
                                    readOnly
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-5 py-3 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Mức độ hài lòng</label>
                                <div className="flex gap-3 h-[52px] items-center bg-gray-50 rounded-xl px-4 justify-center">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <button
                                            key={s}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, soSao: s })}
                                            className="transition-all hover:scale-125 hover:-translate-y-1 active:scale-95"
                                        >
                                            <StarIcon
                                                fill={s <= formData.soSao ? "currentColor" : "none"}
                                                className={`w-8 h-8 ${s <= formData.soSao ? "text-yellow-400" : "text-gray-300"}`}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Chia sẻ trải nghiệm</label>
                            <textarea
                                value={formData.noiDung}
                                onChange={(e) => setFormData({ ...formData, noiDung: e.target.value })}
                                required
                                rows={4}
                                placeholder="Bạn cảm thấy thế nào về dịch vụ, căn phòng và các hoạt động tại khách sạn?..."
                                className="w-full text-gray-500 border border-gray-800 rounded-2xl px-5 py-4 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all resize-none shadow-sm"
                            />
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 text-red-500 bg-red-50 p-4 rounded-xl border border-red-100">
                                <span>❌</span>
                                <span className="text-sm font-medium">{error}</span>
                            </div>
                        )}
                        {success && (
                            <div className="flex items-center gap-2 text-green-600 bg-green-50 p-4 rounded-xl border border-green-100">
                                <span>✅</span>
                                <span className="text-sm font-medium">Cảm ơn bạn đã đóng góp ý kiến để chúng tôi phát triển hơn!</span>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-4 rounded-2xl shadow-xl transition-all duration-300 transform ${isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:translate-y-[-2px] hover:shadow-2xl active:scale-[0.98] active:translate-y-0"
                                }`}
                        >
                            {isSubmitting ? "Đang gửi ý kiến..." : "Gửi đánh giá của bạn"}
                        </button>
                    </form>
                )}
            </div>

            {/* Reviews List */}
            <div className="space-y-10">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-800">Cảm nhận từ khách hàng</h2>
                    <div className="h-1 flex-1 mx-6 bg-gray-100 rounded-full"></div>
                </div>

                {isLoading ? (
                    <div className="text-center py-20">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mx-auto shadow-lg"></div>
                        <p className="mt-6 text-gray-400 font-medium italic tracking-wide">Đang tải những trải nghiệm tuyệt vời...</p>
                    </div>
                ) : reviews.length === 0 ? (
                    <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-gray-200">
                        <div className="text-6xl mb-6 grayscale opacity-50">🌟</div>
                        <p className="text-gray-400 text-lg font-medium">Chưa có đánh giá nào. Hãy là người đầu tiên chia sẻ cảm nhận!</p>
                    </div>
                ) : (
                    <div className="grid gap-8">
                        {reviews.map((review, idx) => (
                            <div
                                key={review.maDanhGia}
                                className="bg-white p-8 rounded-3xl shadow-lg border border-gray-50 hover:shadow-2xl transition-all duration-500 group animate-fadeIn"
                                style={{ animationDelay: `${idx * 100}ms` }}
                            >
                                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xl font-bold shadow-lg transform group-hover:rotate-6 transition-transform">
                                            {review.tenKhachHang.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-800 text-xl group-hover:text-blue-600 transition-colors">{review.tenKhachHang}</h3>
                                            <div className="flex gap-1.5 mt-1.5">
                                                {[...Array(5)].map((_, i) => (
                                                    <StarIcon
                                                        key={i}
                                                        fill={i < review.soSao ? "currentColor" : "none"}
                                                        className={`w-5 h-5 ${i < review.soSao ? "text-yellow-400" : "text-gray-200"}`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-xs font-bold text-gray-400 bg-gray-50 px-4 py-2 rounded-full border border-gray-100 shadow-sm">
                                            📅 {new Date(review.ngayDanhGia).toLocaleDateString('vi-VN')}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-6 relative">
                                    <span className="absolute -top-3 -left-2 text-6xl text-blue-50 opacity-10 font-serif leading-none select-none">"</span>
                                    <p className="text-gray-600 leading-relaxed text-lg italic pl-4 border-l-4 border-blue-500/20">
                                        {review.noiDung}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes slideDown {
                    from { opacity: 0; transform: translateY(-30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
                }
                .animate-slideDown {
                    animation: slideDown 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
                }
            `}</style>
        </div>
    );
}
