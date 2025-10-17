import React, { useContext, useState, useEffect } from "react";
import { FaPlus, FaSearch } from "react-icons/fa";
import { PackageIcon, Loader2, AlertCircle, Trash2, Edit } from "lucide-react";
import { ShoesShopContext } from "../../context/ShoeShopContext";
import { useNotification } from "../../context/NotificationContext";
import { Link } from "react-router-dom";
import SideBarAdmin from '../../components/SideBarAdmin';

// Confirm Dialog Component
const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, confirmText, cancelText, type = "warning" }) => {
  if (!isOpen) return null;

  const getButtonStyle = () => {
    switch (type) {
      case "danger":
        return "bg-red-600 hover:bg-red-700 text-white";
      case "warning":
        return "bg-yellow-600 hover:bg-yellow-700 text-white";
      case "success":
        return "bg-green-600 hover:bg-green-700 text-white";
      default:
        return "bg-blue-600 hover:bg-blue-700 text-white";
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center mb-4">
          <AlertCircle className={`w-6 h-6 mr-3 ${
            type === "danger" ? "text-red-600" : 
            type === "warning" ? "text-yellow-600" : 
            "text-blue-600"
          }`} />
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        
        <p className="text-gray-600 mb-6">{message}</p>
        
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            {cancelText || "Hủy"}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded-lg transition-colors ${getButtonStyle()}`}
          >
            {confirmText || "Xác nhận"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function ProductManagement() {
  const {
    productsRoot,
    categories,
    setProductsRoot,
  } = useContext(ShoesShopContext);

  const { showSuccess, showError } = useNotification();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  
  // Confirm dialog states
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: '',
    cancelText: '',
    type: 'warning',
    onConfirm: null
  });

  // Filtered products based on search and category
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Load products when component mounts
  useEffect(() => {
    if (productsRoot && Array.isArray(productsRoot)) {
      setFilteredProducts(productsRoot);
      setLoading(false);
    }
  }, [productsRoot]);

  // Update filtered products when search or category changes
  useEffect(() => {
    if (!productsRoot || !Array.isArray(productsRoot)) return;

    let filtered = productsRoot;

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter(product => 
        String(product.category_id) === String(selectedCategory)
      );
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(product => 
        product.name?.toLowerCase().includes(term) ||
        product.description?.toLowerCase().includes(term) ||
        product.sku?.toLowerCase().includes(term)
      );
    }

    setFilteredProducts(filtered);
  }, [productsRoot, selectedCategory, searchTerm]);

  // Handle search
  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  // Handle category filter
  const handleCategoryFilter = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  // Handle delete product with confirmation
  const handleDeleteProduct = (product) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Xác nhận xóa sản phẩm',
      message: `Bạn có chắc chắn muốn xóa sản phẩm "${product.name}"? Hành động này không thể hoàn tác.`,
      confirmText: 'Xóa sản phẩm',
      cancelText: 'Hủy',
      type: 'danger',
      onConfirm: async () => {
        try {
          // Call API to delete the product
          const response = await fetch(`http://localhost:9999/products/${product.id}`, {
            method: 'DELETE',
          });

          if (response.ok) {
            // Update local state
            const updatedProducts = productsRoot.filter(p => p.id !== product.id);
            setProductsRoot(updatedProducts);
            
            showSuccess('Đã xóa sản phẩm thành công!');
          } else {
            throw new Error('Không thể xóa sản phẩm');
          }
        } catch (error) {
          console.error("Error deleting product:", error);
          showError('Lỗi khi xóa sản phẩm: ' + error.message);
        }
        
        setConfirmDialog({ ...confirmDialog, isOpen: false });
      }
    });
  };

  // Get category name by ID
  const getCategoryName = (categoryId) => {
    const category = categories?.find(cat => String(cat.id) === String(categoryId));
    return category ? category.name : "Unknown";
  };

  // Get product display price
  const getProductPrice = (product) => {
    if (product.variants && Array.isArray(product.variants) && product.variants.length > 0) {
      const prices = product.variants.map(v => Number(v.price) || 0).filter(p => p > 0);
      if (prices.length > 0) {
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        return minPrice === maxPrice ? minPrice : { min: minPrice, max: maxPrice };
      }
    }
    return product.price || 0;
  };

  // Get total stock
  const getTotalStock = (product) => {
    if (product.variants && Array.isArray(product.variants)) {
      return product.variants.reduce((sum, v) => sum + (Number(v.stock_quantity) || 0), 0);
    }
    return product.stock_quantity || 0;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <SideBarAdmin />
      <div className="flex-1 p-8 overflow-y-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <PackageIcon className="w-7 h-7 text-blue-500" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Quản lý sản phẩm</h1>
              <p className="text-sm text-gray-500">
                Kho sản phẩm của bạn
              </p>
            </div>
          </div>
          <Link to="/admin/addProduct">
            <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition-colors">
              <FaPlus /> Thêm sản phẩm
            </button>
          </Link>
        </div>

        {/* Filter + Search */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
            <input
              type="text"
                placeholder="Tìm kiếm theo tên, mô tả, SKU..."
              value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <FaSearch className="absolute top-3 left-3 text-gray-400" />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            <button
                onClick={() => handleCategoryFilter("All")}
                className={`px-4 py-2 rounded-full border transition-colors ${
                  selectedCategory === "All"
                  ? "bg-blue-600 text-white border-blue-600"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300"
                }`}
            >
                Tất cả
            </button>

              {categories?.map((cat) => (
              <button
                key={cat.id}
                  onClick={() => handleCategoryFilter(cat.id)}
                  className={`px-4 py-2 rounded-full border transition-colors ${
                    selectedCategory === cat.id
                    ? "bg-blue-600 text-white border-blue-600"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300"
                  }`}
              >
                {cat.name}
              </button>
            ))}
            </div>
          </div>

          {/* Search Results Info */}
          {searchTerm && (
            <p className="text-sm text-gray-500 mt-3">
              Tìm thấy {filteredProducts.length} sản phẩm
            </p>
          )}
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="text-center py-12">
            <Loader2 className="animate-spin text-blue-500 mx-auto mb-4" size={48} />
            <p className="text-gray-500">Đang tải sản phẩm...</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => {
              const price = getProductPrice(product);
              const totalStock = getTotalStock(product);
            const baseId = String(product.id).split('-')[0];

            return (
              <div
                key={product.id}
                  className="bg-white rounded-xl shadow hover:shadow-lg transition-all duration-200 flex flex-col overflow-hidden border border-gray-100"
              >
                {/* Image */}
                  <div className="relative">
                <img
                      src={product.images?.[0] || '/placeholder-product.jpg'}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.target.src = '/placeholder-product.jpg';
                      }}
                    />
                    
                  </div>

                <div className="p-4 flex flex-col flex-1">
                  {/* Title */}
                    <h3 className="font-bold text-lg mb-2 text-gray-900 line-clamp-2">
                      {product.name}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-sm text-gray-500 mb-3 line-clamp-2 flex-1">
                      {product.description || "Không có mô tả"}
                    </p>

                  {/* Price & Stock */}
                    <div className="flex justify-between items-center mb-3">
                      <div className="text-lg font-bold text-blue-600">
                        {typeof price === 'object' ? (
                          <span>
                            {price.min.toLocaleString()} - {price.max.toLocaleString()} VND
                    </span>
                        ) : (
                          <span>{Number(price).toLocaleString()} VND</span>
                        )}
                      </div>
                      <span className={`text-sm px-2 py-1 rounded-full ${
                        totalStock > 0 
                          ? "bg-green-100 text-green-600" 
                          : "bg-red-100 text-red-600"
                      }`}>
                      Stock: {totalStock}
                    </span>
                  </div>

                  {/* Category & Date */}
                  <div className="flex justify-between items-center text-xs text-gray-400 mb-4">
                    <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                        {getCategoryName(product.category_id)}
                    </span>
                    <span>
                        {product.created_at ? new Date(product.created_at).toLocaleDateString() : "N/A"}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-auto">
                      <Link to={`/admin/editProduct?id=${baseId}`} className="flex-1">
                        <button className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                          <Edit size={16} /> Sửa
                      </button>
                    </Link>
                      
                      
                      
                      <button 
                        className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors"
                        onClick={() => handleDeleteProduct(product)}
                        title="Xóa sản phẩm"
                      >
                        <Trash2 size={16} /> Xóa
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        ) : (
          <div className="text-center py-12">
            <PackageIcon className="mx-auto mb-4 text-gray-400" size={64} />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? "Không tìm thấy sản phẩm" : "Không có sản phẩm nào"}
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm 
                ? `Không có sản phẩm nào khớp với từ khóa "${searchTerm}"`
                : "Bắt đầu thêm sản phẩm đầu tiên của bạn"
              }
            </p>
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("All");
                }}
                className="text-blue-600 hover:text-blue-800 underline"
              >
                Xóa tìm kiếm
              </button>
            )}
          </div>
        )}

        {/* Confirm Dialog */}
        <ConfirmDialog
          isOpen={confirmDialog.isOpen}
          onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
          onConfirm={confirmDialog.onConfirm}
          title={confirmDialog.title}
          message={confirmDialog.message}
          confirmText={confirmDialog.confirmText}
          cancelText={confirmDialog.cancelText}
          type={confirmDialog.type}
        />
      </div>
    </div>
  );
}