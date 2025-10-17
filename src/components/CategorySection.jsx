import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { ShoeShopContext } from "../context/ShoeShopContext";

const CategorySection = ({ categories = [], onSelectCategory, selectedCategory }) => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Danh mục sản phẩm
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Khám phá các bộ sưu tập thời trang cho mọi lứa tuổi
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => onSelectCategory(category.id)}
              className={`group relative overflow-hidden rounded-lg bg-gray-100 aspect-[16/10] cursor-pointer border-2 ${selectedCategory === category.id ? 'border-red-500' : 'border-transparent'}`}
            >
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <h3 className="text-lg font-bold mb-1">{category.name}</h3>
                <p className="text-xs opacity-90">{category.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
