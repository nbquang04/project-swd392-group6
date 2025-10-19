import React from 'react';
import ColorDropdown from './ColorDropdown';
import SizeDropdown from './SizeDropdown';
import VariantImageManager from './VariantImageManager';





export default function VariantOptions({
  options,
  handleOptionNameChange,
  handleValueChange,
  removeOption,
  addValue,
  removeValue,
  variants,
  handleVariantImageChange,
  handleRemoveVariantImage,
  colorOptions = [],
  sizeOptions = [],
  productType = null
}) {
  return (
    <div className="space-y-6">
      {options.map((option, optIndex) => (
        <div key={optIndex} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          {optIndex < 2 ? (
            <>
              <div className="flex justify-between items-center mb-4">
                <input
                  type="text"
                  placeholder="Tên tùy chọn (VD: Màu sắc, Kích thước, Color, Size)"
                  value={option.name}
                  onChange={(e) => handleOptionNameChange(optIndex, e.target.value)}
                  className="flex-grow border border-gray-300 rounded-lg px-3 py-2 mr-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => removeOption(optIndex)}
                  className="w-8 h-8 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors flex items-center justify-center"
                >
                  ✕
                </button>
              </div>
              
              <div className="pl-6 space-y-3">
                {option.values.map((value, valIndex) => (
                  <div key={valIndex} className="flex items-center gap-3">
                    {option.name.toLowerCase().includes('màu') || option.name.toLowerCase().includes('color') ? (
                      <ColorDropdown
                        value={value}
                        optIndex={optIndex}
                        valIndex={valIndex}
                        handleValueChange={handleValueChange}
                        options={options}
                        colorOptions={colorOptions}
                      />
                    ) : option.name.toLowerCase().includes('kích thước') || option.name.toLowerCase().includes('size') ? (
                      <SizeDropdown
                        value={value}
                        optIndex={optIndex}
                        valIndex={valIndex}
                        handleValueChange={handleValueChange}
                        options={options}
                        sizeOptions={sizeOptions}
                        productType={productType}
                      />
                    ) : (
                      <input
                        type="text"
                        placeholder="Giá trị tùy chọn"
                        value={value}
                        onChange={(e) => handleValueChange(optIndex, valIndex, e.target.value)}
                        className="flex-grow border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    )}
                    
                    <button
                      type="button"
                      onClick={() => removeValue(optIndex, valIndex)}
                      className="w-8 h-8 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors flex items-center justify-center"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={() => addValue(optIndex)}
                  className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center gap-1 transition-colors"
                >
                  <span className="text-lg">+</span>
                  Thêm giá trị
                </button>
              </div>
            </>
          ) : (
            <VariantImageManager 
              variants={variants}
              handleVariantImageChange={handleVariantImageChange}
              handleRemoveVariantImage={handleRemoveVariantImage}
            />
          )}
        </div>
      ))}
    </div>
  );
}
