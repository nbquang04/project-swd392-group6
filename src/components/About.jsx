import React from 'react';

const About = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-red-600 to-red-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">
              Về UNITSUKA TIGER
            </h1>
            <p className="text-xl text-red-100 max-w-3xl mx-auto">
              Chúng tôi tự hào là đối tác chính thức của Onitsuka Tiger tại Việt Nam, 
              mang đến những sản phẩm chất lượng cao với thiết kế độc đáo và lịch sử huyền thoại.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Company Story */}
        <div className="mb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Câu Chuyện Thương Hiệu
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Onitsuka Tiger được thành lập vào năm 1949 bởi Kihachiro Onitsuka tại Kobe, Nhật Bản. 
                  Với tầm nhìn "tạo ra sự hài hòa và sức khỏe thông qua thể thao", thương hiệu đã phát triển 
                  từ một công ty giày thể thao nhỏ thành một biểu tượng văn hóa toàn cầu.
                </p>
                <p>
                  Năm 1977, Onitsuka Tiger sáp nhập với GTO và JELENK để thành lập ASICS Corporation. 
                  Tuy nhiên, dòng sản phẩm Onitsuka Tiger vẫn được duy trì như một thương hiệu riêng biệt, 
                  tập trung vào thiết kế retro và phong cách streetwear.
                </p>
                <p>
                  Tại Việt Nam, chúng tôi tự hào được chọn làm đối tác chính thức, mang đến cho người 
                  tiêu dùng Việt Nam những sản phẩm chất lượng cao với thiết kế độc đáo và lịch sử huyền thoại.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gray-100 rounded-lg p-8">
                <div className="text-center">
                  <div className="text-6xl font-bold text-red-600 mb-4">1949</div>
                  <p className="text-lg text-gray-700 font-medium">Năm thành lập</p>
                  <p className="text-sm text-gray-500 mt-2">Kobe, Nhật Bản</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mission & Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Sứ Mệnh & Giá Trị Cốt Lõi
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-red-50 rounded-lg">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-heart-line text-2xl text-white"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Chất Lượng</h3>
              <p className="text-gray-600">
                Cam kết cung cấp những sản phẩm chất lượng cao nhất, được sản xuất theo tiêu chuẩn 
                nghiêm ngặt của Nhật Bản với vật liệu bền bỉ và công nghệ hiện đại.
              </p>
            </div>
            <div className="text-center p-6 bg-red-50 rounded-lg">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-star-line text-2xl text-white"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Sáng Tạo</h3>
              <p className="text-gray-600">
                Kết hợp giữa thiết kế truyền thống Nhật Bản và xu hướng hiện đại, tạo ra những sản phẩm 
                độc đáo mang đậm bản sắc văn hóa và phong cách thời trang đương đại.
              </p>
            </div>
            <div className="text-center p-6 bg-red-50 rounded-lg">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-user-heart-line text-2xl text-white"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Khách Hàng</h3>
              <p className="text-gray-600">
                Đặt trải nghiệm khách hàng lên hàng đầu, cung cấp dịch vụ tận tâm và hỗ trợ toàn diện 
                để mỗi khách hàng đều cảm thấy hài lòng và tin tưởng.
              </p>
            </div>
          </div>
        </div>

        {/* Product Categories */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Danh Mục Sản Phẩm
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <i className="ri-shoe-line text-xl text-red-600"></i>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Giày Thể Thao</h3>
              <p className="text-sm text-gray-600">
                Các mẫu giày thể thao cổ điển với thiết kế retro độc đáo
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <i className="ri-shoe-line text-xl text-red-600"></i>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Giày Casual</h3>
              <p className="text-sm text-gray-600">
                Giày phong cách casual phù hợp cho mọi dịp
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <i className="ri-shoe-line text-xl text-red-600"></i>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Phụ Kiện</h3>
              <p className="text-sm text-gray-600">
                Tất, vớ và các phụ kiện đi kèm chất lượng cao
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <i className="ri-shoe-line text-xl text-red-600"></i>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Bộ Sưu Tập</h3>
              <p className="text-sm text-gray-600">
                Các bộ sưu tập đặc biệt và phiên bản giới hạn
              </p>
            </div>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Tại Sao Chọn Chúng Tôi?
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <i className="ri-check-line text-white text-sm"></i>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Sản Phẩm Chính Hãng 100%</h3>
                  <p className="text-gray-600">
                    Tất cả sản phẩm đều được nhập khẩu trực tiếp từ Nhật Bản, đảm bảo chất lượng 
                    và tính xác thực của thương hiệu.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <i className="ri-check-line text-white text-sm"></i>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Bảo Hành Chính Hãng</h3>
                  <p className="text-gray-600">
                    Chế độ bảo hành chính hãng với thời gian bảo hành lên đến 12 tháng, 
                    đảm bảo quyền lợi của khách hàng.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <i className="ri-check-line text-white text-sm"></i>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Giao Hàng Toàn Quốc</h3>
                  <p className="text-gray-600">
                    Dịch vụ giao hàng nhanh chóng và an toàn trên toàn quốc, 
                    với nhiều tùy chọn vận chuyển phù hợp.
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <i className="ri-check-line text-white text-sm"></i>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Đổi Trả Dễ Dàng</h3>
                  <p className="text-gray-600">
                    Chính sách đổi trả linh hoạt trong vòng 30 ngày với điều kiện sản phẩm 
                    còn nguyên vẹn và đầy đủ phụ kiện.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <i className="ri-check-line text-white text-sm"></i>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Hỗ Trợ 24/7</h3>
                  <p className="text-gray-600">
                    Đội ngũ tư vấn chuyên nghiệp sẵn sàng hỗ trợ khách hàng mọi lúc, 
                    mọi nơi với thông tin chính xác và tận tâm.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <i className="ri-check-line text-white text-sm"></i>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Giá Cả Cạnh Tranh</h3>
                  <p className="text-gray-600">
                    Cam kết cung cấp sản phẩm với giá cả cạnh tranh nhất thị trường, 
                    phù hợp với chất lượng và thương hiệu.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-gray-50 rounded-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            Thông Tin Liên Hệ
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-map-pin-line text-xl text-white"></i>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Địa Chỉ</h3>
              <p className="text-gray-600">
                123 Đường ABC, Quận 1<br />
                Thành phố Hồ Chí Minh<br />
                Việt Nam
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-phone-line text-xl text-white"></i>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Điện Thoại</h3>
              <p className="text-gray-600">
                Hotline: 1900-xxxx<br />
                Tư vấn: 090-xxx-xxxx<br />
                Fax: 028-xxxx-xxxx
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-mail-line text-xl text-white"></i>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Email</h3>
              <p className="text-gray-600">
                info@unitsukatiger.vn<br />
                support@unitsukatiger.vn<br />
                sales@unitsukatiger.vn
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;

