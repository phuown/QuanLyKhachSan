"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = [
    "/uploads/anh_ks_ben_ngoai/Anh-mat-chinh-ks.jpg",
    "/uploads/anh_ks_ben_ngoai/Anh-mat-phu-1.jpg",
    "/uploads/anh_ks_ben_ngoai/Anh-mat-phu-2.jpg",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 2000); // Đổi ảnh

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div>
      {/* CAROUSEL */}
      <section className="relative w-full h-[700px] md:h-[800px] overflow-hidden">

        {/* Image slider */}
        {images.map((img, index) => (
          <Image
            key={index}
            src={img}
            alt="Hotel Hero"
            fill
            priority={index === 0}
            className={`object-contain transition-opacity duration-1000 ${index === currentImageIndex ? "opacity-100" : "opacity-0"
              }`}
          />
        ))}

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/10"></div>

        {/* Slider dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-20">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-3 h-3 rounded-full transition-all ${index === currentImageIndex
                ? "bg-white scale-110"
                : "bg-white/50"
                }`}
            />
          ))}
        </div>

      </section>

      {/* DESCRIPTION SECTION */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 gap-12 items-center">

            {/* LEFT - TEXT */}
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-gray-800">
                Hãy cùng khám phá khách sạn ABC - Nơi sự sang trọng gặp gỡ sự thoải mái
              </h2>

              <div className="text-gray-700 text-base leading-relaxed space-y-4">
                <p>
                  Hãy trốn đến một góc thiên đường của trái đất
                </p>
                <p>
                  Khu nghỉ dưỡng ven biển cao cấp 5 sao với những hồ bơi nước ngọt trước biển và những khu vườn xanh mát, tất cả trải dài trên bãi cát trắng mịn và hoang sơ tại vùng biển Bãi Dài tuyệt đẹp.
                </p>

                <p>
                  Đến đây, quý khách có cơ hội được thả bước quoanh các khu vườn kiểng được chăm chút hoặc dành những giây phút thư giãn tại trung tâm thể thao.
                </p>

                <p>
                  Quý khách cũng có thể thư giãn qua các phương pháp trị liệu tại Rinata Oasis Spa hoặc làm đẹp tại trung tâm thẩm mỹ.
                </p>

                <p>
                  Bên cạnh đó, hai nhà hàng và ba quầy bar phục vụ nguyên ngày là điểm thu hút vị giác cho các thị khách tới đây.
                </p>
              </div>
            </div>

            {/* RIGHT - IMAGE */}
            <div className="relative h-[450px]">
              <Image
                src="/uploads/anh_ks_ben_ngoai/anh_gioi_thieu.jpg"
                alt="Hotel Description"
                fill
                className="object-cover rounded-lg shadow-lg"
              />
            </div>

          </div>
        </div>
      </section>

      {/* ROOMS SECTION */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 gap-12 items-center">

            {/* LEFT - IMAGE */}
            <div className="relative h-[450px]">
              <Image
                src="/uploads/anh_loai_phong/sanh_cho.jpg"
                alt="Luxury Rooms"
                fill
                className="object-cover rounded-lg shadow-lg"
              />
            </div>

            {/* RIGHT - TEXT */}
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-gray-800">
                Hệ thống phòng lưu trú
              </h2>

              <div className="text-gray-700 text-base leading-relaxed space-y-4">
                <p>
                  Khám phá không gian nghỉ ngơi lý tưởng với thiết kế hiện đại, đầy đủ tiện nghi. Khách sạn ABC cung cấp đa dạng các hạng phòng từ Superior, Deluxe đến các căn Suite sang trọng.
                </p>
                <p>
                  Hệ thống phòng được trang bị đầy đủ các thiết bị công nghệ hiện đại, nội thất cao cấp cùng dịch vụ phòng chuyên nghiệp, đảm bảo mang đến cho quý khách một giấc ngủ ngon và những giây phút nghỉ ngơi đúng nghĩa.
                </p>
              </div>

              <Link href="/our-rooms" className="inline-block bg-blue-400 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition font-semibold">
                Khám phá chi tiết
              </Link>
            </div>

          </div>
        </div>
      </section>


      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">

            {/* LEFT - IMAGE */}
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-gray-800">
                Nhà hàng & quầy Bar
              </h2>

              <div className="text-gray-700 text-base leading-relaxed space-y-4">
                <p>
                  Dưới bàn tay đầy sáng tạo của đầu bếp lành nghề cùng với sự kết hợp của các nguyên liệu tươi ngon tại địa phương tạo nên những món ăn hấp dẫn và giữ nguyên hương vị vốn có. Cùng với không gian trang nhã và dịch vụ chu đáo, tận tình, mỗi địa điểm ăn uống tại ABC Hotel luôn tạo ra một khoảnh khắc tuyệt vời của cuộc sống.
                </p>
              </div>

              <Link href="/restaurant" className="inline-block bg-blue-400 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition font-semibold">
                Khám phá chi tiết
              </Link>
            </div>
            {/* RIGHT - TEXT */}
            <div className="relative h-[350px]">
              <Image
                src="/uploads/nhahang_bar/gioi-thieu-nha-hang.jpg"
                alt="Hotel Description"
                fill
                className="object-cover rounded-lg shadow-lg"
              />
            </div>

          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 gap-12 items-center">

            {/* LEFT - TEXT */}
            <div className="relative h-[450px]">
              <Image
                src="/uploads/vuichoi/vuichoi.jpg"
                alt="Entertainment"
                fill
                className="object-cover rounded-lg shadow-lg"
              />
            </div>

            {/* RIGHT - IMAGE */}
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-gray-800">
                Các hoạt động giải trí
              </h2>

              <p className="text-gray-700 text-base leading-relaxed">
                Bạn vừa thoát khỏi những lo toan thường nhật và đang háo hức chờ đón kỳ nghỉ. Hãy gạt bỏ mọi căng thẳng, đội ngũ hoạt động giải trí của chúng tôi đã chuẩn bị một chương trình thú vị và hấp dẫn dành cho mọi lứa tuổi và sở thích.
              </p>

              <p className="text-gray-700 text-base leading-relaxed">
                Ban ngày, các hoạt động như thể dục dưới nước, Yoga, Zumba, chiếu phim hoạt hình được tổ chức tại hồ bơi hoặc bãi biển.
              </p>

              <p className="text-gray-700 text-base leading-relaxed">
                Buổi tối, các chương trình thư giãn khác nhau được lên kế hoạch mỗi đêm với âm nhạc, biểu diễn và các cuộc thi.
              </p>

              <p className="text-gray-700 text-base leading-relaxed">
                Bên cạnh việc đảm bảo các vị khách nhỏ tuổi của khu nghỉ dưỡng được vui chơi thỏa thích, đội ngũ hoạt động giải trí chuyên nghiệp của chúng tôi cũng tổ chức các chương trình riêng biệt dành cho thanh thiếu niên và trẻ em.
              </p>

              <Link href="/entertainment" className="inline-block bg-blue-400 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition font-semibold">
                Khám phá chi tiết
              </Link>
            </div>

          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 gap-12 items-center">

            {/* LEFT - IMAGE */}
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-gray-800">
                Thiên đường vui chơi
              </h2>

              <p className="text-gray-700 text-base leading-relaxed">
                Khách sạn ABC Hotel cung cấp một loạt các khu vui chơi hiện đại.
              </p>

              <p className="text-gray-700 text-base leading-relaxed">
                Hoạt động vui chơi công viên nước ngoài trời phù hợp với mọi độ tuổi, sở thích của đa số các khách hàng đến đây.
              </p>

              <Link href="/game" className="inline-block bg-blue-400 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition font-semibold">
                Khám phá chi tiết
              </Link>
            </div>
            {/* RIGHT - TEXT */}
            <div className="relative h-[450px]">
              <Image
                src="/uploads/vuichoi/cvnuoc.jpg"
                alt="Hotel Description"
                fill
                className="object-cover rounded-lg shadow-lg"
              />
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}