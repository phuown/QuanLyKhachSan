"use client";
import Image from "next/image";
import Header from "@/components/Header";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function GamePage() {
  const [currentSlidesIndex, setCurrentSlidesIndex] = useState(0);
  const [currentKidsPoolIndex, setCurrentKidsPoolIndex] = useState(0);
  const [currentMainPoolIndex, setCurrentMainPoolIndex] = useState(0);

  const waterSlidesImages = [
    "/uploads/vuichoi/cvnuoc.jpg",
    "/uploads/vuichoi/cvnuoc4.jpg",
  ];

  const kidsPoolImages = [
    "/uploads/vuichoi/cvnuoc2.jpg",
    "/uploads/vuichoi/cvnuoc3.jpg",
  ];

  const mainPoolImages = [
    "/uploads/vuichoi/hoboi.jpg",
    "/uploads/vuichoi/hoboi2.jpg",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlidesIndex((prev) => (prev + 1) % waterSlidesImages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [waterSlidesImages.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentKidsPoolIndex((prev) => (prev + 1) % kidsPoolImages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [kidsPoolImages.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMainPoolIndex((prev) => (prev + 1) % mainPoolImages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [mainPoolImages.length]);
  return (
    <div>
      <Header />

      {/* HERO */}
      <section className="relative h-[500px] w-full">
        <Image
          src="/uploads/vuichoi/cvnuoc.jpg"
          alt="Water Park"
          fill
          className="object-cover object-center"
        />

        <div className="absolute inset-0 bg-black/50"></div>

        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center">
          <h1 className="text-5xl font-light">Công Viên Nước</h1>
          <p className="mt-3 text-lg">Vui chơi và thư giãn tại công viên nước tuyệt đẹp</p>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          
          <div className="mb-16">
            <h3 className="text-3xl font-bold text-gray-800 mb-10 text-center">
              Khám Phá Công Viên Nước
            </h3>

            <p className="text-gray-700 text-lg leading-relaxed mb-12 text-center">
              Công viên nước ABC Hotel là điểm đến lý tưởng cho cả gia đình với các trò chơi nước sôi động, hồ bơi xanh mát và các tiện nghi hiện đại. Từ những trượt nước rối rắm đến hồ bơi yên tĩnh, chúng tôi có mọi thứ bạn cần để tận hưởng ngày hè tuyệt vời.
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              
              <div className="bg-gray-50 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition">
                <div className="relative h-[300px]">
                  {/* Image Carousel */}
                  {waterSlidesImages.map((img, index) => (
                    <Image
                      key={index}
                      src={img}
                      alt="Water Slides"
                      fill
                      className={`object-cover transition-opacity duration-1000 ${
                        index === currentSlidesIndex ? "opacity-100" : "opacity-0"
                      }`}
                    />
                  ))}

                  {/* Dots */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                    {waterSlidesImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlidesIndex(index)}
                        className={`w-2 h-2 rounded-full transition ${
                          index === currentSlidesIndex ? "bg-white" : "bg-white/50"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="text-xl font-bold text-gray-800 mb-2">Trượt Nước Rối Rắm</h4>
                  <p className="text-gray-600 text-sm">
                    Các trượt nước tốc độ cao và ngoặt qua với độ cao khác nhau. Cảm nhận cơn chóng mặt khi trượt xuống nước lạnh mát.
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition">
                <div className="relative h-[300px]">
                  {/* Image Carousel */}
                  {mainPoolImages.map((img, index) => (
                    <Image
                      key={index}
                      src={img}
                      alt="Swimming Pool"
                      fill
                      className={`object-cover transition-opacity duration-1000 ${
                        index === currentMainPoolIndex ? "opacity-100" : "opacity-0"
                      }`}
                    />
                  ))}

                  {/* Dots */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                    {mainPoolImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentMainPoolIndex(index)}
                        className={`w-2 h-2 rounded-full transition ${
                          index === currentMainPoolIndex ? "bg-white" : "bg-white/50"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="text-xl font-bold text-gray-800 mb-2">Hồ Bơi Chính</h4>
                  <p className="text-gray-600 text-sm">
                    Hồ bơi với nước sạch và an toàn. Hoàn hảo cho bơi lội, luyện tập hoặc thư giãn.
                  </p>
                </div>
              </div>


              <div className="bg-gray-50 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition">
                <div className="relative h-[300px]">
                  {/* Image Carousel */}
                  {kidsPoolImages.map((img, index) => (
                    <Image
                      key={index}
                      src={img}
                      alt="Kids Pool"
                      fill
                      className={`object-cover transition-opacity duration-1000 ${
                        index === currentKidsPoolIndex ? "opacity-100" : "opacity-0"
                      }`}
                    />
                  ))}

                  {/* Dots */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                    {kidsPoolImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentKidsPoolIndex(index)}
                        className={`w-2 h-2 rounded-full transition ${
                          index === currentKidsPoolIndex ? "bg-white" : "bg-white/50"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="text-xl font-bold text-gray-800 mb-2">Công viên nước vui chơi cho Trẻ Em</h4>
                  <p className="text-gray-600 text-sm">
                    Công viên nước nông an toàn dành cho trẻ em với các trò chơi nước vui nhộn, an toàn phù hợp với độ tuổi trẻ em và có giám sát.
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* AMENITIES */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-12 mb-12">
            <h3 className="text-3xl font-bold text-gray-800 mb-8 text-center">
              Tiện Nghi & Dịch Vụ
            </h3>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <h4 className="text-xl font-bold text-blue-600 mb-3">🏖️ Bãi Biển & Đệm</h4>
                <p className="text-gray-700 text-sm">
                  Ghế nằm, ô che nắng và khăn mát được cung cấp miễn phí trên toàn công viên.
                </p>
              </div>

              <div>
                <h4 className="text-xl font-bold text-blue-600 mb-3">🍔 Quầy Ăn Nhẹ</h4>
                <p className="text-gray-700 text-sm">
                  Quầy ăn nhẹ phục vụ nước mát, kem, pizza và các món ăn nhẹ khác.
                </p>
              </div>

              <div>
                <h4 className="text-xl font-bold text-blue-600 mb-3">👨‍⚕️ Nhân Viên an Toàn</h4>
                <p className="text-gray-700 text-sm">
                  Các nhân viên cứu hộ được đào tạo chuyên nghiệp theo dõi toàn bộ công viên.
                </p>
              </div>
            </div>
          </div>

          {/* BACK TO HOME */}
          <div className="text-center">
            <Link href="/" className="inline-block bg-blue-400 text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition font-semibold">
              Quay lại Trang Chủ
            </Link>
          </div>

        </div>
      </section>

    </div>
  );
}
