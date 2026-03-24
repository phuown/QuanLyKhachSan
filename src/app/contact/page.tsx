import Image from "next/image";
import Header from "@/components/Header";
import Link from "next/link";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      {/* SINGLE SECTION WITH BACKGROUND IMAGE */}
      <section className="relative flex-1 flex flex-col items-center justify-center p-6 overflow-hidden min-h-[600px]">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/uploads/anh_ks_ben_ngoai/Anh-mat-phu-2.jpg"
            alt="Contact Background"
            fill
            className="object-cover"
          />
          {/* Subtle overlay for readability if needed, but keeping it light since user said "bỏ nền đen" */}
          <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]"></div>
        </div>

        <div className="relative z-10 w-full max-w-4xl mx-auto space-y-12">

          {/* HERO TEXT */}
          <div className="text-center text-gray-800">
            <h1 className="text-4xl font-light tracking-tight">Contact</h1>
            <p className="mt-2 text-sm uppercase tracking-widest text-gray-500 font-medium">Get In touch</p>
          </div>

          {/* CONTACT INFO CARDS - OVERLAYING THE IMAGE */}
          <div className="grid md:grid-cols-3 gap-6">

            {/* PHONE */}
            <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-xl text-center group transition-all hover:bg-white hover:-translate-y-1">
              <div className="w-10 h-10 mx-auto rounded-full bg-gray-100 text-gray-800 flex items-center justify-center text-lg mb-4">
                📞
              </div>
              <h3 className="text-base font-semibold text-gray-800 mb-1">Phone</h3>
              <p className="text-xs text-gray-500 mb-3 leading-relaxed">
                Tư vấn trực tiếp 24/7
              </p>
              <p className="text-sm font-bold text-slate-700">0987654321</p>
            </div>

            {/* EMAIL */}
            <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-xl text-center group transition-all hover:bg-white hover:-translate-y-1">
              <div className="w-10 h-10 mx-auto rounded-full bg-gray-100 text-gray-800 flex items-center justify-center text-lg mb-4">
                ✉️
              </div>
              <h3 className="text-base font-semibold text-gray-800 mb-1">Email</h3>
              <p className="text-xs text-gray-500 mb-3 leading-relaxed">
                Phản hồi trong 24 giờ làm việc
              </p>
              <p className="text-sm font-bold text-slate-700">info@webhotel.vn</p>
            </div>

            {/* LOCATION */}
            <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-xl text-center group transition-all hover:bg-white hover:-translate-y-1">
              <div className="w-10 h-10 mx-auto rounded-full bg-gray-100 text-gray-800 flex items-center justify-center text-lg mb-4">
                📍
              </div>
              <h3 className="text-base font-semibold text-gray-800 mb-1">Location</h3>
              <p className="text-xs text-gray-500 mb-3 leading-relaxed">
                Vung Tau, Vietnam
              </p>
              <p className="text-sm font-bold text-slate-700"> Vũng Tàu</p>
            </div>

          </div>

          {/* CTA BUTTON */}
          <div className="text-center">
            <Link href="/" className="inline-block bg-gray-200 text-gray-800 px-8 py-2.5 rounded-full hover:bg-gray-300 transition font-bold text-sm shadow-sm border border-gray-300">
              Quay lại Trang Chủ
            </Link>
          </div>

        </div>

      </section>

    </div>
  );
}