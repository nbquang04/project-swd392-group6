
import { useState } from 'react';

export default function ProductTabs({ product, reviews = [], onWriteReview }) {
  const [activeTab, setActiveTab] = useState('description');

  // Function to get category-specific description
  const getCategoryDescription = () => {
    const categoryId = product.category_id;
    
    switch (categoryId) {
      case "1": // Giày
        return {
          title: "Mô tả chi tiết",
          description: product.description,
          additionalInfo: [
            "Giày sneaker này được thiết kế với sự kết hợp hoàn hảo giữa phong cách hiện đại và tính năng thực dụng.",
            "Chất liệu da thật cao cấp không chỉ mang lại vẻ ngoài sang trọng mà còn đảm bảo độ bền và sự thoải mái cho người sử dụng.",
            "Đế giày được làm từ cao su chống trượt chất lượng cao, giúp bạn tự tin di chuyển trên mọi địa hình.",
            "Thiết kế thoáng khí với các lỗ thông hơi nhỏ giúp chân luôn khô ráo và thoải mái cả ngày dài."
          ],
          careInstructions: [
            "Làm sạch bằng khăn ẩm, tránh ngâm nước",
            "Bảo quản nơi khô ráo, thoáng mát",
            "Sử dụng miếng lót giày để tăng tuổi thọ",
            "Định kỳ vệ sinh đế giày để tránh mài mòn"
          ],
          specifications: {
            material: "Da thật + Cao su",
            weight: "~0.8kg/đôi",
            warranty: "12 tháng",
            sizes: "38-44"
          }
        };
        
      case "2": // Dép
        return {
          title: "Mô tả chi tiết",
          description: product.description,
          additionalInfo: [
            "Dép được thiết kế với chất liệu cao cấp, mang lại cảm giác thoải mái tối đa cho đôi chân.",
            "Đế dép mềm mại với khả năng chống trượt tốt, phù hợp cho việc đi lại hàng ngày.",
            "Thiết kế đơn giản nhưng tinh tế, dễ dàng phối với nhiều loại trang phục khác nhau.",
            "Quai dép được làm từ chất liệu bền bỉ, không gây kích ứng da."
          ],
          careInstructions: [
            "Rửa sạch bằng nước ấm và xà phòng nhẹ",
            "Phơi khô tự nhiên, tránh ánh nắng trực tiếp",
            "Bảo quản nơi khô ráo, tránh ẩm ướt",
            "Không sử dụng hóa chất tẩy rửa mạnh"
          ],
          specifications: {
            material: "Cao su + Vải",
            weight: "~0.3kg/đôi",
            warranty: "6 tháng",
            sizes: "38-42"
          }
        };
        
      case "3": // Phụ kiện
        return {
          title: "Mô tả chi tiết",
          description: product.description,
          additionalInfo: [
            "Phụ kiện được thiết kế với chất liệu cao cấp, tăng thêm sự hoàn thiện cho bộ trang phục.",
            "Sản phẩm được sản xuất theo tiêu chuẩn chất lượng quốc tế, đảm bảo độ bền và thẩm mỹ.",
            "Thiết kế đa dạng, phù hợp với nhiều phong cách thời trang khác nhau.",
            "Dễ dàng bảo quản và sử dụng trong thời gian dài."
          ],
          careInstructions: [
            "Làm sạch theo hướng dẫn trên nhãn sản phẩm",
            "Bảo quản nơi khô ráo, tránh ánh nắng trực tiếp",
            "Tránh tiếp xúc với hóa chất mạnh",
            "Định kỳ kiểm tra và bảo dưỡng"
          ],
          specifications: {
            material: "Đa dạng theo loại sản phẩm",
            weight: "Tùy theo sản phẩm",
            warranty: "3-6 tháng",
            sizes: "Đa dạng"
          }
        };
        
      default:
        return {
          title: "Mô tả chi tiết",
          description: product.description,
          additionalInfo: [
            "Sản phẩm được thiết kế với chất liệu cao cấp, mang lại trải nghiệm sử dụng tốt nhất.",
            "Được sản xuất theo tiêu chuẩn chất lượng cao, đảm bảo độ bền và thẩm mỹ.",
            "Thiết kế hiện đại, phù hợp với xu hướng thời trang hiện tại.",
            "Dễ dàng bảo quản và sử dụng trong thời gian dài."
          ],
          careInstructions: [
            "Làm sạch theo hướng dẫn sử dụng",
            "Bảo quản nơi khô ráo, thoáng mát",
            "Tránh tiếp xúc với hóa chất mạnh",
            "Định kỳ kiểm tra và bảo dưỡng"
          ],
          specifications: {
            material: "Chất liệu cao cấp",
            weight: "Tùy theo sản phẩm",
            warranty: "6-12 tháng",
            sizes: "Đa dạng"
          }
        };
    }
  };

  const categoryInfo = getCategoryDescription();

  const tabs = [
    { id: 'description', label: 'Mô tả sản phẩm', icon: 'ri-information-line' },
    { id: 'specifications', label: 'Thông số kỹ thuật', icon: 'ri-settings-3-line' },
    { id: 'shipping', label: 'Vận chuyển', icon: 'ri-truck-line' }
  ];

  // Sử dụng reviews từ props thay vì mock data

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-6 py-4 text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <i className={`${tab.icon} w-4 h-4 flex items-center justify-center mr-2`}></i>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'description' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">{categoryInfo.title}</h3>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed mb-4">
                  {categoryInfo.description}
                </p>
                {categoryInfo.additionalInfo.map((info, index) => (
                  <p key={index} className="text-gray-700 leading-relaxed mb-4">
                    {info}
                  </p>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-3">Hướng dẫn sử dụng:</h4>
              <ul className="space-y-2 text-gray-700">
                {categoryInfo.careInstructions.map((instruction, index) => (
                  <li key={index} className="flex items-start">
                    <i className="ri-arrow-right-s-line text-blue-600 w-5 h-5 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5"></i>
                    {instruction}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'specifications' && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Thông số kỹ thuật</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Thương hiệu:</span>
                  <span className="font-medium">{product.brand}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Danh mục:</span>
                  <span className="font-medium">{product.category}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Mã sản phẩm:</span>
                  <span className="font-medium">{product.sku}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Chất liệu:</span>
                  <span className="font-medium">{categoryInfo.specifications.material}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Xuất xứ:</span>
                  <span className="font-medium">Việt Nam</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Bảo hành:</span>
                  <span className="font-medium">{categoryInfo.specifications.warranty}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Size có sẵn:</span>
                  <span className="font-medium">{categoryInfo.specifications.sizes}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Trọng lượng:</span>
                  <span className="font-medium">{categoryInfo.specifications.weight}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'shipping' && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Thông tin vận chuyển</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-100 rounded-full p-2 flex-shrink-0">
                    <i className="ri-truck-line text-blue-600 w-5 h-5 flex items-center justify-center"></i>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Giao hàng tiêu chuẩn</h4>
                    <p className="text-gray-600 text-sm">3-5 ngày làm việc • Phí: 30.000₫</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="bg-green-100 rounded-full p-2 flex-shrink-0">
                    <i className="ri-flashlight-line text-green-600 w-5 h-5 flex items-center justify-center"></i>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Giao hàng nhanh</h4>
                    <p className="text-gray-600 text-sm">1-2 ngày làm việc • Phí: 50.000₫</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="bg-yellow-100 rounded-full p-2 flex-shrink-0">
                    <i className="ri-gift-line text-yellow-600 w-5 h-5 flex items-center justify-center"></i>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Miễn phí vận chuyển</h4>
                    <p className="text-gray-600 text-sm">Đơn hàng từ 500.000₫</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Chính sách đổi trả</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Đổi trả trong 30 ngày</li>
                    <li>• Sản phẩm còn nguyên tem mác</li>
                    <li>• Miễn phí đổi size lần đầu</li>
                    <li>• Hoàn tiền 100% nếu lỗi</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Hỗ trợ khách hàng</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    Hotline: 1900 1234 (7:00 - 22:00)
                  </p>
                  <p className="text-sm text-gray-600">
                    Email: support@shoeshop.vn
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
