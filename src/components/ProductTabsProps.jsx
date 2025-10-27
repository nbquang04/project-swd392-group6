import { useState } from 'react';

export default function ProductTabs({ product, reviews = [], onWriteReview }) {
  const [activeTab, setActiveTab] = useState('description');

  // 🌸 Mô tả theo từng dịp (occasion)
  const getCategoryDescription = () => {
    const occasion = (product.occasion || '').toLowerCase();

    switch (occasion) {
      case 'birthday':
      case 'sinh nhật':
        return {
          title: "Hoa tặng sinh nhật 🎂",
          description: product.description || "Bó hoa sinh nhật tươi thắm gửi trao lời chúc tốt đẹp, niềm vui và hạnh phúc đến người thân yêu trong ngày đặc biệt.",
          additionalInfo: [
            "Hoa sinh nhật thường mang tông màu rực rỡ như đỏ, vàng, cam hoặc hồng để thể hiện niềm vui và sự may mắn.",
            "Các loại hoa thường dùng: hoa hồng, hướng dương, cẩm chướng, baby trắng.",
            "Thích hợp tặng bạn bè, người yêu, đồng nghiệp hoặc người thân."
          ],
          careInstructions: [
            "Thay nước hoa mỗi ngày và cắt chéo gốc cành 2–3 cm.",
            "Đặt hoa nơi thoáng mát, tránh ánh nắng trực tiếp.",
            "Phun sương nhẹ để hoa luôn tươi lâu hơn."
          ],
          specifications: {
            material: "Hoa tươi tự nhiên nhập mới mỗi ngày",
            weight: "~0.8kg/bó",
            warranty: "Không áp dụng",
            sizes: "Tùy theo kích thước bó"
          }
        };

      case 'valentine':
      case 'lễ tình nhân':
        return {
          title: "Hoa Lễ Tình Nhân ❤️",
          description: product.description || "Bó hoa Valentine là món quà thể hiện tình yêu, sự ngọt ngào và lãng mạn dành cho người thương.",
          additionalInfo: [
            "Hoa hồng đỏ là biểu tượng của tình yêu nồng cháy và chân thành.",
            "Có thể phối cùng baby, lá bạc hoặc giấy gói tone đỏ, hồng pastel.",
            "Phù hợp tặng người yêu, vợ/chồng hoặc bạn gái."
          ],
          careInstructions: [
            "Giữ hoa nơi mát mẻ, tránh ánh nắng mạnh.",
            "Thay nước hằng ngày và dùng nước sạch có vài giọt chanh để hoa tươi lâu.",
            "Không đặt gần quạt hoặc điều hòa để tránh làm khô hoa."
          ],
          specifications: {
            material: "Hoa hồng nhập khẩu / hoa baby / giấy gói cao cấp",
            weight: "~0.6kg/bó",
            warranty: "Không áp dụng",
            sizes: "Tùy theo thiết kế bó"
          }
        };

      case 'wedding':
      case 'đám cưới':
        return {
          title: "Hoa cưới 💍",
          description: product.description || "Hoa cưới là biểu tượng của hạnh phúc, tình yêu và khởi đầu viên mãn cho lứa đôi trong ngày trọng đại.",
          additionalInfo: [
            "Thường dùng các loài hoa nhẹ nhàng như lan, baby, hồng pastel, cúc mẫu đơn.",
            "Tông màu trắng, kem, hồng nhạt giúp mang lại cảm giác tinh khôi và sang trọng.",
            "Phù hợp cho hoa cầm tay cô dâu, bàn tiệc, cổng cưới hoặc hoa trang trí."
          ],
          careInstructions: [
            "Bảo quản hoa ở nhiệt độ mát, tránh ánh nắng gắt.",
            "Phun sương nhẹ lên cánh hoa để giữ độ tươi.",
            "Không đặt hoa gần nguồn nhiệt hoặc gió mạnh."
          ],
          specifications: {
            material: "Hoa hồng pastel / lan hồ điệp / baby trắng",
            weight: "~1kg/bó / kệ",
            warranty: "Không áp dụng",
            sizes: "Tùy theo yêu cầu đặt thiết kế"
          }
        };

      case 'funeral':
      case 'tang lễ':
        return {
          title: "Hoa chia buồn 🕊️",
          description: product.description || "Hoa chia buồn thể hiện lòng thành kính, cảm thông và sự chia sẻ nỗi đau mất mát.",
          additionalInfo: [
            "Tông màu chủ đạo: trắng, vàng nhạt hoặc tím thể hiện sự trang trọng và thanh khiết.",
            "Các loài hoa thường dùng: lan trắng, cúc trắng, huệ, hồng trắng.",
            "Phù hợp gửi đến tang lễ, viếng người thân, đồng nghiệp, đối tác."
          ],
          careInstructions: [
            "Đặt hoa nơi thoáng mát, tránh ánh nắng mạnh.",
            "Phun sương giữ ẩm định kỳ để hoa không héo.",
            "Nếu để lâu, thay nước trong chân kệ hoa (nếu có ống nước)."
          ],
          specifications: {
            material: "Lan trắng / cúc trắng / huệ trắng",
            weight: "~2kg/kệ",
            warranty: "Không áp dụng",
            sizes: "Cao 1.5m – 2m"
          }
        };

      case 'congratulations':
      case 'chúc mừng':
      case 'khai trương':
        return {
          title: "Hoa chúc mừng 🎉",
          description: product.description || "Kệ hoa chúc mừng tượng trưng cho sự thịnh vượng, may mắn và khởi đầu tốt đẹp trong công việc, kinh doanh.",
          additionalInfo: [
            "Hoa hướng dương, lan, đồng tiền, hồng vàng tượng trưng cho thành công và tài lộc.",
            "Thiết kế dạng kệ hoặc giỏ sang trọng, màu sắc tươi sáng.",
            "Phù hợp cho khai trương, thăng chức, tân gia, kỷ niệm."
          ],
          careInstructions: [
            "Đặt hoa ở nơi mát mẻ, tránh gió mạnh.",
            "Phun sương thường xuyên để giữ hoa tươi.",
            "Không để gần nguồn nhiệt hoặc ánh nắng trực tiếp."
          ],
          specifications: {
            material: "Hoa hướng dương / lan hồ điệp / đồng tiền",
            weight: "~2–3kg/kệ",
            warranty: "Không áp dụng",
            sizes: "Cao 1.5m – 1.8m"
          }
        };

      default:
        return {
          title: "Hoa tươi cho mọi dịp 🌸",
          description: product.description || "Hoa tươi mang đến niềm vui, hạnh phúc và là món quà tinh tế cho mọi dịp trong cuộc sống.",
          additionalInfo: [
            "Các loài hoa được tuyển chọn tươi mới, nhập mới mỗi ngày.",
            "Thiết kế thủ công bởi đội ngũ florist chuyên nghiệp của FlowerShop.",
            "Phù hợp cho nhiều dịp: sinh nhật, chúc mừng, khai trương, tri ân, lễ tết."
          ],
          careInstructions: [
            "Cắt chéo gốc hoa trước khi cắm vào bình nước sạch.",
            "Thay nước mỗi ngày, tránh ánh nắng gắt và gió mạnh.",
            "Phun sương nhẹ lên hoa để giữ độ tươi tự nhiên."
          ],
          specifications: {
            material: "Hoa tươi các loại",
            weight: "~0.5–1kg/bó",
            warranty: "Không áp dụng",
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

  // ✅ Giữ nguyên toàn bộ layout gốc
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
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

      {/* Nội dung giữ nguyên */}
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
              <h4 className="font-medium mb-3">Hướng dẫn chăm sóc hoa:</h4>
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

        {/* ⚙️ Các tab khác giữ nguyên */}
        {activeTab === 'specifications' && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Thông số kỹ thuật</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Mã sản phẩm:</span>
                  <span className="font-medium">{product.id}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Danh mục:</span>
                  <span className="font-medium">{product.categoryId}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Chất liệu:</span>
                  <span className="font-medium">{categoryInfo.specifications.material}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Bảo hành:</span>
                  <span className="font-medium">{categoryInfo.specifications.warranty}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Kích thước:</span>
                  <span className="font-medium">{categoryInfo.specifications.sizes}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Khối lượng:</span>
                  <span className="font-medium">{categoryInfo.specifications.weight}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'shipping' && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Vận chuyển</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-100 rounded-full p-2 flex-shrink-0">
                    <i className="ri-truck-line text-blue-600 w-5 h-5 flex items-center justify-center"></i>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Giao hàng nhanh</h4>
                    <p className="text-gray-600 text-sm">2–4 tiếng nội thành • 1–2 ngày tỉnh</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-green-100 rounded-full p-2 flex-shrink-0">
                    <i className="ri-gift-line text-green-600 w-5 h-5 flex items-center justify-center"></i>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Miễn phí giao hàng</h4>
                    <p className="text-gray-600 text-sm">Cho đơn hàng trên 500.000₫</p>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Chính sách đổi trả</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Đổi trả trong 24h nếu hoa hư hỏng do vận chuyển</li>
                  <li>• Miễn phí thay hoa nếu giao sai mẫu</li>
                  <li>• Liên hệ hotline 1900 1234 để được hỗ trợ</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
