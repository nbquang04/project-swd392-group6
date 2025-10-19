import React, { useContext, useEffect, useRef, useState } from 'react';
import '../index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { fetchProduct } from '../service/product.js';
import { ShoeShopContext } from '../context/ShoeShopContext.js';
import { fetchCart } from '../service/cart.js';








const Header1 = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [isSearchSubmitted, setIsSearchSubmitted] = useState(false);

  // Cart from context
  const { carts, setCart, handleGoTop } = useContext(ShoeShopContext);
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch {
      return null;
    }
  })();

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchCart();
        setCart(data);
      } catch (e) {
        console.error('Fetch cart error:', e);
      }
    };
    load();
  }, [user?.id, setCart]);

  // Load all products for search filtering
  useEffect(() => {
    const loadAllProducts = async () => {
      try {
        const products = await fetchProduct();
        setAllProducts(products || []);
      } catch (error) {
        console.error('Error loading products:', error);
        setAllProducts([]);
      }
    };
    loadAllProducts();
  }, []);

  const userCarts = Array.isArray(carts)
    ? carts.filter((cart) => String(cart.user_id) === String(user?.id))
    : [];

  const cartCount = userCarts.reduce((sum, cart) => sum + (cart.items?.length || 0), 0);

  // Sync search query from URL when on product page
  useEffect(() => {
    if (location.pathname === '/products') {
      const searchFromUrl = searchParams.get('search');
      if (searchFromUrl) {
        setSearchQuery(searchFromUrl);
      } else {
        setSearchQuery('');
      }
    }
  }, [location, searchParams]);

  // Search outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Text normalization functions
  const normalizeText = (str = "") =>
    str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  const SOCK_REGEX = /(^|[^a-z0-9])(tat|vo|sock)([^a-z0-9]|$)/i;

  const isSockQuery = (query = "") => SOCK_REGEX.test(normalizeText(query));

  const isSockProduct = (product) => {
    const text = normalizeText(`${product?.name || ""} ${product?.description || ""}`);
    return String(product?.category_id) === "3" && SOCK_REGEX.test(text);
  };

  // Enhanced search with same logic as ProductPage
  const searchProductsWithFilter = (query, products) => {
    if (!query.trim() || query.trim().length < 2) {
      return [];
    }

    const normalizedQuery = normalizeText(query);
    let filtered = [...products];

    filtered = filtered.filter(product => {
      const name = normalizeText(product.name);
      const productDesc = normalizeText(product.description || '');
      const variantText = product.variants?.map(v =>
        normalizeText(`${v.sku || ''} ${v.color_code || ''}`)
      ).join(' ') || '';

      const searchText = `${name} ${productDesc} ${variantText}`;

      return searchText.includes(normalizedQuery) ||
        name.includes(normalizedQuery) ||
        productDesc.includes(normalizedQuery);
    });

    if (isSockQuery(query)) {
      const socks = filtered.filter(isSockProduct);
      const nonSocks = filtered.filter(product => !isSockProduct(product));
      filtered = [...socks, ...nonSocks];
    }

    return filtered;
  };

  // Live search
  useEffect(() => {
    if (isSearchSubmitted) return; // Nếu vừa submit thì không show dropdown
    const searchProductsAsync = async () => {
      if (searchQuery.trim().length >= 2) {
        setIsSearching(true);
        try {
          const results = searchProductsWithFilter(searchQuery, allProducts);
          setSearchResults(results || []);
          setShowSearchResults(true);
        } catch (error) {
          console.error('Search error:', error);
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
        setShowSearchResults(false);
      }
    };
    const timeoutId = setTimeout(searchProductsAsync, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, allProducts, isSearchSubmitted]);


  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchSubmitted(true); // đánh dấu vừa submit
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearchResults(false);
      if (location.pathname !== '/products') {
        setSearchQuery('');
      }
    }
  };

  const handleSearchResultClick = (productId) => {
    navigate(`/products/${productId}`);
    setShowSearchResults(false);
    setSearchQuery('');
  };

  const handleSearchQueryChange = (value) => {
    setIsSearchSubmitted(false); // reset khi gõ mới
    setSearchQuery(value);
    if (location.pathname === '/products') {
      const newSearchParams = new URLSearchParams(searchParams);
      if (value) {
        newSearchParams.set('search', value);
      } else {
        newSearchParams.delete('search');
      }
      navigate(`/products?${newSearchParams.toString()}`, { replace: true });
    }
  };


  const clearSearch = () => {
    setSearchQuery('');
    if (location.pathname === '/products') {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete('search');
      navigate(`/products?${newSearchParams.toString()}`, { replace: true });
    }
  };

  const formatPrice = (price) => {
    return price.toLocaleString('vi-VN') + '₫';
  };

  const getMainImage = (product) => {
    if (product.images && product.images.length > 0) {
      return product.images[0];
    }
    if (product.variants && product.variants.length > 0) {
      const firstVariant = product.variants[0];
      if (firstVariant.images && firstVariant.images.length > 0) {
        return firstVariant.images[0];
      }
    }
    return '/images/logo.jpg';
  };

  const getLowestPrice = (variants) => {
    if (!variants || variants.length === 0) return 0;
    return Math.min(...variants.map(variant => variant.price));
  };

  // Helper function to check if current page is active
  const isActivePage = (path) => {
    if (path === '/home') {
      return location.pathname === '/home' || location.pathname === '/';
    }
    if (path === '/products') {
      return location.pathname === '/products' || location.pathname.startsWith('/products/');
    }
    if (path === '/about') {
      return location.pathname === '/about';
    }
    return location.pathname === path;
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">

      {/* Main header */}
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Mobile menu + Logo */}
            <div className="flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
              >
                <i className="ri-menu-line text-xl"></i>
              </button>

              <Link onClick={handleGoTop} to="/home" className="ml-4 lg:ml-0">
                <div className="flex items-center space-x-2">
                  <span className="text-xl font-bold text-gray-900 hidden sm:block" style={{ fontFamily: 'Pacifico, serif' }}>
                    UNITSUKA TIGER
                  </span>
                </div>
              </Link>
            </div>

            {/* Center: Search Bar */}
            <div className="flex-1 max-w-2xl mx-4 lg:mx-8" ref={searchRef}>
              <form onSubmit={handleSearchSubmit} className="relative">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearchQueryChange(e.target.value)}
                    placeholder="Tìm kiếm sản phẩm, thương hiệu..."
                    className="w-full h-8 px-4 pl-12 pr-20 text-base border border-gray-200 rounded-full focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                  />

                  {/* Clear button */}
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={clearSearch}
                      className="absolute right-8 top-1/2 transform -translate-y-1/2 p-2 text-gray-500 rounded-full transition-colors duration-200"
                    >
                      <i
                        className="ri-close-line text-md"></i>
                    </button>
                  )}

                  {/* Search button */}
                  <button
                    type="submit"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 w-6 h-6 flex items-center justify-center bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-200 "
                  >
                    <i className="ri-search-line text-sm"></i>
                  </button>
                </div>

                {/* Search results dropdown */}
                {showSearchResults && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                    {isSearching ? (
                      <div className="p-4 text-center text-gray-500">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600 mx-auto mb-2"></div>
                        Đang tìm kiếm...
                      </div>
                    ) : searchResults.length > 0 ? (
                      <div>
                        {searchResults.slice(0, 6).map((product) => {
                          const lowestPrice = getLowestPrice(product.variants);
                          return (
                            <div
                              key={product.id}
                              onClick={() => handleSearchResultClick(product.id)}
                              className="flex items-center p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                            >
                              <img
                                src={getMainImage(product)}
                                alt={product.name}
                                className="w-14 h-14 object-cover rounded-lg mr-4 border border-gray-200"
                                onError={(e) => {
                                  e.target.src = '/images/logo.jpg';
                                }}
                              />
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-medium text-gray-900 truncate mb-1">{product.name}</h4>
                                <p className="text-sm text-red-600 font-semibold">
                                  {lowestPrice > 0 ? formatPrice(lowestPrice) : 'Liên hệ'}
                                </p>
                              </div>
                              <i className="ri-arrow-right-s-line text-lg text-gray-400"></i>
                            </div>
                          );
                        })}
                        {searchResults.length > 6 && (
                          <div className="p-4 text-center border-t border-gray-100 bg-gray-50">
                            <button
                              onClick={handleSearchSubmit}
                              className="text-sm text-red-600 hover:text-red-700 font-medium hover:underline"
                            >
                              Xem tất cả {searchResults.length} kết quả →
                            </button>
                          </div>
                        )}
                      </div>
                    ) : searchQuery.trim().length >= 2 ? (
                      <div className="p-6 text-center">
                        <i className="ri-search-2-line text-4xl text-gray-300 mb-4 block"></i>
                        <p className="text-gray-500 text-sm">Không tìm thấy sản phẩm nào</p>
                        <p className="text-gray-400 text-xs mt-1">Thử tìm kiếm với từ khóa khác</p>
                      </div>
                    ) : null}
                  </div>
                )}
              </form>
            </div>

            {/* Right: User actions */}
            <div className="flex items-center space-x-4">
              {/* Desktop navigation links - hidden on mobile */}
              <nav className="hidden lg:flex items-center space-x-6 mr-4">
                <Link
                  onClick={handleGoTop}
                  to="/home"
                  className={`text-sm font-medium transition-colors ${isActivePage('/home')
                    ? 'text-red-600'
                    : 'text-gray-700 hover:text-red-600'
                    }`}
                >
                  Trang chủ
                </Link>
                <Link
                  to="/products"
                  className={`text-sm font-medium transition-colors ${isActivePage('/products')
                    ? 'text-red-600'
                    : 'text-gray-700 hover:text-red-600'
                    }`}
                >
                  Sản phẩm
                </Link>
                <Link
                  to="/about"
                  className={`text-sm font-medium transition-colors ${isActivePage('/about')
                    ? 'text-red-600'
                    : 'text-gray-700 hover:text-red-600'
                    }`}
                >
                  Giới thiệu
                </Link>
              </nav>

              {/* User account */}
              <Link
                onClick={handleGoTop}
                to="/profile"
                className={`p-2 rounded-full transition-all ${isActivePage('/profile')
                  ? 'text-red-600 bg-red-50'
                  : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
                  }`}
                title="Tài khoản"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </Link>



              {/* Cart */}
              <Link
                to="/cart"
                className={`relative p-2 rounded-full transition-all ${isActivePage('/cart')
                  ? 'text-red-600 bg-red-50'
                  : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
                  }`}
                title={`Giỏ hàng (${cartCount})`}
              >
                <div className="relative">
                  <i className="ri-shopping-bag-line text-xl"></i>
                  {cartCount > 0 && (
                    <span
                      className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center font-medium shadow-md"
                      style={{
                        fontSize: '11px',
                        lineHeight: '1',
                        zIndex: 10
                      }}
                    >
                      {cartCount > 99 ? '99+' : cartCount}
                    </span>
                  )}
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200">
          <div className="px-4 py-4 space-y-4 bg-white">
            <nav className="space-y-3">
              <Link
                to="/home"
                className={`block text-base font-medium transition-colors py-2 ${isActivePage('/home')
                  ? 'text-red-600'
                  : 'text-gray-900 hover:text-red-600'
                  }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Trang chủ
              </Link>
              <Link
                to="/products"
                className={`block text-base font-medium transition-colors py-2 ${isActivePage('/products')
                  ? 'text-red-600'
                  : 'text-gray-900 hover:text-red-600'
                  }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sản phẩm
              </Link>
              <Link
                to="/about"
                className={`block text-base font-medium transition-colors py-2 ${isActivePage('/about')
                  ? 'text-red-600'
                  : 'text-gray-900 hover:text-red-600'
                  }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Giới thiệu
              </Link>

              {/* Mobile subcategories */}
              <div className="pl-4 space-y-2 border-l-2 border-gray-200">
                <div className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Phụ kiện</div>
                <Link
                  to="/products?category=3&subcategory=socks"
                  className="block text-sm text-gray-700 hover:text-red-600 transition-colors py-1"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Tất/Vớ
                </Link>
                <Link
                  to="/products?category=3&subcategory=bag"
                  className="block text-sm text-gray-700 hover:text-red-600 transition-colors py-1"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Túi xách
                </Link>
              </div>
            </nav>

          </div>
        </div>
      )}
    </header>
  );
};

export default Header1;