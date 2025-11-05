import { useState, useContext, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoesShopContext } from '../../context/ShoeShopContext';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

const PW_MIN_MSG = 'Mật khẩu tối thiểu 6 ký tự';

const loginSchema = yup.object({
  email: yup.string().email('Email không hợp lệ').required('Vui lòng nhập email'),
  password: yup.string().min(6, PW_MIN_MSG).required('Vui lòng nhập mật khẩu'),
  rememberMe: yup.boolean().default(false),
});

const registerSchema = yup.object({
  fullName: yup.string().trim().min(3, 'Tối thiểu 3 ký tự').required('Vui lòng nhập họ và tên'),
  email: yup.string().email('Email không hợp lệ').required('Vui lòng nhập email'),
  password: yup.string().min(6, PW_MIN_MSG).required('Vui lòng nhập mật khẩu'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Mật khẩu xác nhận không khớp')
    .required('Vui lòng xác nhận mật khẩu'),
});

const Auth = () => {
  const {
    handleSubmitLogin,
    handleSubmitSignup,
    isAuthenticated,
    authChecked,
  } = useContext(ShoesShopContext);

  const navigate = useNavigate();

  const [currentTab, setCurrentTab] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // ✅ Chỉ redirect sau khi đã check xong auth
  useEffect(() => {
    if (authChecked && isAuthenticated) {
      if (window.location.pathname === '/auth' || window.location.pathname === '/login') {
        navigate('/', { replace: true });
      }
    }
  }, [authChecked, isAuthenticated, navigate]);

  const activeSchema = useMemo(
    () => (currentTab === 'login' ? loginSchema : registerSchema),
    [currentTab]
  );

  const {
    register,
    handleSubmit: rhfHandleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(activeSchema),
    mode: 'onTouched',
  });

  const onSubmitRHF = async (data) => {
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      if (currentTab === 'login') {
        const res = await handleSubmitLogin({ email: data.email, password: data.password });
        if (res?.status) {
          const user = res.user;
         
          setMessage({ type: 'success', text: 'Đăng nhập thành công!' });

          setTimeout(() => {
            if (user?.role === 'ADMIN') {
              navigate('/admin/dashboard', { replace: true });
            } else {
              navigate('/', { replace: true });
            }
          }, 800);
        } else {
          setMessage({ type: 'error', text: 'Sai email hoặc mật khẩu!' });
        }
      }

      if (currentTab === 'register') {
        const req = {
          email: data.email,
          password: data.password,
          fullName: data.fullName,
        };

        const res = await handleSubmitSignup(req);
        if (res?.status) {
          setMessage({
            type: 'success',
            text: 'Đăng ký thành công! Vui lòng đăng nhập để tiếp tục.',
          });
          setTimeout(() => {
            setCurrentTab('login');
            reset({ email: data.email, password: '', rememberMe: false });
          }, 1000);
        } else {
          setMessage({ type: 'error', text: 'Không thể đăng ký, email có thể đã tồn tại.' });
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      setMessage({ type: 'error', text: 'Có lỗi xảy ra, vui lòng thử lại!' });
    } finally {
      setLoading(false);
    }
  };

  const renderLoginForm = () => (
    <form onSubmit={rhfHandleSubmit(onSubmitRHF)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
        <input
          type="email"
          {...register('email')}
          className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500"
          placeholder="Nhập email của bạn"
        />
        {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Mật khẩu</label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            {...register('password')}
            className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500"
            placeholder="Nhập mật khẩu"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-4 flex items-center"
          >
            <i className={`${showPassword ? 'ri-eye-off-line' : 'ri-eye-line'} text-gray-400 text-lg`}></i>
          </button>
        </div>
        {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>}
      </div>

      <button
        type="submit"
        disabled={loading || isSubmitting}
        className="w-full bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition-all"
      >
        {loading || isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
      </button>
    </form>
  );

  const renderRegisterForm = () => (
    <form onSubmit={rhfHandleSubmit(onSubmitRHF)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Họ và tên</label>
        <input
          type="text"
          {...register('fullName')}
          className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500"
          placeholder="Nhập họ và tên"
        />
        {errors.fullName && <p className="text-sm text-red-600 mt-1">{errors.fullName.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
        <input
          type="email"
          {...register('email')}
          className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500"
          placeholder="Nhập email của bạn"
        />
        {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Mật khẩu</label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            {...register('password')}
            className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500"
            placeholder="Nhập mật khẩu"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-4 flex items-center"
          >
            <i className={`${showPassword ? 'ri-eye-off-line' : 'ri-eye-line'} text-gray-400 text-lg`}></i>
          </button>
        </div>
        {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Xác nhận mật khẩu</label>
        <div className="relative">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            {...register('confirmPassword')}
            className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500"
            placeholder="Nhập lại mật khẩu"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute inset-y-0 right-0 pr-4 flex items-center"
          >
            <i className={`${showConfirmPassword ? 'ri-eye-off-line' : 'ri-eye-line'} text-gray-400 text-lg`}></i>
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-sm text-red-600 mt-1">{errors.confirmPassword.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading || isSubmitting}
        className="w-full bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition-all"
      >
        {loading || isSubmitting ? 'Đang đăng ký...' : 'Đăng ký tài khoản'}
      </button>
    </form>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-md">
        <h2 className="text-3xl font-bold text-center text-red-600 mb-6">
          {currentTab === 'login' ? 'Đăng nhập' : 'Đăng ký tài khoản'}
        </h2>

        <div className="flex mb-6 bg-gray-100 rounded-xl p-1">
          <button
            onClick={() => setCurrentTab('login')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium ${currentTab === 'login' ? 'bg-red-600 text-white' : 'text-gray-600 hover:text-gray-900'
              }`}
          >
            Đăng nhập
          </button>
          <button
            onClick={() => setCurrentTab('register')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium ${currentTab === 'register' ? 'bg-red-600 text-white' : 'text-gray-600 hover:text-gray-900'
              }`}
          >
            Đăng ký
          </button>
        </div>

        {currentTab === 'login' && renderLoginForm()}
        {currentTab === 'register' && renderRegisterForm()}

        {message.text && (
          <div
            className={`mt-6 p-4 rounded-xl text-sm font-medium ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
              }`}
          >
            {message.text}
          </div>
        )}

        <div className="mt-6 text-center">
          <Link to="/" className="text-sm text-gray-600 hover:text-red-600">
            ← Quay lại trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Auth;
