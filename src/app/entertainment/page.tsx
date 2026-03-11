"use client";
import Image from "next/image";
import Header from "@/components/Header";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function EntertainmentPage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentYogaImageIndex, setCurrentYogaImageIndex] = useState(0);
  const [currentKidsImageIndex, setCurrentKidsImageIndex] = useState(0);

  const waterSportsImages = [
    "/uploads/vuichoi/ttduoinuoc3.jpg",
    "/uploads/vuichoi/ttduoinuoc2.jpg",
    "/uploads/vuichoi/ttduoinuoc.jpg",
    "/uploads/vuichoi/vuichoi4.jpg",
  ];

  const yogaImages = [
    "/uploads/vuichoi/hoatdongt2.jpg",
    "/uploads/vuichoi/hoatdongt2_1.jpg",
    "/uploads/vuichoi/hoatdongt2_2.jpg",
  ];

  const kidsClubImages = [
    "/uploads/vuichoi/kid1.jpg",
    "/uploads/vuichoi/kid2.jpg",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % waterSportsImages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [waterSportsImages.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentYogaImageIndex((prev) => (prev + 1) % yogaImages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [yogaImages.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentKidsImageIndex((prev) => (prev + 1) % kidsClubImages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [kidsClubImages.length]);

  return (
    <div>
      <Header />

      {/* HERO */}
      <section className="relative h-[500px] w-full">
        <Image
          src="/uploads/vuichoi/vuichoic.jpg"
          alt="Entertainment"
          fill
          className="object-cover object-center"
        />

        <div className="absolute inset-0 bg-black/50"></div>

        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center">
          <h1 className="text-5xl font-light">Hoạt động giải trí</h1>
          <p className="mt-3 text-lg">Vui chơi và thư giãn với gia đình</p>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          
          {/* ACTIVITIES GRID */}
          <div className="mb-16">
            <h3 className="text-3xl font-bold text-gray-800 mb-10 text-center">
              Các Hoạt Động Nổi Bật
            </h3>
            
            <div className="grid md:grid-cols-3 gap-8">
              
              {/* ACTIVITY 1 */}
              <div className="bg-gray-50 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition">
                <div className="relative h-[250px]">
                  {/* Image Carousel */}
                  {waterSportsImages.map((img, index) => (
                    <Image
                      key={index}
                      src={img}
                      alt="Water Sports"
                      fill
                      className={`object-cover transition-opacity duration-1000 ${
                        index === currentImageIndex ? "opacity-100" : "opacity-0"
                      }`}
                    />
                  ))}

                  {/* Dots */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                    {waterSportsImages.map((_, index) => (
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
                
                <div className="p-6">
                  <h4 className="text-xl font-bold text-gray-800 mb-2">
                    Thể thao dưới nước
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Khám phá các hoạt động thể thao thú vị như tập chung vui choi trên hồ, lướt ván, chơi bóng trên nước và các nhiều các trò chơi thú vụ khác.
                  </p>
                </div>
              </div>

              {/* ACTIVITY 2 */}
              <div className="bg-gray-50 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition">
                <div className="relative h-[250px]">
                  {/* Image Carousel */}
                  {yogaImages.map((img, index) => (
                    <Image
                      key={index}
                      src={img}
                      alt="Yoga"
                      fill
                      className={`object-cover transition-opacity duration-1000 ${
                        index === currentYogaImageIndex ? "opacity-100" : "opacity-0"
                      }`}
                    />
                  ))}

                  {/* Dots */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                    {yogaImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentYogaImageIndex(index)}
                        className={`w-2 h-2 rounded-full transition ${
                          index === currentYogaImageIndex ? "bg-white" : "bg-white/50"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                
                <div className="p-6">
                  <h4 className="text-xl font-bold text-gray-800 mb-2">
                    Yoga & Wellness
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Tham gia các lớp yoga buổi sáng và tập thể dục để cân bằng và thư giãn.
                  </p>
                </div>
              </div>

              {/* ACTIVITY 3 */}
              <div className="bg-gray-50 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition">
                <div className="relative h-[250px]">
                    {/* Image Carousel */}
                    {kidsClubImages.map((img, index) => (
                      <Image
                        key={index}
                        src={img}
                        alt="Kids Club"
                        fill
                        className={`object-cover transition-opacity duration-1000 ${
                          index === currentKidsImageIndex ? "opacity-100" : "opacity-0"
                        }`}
                      />
                    ))}

                    {/* Dots */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                      {kidsClubImages.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentKidsImageIndex(index)}   
                          className={`w-2 h-2 rounded-full transition ${
                            index === currentKidsImageIndex ? "bg-white" : "bg-white/50"
                          }`}
                        />
                        ))}
                    </div>
                </div>
                
                <div className="p-6">
                  <h4 className="text-xl font-bold text-gray-800 mb-2">
                    Kids Club
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Chương trình đặc biệt dành cho trẻ em với các hoạt động sáng tạo và vui chơi an toàn.
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* SCHEDULE SECTION */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-12 mb-12">
            <h3 className="text-3xl font-bold text-gray-800 mb-8 text-center">
              Lịch trình khách hàng tham khảo theo ngày
            </h3>
            
            <div className="grid md:grid-cols-2 gap-8">
              
              <div>
                <h4 className="text-2xl font-bold text-gray-800 mb-4">Buổi sáng (8:00 - 12:00)</h4>
                <ul className="text-gray-700 space-y-2 text-sm">
                  <li>• 08:00 - Lớp yoga trên bãi biển</li>
                  <li>• 09:00 - Thể thao dưới nước</li>
                  <li>• 10:00 - Lớp bơi cho trẻ em</li>
                  <li>• 11:00 - Trò chơi nhóm tại hồ bơi</li>
                </ul>
              </div>

              <div>
                <h4 className="text-2xl font-bold text-gray-800 mb-4">Buổi chiều & tối (15:00 - 22:00)</h4>
                <ul className="text-gray-700 space-y-2 text-sm">
                  <li>• 15:00 - Zumba trên bãi biển</li>
                  <li>• 16:00 - Chiếu phim hoạt hình</li>
                  <li>• 19:00 - Biểu diễn âm nhạc live</li>
                  <li>• 20:30 - Buổi hòa nhạc & khiêu vũ</li>
                </ul>
              </div>

            </div>
          </div>
        </div>

        <div className="text-center">
            <Link href="/" className="inline-block bg-blue-400 text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition font-semibold">
              Quay lại Trang Chủ
            </Link>
        </div>

      </section>

    </div>
  );
}
