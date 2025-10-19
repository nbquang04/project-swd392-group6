import React from 'react';
import { Controller } from 'react-hook-form';
import ColorDropdown from './ColorDropdown';
import SizeDropdown from './SizeDropdown';
import VariantImageManager from './VariantImageManager';






export default function VariantsTable({
  variants,
  onRemoveVariant,
  onVariantImageChange,
  onRemoveVariantImage,
  colorOptions,
  sizeOptions,
  productType,
  control,
  errors,
  setValue,
  generateSKU,
  colorMapping,
  getSizeNumber
}) {

  if (!variants || variants.length === 0) {
    return (
      <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
        <div className="text-gray-400 mb-2">
          <svg className="mx-auto h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48">
            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <p className="text-gray-600 font-medium">Chưa có biến thể nào</p>
        <p className="text-gray-500 text-sm">Vui lòng thêm biến thể để tiếp tục</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg">
      {/* BỎ overflow-hidden khỏi table để không chặn dropdown */}
      <table className="w-full border border-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200 w-24">STT</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200 w-32">SKU</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200 w-32">Màu sắc</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200 w-32">Kích thước</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200 w-28">Giá bán</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200 w-28">Giá nhập</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200 w-28">Tồn kho</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200 w-48">Hình ảnh</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200 w-24">Thao tác</th>
          </tr>
        </thead>

        {/* Ép overflow:visible để menu không bị cắt bởi tbody */}
        <tbody className="bg-white divide-y divide-gray-200 [overflow:visible]">
          {variants.map((variant, index) => (
            <tr key={variant.key} className="hover:bg-gray-50">
              {/* STT */}
              <td className="px-4 py-3 text-sm text-gray-900 border-b border-gray-200">{index + 1}</td>

              {/* SKU */}
              <td className="px-4 py-3 border-b border-gray-200">
                <Controller
                  name={`variants.${index}.sku`}
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      className={`w-full px-3 py-2 border rounded-md text-sm ${
                        errors?.variants?.[index]?.sku ? 'border-red-500' : 'border-gray-300'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      placeholder="SKU..."
                    />
                  )}
                />
                {errors?.variants?.[index]?.sku && (
                  <p className="mt-1 text-xs text-red-600">{errors.variants[index].sku.message}</p>
                )}
              </td>

              {/* Màu sắc */}
              {/* relative + overflow-visible để menu position:absolute thoát ra ngoài */}
              <td className="px-4 py-3 border-b border-gray-200 relative overflow-visible">
                <Controller
                  name={`variants.${index}.color_code`}
                  control={control}
                  render={({ field }) => (
                    <ColorDropdown
                      value={field.value}
                      onChange={(value) => {
                        field.onChange(value);
                      }}
                      colorOptions={colorOptions}
                      dropdownClassName="absolute top-full left-0 z-[9999] bg-white border border-gray-300 rounded shadow-lg"
                    />
                  )}
                />
                {errors?.variants?.[index]?.color_code && (
                  <p className="mt-1 text-xs text-red-600">{errors.variants[index].color_code.message}</p>
                )}
              </td>

              {/* Kích thước */}
              <td className="px-4 py-3 border-b border-gray-200 relative overflow-visible">
                <Controller
                  name={`variants.${index}.size`}
                  control={control}
                  render={({ field }) => (
                    <SizeDropdown
                      value={field.value}
                      onChange={(value) => {
                        field.onChange(value);
                      }}
                      sizeOptions={sizeOptions}
                      productType={productType}
                      dropdownClassName="absolute top-full left-0 z-[9999] bg-white border border-gray-300 rounded shadow-lg"
                    />
                  )}
                />
                {errors?.variants?.[index]?.size && (
                  <p className="mt-1 text-xs text-red-600">{errors.variants[index].size.message}</p>
                )}
              </td>

              {/* Giá bán */}
              <td className="px-4 py-3 border-b border-gray-200">
                <Controller
                  name={`variants.${index}.price`}
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="number"
                      value={field.value || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value === "" ? "" : Number(value));
                      }}
                      className={`w-full px-3 py-2 border rounded-md text-sm ${
                        errors?.variants?.[index]?.price ? 'border-red-500' : 'border-gray-300'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      placeholder="0"
                      min="0"
                    />
                  )}
                />
                {errors?.variants?.[index]?.price && (
                  <p className="mt-1 text-xs text-red-600">{errors.variants[index].price.message}</p>
                )}
              </td>

              {/* Giá nhập */}
              <td className="px-4 py-3 border-b border-gray-200">
                <Controller
                  name={`variants.${index}.cost_price`}
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="number"
                      value={field.value || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value === "" ? "" : Number(value));
                      }}
                      className={`w-full px-3 py-2 border rounded-md text-sm ${
                        errors?.variants?.[index]?.cost_price ? 'border-red-500' : 'border-gray-300'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      placeholder="0"
                      min="0"
                    />
                  )}
                />
                {errors?.variants?.[index]?.cost_price && (
                  <p className="mt-1 text-xs text-red-600">{errors.variants[index].cost_price.message}</p>
                )}
              </td>

              {/* Tồn kho */}
              <td className="px-4 py-3 border-b border-gray-200">
                <Controller
                  name={`variants.${index}.stock_quantity`}
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="number"
                      value={field.value || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value === "" ? "" : Number(value));
                      }}
                      className={`w-full px-3 py-2 border rounded-md text-sm ${
                        errors?.variants?.[index]?.stock_quantity ? 'border-red-500' : 'border-gray-300'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      placeholder="0"
                      min="0"
                    />
                  )}
                />
                {errors?.variants?.[index]?.stock_quantity && (
                  <p className="mt-1 text-xs text-red-600">{errors.variants[index].stock_quantity.message}</p>
                )}
              </td>

              {/* Hình ảnh */}
              <td className="px-4 py-3 border-b border-gray-200">
                <div className="max-w-xs">
                  <VariantImageManager
                    variants={[variant]}
                    handleVariantImageChange={(e) => {
                      onVariantImageChange(variant.key, e);
                    }}
                    handleRemoveVariantImage={(vIndex, imgIdx) => {
                      onRemoveVariantImage(variant.key, imgIdx);
                    }}
                  />
                </div>
              </td>

              {/* Thao tác */}
              <td className="px-4 py-3 border-b border-gray-200">
                <button
                  type="button"
                  onClick={() => onRemoveVariant(variant.key)}
                  className="text-red-600 hover:text-red-800 transition-colors"
                  title="Xóa biến thể"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
