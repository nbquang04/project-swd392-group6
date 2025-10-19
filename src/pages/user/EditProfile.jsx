import { useContext, useEffect, useMemo, useState } from "react";
import { ShoesShopContext } from "../../context/ShoeShopContext.js";
import { useNotification } from "../../context/NotificationContext.js";
import { fetchUsers } from "../../service/users.js";

import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";








// ==============================
// Yup Schemas
// ==============================
// Tên: chỉ chữ (Unicode), khoảng trắng, ', ., -, 2–50 ký tự, bắt đầu/kết thúc bằng chữ
const NAME_REGEX = /^[\p{L}][\p{L}\s'.-]{0,48}[\p{L}]$/u;

const profileSchema = yup.object({
  name: yup
    .string()
    .trim()
    .matches(NAME_REGEX, "Tên chỉ gồm chữ và khoảng trắng (2–50 ký tự)")
    .min(2, "Tên tối thiểu 2 ký tự")
    .max(50, "Tên tối đa 50 ký tự")
    .required("Vui lòng nhập họ và tên"),
  email: yup.string().email("Email không hợp lệ").required("Vui lòng nhập email"),
  phone: yup
    .string()
    .matches(/^(\+?\d{9,15})$/, "Số điện thoại không hợp lệ")
    .required("Vui lòng nhập số điện thoại"),
  gender: yup
    .string()
    .oneOf(["Nam", "Nữ"], "Vui lòng chọn giới tính (Nam/Nữ)")
    .required("Vui lòng chọn giới tính"),
  address: yup
    .string()
    .trim()
    .min(5, "Địa chỉ quá ngắn")
    .max(200, "Địa chỉ quá dài")
    .required("Vui lòng nhập địa chỉ"),
});

const passwordSchema = yup.object({
  currentPassword: yup.string().required("Vui lòng nhập mật khẩu hiện tại"),
  newPassword: yup
    .string()
    .min(6, "Mật khẩu mới phải có ít nhất 6 ký tự")
    .required("Vui lòng nhập mật khẩu mới")
    .notOneOf([yup.ref("currentPassword")], "Mật khẩu mới phải khác mật khẩu hiện tại"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword")], "Xác nhận mật khẩu không khớp")
    .required("Vui lòng xác nhận mật khẩu mới"),
});

const EditProfile = ({ formData, setFormData }) => {
  const { updateUser, setUser, getCompleteUserData, users } = useContext(ShoesShopContext);
  const { showError } = useNotification();
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);


  const [activeTab, setActiveTab] = useState("profile"); // "profile" | "password"

  const activeSchema = useMemo(
    () => (activeTab === "profile" ? profileSchema : passwordSchema),
    [activeTab]
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(activeSchema),
    mode: "onTouched",
  });

  // Đồng bộ defaultValues theo tab + formData
  useEffect(() => {
    if (activeTab === "profile") {
      reset({
        name: formData?.name || "",
        email: formData?.email || "",
        phone: formData?.phone || "",
        gender: formData?.gender || "", // sẽ báo lỗi nếu để trống vì oneOf yêu cầu Nam/Nữ
        address: formData?.address || "",
      });
    } else {
      reset({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  }, [activeTab, formData, reset]);

  // Lấy users về context (dùng để verify mật khẩu hiện tại)
  useEffect(() => {
    fetchUsers().then((data) => setUser(data));
  }, [setUser]);

  const onSubmit = async (data) => {
    try {
      const currentUser = getCompleteUserData();
      if (!currentUser) {
        showError("Không tìm thấy người dùng hiện tại!");
        return;
      }

      if (activeTab === "profile") {
        // Lấy user đầy đủ trong DB để giữ các field khác (vd: password)
        const fullUser = users.find((u) => u.id === currentUser.id) || {};

        const updatedUser = {
          ...fullUser,
          ...currentUser,
          name: data.name,
          email: data.email,
          phone: data.phone,
          gender: data.gender, // bắt buộc Nam/Nữ
          address: data.address, // bắt buộc
          role: currentUser?.role || "user",
        };

        await updateUser(updatedUser);
        // Đồng bộ formData bên trên để UI cập nhật ngay
        setFormData((prev) => ({ ...prev, ...updatedUser }));
      }

      if (activeTab === "password") {
        const fullUser = users.find((u) => u.id === currentUser.id);
        if (!fullUser) {
          showError("Không tìm thấy người dùng để đổi mật khẩu!");
          return;
        }
        if (data.currentPassword !== fullUser.password) {
          showError("Mật khẩu hiện tại không đúng!");
          return;
        }
        const updatedUser = {
          ...fullUser,
          password: data.newPassword,
        };
        await updateUser(updatedUser);
        reset({ currentPassword: "", newPassword: "", confirmPassword: "" });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      showError("Có lỗi xảy ra khi cập nhật thông tin!");
    }
  };

  return (
    <div className="max-w-5xl mx-auto ">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">Chỉnh sửa hồ sơ</h2>
      <div className="flex gap-8">
        {/* Left Menu */}
        <div className="w-48 border-r pr-4">
          <button
            className={`w-full text-left px-4 py-2 mb-2 rounded-lg ${activeTab === "profile" ? "bg-red-100 text-red-600 font-semibold" : "hover:bg-gray-100"
              }`}
            onClick={() => setActiveTab("profile")}
            type="button"
          >
            Hồ sơ
          </button>
          <button
            className={`w-full text-left px-4 py-2 rounded-lg ${activeTab === "password" ? "bg-red-100 text-red-600 font-semibold" : "hover:bg-gray-100"
              }`}
            onClick={() => setActiveTab("password")}
            type="button"
          >
            Đổi mật khẩu
          </button>
        </div>

        {/* Right Content */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 space-y-6">
          {activeTab === "profile" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Họ và tên *</label>
                <input
                  type="text"
                  {...register("name")}
                  aria-invalid={!!errors.name}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email *</label>
                <input
                  type="email"
                  {...register("email")}
                  aria-invalid={!!errors.email}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Số điện thoại *</label>
                <input
                  type="tel"
                  {...register("phone")}
                  aria-invalid={!!errors.phone}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
                {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Giới tính *</label>
                <select
                  {...register("gender")}
                  aria-invalid={!!errors.gender}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                >
                  <option value="">Chọn giới tính</option>
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                </select>
                {errors.gender && <p className="mt-1 text-sm text-red-600">{errors.gender.message}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Địa chỉ *</label>
                <input
                  type="text"
                  {...register("address")}
                  aria-invalid={!!errors.address}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
                {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>}
              </div>
            </div>
          )}

          {activeTab === "password" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Mật khẩu hiện tại</label>
                <div className="relative group">
                  <input
                    type={showCurrent ? "text" : "password"}
                    {...register("currentPassword")}
                    aria-invalid={!!errors.currentPassword}
                    className="w-full px-3 py-2 border rounded-lg text-sm pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute inset-y-0 right-2 flex items-center"
                  >
                    <i
                      className={`${showCurrent ? 'ri-eye-off-line' : 'ri-eye-line'
                        } text-gray-400 group-hover:text-red-500 text-lg transition-colors`}
                    ></i>
                  </button>
                </div>
                {errors.currentPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.currentPassword.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Mật khẩu mới</label>
                <div className="relative group">
                  <input
                    type={showNew ? "text" : "password"}
                    {...register("newPassword")}
                    aria-invalid={!!errors.newPassword}
                    className="w-full px-3 py-2 border rounded-lg text-sm pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute inset-y-0 right-2 flex items-center"
                  >
                    <i
                      className={`${showNew ? 'ri-eye-off-line' : 'ri-eye-line'
                        } text-gray-400 group-hover:text-red-500 text-lg transition-colors`}
                    ></i>
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.newPassword.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Xác nhận mật khẩu mới</label>
                <div className="relative group">
                  <input
                    type={showConfirm ? "text" : "password"}
                    {...register("confirmPassword")}
                    aria-invalid={!!errors.confirmPassword}
                    className="w-full px-3 py-2 border rounded-lg text-sm pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute inset-y-0 right-2 flex items-center"
                  >
                    <i
                      className={`${showConfirm ? 'ri-eye-off-line' : 'ri-eye-line'
                        } text-gray-400 group-hover:text-red-500 text-lg transition-colors`}
                    ></i>
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-60"
            >
              {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
