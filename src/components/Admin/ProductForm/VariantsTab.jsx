import React, { useMemo } from 'react';
import VariantsTable from './VariantsTable';



export default function VariantsTab({
  variants,
  control,
  errors,
  handleVariantImageChange,
  handleRemoveVariantImage,
  watch,
  setValue,
  generateSKU,
  colorMapping,
  getSizeNumber
}) {
  // Watch form values để lấy category_id
  const watchedValues = watch();

  // Xác định loại sản phẩm dựa trên category_id
  const getProductType = () => {
    if (!watchedValues?.category_id) return null;

    const categoryId = Number(watchedValues.category_id);
    if (categoryId === 1) return 'shoes'; // Giày
    if (categoryId === 2) return 'sandals'; // Dép
    if (categoryId === 3) return 'accessories'; // Phụ kiện
    return null;
  };

  const productType = getProductType();

  // Danh sách size theo loại sản phẩm
  const getSizeOptions = () => {
    switch (productType) {
      case 'shoes':
      case 'sandals':
        return ["35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47", "48"];
      case 'accessories':
        return ["XS", "S", "M", "L", "XL", "XXL", "Standard", "Small", "Medium", "Large", "One Size"];
      default:
        return ["35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47", "48", "XS", "S", "M", "L", "XL", "XXL", "Standard", "Small", "Medium", "Large", "One Size"];
    }
  };

  // Danh sách màu sắc
  const colorOptions = [
    { name: "Đen", code: "#000000" },
    { name: "Trắng", code: "#FFFFFF" },
    { name: "Xanh dương", code: "#0066CC" },
    { name: "Xanh lá", code: "#00FF00" },
    { name: "Đỏ", code: "#FF0000" },
    { name: "Vàng", code: "#FFFF00" },
    { name: "Cam", code: "#FFA500" },
    { name: "Tím", code: "#800080" },
    { name: "Hồng", code: "#FFC0CB" },
    { name: "Nâu", code: "#A52A2A" },
    { name: "Xám", code: "#808080" },
    { name: "Be", code: "#F5F5DC" },
    { name: "Xanh navy", code: "#000080" },
    { name: "Xanh mint", code: "#98FF98" },
    { name: "Đỏ đậm", code: "#8B0000" },
    { name: "Vàng đậm", code: "#FFD700" },
    { name: "Xám đậm", code: "#696969" },
    { name: "Xám nhạt", code: "#D3D3D3" }
  ];

  // Hàm thêm biến thể thủ công
  const handleAddManualVariant = () => {
    const currentVariants = watchedValues.variants || [];
    const name = watchedValues.name || "PROD";
    const newVariant = {
      key: Date.now(), // Unique key
      sku: generateSKU(name, { color_code: "#000000", size: "35" }) || `SKU-${Date.now()}`,
      color_code: "#000000",
      size: "35",
      price: 0,
      cost_price: 0,
      stock_quantity: 1,
      images: []
    };

    setValue("variants", [...currentVariants, newVariant]);
  };

  // Hàm xóa biến thể
  const handleRemoveVariant = (variantKey) => {
    const currentVariants = watchedValues.variants || [];
    setValue("variants", currentVariants.filter(v => v.key !== variantKey));
  };

  // Tính toán tổng quan biến thể
  const variantsSummary = useMemo(() => {
    if (!variants.length) return null;

    const totalVariants = variants.length;
    const totalStock = variants.reduce((sum, variant) => sum + (Number(variant.stock_quantity) || 0), 0);
    const minPrice = Math.min(...variants.map(v => Number(v.price) || 0));
    const maxPrice = Math.max(...variants.map(v => Number(v.price) || 0));

    const uniqueColors = new Set(variants.map(v => v.color_code));
    const uniqueSizes = new Set(variants.map(v => v.size));

    return {
      totalVariants,
      totalStock,
      minPrice,
      maxPrice,
      uniqueColors: uniqueColors.size,
      uniqueSizes: uniqueSizes.size
    };
  }, [variants]);

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
        <span className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600">2</span>
        Biến thể sản phẩm
      </h2>

      {/* Variants Summary */}
      {variantsSummary && variants && variants.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">📊 Tóm tắt biến thể</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Tổng số biến thể:</p>
              <p className="text-2xl font-semibold text-gray-900">{variantsSummary.totalVariants}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Tổng tồn kho:</p>
              <p className="text-2xl font-semibold text-gray-900">{variantsSummary.totalStock.toLocaleString('vi-VN')}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Khoảng giá:</p>
              <p className="text-2xl font-semibold text-gray-900">
                {variantsSummary.minPrice === variantsSummary.maxPrice 
                  ? `${variantsSummary.minPrice.toLocaleString('vi-VN')}₫`
                  : `${variantsSummary.minPrice.toLocaleString('vi-VN')}₫ - ${variantsSummary.maxPrice.toLocaleString('vi-VN')}₫`
                }
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Số màu sắc:</p>
              <p className="text-2xl font-semibold text-gray-900">{variantsSummary.uniqueColors}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Số kích thước:</p>
              <p className="text-2xl font-semibold text-gray-900">{variantsSummary.uniqueSizes}</p>
            </div>
          </div>
        </div>
      )}

      {/* Thông báo loại sản phẩm */}
      {productType && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
            <span className="text-lg">ℹ️</span>
            Loại sản phẩm: {productType === 'shoes' ? 'Giày' : productType === 'sandals' ? 'Dép' : 'Phụ kiện'}
          </h4>
          <div className="text-sm text-blue-700">
            {productType === 'shoes' && "• Hỗ trợ size số từ 35-48"}
            {productType === 'sandals' && "• Hỗ trợ size số từ 35-48"}
            {productType === 'accessories' && "• Hỗ trợ size chữ (M, L, XL, Standard) và One Size"}
          </div>
        </div>
      )}

      {/* Hướng dẫn */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h4 className="font-medium text-blue-800 mb-3 flex items-center gap-2">
          <span className="text-lg">💡</span>
          Hướng dẫn tạo biến thể
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
          <div>
            <p className="font-medium mb-2">🎨 Tự động từ options:</p>
            <ul className="space-y-1">
              <li>• Đặt tên tùy chọn là "Màu sắc" hoặc "Color"</li>
              <li>• Đặt tên tùy chọn là "Kích thước" hoặc "Size"</li>
              <li>• Hệ thống sẽ tự động sinh variants</li>
              <li>• Size sẽ tự động theo loại sản phẩm</li>
            </ul>
          </div>
          <div>
            <p className="font-medium mb-2">➕ Thêm thủ công:</p>
            <ul className="space-y-1">
              <li>• Click "Thêm biến thể" để tạo từng variant</li>
              <li>• Chọn màu sắc từ dropdown</li>
              <li>• Chọn kích thước phù hợp</li>
              <li>• Chỉnh sửa SKU, giá, tồn kho</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Manual Variants Section */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium text-gray-800 flex items-center gap-2">
            <span className="text-lg">📦</span>
            Quản lý biến thể ({variants ? variants.length : 0} biến thể)
          </h3>
          <button
            type="button"
            onClick={handleAddManualVariant}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center gap-2"
          >
            <span className="text-lg">+</span>
            Thêm biến thể
          </button>
        </div>

      {/* Variants Table */}
        {variants && variants.length > 0 ? (
        <VariantsTable 
          variants={variants} 
            onRemoveVariant={handleRemoveVariant}
            onVariantImageChange={handleVariantImageChange}
            onRemoveVariantImage={handleRemoveVariantImage}
            colorOptions={colorOptions}
            sizeOptions={getSizeOptions()}
            productType={productType}
            control={control}
            errors={errors}
            setValue={setValue}
            generateSKU={generateSKU}
            colorMapping={colorMapping}
            getSizeNumber={getSizeNumber}
          />
        ) : (
          <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
            <div className="text-gray-400 mb-2">
              <svg className="mx-auto h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="text-gray-600 font-medium">Chưa có biến thể nào</p>
            <p className="text-gray-500 text-sm">
              {productType ? 
                `Tạo tùy chọn hoặc thêm biến thể thủ công cho ${productType === 'shoes' ? 'giày' : productType === 'sandals' ? 'dép' : 'phụ kiện'}` : 
                'Vui lòng chọn danh mục sản phẩm trước'
              }
            </p>
            <button
              type="button"
              onClick={handleAddManualVariant}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2 mx-auto"
            >
              <span className="text-lg">+</span>
              Thêm biến thể đầu tiên
            </button>
          </div>
        )}
      </div>

      {/* Summary */}
      {variants && variants.length > 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="font-medium text-gray-800 mb-3">📊 Tóm tắt biến thể</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Tổng biến thể:</span>
              <span className="font-medium text-gray-800 ml-2">{variants.length}</span>
            </div>
            <div>
              <span className="text-gray-600">Tổng tồn kho:</span>
              <span className="font-medium text-gray-800 ml-2">
                {variants.reduce((sum, v) => sum + (Number(v.stock_quantity) || 0), 0)}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Giá bán TB:</span>
              <span className="font-medium text-gray-800 ml-2">
                {Math.round(variants.reduce((sum, v) => sum + (Number(v.price) || 0), 0) / variants.length).toLocaleString()}₫
              </span>
            </div>
            <div>
              <span className="text-gray-600">Giá nhập TB:</span>
              <span className="font-medium text-gray-800 ml-2">
                {Math.round(variants.reduce((sum, v) => sum + (Number(v.cost_price) || 0), 0) / variants.length).toLocaleString()}₫
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
