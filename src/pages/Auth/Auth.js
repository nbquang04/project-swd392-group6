import { useState, useContext, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import emailjs from 'emailjs-com';
import { ShoesShopContext } from '../../context/ShoeShopContext';

import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

// ==============================
// Yup Schemas
// ==============================
const PW_MIN_MSG = 'Mật khẩu tối thiểu 6 ký tự';

const loginSchema = yup.object({
  email: yup.string().email('Email không hợp lệ').required('Vui lòng nhập email'),
  password: yup.string().min(6, PW_MIN_MSG).required('Vui lòng nhập mật khẩu'),
  rememberMe: yup.boolean().default(false),
});

const registerSchema = yup.object({
  username: yup.string().trim().min(3, 'Tối thiểu 3 ký tự').required('Vui lòng nhập tên đăng nhập'),
  email: yup.string().email('Email không hợp lệ').required('Vui lòng nhập email'),
  phone: yup
    .string()
    .matches(/^(\+?\d{9,15})$/, 'SĐT không hợp lệ')
    .required('Vui lòng nhập SĐT'),
  address: yup.string().trim().min(5, 'Địa chỉ quá ngắn').required('Vui lòng nhập địa chỉ'),
  password: yup.string().min(6, PW_MIN_MSG).required('Vui lòng nhập mật khẩu'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Mật khẩu xác nhận không khớp')
    .required('Vui lòng xác nhận mật khẩu'),
});

const forgotStep1 = yup.object({
  email: yup.string().email('Email không hợp lệ').required('Vui lòng nhập email'),
});

const forgotStep2 = yup.object({
  verificationCode: yup
    .string()
    .length(6, 'Mã gồm 6 số')
    .matches(/^\d{6}$/, 'Mã chỉ gồm số')
    .required('Vui lòng nhập mã'),
});

const forgotStep3 = yup.object({
  newPassword: yup.string().min(6, PW_MIN_MSG).required('Vui lòng nhập mật khẩu mới'),
  confirmNewPassword: yup
    .string()
    .oneOf([yup.ref('newPassword')], 'Mật khẩu không khớp')
    .required('Vui lòng xác nhận mật khẩu mới'),
});

// ==============================
// EmailJS / OTP helpers
// ==============================
const EMAILJS_SERVICE_ID = 'service_xj2twkz';
const EMAILJS_TEMPLATE_OTP_ID = 'template_bjg4rcd';
const EMAILJS_PUBLIC_KEY = 'oP62zfxQ2zGZKjVSU';

// TTL OTP: 2 phút (khớp nội dung email)
const OTP_TTL_MIN = 2;

const BRAND = {
  store_name: 'UNITSUKA TIGER',
  website_url: 'https://shop.example.com',
  logo_url:
    'https://cdn.discordapp.com/attachments/714835186575212635/1405012841118961675/ChatGPT_Image_09_19_27_13_thg_8_2025.png?ex=689d47ad&is=689bf62d&hm=85a599ac6aa0f430ba97df539d6c7b7e15b23cb1043af8871bae2d7d276f5460&',
  support_url: 'https://shop.example.com/support',
};

const fmtTime = (date) =>
  new Date(date).toLocaleString('vi-VN', {
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });

const Auth = () => {
  const { msg, handleSubmitLogin, handleSubmitSignup, isAuthenticated } = useContext(ShoesShopContext);
  const navigate = useNavigate();

  // Tabs & UI states
  const [currentTab, setCurrentTab] = useState('login'); // login | register | forgot
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Forgot password flow
  const [step, setStep] = useState(1); // 1: email, 2: code, 3: new pw
  const [sentCode, setSentCode] = useState('');
  const [codeExpiration, setCodeExpiration] = useState(null);
  const [userId, setUserId] = useState(null);

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) navigate('/');
  }, [isAuthenticated, navigate]);

  // ------------------------------
  // RHF setup (dynamic resolver)
  // ------------------------------
  const activeSchema = useMemo(() => {
    if (currentTab === 'login') return loginSchema;
    if (currentTab === 'register') return registerSchema;
    if (currentTab === 'forgot') {
      if (step === 1) return forgotStep1;
      if (step === 2) return forgotStep2;
      return forgotStep3;
    }
    return yup.object();
  }, [currentTab, step]);

  const {
    register,
    handleSubmit: rhfHandleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(activeSchema),
    mode: 'onTouched',
  });

  // ------------------------------
  // Helpers
  // ------------------------------
  const checkEmailExists = async (email) => {
    try {
      const response = await axios.get(`http://localhost:9999/user?email=${email}`);
      if (response.data.length > 0) {
        setUserId(response.data[0].id);
        return true;
      }
      return false;
    } catch (error) {
      setMessage({ type: 'error', text: 'Lỗi kết nối server.' });
      return false;
    }
  };

  // Gửi OTP qua EmailJS (chuẩn hoá template params)
  const sendVerificationCode = (email) => {
    const code = Math.floor(100000 + Math.random() * 900000);
    const expiresAt = Date.now() + OTP_TTL_MIN * 60 * 1000;

    setSentCode(code.toString());
    setCodeExpiration(expiresAt);

    const resetUrl = `${window.location.origin}/reset-password?email=${encodeURIComponent(
      email
    )}&code=${code}`;

    const templateParams = {
      // Recipient
      to_email: email,       // đặt ô "To email" trong template = {{to_email}}
      user_email: email,     // dùng trong nội dung email nếu cần

      // OTP & thời gian
      passcode: code.toString(),
      time: fmtTime(expiresAt),
      request_time: fmtTime(Date.now()),

      // Brand & links
      store_name: BRAND.store_name,
      logo_url: BRAND.logo_url,
      website_url: BRAND.website_url,
      reset_url: resetUrl,
      support_url: BRAND.support_url,
      webview_url: `${BRAND.website_url}/email/webview/otp`,
      year: new Date().getFullYear().toString(),
    };

    return emailjs
      .send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_OTP_ID, templateParams, EMAILJS_PUBLIC_KEY)
      .then(() => setMessage({ type: 'success', text: 'Mã xác thực đã gửi, kiểm tra email!' }))
      .catch((err) => {
        console.error(err);
        const status = err?.status;
        const text = err?.text || err?.message || '';
        let msg = 'Không thể gửi email, thử lại sau!';
        if (status === 422 && /recipient/i.test(text)) {
          msg = 'Thiếu địa chỉ người nhận. Kiểm tra ô "To email" = {{to_email}} trong template EmailJS.';
        } else if (status === 402) {
          msg = 'EmailJS hết quota/plan (402). Kiểm tra Dashboard.';
        }
        setMessage({ type: 'error', text: msg });
      });
  };

  const handleTabChange = (tab) => {
    setCurrentTab(tab);
    setStep(1);
    setMessage({ type: '', text: '' });

    // Reset form theo tab
    if (tab === 'login') reset({ email: '', password: '', rememberMe: false });
    if (tab === 'register')
      reset({ username: '', email: '', phone: '', address: '', password: '', confirmPassword: '' });
    if (tab === 'forgot') reset({ email: '', verificationCode: '', newPassword: '', confirmNewPassword: '' });
  };

  const getTabTitle = () => {
    switch (currentTab) {
      case 'register':
        return { title: 'Tạo tài khoản mới', subtitle: 'Đăng ký để bắt đầu mua sắm' };
      case 'forgot':
        return {
          title: step === 1 ? 'Khôi phục mật khẩu' : step === 2 ? 'Xác thực mã' : 'Đặt mật khẩu mới',
          subtitle:
            step === 1
              ? 'Nhập email để nhận mã xác thực'
              : step === 2
                ? 'Nhập mã 6 số đã gửi đến email'
                : 'Tạo mật khẩu mới cho tài khoản',
        };
      default:
        return { title: 'Chào mừng trở lại', subtitle: 'Đăng nhập để tiếp tục khám phá' };
    }
  };

  // ------------------------------
  // Submit Handler (RHF)
  // ------------------------------
  const onSubmitRHF = async (data) => {
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      if (currentTab === 'login') {
        // data: { email, password, rememberMe }
        const res = await handleSubmitLogin(data);
        if (res?.status) {
          setMessage({ type: 'success', text: 'Đăng nhập thành công!' });
          setTimeout(() => navigate('/'), 1500);
        } else {
          // Hiển thị thông báo lỗi cụ thể từ context
          const errorMessage = res?.text || msg || 'Đăng nhập thất bại!';
          
          // Kiểm tra nếu là lỗi tài khoản bị disable
          if (errorMessage.includes('vô hiệu hóa') || errorMessage.includes('Disabled')) {
            setMessage({ 
              type: 'error', 
              text: errorMessage,
              details: 'Tài khoản của bạn đã bị admin vô hiệu hóa. Vui lòng liên hệ admin để được hỗ trợ.'
            });
          } else {
            setMessage({ type: 'error', text: errorMessage });
          }
        }
      }

      if (currentTab === 'register') {
        // data: { username, email, phone, address, password, confirmPassword }
        const res = await handleSubmitSignup(data);
        if (res?.status) {
          setMessage({
            type: 'success',
            text: 'Đăng ký thành công! Chuyển đến trang đăng nhập...',
          });
          setTimeout(() => {
            setCurrentTab('login');
            // giữ lại email đã đăng ký để user login cho tiện
            reset({ email: data.email, password: '', rememberMe: false });
          }, 1500);
        } else {
          setMessage({ type: 'error', text: res?.text || 'Đăng ký thất bại!' });
        }
      }

      if (currentTab === 'forgot') {
        if (step === 1) {
          // data: { email }
          if (await checkEmailExists(data.email)) {
            setStep(2);
            await sendVerificationCode(data.email);
            setValue('verificationCode', '');
          } else {
            setMessage({ type: 'error', text: 'Email không tồn tại.' });
          }
        } else if (step === 2) {
          // data: { verificationCode }
          if (Date.now() > codeExpiration) {
            setMessage({ type: 'error', text: 'Mã xác thực đã hết hạn (2 phút), hãy yêu cầu mã mới.' });
            return;
          }
          if (data.verificationCode !== sentCode) {
            setMessage({ type: 'error', text: 'Mã xác thực không chính xác.' });
            return;
          }
          setStep(3);
          setMessage({ type: 'success', text: 'Mã xác thực chính xác!' });
          setValue('newPassword', '');
          setValue('confirmNewPassword', '');
        } else if (step === 3) {
          // data: { newPassword, confirmNewPassword }
          await axios.patch(`http://localhost:9999/user/${userId}`, {
            password: data.newPassword,
          });
          setMessage({
            type: 'success',
            text: 'Mật khẩu đã cập nhật thành công. Đang chuyển hướng...',
          });
          setTimeout(() => {
            setCurrentTab('login');
            setStep(1);
            reset({ email: watch('email') || '', password: '', rememberMe: false });
          }, 2000);
        }
      }
    } catch (error) {
      console.log(error);
      setMessage({ type: 'error', text: 'Có lỗi xảy ra, vui lòng thử lại!' });
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // Renderers (đã gắn RHF register + errors)
  // ==============================
  const renderLoginForm = () => (
    <form id="login-form" onSubmit={rhfHandleSubmit(onSubmitRHF)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
        <div className="relative">
          <input
            type="email"
            {...register('email')}
            aria-invalid={!!errors.email}
            className="w-full px-4 py-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900 placeholder-gray-500 text-sm transition-all duration-200 shadow-sm hover:shadow-md"
            placeholder="Nhập email của bạn"
          />
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
            <i className="ri-mail-line text-gray-400 text-lg"></i>
          </div>
        </div>
        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Mật khẩu</label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            {...register('password')}
            aria-invalid={!!errors.password}
            className="w-full px-4 py-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900 placeholder-gray-500 text-sm transition-all duration-200 shadow-sm hover:shadow-md"
            placeholder="Nhập mật khẩu"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer group"
          >
            <i
              className={`${showPassword ? 'ri-eye-off-line' : 'ri-eye-line'
                } text-gray-400 group-hover:text-red-500 text-lg transition-colors`}
            ></i>
          </button>
        </div>
        {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center cursor-pointer group">
          <input
            type="checkbox"
            {...register('rememberMe')}
            className="w-4 h-4 text-red-500 bg-white border-gray-300 rounded focus:ring-red-500 focus:ring-2"
          />
          <span className="ml-3 text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
            Ghi nhớ đăng nhập
          </span>
        </label>
        <button
          type="button"
          onClick={() => handleTabChange('forgot')}
          className="text-sm text-red-500 hover:text-red-700 font-medium cursor-pointer transition-colors"
        >
          Quên mật khẩu?
        </button>
      </div>

      <button
        type="submit"
        disabled={loading || isSubmitting}
        className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center whitespace-nowrap cursor-pointer shadow-lg hover:shadow-red-500/25 transform hover:scale-[1.02]"
      >
        {loading || isSubmitting ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
            Đang đăng nhập...
          </>
        ) : (
          <>
            <span>Đăng nhập</span>
            <i className="ri-arrow-right-line ml-2 text-lg"></i>
          </>
        )}
      </button>
    </form>
  );

  const renderRegisterForm = () => (
    <form id="register-form" onSubmit={rhfHandleSubmit(onSubmitRHF)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Tên đăng nhập</label>
        <div className="relative">
          <input
            type="text"
            {...register('username')}
            aria-invalid={!!errors.username}
            className="w-full px-4 py-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900 placeholder-gray-500 text-sm transition-all duration-200 shadow-sm hover:shadow-md"
            placeholder="Nhập tên đăng nhập"
          />
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
            <i className="ri-user-line text-gray-400 text-lg"></i>
          </div>
        </div>
        {errors.username && <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
        <div className="relative">
          <input
            type="email"
            {...register('email')}
            aria-invalid={!!errors.email}
            className="w-full px-4 py-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900 placeholder-gray-500 text-sm transition-all duration-200 shadow-sm hover:shadow-md"
            placeholder="Nhập email của bạn"
          />
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
            <i className="ri-mail-line text-gray-400 text-lg"></i>
          </div>
        </div>
        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại</label>
        <div className="relative">
          <input
            type="tel"
            {...register('phone')}
            aria-invalid={!!errors.phone}
            className="w-full px-4 py-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900 placeholder-gray-500 text-sm transition-all duration-200 shadow-sm hover:shadow-md"
            placeholder="Nhập số điện thoại"
          />
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
            <i className="ri-phone-line text-gray-400 text-lg"></i>
          </div>
        </div>
        {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Địa chỉ</label>
        <div className="relative">
          <input
            type="text"
            {...register('address')}
            aria-invalid={!!errors.address}
            className="w-full px-4 py-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900 placeholder-gray-500 text-sm transition-all duration-200 shadow-sm hover:shadow-md"
            placeholder="Nhập địa chỉ"
          />
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
            <i className="ri-map-pin-line text-gray-400 text-lg"></i>
          </div>
        </div>
        {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Mật khẩu</label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            {...register('password')}
            aria-invalid={!!errors.password}
            className="w-full px-4 py-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900 placeholder-gray-500 text-sm transition-all duration-200 shadow-sm hover:shadow-md"
            placeholder="Nhập mật khẩu"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer group"
          >
            <i
              className={`${showPassword ? 'ri-eye-off-line' : 'ri-eye-line'
                } text-gray-400 group-hover:text-red-500 text-lg transition-colors`}
            ></i>
          </button>
        </div>
        {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Xác nhận mật khẩu</label>
        <div className="relative">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            {...register('confirmPassword')}
            aria-invalid={!!errors.confirmPassword}
            className="w-full px-4 py-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900 placeholder-gray-500 text-sm transition-all duration-200 shadow-sm hover:shadow-md"
            placeholder="Nhập lại mật khẩu"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer group"
          >
            <i
              className={`${showConfirmPassword ? 'ri-eye-off-line' : 'ri-eye-line'
                } text-gray-400 group-hover:text-red-500 text-lg transition-colors`}
            ></i>
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading || isSubmitting}
        className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center whitespace-nowrap cursor-pointer shadow-lg hover:shadow-red-500/25 transform hover:scale-[1.02]"
      >
        {loading || isSubmitting ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
            Đang đăng ký...
          </>
        ) : (
          <>
            <span>Đăng ký tài khoản</span>
            <i className="ri-user-add-line ml-2 text-lg"></i>
          </>
        )}
      </button>
    </form>
  );

  const renderForgotForm = () => (
    <form id="forgot-form" onSubmit={rhfHandleSubmit(onSubmitRHF)} className="space-y-6">
      {step === 1 && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <div className="relative">
              <input
                type="email"
                {...register('email')}
                aria-invalid={!!errors.email}
                className="w-full px-4 py-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900 placeholder-gray-500 text-sm transition-all duration-200 shadow-sm hover:shadow-md"
                placeholder="Nhập email để khôi phục"
              />
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                <i className="ri-mail-line text-gray-400 text-lg"></i>
              </div>
            </div>
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mã xác thực</label>
            <div className="relative">
              <input
                type="text"
                {...register('verificationCode')}
                aria-invalid={!!errors.verificationCode}
                className="w-full px-4 py-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900 placeholder-gray-500 text-sm transition-all duration-200 shadow-sm hover:shadow-md"
                placeholder="Nhập mã 6 số"
                maxLength={6}
              />
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                <i className="ri-shield-check-line text-gray-400 text-lg"></i>
              </div>
            </div>
            {errors.verificationCode && (
              <p className="mt-1 text-sm text-red-600">{errors.verificationCode.message}</p>
            )}
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mật khẩu mới</label>
            <div className="relative">
              <input
                type={showNewPassword ? 'text' : 'password'}
                {...register('newPassword')}
                aria-invalid={!!errors.newPassword}
                className="w-full px-4 py-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900 placeholder-gray-500 text-sm transition-all duration-200 shadow-sm hover:shadow-md"
                placeholder="Nhập mật khẩu mới"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer group"
              >
                <i
                  className={`${showNewPassword ? 'ri-eye-off-line' : 'ri-eye-line'
                    } text-gray-400 group-hover:text-red-500 text-lg transition-colors`}
                ></i>
              </button>
            </div>
            {errors.newPassword && <p className="mt-1 text-sm text-red-600">{errors.newPassword.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Xác nhận mật khẩu mới</label>
            <div className="relative">
              <input
                type={showConfirmNewPassword ? 'text' : 'password'}
                {...register('confirmNewPassword')}
                aria-invalid={!!errors.confirmNewPassword}
                className="w-full px-4 py-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900 placeholder-gray-500 text-sm transition-all duration-200 shadow-sm hover:shadow-md"
                placeholder="Nhập lại mật khẩu mới"
              />
              <button
                type="button"
                onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer group"
              >
                <i
                  className={`${showConfirmNewPassword ? 'ri-eye-off-line' : 'ri-eye-line'
                    } text-gray-400 group-hover:text-red-500 text-lg transition-colors`}
                ></i>
              </button>
            </div>
            {errors.confirmNewPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.confirmNewPassword.message}</p>
            )}
          </div>
        </>
      )}

      <button
        type="submit"
        disabled={loading || isSubmitting}
        className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center whitespace-nowrap cursor-pointer shadow-lg hover:shadow-red-500/25 transform hover:scale-[1.02]"
      >
        {(loading || isSubmitting) ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
            Đang xử lý...
          </>
        ) : (
          <>
            <span>{step === 1 ? 'Gửi mã xác thực' : step === 2 ? 'Xác thực mã' : 'Cập nhật mật khẩu'}</span>
            <i className="ri-send-plane-line ml-2 text-lg"></i>
          </>
        )}
      </button>

      {step > 1 && (
        <div className="text-center">
          <button
            type="button"
            onClick={() => {
              setStep(step - 1);
              setMessage({ type: '', text: '' });
            }}
            className="text-sm text-red-500 hover:text-red-700 font-medium cursor-pointer transition-colors"
          >
            ← Quay lại bước trước
          </button>
        </div>
      )}
    </form>
  );

  // ==============================
  // JSX
  // ==============================
  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Side - Fixed Background Image */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://readdy.ai/api/search-image?query=Elegant%20luxury%20shoe%20store%20interior%20with%20premium%20sneakers%20and%20formal%20footwear%20display%2C%20warm%20ambient%20lighting%2C%20modern%20glass%20showcases%2C%20marble%20floors%2C%20sophisticated%20retail%20design%2C%20high-end%20fashion%20boutique%20atmosphere%2C%20contemporary%20commercial%20space%20with%20red%20accent%20lighting%2C%20minimalist%20luxury%20aesthetic%2C%20professional%20photography&width=600&height=800&seq=login-bg-fixed&orientation=portrait')`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-600/10 to-red-600/20"></div>
        </div>

        <div className="absolute bottom-8 right-8 text-white max-w-sm text-right">
          <h4 className="text-2xl font-bold mb-3">Khám phá bộ sưu tập mới</h4>
          <p className="text-gray-100 leading-relaxed">
            Hàng nghìn mẫu giày dép chính hãng từ các thương hiệu nổi tiếng, cập nhật xu hướng thời trang mới nhất.
          </p>
        </div>

        <div className="absolute top-8 left-8 flex space-x-2">
          <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
          <div className="w-3 h-3 bg-red-600/60 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-3 h-3 bg-red-600/30 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8 py-12 bg-white">
        <div className="max-w-md w-full">
          {/* Logo */}
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-red-600 mb-2" style={{ fontFamily: '"Pacifico", serif' }}>
              UNITSUKA TIGER
            </h2>
            <p className="text-gray-600 text-sm">Thế giới giày dép chất lượng</p>
          </div>

          {/* Tab Navigation */}
          <div className="flex bg-gray-100 rounded-xl p-1 mb-8">
            <button
              type="button"
              onClick={() => handleTabChange('login')}
              className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer whitespace-nowrap ${currentTab === 'login' ? 'bg-red-600 text-white shadow-lg' : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              Đăng nhập
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('register')}
              className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer whitespace-nowrap ${currentTab === 'register' ? 'bg-red-600 text-white shadow-lg' : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              Đăng ký
            </button>
          </div>

          {/* Welcome Text */}
          <div className="mb-8">
            <h3 className="text-3xl font-bold text-gray-900 mb-2">{getTabTitle().title}</h3>
            <p className="text-gray-600">{getTabTitle().subtitle}</p>
          </div>

          {/* Dynamic Form */}
          {currentTab === 'login' && renderLoginForm()}
          {currentTab === 'register' && renderRegisterForm()}
          {currentTab === 'forgot' && renderForgotForm()}

          {/* Message Display */}
          {message.text && (
            <div
              className={`mt-6 p-4 rounded-xl border ${message.type === 'success'
                ? 'bg-green-50 text-green-700 border-green-200'
                : 'bg-red-50 text-red-700 border-red-200'
                }`}
            >
              <div className="flex items-start">
                <i
                  className={`${message.type === 'success' ? 'ri-check-circle-line' : 'ri-error-warning-line'
                    } mr-3 text-lg mt-0.5`}
                ></i>
                <div className="flex-1">
                  <span className="text-sm font-medium">{message.text}</span>
                  {message.details && (
                    <p className="text-xs mt-2 opacity-90 leading-relaxed">
                      {message.details}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Footer Links */}
          <div className="mt-8 text-center">
            <Link
              to="/"
              className="inline-flex items-center text-gray-500 hover:text-gray-900 font-medium cursor-pointer transition-colors text-sm"
            >
              <i className="ri-arrow-left-line mr-2"></i>
              Quay lại trang chủ
            </Link>
          </div>

          {/* Nút chuyển sang Forgot (nếu muốn hiện trên login/register) */}
          {currentTab !== 'forgot' && (
            <div className="mt-3 text-center">
              <button
                type="button"
                onClick={() => handleTabChange('forgot')}
                className="text-sm text-red-500 hover:text-red-700 font-medium cursor-pointer transition-colors"
              >
                Quên mật khẩu?
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
