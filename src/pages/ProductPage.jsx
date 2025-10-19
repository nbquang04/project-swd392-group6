import React, { useState, useEffect, useContext } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { fetchProduct, fetchCategory } from '../service/product.js';
import { getProductStats } from '../service/reviews.js';
import { ShoeShopContext } from "../context/ShoeShopContext";
// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.






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
    const { handleGoTop, addToCart, getCurrentUser } = useContext(ShoeShopContext)

    // Track if this is the initial page load
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [refreshKey, setRefreshKey] = useState(0); // Add refresh key for forcing re-render

    // Auto scroll to top when page changes (except first page load)
    useEffect(() => {
        if (!isInitialLoad) {
            handleGoTop();
        } else {
            setIsInitialLoad(false);
        }
    }, [currentPage, handleGoTop, isInitialLoad]);

    // Refresh data function


    // Auto-refresh when page becomes visible (user returns to tab)


    // Refresh data when refreshKey changes
    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                console.log('🚀 Loading initial data...');
                
                const [productsData, categoriesData] = await Promise.all([
                    fetchProduct(),
                    fetchCategory(),
                ]);
                
                console.log('📦 Initial products data:', productsData);
                console.log('📂 Initial categories data:', categoriesData);
                
                setProducts(productsData);
                setCategories(categoriesData);
                
                // Lấy rating cho tất cả products
                const ratings = {};
                for (const product of productsData) {
                    try {
                        const stats = await getProductStats(product.id);
                        ratings[product.id] = stats;
                    } catch (error) {
                        console.error(`Error fetching stats for product ${product.id}:`, error);
                        // Fallback: sử dụng dữ liệu mặc định khi có lỗi
                        ratings[product.id] = { 
                            averageRating: 0, 
                            reviewCount: 0, 
                            soldCount: 0,
                            error: true 
                        };
                    }
                }
                setProductRatings(ratings);
                
                console.log('✅ Initial data loaded successfully');
                console.log('📊 Final initial products state:', productsData);
                
            } catch (error) {
                console.error('Error loading data:', error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [refreshKey]); // Add refreshKey as dependency

    // Bỏ dấu + toLowerCase
    const normalizeText = (str = "") =>
        str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

    // Regex xác định từ khóa "tất/vớ/sock" ở ranh giới từ
    const SOCK_REGEX = /(^|[^a-z0-9])(tat|vo|sock)([^a-z0-9]|$)/i;

    // Truy vấn có nhắm tới tất?
    const isSockQuery = (query = "") => SOCK_REGEX.test(normalizeText(query));

    // Sản phẩm có phải TẤT?
    const isSockProduct = (product) => {
        const text = normalizeText(`${product?.name || ""} ${product?.description || ""}`);
        // BẮT BUỘC thuộc danh mục Phụ kiện (id "3") + khớp từ khóa
        return String(product?.category_id) === "3" && SOCK_REGEX.test(text);
    };

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                console.log('🎯 Loading data on component mount...');
                
                const [productsData, categoriesData] = await Promise.all([
                    fetchProduct(),
                    fetchCategory(),
                ]);
                
                console.log('📦 Mount products data:', productsData);
                console.log('📂 Mount categories data:', categoriesData);
                
                setProducts(productsData);
                setCategories(categoriesData);
                
                // Lấy rating cho tất cả products
                const ratings = {};
                for (const product of productsData) {
                    try {
                        const stats = await getProductStats(product.id);
                        ratings[product.id] = stats;
                    } catch (error) {
                        console.error(`Error fetching stats for product ${product.id}:`, error);
                        // Fallback: sử dụng dữ liệu mặc định khi có lỗi
                        ratings[product.id] = { 
                            averageRating: 0, 
                            reviewCount: 0, 
                            soldCount: 0,
                            error: true 
                        };
                    }
                }
                setProductRatings(ratings);
                
                console.log('✅ Mount data loaded successfully');
                console.log('📊 Final mount products state:', productsData);
                
            } catch (error) {
                console.error('Error loading data:', error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    // Get category, subcategory, and search from URL params
    useEffect(() => {
        const categoryFromUrl = searchParams.get('category');
        const subcategoryFromUrl = searchParams.get('subcategory');
        const searchFromUrl = searchParams.get('search');

        if (categoryFromUrl) {
            setSelectedCategory(categoryFromUrl);
        }
        if (subcategoryFromUrl) {
            setSelectedSubcategory(subcategoryFromUrl);
        }
        if (searchFromUrl) {
            // Set search query for display purposes
            setSearchQuery(searchFromUrl);
        }
    }, [searchParams]);

    // Filter and sort products
    useEffect(() => {
        console.log('🔍 Starting filtering process...');
        console.log('📦 Products before filtering:', products);
        
        let filtered = [...products];

        // Filter by search query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim();
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(query) ||
                product.description?.toLowerCase().includes(query) ||
                product.variants?.some(variant =>
                    variant.sku?.toLowerCase().includes(query) ||
                    variant.color_code?.toLowerCase().includes(query)
                )
            );
            console.log('🔍 After search filter:', filtered.length);
        }

        // Filter by category
        if (selectedCategory && selectedCategory !== "Tất cả") {
            filtered = filtered.filter(product => String(product.category_id) === String(selectedCategory));
            console.log('🔍 After category filter:', filtered.length, 'for category:', selectedCategory);
        }

        // ====== SUBCATEGORY PHỤ KIỆN ======
        if (selectedCategory === "3" && selectedSubcategory) {
            if (selectedSubcategory === "socks") {
                filtered = filtered.filter(product =>
                    product.name.toLowerCase().includes('vớ') ||
                    product.name.toLowerCase().includes('tất') ||
                    product.name.toLowerCase().includes('sock')
                );
            } else if (selectedSubcategory === "bag") {
                filtered = filtered.filter(product =>
                    product.name.toLowerCase().includes('túi') ||
                    product.name.toLowerCase().includes('bag')
                );
            }
        }

        // ====== MÀU ======
        if (selectedColors.length > 0) {
            filtered = filtered.filter(product =>
                product.variants?.some(variant =>
                    selectedColors.some(color => {
                        const colorMap = {
                            'Đen': '#000000',
                            'Trắng': '#FFFFFF',
                            'Nâu': '#8B4513',
                            'Xanh navy': '#000080',
                            'Đỏ': '#FF0000',
                            'Xám': '#808080',
                            'Be': '#F5F5DC',
                            'Hồng': '#FFC0CB'
                        };
                        return variant.color_code === colorMap[color];
                    })
                )
            );
        }

        // ====== GIÁ ======
        filtered = filtered.filter((product) => {
            const minPrice = Math.min(...(product.variants?.map((v) => v.price) || [0]));
            return minPrice >= priceRange[0] && minPrice <= priceRange[1];
        });

        // ====== SẮP XẾP ======
        filtered.sort((a, b) => {
            const aMin = Math.min(...(a.variants?.map((v) => v.price) || [0]));
            const bMin = Math.min(...(b.variants?.map((v) => v.price) || [0]));
            switch (sortBy) {
                case "price-low": return aMin - bMin;
                case "price-high": return bMin - aMin;
                case "newest": return new Date(b.created_at) - new Date(a.created_at);
                default: return 0;
            }
        });

        console.log('🔍 Final filtered products:', filtered);
        console.log('🔍 Filtered products count:', filtered.length);
        
        setFilteredProducts(filtered);
        setCurrentPage(1);
    }, [
        products,
        selectedCategory,
        selectedSubcategory,
        selectedColors,
        priceRange,
        sortBy,
        searchQuery,
    ]);

    const handleColorToggle = (colorName) => {
        setSelectedColors((prev) =>
            prev.includes(colorName)
                ? prev.filter((c) => c !== colorName)
                : [...prev, colorName]
        );
    };

    const formatPrice = (price) => {
        return price.toLocaleString("vi-VN") + "đ";
    };

    const getLowestPrice = (variants) => {
        if (!variants || variants.length === 0) return 0;
        return Math.min(...variants.map(variant => variant.price));
    };

    const getHighestPrice = (variants) => {
        if (!variants || variants.length === 0) return 0;
        return Math.max(...variants.map(variant => variant.price));
    };

    const getMainImage = (product) => {
        if (product.images && product.images.length > 0) {
            return product.images[0];
        }
        if (product.variants && product.variants.length > 0 && product.variants[0].images) {
            return product.variants[0].images[0];
        }
        return 'https://via.placeholder.com/400x400?text=No+Image';
    };

    const getCategoryName = (categoryId) => {
        const category = categories.find(cat => String(cat.id) === String(categoryId));
        return category ? category.name : '';
    };

    const getSubcategoryName = () => {
        if (selectedSubcategory === "socks") return "Tất";
        if (selectedSubcategory === "bag") return "Túi";
        return "";
    };

    // Hàm helper để render rating stars
    const renderRatingStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            const starClass = i <= Math.floor(rating) 
                ? 'fill-current' 
                : i === Math.ceil(rating) && rating % 1 > 0
                    ? 'fill-current opacity-50'
                    : 'fill-none';
            
            stars.push(
                <svg key={i} className={`w-3 h-3 text-yellow-400 ${starClass}`} viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            );
        }
        return stars;
    };

    // Handle add to cart
    const handleAddToCart = (product) => {
        // Lấy variant đầu tiên của sản phẩm (hoặc có thể để user chọn sau)
        const firstVariant = product.variants?.[0];
        if (!firstVariant) {
            console.error('Không có variant cho sản phẩm:', product.name);
            return;
        }

        // Tạo object đúng dạng context yêu cầu
        const cartItem = {
            ...product,
            id: `${product.id}-${firstVariant.sku}`,
            name: product.name,
            variant_sku: firstVariant.sku,
            color_code: firstVariant.color_code,
            size: firstVariant.size,
            price: firstVariant.price,
            stock_quantity: firstVariant.stock_quantity,
            images: firstVariant.images || product.images,
        };

        // Thêm 1 sản phẩm vào giỏ hàng
        addToCart(cartItem, 1);
    };

    const productsPerPage = 9;
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    const startIndex = (currentPage - 1) * productsPerPage;
    const currentProducts = filteredProducts.slice(startIndex, startIndex + productsPerPage);

    console.log('Current state:', {
        filteredProductsLength: filteredProducts.length,
        currentPage,
        totalPages,
        startIndex,
        currentProductsLength: currentProducts.length,
        currentProducts: currentProducts
    });

    const renderPagination = () => {
        const pages = [];
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    className={`px-3 py-2 mx-1 rounded-md cursor-pointer ${currentPage === i
                        ? "bg-red-600 text-white"
                        : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                        }`}
                >
                    {i}
                </button>
            );
        }
        return pages;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 py-6">

                <div className="flex gap-6">
                    {/* Sidebar */}
                    <div className={`${isSidebarOpen ? "block" : "hidden"} lg:block fixed lg:static inset-0 lg:inset-auto z-50 lg:z-auto bg-white lg:bg-transparent lg:w-1/4`}>
                        <div className="lg:hidden absolute top-4 right-4">
                            <button
                                onClick={() => setIsSidebarOpen(false)}
                                className="p-2 cursor-pointer"
                            >
                                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="bg-white rounded-lg shadow-sm p-6 h-fit">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Bộ lọc
                            </h3>

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
                                            onChange={() => {
                                                setSelectedCategory("");
                                                setSelectedSubcategory("");
                                                setSelectedColors([]);
                                            }}
                                            className="mr-2"
                                        />
                                        <span className="text-gray-700 text-sm">Tất cả</span>
                                    </label>
                                    {categories.map((category) => (
                                        <label key={category.id} className="flex items-center cursor-pointer">
                                            <input
                                                type="radio"
                                                name="category"
                                                value={String(category.id)}
                                                checked={String(selectedCategory) === String(category.id)}
                                                onChange={(e) => {
                                                    setSelectedCategory(e.target.value);
                                                    setSelectedSubcategory("");
                                                    setSelectedColors([]);
                                                    // Cập nhật URL query
                                                    const params = new URLSearchParams(searchParams);
                                                    if (e.target.value) {
                                                        params.set('category', e.target.value);
                                                    } else {
                                                        params.delete('category');
                                                    }
                                                    params.delete('subcategory');
                                                    setSearchParams(params);
                                                }}
                                                className="mr-2"
                                            />
                                            <span className="text-gray-700 text-sm">{category.name}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Subcategory Filter for Accessories */}
                            {selectedCategory === "3" && (
                                <div className="mb-6">
                                    <h4 className="text-md font-medium text-gray-800 mb-3">Loại phụ kiện</h4>
                                    <div className="space-y-2">
                                        <label className="flex items-center cursor-pointer">
                                            <input
                                                type="radio"
                                                name="subcategory"
                                                value=""
                                                checked={!selectedSubcategory}
                                                onChange={() => {
                                                    setSelectedSubcategory("");
                                                    setSelectedColors([]);
                                                }}
                                                className="mr-2"
                                            />
                                            <span className="text-gray-700 text-sm">Tất cả phụ kiện</span>
                                        </label>
                                        <label className="flex items-center cursor-pointer">
                                            <input
                                                type="radio"
                                                name="subcategory"
                                                value="socks"
                                                checked={selectedSubcategory === "socks"}
                                                onChange={(e) => {
                                                    setSelectedSubcategory(e.target.value);
                                                    setSelectedColors([]);
                                                }}
                                                className="mr-2"
                                            />
                                            <span className="text-gray-700 text-sm">Tất</span>
                                        </label>
                                        <label className="flex items-center cursor-pointer">
                                            <input
                                                type="radio"
                                                name="subcategory"
                                                value="bag"
                                                checked={selectedSubcategory === "bag"}
                                                onChange={(e) => {
                                                    setSelectedSubcategory(e.target.value);
                                                    setSelectedColors([]);
                                                }}
                                                className="mr-2"
                                            />
                                            <span className="text-gray-700 text-sm">Túi</span>
                                        </label>
                                    </div>
                                </div>
                            )}

                            {/* Color Filter */}
                            <div className="mb-6">
                                <h4 className="text-md font-medium text-gray-800 mb-3">Màu sắc</h4>
                                <div className="grid grid-cols-4 gap-2">
                                    {[
                                        { name: "Đen", value: "#000000" },
                                        { name: "Trắng", value: "#FFFFFF" },
                                        { name: "Nâu", value: "#8B4513" },
                                        { name: "Xanh navy", value: "#000080" },
                                        { name: "Đỏ", value: "#FF0000" },
                                        { name: "Xám", value: "#808080" },
                                        { name: "Be", value: "#F5F5DC" },
                                        { name: "Hồng", value: "#FFC0CB" },
                                    ].map((color) => (
                                        <div
                                            key={color.name}
                                            onClick={() => handleColorToggle(color.name)}
                                            className={`w-8 h-8 rounded-full border-2 cursor-pointer ${selectedColors.includes(color.name)
                                                ? "border-red-500 ring-2 ring-red-200"
                                                : "border-gray-300"
                                                }`}
                                            style={{ backgroundColor: color.value }}
                                            title={color.name}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Price Range */}
                            <div className="mb-6">
                                <h4 className="text-md font-medium text-gray-800 mb-3">Khoảng giá</h4>
                                <div className="space-y-3">
                                    <input
                                        type="range"
                                        min="0"
                                        max="100000000"
                                        step="100000"
                                        value={priceRange[1]}
                                        onChange={(e) =>
                                            setPriceRange([priceRange[0], parseInt(e.target.value)])
                                        }
                                        className="w-full"
                                    />
                                    <div className="flex justify-between text-sm text-gray-600">
                                        <span>{formatPrice(priceRange[0])}</span>
                                        <span>{formatPrice(priceRange[1])}</span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => {
                                    setSelectedCategory("");
                                    setSelectedSubcategory("");
                                    setSelectedColors([]);
                                    setPriceRange([0, 100000000]);
                                }}
                                className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 cursor-pointer"
                            >
                                Xóa bộ lọc
                            </button>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 lg:w-3/4">
                        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div className="text-gray-600">
                                    Hiển thị{" "}
                                    <span className="font-semibold">
                                        {filteredProducts.length > 0 ? startIndex + 1 : 0}-{Math.min(startIndex + productsPerPage, filteredProducts.length)}
                                    </span>{" "}
                                    trong tổng số{" "}
                                    <span className="font-semibold">{filteredProducts.length}</span> sản phẩm
                                </div>
                                <div className="flex items-center gap-4">
                                    {/* Refresh Button */}
                                  
                                    
                                    {/* Test API Button */}

                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-gray-600">Sắp xếp:</span>
                                        <select
                                            value={sortBy}
                                            onChange={(e) => setSortBy(e.target.value)}
                                            className="border border-gray-300 rounded-md px-3 py-1 text-sm cursor-pointer"
                                        >
                                            <option value="newest">Mới nhất</option>
                                            <option value="price-low">Giá thấp đến cao</option>
                                            <option value="price-high">Giá cao đến thấp</option>
                                        </select>
                                    </div>
                                    <button
                                        onClick={() => setIsSidebarOpen(true)}
                                        className="lg:hidden p-2 border border-gray-300 rounded cursor-pointer"
                                    >
                                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            
                          
                        </div>

                        {/* Products Grid */}
                        {!loading && currentProducts.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
                                {currentProducts.map((product) => {
                                    const lowestPrice = getLowestPrice(product.variants);
                                    const highestPrice = getHighestPrice(product.variants);
                                    const hasDiscount = highestPrice > lowestPrice;
                                    const discountPercentage = hasDiscount
                                        ? Math.round(((highestPrice - lowestPrice) / highestPrice) * 100)
                                        : 0;

                                    return (
                                        <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
                                            <Link to={`/products/${product.id}`}>
                                                <div className="relative aspect-square overflow-hidden">
                                                    <img
                                                        src={getMainImage(product)}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                                                    />
                                                    {hasDiscount && (
                                                        <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
                                                            -{discountPercentage}%
                                                        </div>
                                                    )}
                                                </div>
                                            </Link>
                                            <div className="p-4">
                                                <Link to={`/products/${product.id}`}>
                                                    <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2 hover:text-red-600 transition-colors">
                                                        {product.name}
                                                    </h3>
                                                </Link>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="text-lg font-bold text-red-600">
                                                        {formatPrice(lowestPrice)}
                                                    </span>
                                                    {hasDiscount && (
                                                        <span className="text-sm text-gray-500 line-through">
                                                            {formatPrice(highestPrice)}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex flex-col gap-1">
                                                        <div className="flex items-center gap-1">
                                                            {productRatings[product.id] ? (
                                                                productRatings[product.id].error ? (
                                                                    <div className="flex items-center gap-1">
                                                                        {[...Array(5)].map((_, i) => (
                                                                            <div key={i} className="w-3 h-3 bg-gray-200 rounded"></div>
                                                                        ))}
                                                                        <span className="text-xs text-gray-400 ml-1">Lỗi tải dữ liệu</span>
                                                                    </div>
                                                                ) : (
                                                                    <>
                                                                        {renderRatingStars(productRatings[product.id]?.averageRating || 0)}
                                                                        <span className="text-xs text-gray-500 ml-1">
                                                                            {productRatings[product.id]?.averageRating > 0 
                                                                                ? `(${productRatings[product.id].averageRating})`
                                                                                : '(Chưa có đánh giá)'
                                                                            }
                                                                        </span>
                                                                    </>
                                                                )
                                                            ) : (
                                                                <div className="flex items-center gap-1">
                                                                    {[...Array(5)].map((_, i) => (
                                                                        <div key={i} className="w-3 h-3 bg-gray-200 rounded animate-pulse"></div>
                                                                    ))}
                                                                    <span className="text-xs text-gray-400 ml-1">Đang tải...</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                        {productRatings[product.id]?.reviewCount > 0 && !productRatings[product.id]?.error && (
                                                            <div className="text-xs text-gray-500">
                                                                {productRatings[product.id].reviewCount} đánh giá
                                                                {productRatings[product.id]?.soldCount > 0 && (
                                                                    <span className="ml-2">• Đã bán {productRatings[product.id].soldCount}</span>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <button 
                                                        onClick={() => handleAddToCart(product)}
                                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all cursor-pointer"
                                                        title="Thêm vào giỏ hàng"
                                                    >
                                                        <i className="ri-shopping-cart-line text-lg"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : !loading ? (
                            <div className="text-center py-12">
                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" />
                                </svg>
                                <h3 className="mt-2 text-sm font-medium text-gray-900">
                                    {searchQuery ? `Không tìm thấy sản phẩm cho "${searchQuery}"` : 'Không tìm thấy sản phẩm'}
                                </h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    {searchQuery ? 'Thử tìm kiếm với từ khóa khác hoặc điều chỉnh bộ lọc.' : 'Thử điều chỉnh bộ lọc của bạn.'}
                                </p>
                            </div>
                        ) : null}

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="bg-white rounded-lg shadow-sm p-4">
                                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                                    <div className="text-sm text-gray-600">
                                        Trang {currentPage} / {totalPages}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                            disabled={currentPage === 1}
                                            className="px-3 py-2 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                        >
                                            <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                            </svg>
                                            Trước
                                        </button>
                                        <div className="hidden sm:flex">{renderPagination()}</div>
                                        <button
                                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                            disabled={currentPage === totalPages}
                                            className="px-3 py-2 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                        >
                                            Sau
                                            <svg className="w-4 h-4 inline ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile Sidebar Overlay */}
                {isSidebarOpen && (
                    <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setIsSidebarOpen(false)} />
                )}
            </div>
        </div>
    );
};

export default ProductPage;