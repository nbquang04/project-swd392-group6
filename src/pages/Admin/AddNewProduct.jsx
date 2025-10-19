import { useState, useEffect, useContext } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import SideBarAdmin from '../../components/SideBarAdmin';
import ErrorBoundary from '../../components/ErrorBoundary';
import { useParams } from "react-router-dom";
import { ShoesShopContext } from "../../context/ShoeShopContext";
import { useNotification } from "../../context/NotificationContext";
import { BasicInfoTab, VariantsTab } from '../../components/Admin/ProductForm';











// Schema validation với Yup
const productSchema = yup.object().shape({
  name: yup
    .string()
    .required("Vui lòng nhập tên sản phẩm")
    .min(2, "Tên sản phẩm phải có ít nhất 2 ký tự")
    .max(100, "Tên sản phẩm không được quá 100 ký tự"),
  description: yup
    .string()
    .required("Vui lòng nhập mô tả sản phẩm")
    .min(10, "Mô tả phải có ít nhất 10 ký tự")
    .max(1000, "Mô tả không được quá 1000 ký tự"),
  category_id: yup
    .string()
    .required("Vui lòng chọn danh mục sản phẩm"),
  images: yup
    .array()
    .of(yup.string().url("URL ảnh không hợp lệ"))
    .min(1, "Phải có ít nhất 1 ảnh sản phẩm"),
  variants: yup
    .array()
    .of(
      yup.object().shape({
        sku: yup
          .string()
          .required("SKU không được để trống")
          .min(3, "SKU phải có ít nhất 3 ký tự")
          .max(20, "SKU không được quá 20 ký tự"),
        color_code: yup
          .string()
          .required("Vui lòng chọn màu sắc"),
        size: yup
          .string()
          .required("Vui lòng chọn kích thước"),
        price: yup
          .number()
          .typeError("Giá bán phải là số")
          .required("Vui lòng nhập giá bán")
          .min(0, "Giá bán không được âm")
          .max(1000000000, "Giá bán không được quá 1 tỷ"),
        cost_price: yup
          .number()
          .typeError("Giá nhập phải là số")
          .required("Vui lòng nhập giá nhập")
          .min(0, "Giá nhập không được âm")
          .max(1000000000, "Giá nhập không được quá 1 tỷ"),
        stock_quantity: yup
          .number()
          .typeError("Số lượng tồn kho phải là số")
          .required("Vui lòng nhập số lượng tồn kho")
          .min(0, "Số lượng tồn kho không được âm")
          .integer("Số lượng tồn kho phải là số nguyên"),
        images: yup
          .array()
          .of(yup.string().url("URL ảnh không hợp lệ"))
          .min(0, "Ảnh biến thể không được âm")
      })
    )
    .min(1, "Phải có ít nhất 1 biến thể")
    .test(
      "at-least-one-stock",
      "Phải có ít nhất 1 biến thể có số lượng tồn kho > 0",
      (variants) => {
        if (!variants || variants.length === 0) return false;
        return variants.some(variant => 
          variant.stock_quantity && Number(variant.stock_quantity) > 0
        );
      }
    )
    .test(
      "all-variants-have-required-fields",
      "Tất cả biến thể phải có đầy đủ thông tin bắt buộc",
      (variants) => {
        if (!variants || variants.length === 0) return false;
        return variants.every(variant => 
          variant.sku && 
          variant.color_code && 
          variant.size && 
          variant.price >= 0 && 
          variant.cost_price >= 0 &&
          variant.stock_quantity >= 0
        );
      }
    )
});

