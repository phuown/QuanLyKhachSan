import Header from "@/components/Header";
import ReviewsClient from "./ReviewsClient";

export default function ReviewsPage() {
    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <Header />
            <ReviewsClient />
        </div>
    );
}
