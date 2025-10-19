
import { Link } from "react-router-dom";
import backgroundImg from '../assets/images/shop_giay.jpg';
import { useContext } from "react";
import { ShoeShopContext } from "../context/ShoeShopContext";





const HeroSection = () => {
  return (
    <section
      className="relative h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${backgroundImg})`
      }}
    >
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="relative h-full flex items-center">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Thời trang
              <br />
              <span className="text-red-500">Đơn giản</span>
              <br />
              Chất lượng
            </h1>
            <p className="text-xl text-white mb-8 leading-relaxed opacity-90">
              Khám phá bộ sưu tập mới nhất với những thiết kế tối giản, chất lượng cao và giá cả hợp lý từ UNITSUKA TIGER
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/products"
                className="bg-red-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-red-700 transition-colors text-center whitespace-nowrap cursor-pointer"
              >
                Mua sắm ngay
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection