import React from 'react';
import { Link } from 'react-router-dom';



const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Chính Sách Bảo Mật</h1>
          <p className="text-lg text-gray-600">
            Cập nhật lần cuối: {new Date().toLocaleDateString('vi-VN')}
          </p>
        </div>

        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li>
              <Link to="/home" className="hover:text-gray-700 transition-colors">
                Trang chủ
              </Link>
            </li>
            <li>
              <span className="mx-2">/</span>
            </li>
            <li className="text-gray-900">Chính sách bảo mật</li>
          </ol>
        </nav>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Giới Thiệu</h2>
            <p className="text-gray-700 leading-relaxed">
              UNITSUKA TIGER cam kết bảo vệ quyền riêng tư và thông tin cá nhân của bạn. 
              Chính sách bảo mật này mô tả cách chúng tôi thu thập, sử dụng và bảo vệ thông tin 
              của bạn khi bạn sử dụng website và dịch vụ của chúng tôi.
            </p>
          </section>

          {/* Information Collection */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Thông Tin Chúng Tôi Thu Thập</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">2.1 Thông tin cá nhân</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  <li>Họ tên và thông tin liên hệ (email, số điện thoại)</li>
                  <li>Địa chỉ giao hàng và thanh toán</li>
                  <li>Thông tin tài khoản ngân hàng (khi thanh toán)</li>
                  <li>Ngày sinh và giới tính (tùy chọn)</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">2.2 Thông tin tự động</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  <li>Địa chỉ IP và thông tin trình duyệt</li>
                  <li>Cookie và công nghệ theo dõi tương tự</li>
                  <li>Lịch sử mua hàng và hành vi duyệt web</li>
                  <li>Thông tin thiết bị và hệ điều hành</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Information */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Cách Chúng Tôi Sử Dụng Thông Tin</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Xử lý đơn hàng và giao hàng</li>
              <li>Cung cấp dịch vụ khách hàng và hỗ trợ</li>
              <li>Gửi thông báo về sản phẩm mới và khuyến mãi</li>
              <li>Cải thiện trải nghiệm người dùng và website</li>
              <li>Phân tích xu hướng mua hàng và hành vi khách hàng</li>
              <li>Tuân thủ các yêu cầu pháp lý</li>
            </ul>
          </section>

          {/* Information Sharing */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Chia Sẻ Thông Tin</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Chúng tôi không bán, trao đổi hoặc chuyển giao thông tin cá nhân của bạn cho bên thứ ba 
              mà không có sự đồng ý của bạn, ngoại trừ các trường hợp sau:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Đối tác giao hàng và thanh toán (để hoàn thành đơn hàng)</li>
              <li>Nhà cung cấp dịch vụ (hosting, email, phân tích)</li>
              <li>Tuân thủ yêu cầu pháp lý hoặc bảo vệ quyền lợi của chúng tôi</li>
              <li>Với sự đồng ý rõ ràng của bạn</li>
            </ul>
          </section>

          {/* Data Security */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Bảo Mật Dữ Liệu</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Chúng tôi thực hiện các biện pháp bảo mật phù hợp để bảo vệ thông tin cá nhân của bạn:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Mã hóa SSL/TLS cho tất cả dữ liệu truyền tải</li>
              <li>Bảo mật cơ sở dữ liệu và hệ thống</li>
              <li>Giới hạn quyền truy cập vào thông tin cá nhân</li>
              <li>Giám sát và kiểm tra bảo mật thường xuyên</li>
            </ul>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Cookie và Công Nghệ Theo Dõi</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Chúng tôi sử dụng cookie và công nghệ tương tự để:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Ghi nhớ tùy chọn và cài đặt của bạn</li>
              <li>Phân tích lưu lượng truy cập và hiệu suất website</li>
              <li>Cá nhân hóa nội dung và quảng cáo</li>
              <li>Cải thiện trải nghiệm người dùng</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              Bạn có thể kiểm soát cookie thông qua cài đặt trình duyệt của mình.
            </p>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Quyền Của Bạn</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Bạn có các quyền sau đối với thông tin cá nhân của mình:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Quyền truy cập và xem thông tin cá nhân</li>
              <li>Quyền chỉnh sửa và cập nhật thông tin</li>
              <li>Quyền xóa tài khoản và dữ liệu cá nhân</li>
              <li>Quyền từ chối nhận email marketing</li>
              <li>Quyền khiếu nại về việc xử lý dữ liệu</li>
            </ul>
          </section>

          {/* Children's Privacy */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Bảo Mật Trẻ Em</h2>
            <p className="text-gray-700 leading-relaxed">
              Website của chúng tôi không nhắm đến trẻ em dưới 13 tuổi. Chúng tôi không cố ý 
              thu thập thông tin cá nhân từ trẻ em dưới 13 tuổi. Nếu bạn là cha mẹ hoặc người 
              giám hộ và tin rằng con bạn đã cung cấp thông tin cá nhân cho chúng tôi, 
              vui lòng liên hệ với chúng tôi.
            </p>
          </section>

          {/* Changes to Policy */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Thay Đổi Chính Sách</h2>
            <p className="text-gray-700 leading-relaxed">
              Chúng tôi có thể cập nhật chính sách bảo mật này theo thời gian. Khi có thay đổi 
              quan trọng, chúng tôi sẽ thông báo cho bạn qua email hoặc thông báo trên website. 
              Việc tiếp tục sử dụng dịch vụ sau khi thay đổi có hiệu lực được coi là chấp nhận 
              chính sách mới.
            </p>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Liên Hệ</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Nếu bạn có câu hỏi về chính sách bảo mật này hoặc cách chúng tôi xử lý thông tin 
              cá nhân của bạn, vui lòng liên hệ với chúng tôi:
            </p>
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="space-y-2">
                <p className="text-gray-700">
                  <strong>Email:</strong> privacy@unitsuka-tiger.com
                </p>
                <p className="text-gray-700">
                  <strong>Điện thoại:</strong> 0909 090 909
                </p>
                <p className="text-gray-700">
                  <strong>Địa chỉ:</strong> Hoa Lac, Thach That, Ha Noi, Viet Nam
                </p>
                <p className="text-gray-700">
                  <strong>Giờ làm việc:</strong> Thứ 2 - Thứ 6, 8:00 - 17:00
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Back to Home Button */}
        <div className="text-center mt-8">
          <Link
            to="/home"
            className="inline-flex items-center px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
          >
            <i className="fas fa-arrow-left mr-2"></i>
            Quay về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