export default function AddNewProduct() {
  const { id } = useParams();
  const {
    formData,
    setFormData,
    handleAddProduct,
    loading,
    categories,
  } = useContext(ShoesShopContext);

  const { showNotification } = useNotification();
  const [activeTab, setActiveTab] = useState('basic');

  // React Hook Form setup
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
    trigger,
    reset
  } = useForm({
    resolver: yupResolver(productSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      description: "",
      category_id: "",
      images: [],
      variants: [
        {
          key: Date.now(),
          sku: "TEMP-SKU-001",
          color_code: "#000000",
          size: "35",
          price: 0,
          cost_price: 0,
          stock_quantity: 1,
          images: []
        }
      ]
    }
  });

  // Watch form values
  const watchedValues = watch();

  // Danh sách màu sắc với color code hex
  const colorOptions = [
    { name: "Đen", code: "#000000" },
    { name: "Trắng", code: "#FFFFFF" },
    { name: "Xanh dương", code: "#0066CC" },
    { name: "Xanh lá", code: "#00FF00" },
    { name: "Đỏ", code: "#FF0000" },
    { name: "Vàng", code: "#FFFF00" },
    { name: "Cam", code: "#FFA500" },
    { name: "Tím", code: "#800080" },
    { name: "Hồng", code: "#FFC0CB" },
    { name: "Nâu", code: "#A52A2A" },
    { name: "Xám", code: "#808080" },
    { name: "Be", code: "#F5F5DC" },
    { name: "Xanh navy", code: "#000080" },
    { name: "Xanh mint", code: "#98FF98" },
    { name: "Đỏ đậm", code: "#8B0000" },
    { name: "Vàng đậm", code: "#FFD700" },
    { name: "Xám đậm", code: "#696969" },
    { name: "Xám nhạt", code: "#D3D3D3" }
  ];

  const colorMapping = Object.fromEntries(
    colorOptions.map(color => [color.name, color.code])
  );

  // Tự động tạo SKU dựa trên tên sản phẩm và thuộc tính
  const generateSKU = (name, variant) => {
    if (!name) return "";
    
    const prefix = name.substring(0, 3).toUpperCase();
    const color = variant.color_code ? variant.color_code.substring(1, 4).toUpperCase() : "DEF";
    const size = variant.size || "STD";
    
    return `${prefix}-${color}-${size}`;
  };

  useEffect(() => {
    // Initialize form data with default values, including default variant
    const defaultVariant = {
      key: Date.now(),
      sku: "TEMP-SKU-001",
      color_code: "#000000",
      size: "35",
      price: 0,
      cost_price: 0,
      stock_quantity: 1,
      images: []
    };

    setFormData({
      name: "",
      description: "",
      category_id: "",
      images: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      variants: [defaultVariant]
    });
  }, [setFormData]);

  // Auto-refresh form when context changes
  useEffect(() => {
    // Reset form when formData changes from context
    if (formData && Object.keys(formData).length > 0) {
      const defaultVariant = {
        key: Date.now(),
        sku: "TEMP-SKU-001",
        color_code: "#000000",
        size: "35",
        price: 0,
        cost_price: 0,
        stock_quantity: 1,
        images: []
      };

      reset({
        name: formData.name || "",
        description: formData.description || "",
        category_id: formData.category_id || "",
        images: formData.images || [],
        variants: formData.variants || [defaultVariant]
      });
    }
  }, [formData, reset]);

  // Manual refresh function
  const handleRefreshForm = () => {
    const defaultVariant = {
      key: Date.now(),
      sku: "TEMP-SKU-001",
      color_code: "#000000",
      size: "35",
      price: 0,
      cost_price: 0,
      stock_quantity: 1,
      images: []
    };

    reset({
      name: "",
      description: "",
      category_id: "",
      images: [],
      variants: [defaultVariant]
    });

    setFormData({
      name: "",
      description: "",
      category_id: "",
      images: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      variants: [defaultVariant]
    });

    showNotification("🔄 Form đã được làm mới!", "info");
  };

  // Helper functions
  const getSizeNumber = (sizeValue) => {
    if (!isNaN(sizeValue) && sizeValue !== "") {
      return Number(sizeValue);
    }
    return sizeValue;
  };

  // Event handlers
  const handleProductNameChange = (e) => {
    const newName = e.target.value;
    setValue("name", newName);

    // Update SKU for existing variants
    const currentVariants = watchedValues.variants || [];
    if (currentVariants.length > 0) {
      const updatedVariants = currentVariants.map(variant => ({
        ...variant,
        sku: generateSKU(newName, variant)
      }));
      setValue("variants", updatedVariants);
    }
  };

  // Handle image upload to Cloudinary (for main product images)
  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    try {
      const uploadedImages = await Promise.all(
        files.map(async (file) => {
          const data = new FormData();
          data.append("file", file);
          data.append("upload_preset", "product_shoes_image");
          data.append("cloud_name", "dbqb8zw82");

          const res = await fetch(
            "https://api.cloudinary.com/v1_1/dbqb8zw82/image/upload",
            {
              method: "POST",
              body: data,
            }
          );

          const uploadResponse = await res.json();
          return uploadResponse.secure_url;
        })
      );

      // Update RHF state for images
      setValue("images", [...(watchedValues.images || []), ...uploadedImages]);
    } catch (error) {
      console.error("❌ Lỗi khi upload ảnh:", error);
      showNotification("⚠️ Không thể upload ảnh. Vui lòng thử lại.", "error");
    }
  };

  // Remove image from RHF state
  const handleRemoveImage = (index) => {
    const currentImages = watchedValues.images || [];
    setValue("images", currentImages.filter((_, i) => i !== index));
  };

  // Form submission với RHF
  const onSubmit = async (data, event) => {
    if (event) {
      event.preventDefault();
    }
    
    console.log("RHF Form data (before final processing):");
    console.log(data);

    // Trigger validation trước khi submit
    const isValid = await trigger();
    if (!isValid) {
      console.log("Form validation failed:", errors);
      showNotification("⚠️ Vui lòng kiểm tra lại thông tin form", "error");
      return;
    }

    // Cập nhật formData với dữ liệu từ RHF
    const finalFormData = {
      ...data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      variants: data.variants.map(variant => ({
        ...variant,
        sku: variant.sku || generateSKU(data.name, variant),
        price: Number(variant.price) || 0,
        cost_price: Number(variant.cost_price) || 0,
        stock_quantity: Number(variant.stock_quantity) || 0,
        images: variant.images || []
      }))
    };

    console.log("Final formData (after processing for context):");
    console.log(finalFormData);

    setFormData(finalFormData); // Update context's formData

    // Call handleAddProduct
    try {
      const result = await handleAddProduct();
      
      // Nếu thêm sản phẩm thành công, reset form và cập nhật
      if (result && result.success) {
        // Reset form về trạng thái ban đầu
        const defaultVariant = {
          key: Date.now(),
          sku: "TEMP-SKU-001",
          color_code: "#000000",
          size: "35",
          price: 0,
          cost_price: 0,
          stock_quantity: 1,
          images: []
        };

        reset({
          name: "",
          description: "",
          category_id: "",
          images: [],
          variants: [defaultVariant]
        });

        // Cập nhật context formData
        setFormData({
          name: "",
          description: "",
          category_id: "",
          images: [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          variants: [defaultVariant]
        });

        // Hiển thị thông báo thành công
        showNotification("✅ Sản phẩm đã được thêm thành công! Form đã được reset để thêm sản phẩm mới.", "success");
        
        // Trigger validation để cập nhật UI
        await trigger();
      }
    } catch (error) {
      console.error('Error adding product in AddNewProduct.jsx onSubmit:', error);
      showNotification("⚠️ Có lỗi xảy ra khi thêm sản phẩm", "error");
    }
  };

  // Handle variant image changes directly on RHF state
  const handleVariantImageChange = async (variantKey, event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    try {
      const uploadedImages = await Promise.all(
        files.map(async (file) => {
          const data = new FormData();
          data.append("file", file);
          data.append("upload_preset", "product_shoes_image");
          data.append("cloud_name", "dbqb8zw82");

          const res = await fetch(
            "https://api.cloudinary.com/v1_1/dbqb8zw82/image/upload",
            {
              method: "POST",
              body: data,
            }
          );

          const uploadResponse = await res.json();
          return uploadResponse.secure_url;
        })
      );

      // Update RHF state for variant images
      const currentVariants = watchedValues.variants || [];
      const updatedVariants = currentVariants.map(variant =>
        variant.key === variantKey
          ? { ...variant, images: [...(variant.images || []), ...uploadedImages] }
          : variant
      );
      setValue("variants", updatedVariants);
    } catch (error) {
      console.error("❌ Lỗi khi upload ảnh variant:", error);
      showNotification("⚠️ Không thể upload ảnh variant. Vui lòng thử lại.", "error");
    }
  };

  // Handle remove variant image directly on RHF state
  const handleRemoveVariantImage = (variantKey, imageIndex) => {
    const currentVariants = watchedValues.variants || [];
    const updatedVariants = currentVariants.map(variant =>
      variant.key === variantKey
        ? { ...variant, images: (variant.images || []).filter((_, idx) => idx !== imageIndex) }
        : variant
    );
    setValue("variants", updatedVariants);
  };

  const TabButton = ({ id, label, icon }) => (
    <button
      type="button"
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
        activeTab === id
          ? 'bg-blue-600 text-white shadow-md'
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      {icon}
      {label}
    </button>
  );

  return (
    <ErrorBoundary>
      <div className="flex">
        <SideBarAdmin />
        <div className="flex-1 p-6 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Thêm sản phẩm mới</h1>
            <p className="text-gray-600">Tạo sản phẩm mới với thông tin cơ bản và biến thể</p>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 mb-6 bg-white p-2 rounded-lg shadow-sm">
            <TabButton id="basic" label="Thông tin cơ bản" icon="📝" />
            <TabButton id="variants" label="Biến thể sản phẩm" icon="🎨" />
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Basic Information Tab */}
            {activeTab === 'basic' && (
              <BasicInfoTab
                control={control}
                errors={errors}
                handleProductNameChange={handleProductNameChange}
                categories={categories}
                handleImageChange={handleImageChange}
                handleRemoveImage={handleRemoveImage}
                watch={watch}
              />
            )}

            {/* Variants Tab */}
            {activeTab === 'variants' && (
              <VariantsTab
                variants={watchedValues.variants}
                control={control}
                errors={errors}
                handleVariantImageChange={handleVariantImageChange}
                handleRemoveVariantImage={handleRemoveVariantImage}
                watch={watch}
                setValue={setValue}
                generateSKU={generateSKU}
                colorMapping={colorMapping}
                getSizeNumber={getSizeNumber}
              />
            )}

            {/* Action Buttons */}
            <div className="flex justify-between items-center bg-white rounded-lg shadow-sm border p-6">
              <div className="flex gap-2">
                {/* Nút Trở về */}
                {activeTab !== 'basic' && (
                  <button 
                    type="button" 
                    onClick={() => setActiveTab('basic')}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    ← Trở về
                  </button>
                )}
                
                {/* Nút Tiếp theo */}
                {activeTab !== 'variants' && (
                  <button 
                    type="button" 
                    onClick={() => setActiveTab('variants')}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Tiếp theo →
                  </button>
                )}
              </div>
              
              <div className="flex gap-3">
                <button 
                  type="button" 
                  onClick={handleRefreshForm}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                  title="Làm mới form để thêm sản phẩm mới"
                >
                  <span className="text-lg">🔄</span>
                  Làm mới
                </button>
                <button 
                  type="button" 
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-8 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                  onClick={() => {
                    console.log("Form validation state:", { isValid, errors });
                    console.log("Current form values:", watchedValues);
                  }}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Đang lưu...
                    </>
                  ) : (
                    <>
                      Lưu sản phẩm
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Debug Info - Chỉ hiển thị trong development */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-2">🔍 Debug Info:</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p><strong>Form Valid:</strong> {isValid ? '✅' : '❌'}</p>
                    <p><strong>Has Errors:</strong> {Object.keys(errors).length > 0 ? '❌' : '✅'}</p>
                    <p><strong>Variants Count:</strong> {watchedValues.variants?.length || 0}</p>
                    <p><strong>Images Count:</strong> {watchedValues.images?.length || 0}</p>
                  </div>
                  <div>
                    <p><strong>Category:</strong> {watchedValues.category_id || 'Chưa chọn'}</p>
                    <p><strong>Name:</strong> {watchedValues.name || 'Chưa nhập'}</p>
                    <p><strong>Description:</strong> {watchedValues.description?.length || 0}/1000</p>
                    <p><strong>Auto-Update:</strong> <span className="text-green-600">🔄 Enabled</span></p>
                  </div>
                </div>
                {Object.keys(errors).length > 0 && (
                  <div className="mt-2">
                    <p className="font-medium text-red-600">Validation Errors:</p>
                    <pre className="text-xs text-red-600 bg-red-50 p-2 rounded mt-1 overflow-auto">
                      {JSON.stringify(errors, null, 2)}
                    </pre>
                  </div>
                )}
                <div className="mt-2 text-xs text-gray-600">
                  <p><strong>💡 Tip:</strong> Form sẽ tự động reset sau khi thêm sản phẩm thành công. Sử dụng nút "Làm mới" để reset thủ công.</p>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
    </ErrorBoundary>
  );
} 