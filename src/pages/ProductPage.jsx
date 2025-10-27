import React, { useState, useEffect, useContext } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { fetchProduct } from '../service/product.js';
import { fetchCategories } from '../service/categories.js';
import { getProductStats } from '../service/reviews.js';
import { ShoeShopContext } from "../context/ShoeShopContext";

const ProductPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [selectedColors, setSelectedColors] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 100000000]);
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [productRatings, setProductRatings] = useState({});
  const { addToCart } = useContext(ShoeShopContext);

  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Load categories and products initially
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        const [productsData, categoriesData] = await Promise.all([
          fetchProduct(),
          fetchCategories(),
        ]);
        setProducts(productsData);
        setCategories(categoriesData);

        const ratings = {};
        for (const p of productsData) {
          try {
            ratings[p.id] = await getProductStats(p.id);
          } catch {
            ratings[p.id] = { averageRating: 0, reviewCount: 0, soldCount: 0 };
          }
        }
        setProductRatings(ratings);
      } catch (err) {
        console.error("Error loading initial data:", err);
      } finally {
        setLoading(false);
      }
    };
    loadInitialData();
  }, []);

  // Load category and search params from URL
  useEffect(() => {
    const categoryFromUrl = searchParams.get("category");
    const subcategoryFromUrl = searchParams.get("subcategory");
    const searchFromUrl = searchParams.get("search");

    if (categoryFromUrl) setSelectedCategory(categoryFromUrl);
    if (subcategoryFromUrl) setSelectedSubcategory(subcategoryFromUrl);
    if (searchFromUrl) setSearchQuery(searchFromUrl);
  }, [searchParams]);

  // === FILTER LOGIC (UPDATED) ===
  useEffect(() => {
    const filterProducts = async () => {
      try {
        setLoading(true);

        // Gọi backend API theo category và search
        const params = {};
        if (selectedCategory) params.categoryId = selectedCategory;
        if (searchQuery) params.q = searchQuery;

        const productsData = await fetchProduct(params);
        let filtered = [...productsData];

        // Lọc theo subcategory (frontend)
        if (selectedCategory === "3" && selectedSubcategory) {
          if (selectedSubcategory === "socks") {
            filtered = filtered.filter((p) =>
              /tất|vớ|sock/i.test(p.name || "")
            );
          } else if (selectedSubcategory === "bag") {
            filtered = filtered.filter((p) =>
              /túi|bag/i.test(p.name || "")
            );
          }
        }

        // Lọc theo màu
        if (selectedColors.length > 0) {
          const colorMap = {
            "Đen": "#000000",
            "Trắng": "#FFFFFF",
            "Nâu": "#8B4513",
            "Xanh navy": "#000080",
            "Đỏ": "#FF0000",
            "Xám": "#808080",
            "Be": "#F5F5DC",
            "Hồng": "#FFC0CB",
          };
          filtered = filtered.filter((p) =>
            p.variants?.some((v) =>
              selectedColors.some(
                (c) => colorMap[c] && v.color_code === colorMap[c]
              )
            )
          );
        }

        // Lọc theo giá
        filtered = filtered.filter((p) => {
          const minPrice = Math.min(...(p.variants?.map((v) => v.price) || [0]));
          return minPrice >= priceRange[0] && minPrice <= priceRange[1];
        });

        // Sắp xếp
        filtered.sort((a, b) => {
          const aMin = Math.min(...(a.variants?.map((v) => v.price) || [0]));
          const bMin = Math.min(...(b.variants?.map((v) => v.price) || [0]));
          switch (sortBy) {
            case "price-low":
              return aMin - bMin;
            case "price-high":
              return bMin - aMin;
            case "newest":
              return new Date(b.created_at) - new Date(a.created_at);
            default:
              return 0;
          }
        });

        setFilteredProducts(filtered);
        setCurrentPage(1);
      } catch (err) {
        console.error("Filter products error:", err);
      } finally {
        setLoading(false);
      }
    };

    filterProducts();
  }, [
    selectedCategory,
    selectedSubcategory,
    selectedColors,
    priceRange,
    sortBy,
    searchQuery,
  ]);
  // === END FILTER LOGIC (UPDATED) ===

  const handleColorToggle = (colorName) => {
    setSelectedColors((prev) =>
      prev.includes(colorName)
        ? prev.filter((c) => c !== colorName)
        : [...prev, colorName]
    );
  };

  const formatPrice = (price) => price.toLocaleString("vi-VN") + "đ";
  const getLowestPrice = (variants) =>
    variants?.length ? Math.min(...variants.map((v) => v.price)) : 0;
  const getHighestPrice = (variants) =>
    variants?.length ? Math.max(...variants.map((v) => v.price)) : 0;
  const getMainImage = (p) =>
    p.images?.[0] || p.variants?.[0]?.images?.[0] || "https://via.placeholder.com/400x400?text=No+Image";

  const handleAddToCart = (product) => {
    const firstVariant = product.variants?.[0];
    if (!firstVariant) return;
    addToCart({
      ...product,
      id: `${product.id}-${firstVariant.sku}`,
      name: product.name,
      variant_sku: firstVariant.sku,
      color_code: firstVariant.color_code,
      size: firstVariant.size,
      price: firstVariant.price,
      stock_quantity: firstVariant.stock_quantity,
      images: firstVariant.images || product.images,
    }, 1);
  };

  const productsPerPage = 9;
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, startIndex + productsPerPage);

  // UI RENDER
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">
        {/* Sidebar */}
        <div className={`${isSidebarOpen ? "block" : "hidden"} lg:block lg:w-1/4`}>
          <div className="bg-white rounded-lg shadow-sm p-6 h-fit">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Bộ lọc</h3>

            {/* Category Filter */}
            <div className="mb-6">
              <h4 className="text-md font-medium text-gray-800 mb-3">Danh mục</h4>
              <div className="space-y-2">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    value=""
                    checked={!selectedCategory}
                    onChange={() => setSelectedCategory("")}
                    className="mr-2"
                  />
                  <span className="text-gray-700 text-sm">Tất cả</span>
                </label>
                {categories.map((cat) => (
                  <label key={cat.id} className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      value={String(cat.id)}
                      checked={String(selectedCategory) === String(cat.id)}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-gray-700 text-sm">{cat.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Color Filter */}
            <div className="mb-6">
              <h4 className="text-md font-medium text-gray-800 mb-3">Màu sắc</h4>
              <div className="grid grid-cols-4 gap-2">
                {["Đen", "Trắng", "Nâu", "Xanh navy", "Đỏ", "Xám", "Be", "Hồng"].map((color) => (
                  <div
                    key={color}
                    onClick={() => handleColorToggle(color)}
                    className={`w-8 h-8 rounded-full border-2 cursor-pointer ${selectedColors.includes(color)
                        ? "border-red-500 ring-2 ring-red-200"
                        : "border-gray-300"
                      }`}
                    style={{
                      backgroundColor:
                        color === "Đen" ? "#000" :
                          color === "Trắng" ? "#fff" :
                            color === "Nâu" ? "#8B4513" :
                              color === "Xanh navy" ? "#000080" :
                                color === "Đỏ" ? "#FF0000" :
                                  color === "Xám" ? "#808080" :
                                    color === "Be" ? "#F5F5DC" : "#FFC0CB"
                    }}
                    title={color}
                  />
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="mb-6">
              <h4 className="text-md font-medium text-gray-800 mb-3">Khoảng giá</h4>
              <input
                type="range"
                min="0"
                max="100000000"
                step="100000"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-600">
                <span>{formatPrice(priceRange[0])}</span>
                <span>{formatPrice(priceRange[1])}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          {currentProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {currentProducts.map((p) => (
                <div key={p.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                  <Link to={`/products/${p.id}`}>
                    <img src={getMainImage(p)} alt={p.name} className="w-full h-64 object-cover rounded-t-lg" />
                  </Link>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{p.name}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-red-600 font-bold">{formatPrice(getLowestPrice(p.variants))}</span>
                      <button
                        onClick={() => handleAddToCart(p)}
                        className="text-gray-400 hover:text-red-600 transition"
                      >
                        <i className="ri-shopping-cart-line text-lg"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-500">Không tìm thấy sản phẩm.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
