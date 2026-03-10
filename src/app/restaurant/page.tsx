"use client";
import Image from "next/image";
import Header from "@/components/Header";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function RestaurantPage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentPremiumIndex, setCurrentPremiumIndex] = useState(0);

  const seafoodImages = [
    "/uploads/nhahang_bar/nhahang_hs.jpg",
    "/uploads/nhahang_bar/nhahang_hs2.jpg",
    "/uploads/nhahang_bar/nhahang_hs3.jpg",
  ];

  const premiumImages = [
    "/uploads/nhahang_bar/nhahang.jpg",
    "/uploads/nhahang_bar/nhahang2.jpg",
    "/uploads/nhahang_bar/nhahang3.jpg",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % seafoodImages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [seafoodImages.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPremiumIndex((prev) => (prev + 1) % premiumImages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [premiumImages.length]);
  return (
    <div>
      <Header />

      {/* HERO */}
      <section className="relative h-[500px] w-full">
        <Image
          src="/uploads/nhahang_bar/gioi-thieu-nha-hang.jpg"
          alt="Restaurant"
          fill
          className="object-cover object-center"
        />

        <div className="absolute inset-0 bg-black/50"></div>

        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center">
          <h1 className="text-5xl font-light">Nhà hàng & Quầy Bar</h1>
          <p className="mt-3 text-lg">Khám phá ẩm thực tuyệt vời</p>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          
          {/* INTRODUCTION */}
          <div className="mb-16">
            <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">
              Trải Nghiệm Ẩm Thực Cao Cấp
            </h2>
            
            <div className="grid md:grid-cols-2 gap-12 items-center mb-12">
              <div className="text-gray-700 text-base leading-relaxed space-y-4">
                <p>
                  Dưới bàn tay đầy sáng tạo của đầu bếp lành nghề cùng với sự kết hợp của các nguyên liệu tươi ngon tại địa phương tạo nên những món ăn hấp dẫn và giữ nguyên hương vị vốn có.
                </p>
                
                <p>
                  Cùng với không gian trang nhã và dịch vụ chu đáo, tận tình, mỗi địa điểm ăn uống tại ABC Hotel luôn tạo ra một khoảnh khắc tuyệt vời của cuộc sống.
                </p>
                
                <p>
                  Chúng tôi cung cấp các món ăn từ ẩm thực quốc tế đến các đặc sản địa phương, đảm bảo hài lòng mọi khẩu vị khách khách.
                </p>
              </div>
              
              <div className="relative h-[400px]">
                <Image
                  src="/uploads/nhahang_bar/gioi_thieu_nha_hang_2.jpg"
                  alt="Restaurant Interior"
                  fill
                  className="object-cover rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>

          {/* RESTAURANT CARDS */}
          <div className="mb-16">
            <h3 className="text-3xl font-bold text-gray-800 mb-10 text-center">
              Các Nhà Hàng Của Chúng Tôi
            </h3>
            
            <div className="grid md:grid-cols-2 gap-10">
              
              {/* RESTAURANT 1 */}
              <div className="bg-gray-50 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition">
                <div className="relative h-[300px]">
                  {/* Image Carousel */}
                  {premiumImages.map((img, index) => (
                    <Image
                      key={index}
                      src={img}
                      alt="Restaurant Premium"
                      fill
                      className={`object-cover transition-opacity duration-1000 ${
                        index === currentPremiumIndex ? "opacity-100" : "opacity-0"
                      }`}
                    />
                  ))}

                  {/* Dots */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                    {premiumImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentPremiumIndex(index)}
                        className={`w-2 h-2 rounded-full transition ${
                          index === currentPremiumIndex ? "bg-white" : "bg-white/50"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                
                <div className="p-8">
                  <h4 className="text-2xl font-bold text-gray-800 mb-3">
                    Nhà Hàng Cao Cấp
                  </h4>
                  <p className="text-gray-600 mb-4">
                    Nhà hàng chính với menu đa dạng từ ẩm thực Á đến Âu. Backdrop biển tuyệt đẹp và không gian sang trọng tạo nên trải nghiệm ăn uống không quên.
                  </p>
                  <p className="text-sm text-gray-500">
                    Mở cửa: 6:00 AM - 11:00 PM
                  </p>
                </div>
              </div>

              {/* RESTAURANT 2 */}
              <div className="bg-gray-50 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition">
                <div className="relative h-[300px]">
                  {/* Image Carousel */}
                  {seafoodImages.map((img, index) => (
                    <Image
                      key={index}
                      src={img}
                      alt="Restaurant Seafood"
                      fill
                      className={`object-cover transition-opacity duration-1000 ${
                        index === currentImageIndex ? "opacity-100" : "opacity-0"
                      }`}
                    />
                  ))}

                  {/* Dots */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                    {seafoodImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2 h-2 rounded-full transition ${
                          index === currentImageIndex ? "bg-white" : "bg-white/50"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                
                <div className="p-8">
                  <h4 className="text-2xl font-bold text-gray-800 mb-3">
                    Nhà Hàng Hải Sản
                  </h4>
                  <p className="text-gray-600 mb-4">
                    Chuyên biệt về các món hải sản tươi ngon với cách chế biến truyền thống. Tọa lạc ngay cạnh bãi biển với view sun-set tuyệt vời.
                  </p>
                  <p className="text-sm text-gray-500">
                    Mở cửa: 11:00 AM - 10:00 PM
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* BAR SECTION */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-12">
            <h3 className="text-3xl font-bold text-gray-800 mb-6 text-center">
              Quầy Bar Độc Đáo
            </h3>
            
            <div className="grid md:grid-cols-3 gap-8">
              
              <div className="text-center">
                <div className="text-5xl mb-4">🍹</div>
                <p className="text-gray-600">
                  Thưởng thức các cocktail mát lạnh bên hồ bơi với ánh nắng mặt trời.
                </p>
              </div>

              <div className="text-center">
                <div className="text-5xl mb-4">🍺</div>
                <p className="text-gray-600">
                  Không gian ấm cúng với view sảnh chính, nơi lý tưởng để gặp gỡ.
                </p>
              </div>

              <div className="text-center">
                <div className="text-5xl mb-4">🍸</div>
                <p className="text-gray-600">
                  Thưởng thức đồ uống dưới ánh trăng với cảnh biển lãng mạn.
                </p>
              </div>

            </div>
          </div>

          {/* BAR IMAGES */}
          <div className="mt-16 mb-12">
            <div className="grid md:grid-cols-2 gap-10">
              <div className="relative h-[400px] rounded-lg overflow-hidden shadow-lg">
                <Image
                  src="/uploads/nhahang_bar/bar.jpg"
                  alt="Bar 1"
                  fill
                  className="object-cover hover:scale-105 transition duration-300"
                />
              </div>

              <div className="relative h-[400px] rounded-lg overflow-hidden shadow-lg">
                <Image
                  src="/uploads/nhahang_bar/bar2.jpg"
                  alt="Bar 2"
                  fill
                  className="object-cover hover:scale-105 transition duration-300"
                />
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
