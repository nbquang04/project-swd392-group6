import React, { useState } from 'react';


export default function ColorDropdown({ 
  value, 
  optIndex, 
  valIndex, 
  handleValueChange, 
  options, 
  colorOptions = [],
  onChange // Thêm prop onChange cho VariantsTable
}) {
  const [isOpen, setIsOpen] = useState(false);

  // Sử dụng colorOptions từ props, nếu không có thì dùng default
  const defaultColorOptions = [
    { name: "Đen", code: "#000000" },
    { name: "Trắng", code: "#FFFFFF" },
    { name: "Xanh dương", code: "#0066CC" },
    { name: "Xanh lá", code: "#00FF00" },
    { name: "Đỏ", code: "#FF0000" },
    { name: "Vàng", code: "#FFFF00" },
    { name: "Cam", code: "#FFA500" },
    { name: "Tím", code: "#800080" },
    { name: "Hồng", code: "#FFC0CB" },
    { name: "Nâu", code: "#8B4513" },
    { name: "Xám", code: "#808080" },
    { name: "Be", code: "#D2B48C" },
    { name: "Xanh da trời", code: "#87CEEB" },
    { name: "Vàng kim", code: "#FFD700" },
    { name: "Bạc", code: "#C0C0C0" },
    { name: "Xanh navy", code: "#000080" },
    { name: "Xanh mint", code: "#98FF98" },
    { name: "Hồng đậm", code: "#FF1493" },
    { name: "Đỏ đậm", code: "#8B0000" },
    { name: "Xanh ngọc", code: "#00CED1" },
    { name: "Tím nhạt", code: "#DDA0DD" },
    { name: "Xanh rêu", code: "#6B8E23" },
    { name: "Nâu sáng", code: "#DEB887" },
    { name: "Xám đậm", code: "#696969" }
  ];

  const finalColorOptions = colorOptions.length > 0 ? colorOptions : defaultColorOptions;
  const colorMapping = Object.fromEntries(
    finalColorOptions.map(color => [color.name, color.code])
  );

  const handleColorSelect = (colorName) => {
    // Hỗ trợ cả hai cách sử dụng
    if (onChange) {
      // Cho VariantsTable - trả về hex code
      onChange(colorMapping[colorName] || "#000000");
    } else if (handleValueChange) {
      // Cho VariantOptions - trả về tên màu
      handleValueChange(optIndex, valIndex, colorName);
    }
    setIsOpen(false);
  };

  // Tìm tên màu từ hex code (cho VariantsTable)
  const getColorNameFromCode = (hexCode) => {
    const color = finalColorOptions.find(c => c.code === hexCode);
    return color ? color.name : "";
  };

  // Xác định giá trị hiển thị
  const displayValue = value ? (onChange ? getColorNameFromCode(value) : value) : "";

  return (
    <div className="flex-grow relative color-dropdown">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-left flex items-center justify-between bg-white hover:bg-gray-50 transition-colors"
      >
        <span className="flex items-center gap-2">
          {displayValue ? (
            <>
              <div
                className="w-4 h-4 rounded border border-gray-300"
                style={{ backgroundColor: onChange ? value : (colorMapping[value] || "#000000") }}
              />
              {displayValue}
            </>
          ) : (
            "Chọn màu sắc"
          )}
        </span>
        <span className="text-gray-400">▼</span>
      </button>
      
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
          {finalColorOptions.map((color, colorIndex) => (
            <button
              key={colorIndex}
              type="button"
              onClick={() => handleColorSelect(color.name)}
              className="w-full px-3 py-2 text-left hover:bg-gray-100 flex items-center gap-2 transition-colors"
            >
              <div
                className="w-4 h-4 rounded border border-gray-300"
                style={{ backgroundColor: color.code }}
              />
              {color.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
