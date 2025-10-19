import React from 'react';


export default function ImagesTab({ formData, handleImageChange, handleRemoveImage }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
        <span className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">3</span>
        Hình ảnh sản phẩm
      </h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="font-medium text-gray-700 mb-4">Ảnh chính sản phẩm</h3>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              id="product-images"
            />
            <label htmlFor="product-images" className="cursor-pointer">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="text-lg font-medium text-gray-700 mb-2">Tải lên hình ảnh</p>
              <p className="text-sm text-gray-500">Kéo thả hoặc click để chọn file</p>
              <p className="text-xs text-gray-400 mt-2">Hỗ trợ: JPG, PNG, GIF (tối đa 10MB)</p>
            </label>
          </div>
          
          {formData.images && formData.images.length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium text-gray-700 mb-3">Ảnh đã tải lên ({formData.images.length})</h4>
              <div className="grid grid-cols-3 gap-3">
                {formData.images.map((img, index) => (
                  <div key={index} className="relative group">
                    <img 
                      src={img} 
                      alt="" 
                      className="w-full h-24 object-cover rounded-lg border border-gray-200 group-hover:opacity-75 transition-opacity" 
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div>
          <h3 className="font-medium text-gray-700 mb-4">Thông tin hình ảnh</h3>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 mb-2">💡 Lưu ý:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Ảnh chính sẽ hiển thị ở trang danh sách sản phẩm</li>
              <li>• Ảnh biến thể sẽ hiển thị khi chọn màu/kích thước</li>
              <li>• Hình ảnh sẽ được tải lên Cloudinary tự động</li>
              <li>• Hỗ trợ nhiều định dạng: JPG, PNG, GIF</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
