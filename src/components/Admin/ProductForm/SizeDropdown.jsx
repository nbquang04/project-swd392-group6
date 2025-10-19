import React, { useState } from 'react';


export default function SizeDropdown({ 
  value, 
  optIndex, 
  valIndex, 
  handleValueChange, 
  options, 
  sizeOptions = [], 
  productType = null,
  onChange // Thêm prop onChange cho VariantsTable
}) {
  const [isOpen, setIsOpen] = useState(false);

  // Sử dụng sizeOptions từ props, nếu không có thì dùng default dựa trên productType
  const getDefaultSizeOptions = () => {
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

  const finalSizeOptions = sizeOptions.length > 0 ? sizeOptions : getDefaultSizeOptions();

  const handleSizeSelect = (size) => {
    // Hỗ trợ cả hai cách sử dụng
    if (onChange) {
      // Cho VariantsTable
      onChange(size);
    } else if (handleValueChange) {
      // Cho VariantOptions
      handleValueChange(optIndex, valIndex, size);
    }
    setIsOpen(false);
  };

  return (
    <div className="flex-grow relative size-dropdown">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-left flex items-center justify-between bg-white hover:bg-gray-50 transition-colors"
      >
        <span>{value || "Chọn kích thước"}</span>
        <span className="text-gray-400">▼</span>
      </button>
      
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
          {finalSizeOptions.map((size, sizeIndex) => (
            <button
              key={sizeIndex}
              type="button"
              onClick={() => handleSizeSelect(size)}
              className="w-full px-3 py-2 text-left hover:bg-gray-100 transition-colors"
            >
              {size}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
