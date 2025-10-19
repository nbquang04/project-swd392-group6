import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { sendNewsletterEmail } from '../lib/sendNewsletterEmail';
// src/components/Footer1.jsx




const Footer1 = () => {
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [ok, setOk] = useState(false);
  const [err, setErr] = useState(null);

  const handleFooterSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setErr(null);
    try {
      await sendNewsletterEmail(email);
      setOk(true);
      setEmail('');
      setTimeout(() => setOk(false), 2500);
    } catch (error) {
      setErr(error?.message || 'Gửi email thất bại.');
    } finally {
      setSending(false);
    }
  };

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Customer Service */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Dịch vụ khách hàng
            </h3>
            <ul className="space-y-3">
              <li><Link to="/help" className="text-sm text-gray-600 hover:text-gray-900 cursor-pointer">Trung tâm hỗ trợ</Link></li>
              <li><Link to="/size-guide" className="text-sm text-gray-600 hover:text-gray-900 cursor-pointer">Hướng dẫn chọn size</Link></li>
              <li><Link to="/delivery" className="text-sm text-gray-600 hover:text-gray-900 cursor-pointer">Giao hàng</Link></li>
              <li><Link to="/returns" className="text-sm text-gray-600 hover:text-gray-900 cursor-pointer">Đổi trả</Link></li>
              <li><Link to="/contact" className="text-sm text-gray-600 hover:text-gray-900 cursor-pointer">Liên hệ</Link></li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Về UNITSUKA TIGER
            </h3>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-sm text-gray-600 hover:text-gray-900 cursor-pointer">Giới thiệu</Link></li>
              <li><Link to="/careers" className="text-sm text-gray-600 hover:text-gray-900 cursor-pointer">Tuyển dụng</Link></li>
              <li><Link to="/news" className="text-sm text-gray-600 hover:text-gray-900 cursor-pointer">Tin tức</Link></li>
              <li><Link to="/stores" className="text-sm text-gray-600 hover:text-gray-900 cursor-pointer">Cửa hàng</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Pháp lý
            </h3>
            <ul className="space-y-3">
              <li><Link to="/privacy" className="text-sm text-gray-600 hover:text-gray-900 cursor-pointer">Chính sách bảo mật</Link></li>
              <li><Link to="/terms" className="text-sm text-gray-600 hover:text-gray-900 cursor-pointer">Điều khoản sử dụng</Link></li>
              <li><Link to="/cookies" className="text-sm text-gray-600 hover:text-gray-900 cursor-pointer">Cookie</Link></li>
            </ul>
          </div>

          {/* Social & Newsletter */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Kết nối
            </h3>
            <div className="flex space-x-4 mb-6">
              <a href="https://shop.example.com/social/facebook" target="_blank" rel="noopener noreferrer"
                 className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300 transition-colors cursor-pointer">
                <i className="ri-facebook-fill text-gray-600"></i>
              </a>
              <a href="https://shop.example.com/social/instagram" target="_blank" rel="noopener noreferrer"
                 className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300 transition-colors cursor-pointer">
                <i className="ri-instagram-fill text-gray-600"></i>
              </a>
              <a href="https://shop.example.com/social/youtube" target="_blank" rel="noopener noreferrer"
                 className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300 transition-colors cursor-pointer">
                <i className="ri-youtube-fill text-gray-600"></i>
              </a>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-2">Đăng ký nhận tin</p>
              <form onSubmit={handleFooterSubmit} className="flex">
                <input
                  type="email"
                  value={email}
                  onChange={(e)=>setEmail(e.target.value)}
                  placeholder="Email của bạn"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:border-red-600 text-sm"
                  autoComplete="email"
                  inputMode="email"
                  required
                />
                <button
                  type="submit"
                  disabled={sending}
                  className="px-4 py-2 bg-red-600 text-white rounded-r-md hover:bg-red-700 transition-colors whitespace-nowrap cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                  aria-busy={sending}
                  title="Đăng ký nhận tin"
                >
                  <i className="ri-send-plane-line"></i>
                </button>
              </form>

              {/* thông báo */}
              {ok && <p className="text-xs text-green-600 mt-2">Đã gửi! Vui lòng kiểm tra hộp thư.</p>}
              {err && <p className="text-xs text-red-600 mt-2">{err}</p>}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="py-6 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500">
              © 2025 UNITSUKA TIGER Vietnam. Tất cả quyền được bảo lưu.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer1;
