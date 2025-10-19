import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { sendNewsletterEmail } from '../lib/sendNewsletterEmail';
// src/components/NewsletterSection.jsx




const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);
    setError(null);
    try {
      await sendNewsletterEmail(email);
      setIsSubmitted(true);
      setEmail('');
      setTimeout(() => setIsSubmitted(false), 3000);
    } catch (err) {
      setError(err?.message || 'Gửi email thất bại.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section className="py-20 bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: `url('https://readdy.ai/api/search-image?query=Modern%20minimalist%20fashion%20retail%20environment%20with%20soft%20natural%20lighting%2C%20clean%20contemporary%20interior%20design%2C%20stylish%20clothing%20displays%2C%20neutral%20color%20palette%20perfect%20for%20newsletter%20subscription%20background&width=1920&height=600&seq=newsletter-bg&orientation=landscape')` }}
      aria-label="Đăng ký nhận bản tin">
      <div className="absolute inset-0 bg-black/40"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Đăng ký nhận tin</h2>
        <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
          Nhận thông báo sản phẩm mới, xu hướng & tin tức từ UNITSUKA TIGER
        </p>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex gap-3">
              <label htmlFor="email" className="sr-only">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Nhập email của bạn"
                className="flex-1 px-4 py-3 rounded-full border-0 focus:outline-none focus:ring-2 focus:ring-white/50 text-gray-900"
                autoComplete="email"
                inputMode="email"
                required
              />
              <button
                type="submit"
                disabled={isSending}
                className="px-8 py-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors font-medium whitespace-nowrap cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSending ? 'Đang gửi…' : 'Đăng ký'}
              </button>
            </div>
            {error && <p className="text-sm text-red-200 mt-3" role="alert">{error}</p>}
          </form>
        ) : (
          <div className="max-w-md mx-auto bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 text-white">
            Cảm ơn bạn đã đăng ký! Vui lòng kiểm tra hộp thư.
          </div>
        )}

        <p className="text-sm text-white/70 mt-4">
          Bằng việc đăng ký, bạn đồng ý với{' '}
          <Link to="/privacy" className="underline hover:text-white transition-colors cursor-pointer">
            Chính sách bảo mật
          </Link>{' '}
          của chúng tôi
        </p>
      </div>
    </section>
  );
};

export default NewsletterSection;
