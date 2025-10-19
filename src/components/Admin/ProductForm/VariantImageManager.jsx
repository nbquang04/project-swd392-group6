import React from 'react';


export default function VariantImageManager({ variants, handleVariantImageChange, handleRemoveVariantImage }) {
  if (variants.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        <p className="text-sm">Chưa có biến thể</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {variants.map((variant, vIndex) => (
        <div key={variant.key} className="space-y-2">
          {/* Variant Info */}
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <span className="font-medium">Variant:</span>
            {Object.entries(variant)
              .filter(([k]) => k !== "key" && !["sku", "price", "cost_price", "stock_quantity", "images"].includes(k))
              .map(([key, val]) => {
                if (key === 'color_code') {
                  return (
                    <span key={key} className="inline-flex items-center gap-1">
                      <div
                        className="w-3 h-3 rounded border border-gray-300"
                        style={{ backgroundColor: val }}
                      />
                      {val}
                    </span>
                  );
                }
                return <span key={key}>{val}</span>;
              })}
          </div>
          
          {/* Upload Input */}
          <div>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => handleVariantImageChange(e)}
              className="w-full text-xs text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
          
          {/* Image Preview Grid */}
          <div className="grid grid-cols-2 gap-1">
            {variant.images && variant.images.length > 0 ? (
              variant.images.map((img, imgIdx) => (
                <div key={imgIdx} className="relative group">
                  <img
                    src={img}
                    alt=""
                    className="w-full h-16 object-cover rounded border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveVariantImage(vIndex, imgIdx)}
                    className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              ))
            ) : (
              <div className="col-span-2 text-center py-2 border border-dashed border-gray-300 rounded text-xs text-gray-400">
                Chưa có ảnh
              </div>
            )}
          </div>

          {/* Image Count */}
          {variant.images && variant.images.length > 0 && (
            <div className="text-xs text-gray-500 text-center">
              {variant.images.length} ảnh
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
