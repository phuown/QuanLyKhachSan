import Image from "next/image";
import Header from "@/components/Header";
import Link from "next/link";

export default function ContactPage() {
  return (
    <div>
      <Header />

      {/* HERO */}
      <section className="relative h-[500px] w-full">

        <Image
          src="/uploads/anh_ks_ben_ngoai/Anh-mat-phu-2.jpg"
          alt="contact"
          fill
          className="object-cover object-center"
        />

        <div className="absolute inset-0 bg-black/50"></div>

        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center">
          <h1 className="text-5xl font-light">Contact</h1>
          <p className="mt-3 text-lg">Get In touch</p>
        </div>

      </section>


      {/* CONTACT INFO */}
      <section className="bg-[#111] text-white py-20">

        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10 px-6">

          {/* PHONE */}
          <div className="text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-white text-black flex items-center justify-center text-2xl mb-6">
              📞
            </div>

            <h3 className="text-xl font-semibold mb-3">Phone</h3>

            <p className="text-gray-400 mb-3">
              A wonderful serenity has taken possession of my entire soul.
            </p>

            <p className="font-semibold">0987654321</p>
          </div>


          {/* EMAIL */}
          <div className="text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-white text-black flex items-center justify-center text-2xl mb-6">
              ✉️
            </div>

            <h3 className="text-xl font-semibold mb-3">Email</h3>

            <p className="text-gray-400 mb-3">
              A wonderful serenity has taken possession of my entire soul.
            </p>

            <p className="font-semibold">info@webhotel.vn</p>
          </div>


          {/* LOCATION */}
          <div className="text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-white text-black flex items-center justify-center text-2xl mb-6">
              📍
            </div>

            <h3 className="text-xl font-semibold mb-3">
              Location & Map
            </h3>

            <p className="text-gray-400 mb-3">
              Vung Tau, Vietnam
            </p>

          </div>

        </div>

        <div className="text-center mt-12">
          <Link href="/" className="inline-block bg-blue-400 text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition font-semibold">
            Quay lại Trang Chủ
          </Link>
        </div>

      </section>

    </div>
  );
}