import { useState, useEffect, useContext, useMemo } from "react";
import SideBarAdmin from '../../components/SideBarAdmin';
import { useSearchParams, useNavigate } from "react-router-dom";
import { ShoesShopContext } from "../../context/ShoeShopContext";
import { Loader2, AlertCircle, Save, X, Plus, Trash2 } from "lucide-react";

export default function EditProduct() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const {
    productsRoot,
    formData,
    setFormData,
    handleChange,
    handleSubmit,
    handleImageChange,
    handleRemoveImage,
    categories,
    fetchProductRootById,
    loading,
  } = useContext(ShoesShopContext);

  const [variants, setVariants] = useState([]);
  const [sizeOptions, setSizeOptions] = useState([]);
  const [colorOptions, setColorOptions] = useState([]);
  const [localLoading, setLocalLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get product ID from query parameter
  const productId = searchParams.get('id');

  // Preset dropdown options
  const presetSizeOptions = useMemo(
    () => [36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47],
    []
  );
  const presetColorOptions = useMemo(
    () => [
      "#000000", // Black
      "#FFFFFF", // White
      "#FF0000", // Red
      "#00FF00", // Green
      "#0000FF", // Blue
      "#FFFF00", // Yellow
      "#FFA500", // Orange
      "#800080", // Purple
      "#A52A2A", // Brown
      "#808080", // Gray
      "#00FFFF", // Cyan
      "#FFC0CB", // Pink
    ],
    []
  );

  const mergedSizeOptions = useMemo(() => {
    const merged = [...presetSizeOptions, ...sizeOptions];
    return Array.from(new Set(merged.map((s) => (typeof s === "number" ? s : Number(s) || s))));
  }, [presetSizeOptions, sizeOptions]);

  const mergedColorOptions = useMemo(() => {
    const merged = [...presetColorOptions, ...colorOptions];
    return Array.from(new Set(merged));
  }, [presetColorOptions, colorOptions]);

  // Load product when component mounts
  useEffect(() => {
    const loadProduct = async () => {
      if (!productId) {
        setError("Không có ID sản phẩm");
        setLocalLoading(false);
        return;
      }

      try {
        setLocalLoading(true);
        setError(null);

        // Fetch root product by ID
        const root = await fetchProductRootById(productId);
        
        if (root) {
          setFormData({
            id: root.id,
            name: root.name || "",
            description: root.description || "",
            category_id: root.category_id || "",
            images: root.images || [],
            status: root.status || "Active",
          });

          if (root.variants?.length) {
            setVariants(root.variants);
            const sizes = [...new Set(root.variants.map(v => v.size).filter(Boolean))];
            const colors = [...new Set(root.variants.map(v => v.color_code).filter(Boolean))];
            setSizeOptions(sizes);
            setColorOptions(colors);
          } else {
            setVariants([]);
            setSizeOptions([]);
            setColorOptions([]);
          }
        } else {
          setError("Không tìm thấy sản phẩm");
        }
      } catch (err) {
        console.error("Error loading product:", err);
        setError("Lỗi khi tải sản phẩm: " + err.message);
      } finally {
        setLocalLoading(false);
      }
    };

    loadProduct();
  }, [productId, fetchProductRootById, setFormData]);

  // Handle variant changes
  const handleVariantChange = (index, field, value) => {
    setVariants(prev => 
      prev.map((variant, i) => 
        i === index ? { ...variant, [field]: value } : variant
      )
    );
  };

  // Add new variant
  const addVariant = () => {
    const newVariant = {
      sku: `SKU-${Date.now()}`,
      size: "",
      color_code: "",
      price: 0,
      cost_price: 0,
      stock_quantity: 0,
      images: [],
    };
    setVariants(prev => [...prev, newVariant]);
  };

  // Remove variant
  const removeVariant = (index) => {
    setVariants(prev => prev.filter((_, i) => i !== index));
  };

  // Handle variant image upload
  const handleVariantImageChange = async (e, variantIndex) => {
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
            { method: "POST", body: data }
          );
          
          if (!res.ok) throw new Error("Upload failed");
          
          const uploadResponse = await res.json();
          return uploadResponse.secure_url;
        })
      );

      setVariants(prev =>
        prev.map((v, idx) =>
          idx === variantIndex
            ? { ...v, images: [...(v.images || []), ...uploadedImages] }
            : v
        )
      );
    } catch (error) {
      console.error("❌ Upload ảnh biến thể lỗi:", error);
      alert("Lỗi khi upload ảnh: " + error.message);
    }
  };

  const handleRemoveVariantImage = (variantIndex, imgIndex) => {
    setVariants(prev =>
      prev.map((v, idx) =>
        idx === variantIndex
          ? { ...v, images: v.images.filter((_, i) => i !== imgIndex) }
          : v
      )
    );
  };

  // Handle form submission
  const handleSubmitForm = (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert("Vui lòng nhập tên sản phẩm");
      return;
    }

    if (!formData.category_id) {
      alert("Vui lòng chọn danh mục");
      return;
    }

    const payload = { ...formData, variants };
    handleSubmit(e, payload);
  };

  // Loading state
  if (localLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <SideBarAdmin />
        <div className="flex-1 p-8 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="animate-spin text-blue-500 mx-auto mb-4" size={48} />
            <p className="text-gray-500">Đang tải dữ liệu sản phẩm...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <SideBarAdmin />
        <div className="flex-1 p-8 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="text-red-500 mx-auto mb-4" size={48} />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Lỗi</h3>
            <p className="text-gray-500 mb-4">{error}</p>
            <button
              onClick={() => navigate("/admin/products")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Quay lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  // No product data
  if (!formData || !formData.id) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <SideBarAdmin />
        <div className="flex-1 p-8 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="text-yellow-500 mx-auto mb-4" size={48} />
            <p className="text-gray-500">Không có dữ liệu sản phẩm</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <SideBarAdmin />
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Chỉnh sửa sản phẩm</h2>
            <button
              onClick={() => navigate("/admin/products")}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmitForm} className="space-y-6">
            {/* Thông tin chung */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên sản phẩm *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhập tên sản phẩm"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mô tả chi tiết
                  </label>
                  <textarea
                    rows={6}
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhập mô tả sản phẩm"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Danh mục *
                    </label>
                    <select
                      name="category_id"
                      value={formData.category_id}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Chọn danh mục</option>
                      {categories?.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Trạng thái
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Upload ảnh chính */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ảnh chính
                </label>
                <div className="border-2 border-dashed border-gray-300 p-4 text-center rounded-lg hover:border-blue-400 transition-colors">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    id="product-images"
                    className="hidden"
                  />
                  <label htmlFor="product-images" className="cursor-pointer text-blue-500 hover:text-blue-700">
                    <Plus size={24} className="mx-auto mb-2" />
                    <p>Nhấn hoặc kéo thả file</p>
                  </label>
                </div>
                
                {formData.images?.length > 0 && (
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    {formData.images.map((img, idx) => (
                      <div key={idx} className="relative">
                        <img src={img} alt="" className="w-full h-20 object-cover rounded" />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Quản lý biến thể */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Danh sách biến thể (SKU)</h3>
                <button
                  type="button"
                  onClick={addVariant}
                  className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                >
                  <Plus size={16} /> Thêm biến thể
                </button>
              </div>

              {variants.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border border-gray-200 text-sm">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border px-3 py-2 text-left">SKU</th>
                        <th className="border px-3 py-2 text-left">Size</th>
                        <th className="border px-3 py-2 text-left">Màu sắc</th>
                        <th className="border px-3 py-2 text-left">Giá (VND)</th>
                        <th className="border px-3 py-2 text-left">Giá vốn (VND)</th>
                        <th className="border px-3 py-2 text-left">Tồn kho</th>
                        <th className="border px-3 py-2 text-left">Ảnh</th>
                        <th className="border px-3 py-2 text-left">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {variants.map((variant, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="border px-3 py-2">
                            <input
                              type="text"
                              value={variant.sku || ""}
                              onChange={(e) => handleVariantChange(idx, "sku", e.target.value)}
                              className="w-full border border-gray-300 rounded px-2 py-1 text-xs"
                              placeholder="SKU-001"
                            />
                          </td>
                          <td className="border px-3 py-2">
                            <select
                              value={variant.size || ""}
                              onChange={(e) => handleVariantChange(idx, "size", e.target.value)}
                              className="w-full border border-gray-300 rounded px-2 py-1 text-xs"
                            >
                              <option value="">Chọn size</option>
                              {mergedSizeOptions.map((s) => (
                                <option key={s} value={s}>{s}</option>
                              ))}
                            </select>
                          </td>
                          <td className="border px-3 py-2">
                            <select
                              value={variant.color_code || ""}
                              onChange={(e) => handleVariantChange(idx, "color_code", e.target.value)}
                              className="w-full border border-gray-300 rounded px-2 py-1 text-xs"
                            >
                              <option value="">Chọn màu</option>
                              {mergedColorOptions.map((c) => (
                                <option key={c} value={c}>{c}</option>
                              ))}
                            </select>
                          </td>
                          <td className="border px-3 py-2">
                            <input
                              type="number"
                              value={variant.price || 0}
                              onChange={(e) => handleVariantChange(idx, "price", Number(e.target.value))}
                              className="w-full border border-gray-300 rounded px-2 py-1 text-xs"
                              min="0"
                            />
                          </td>
                          <td className="border px-3 py-2">
                            <input
                              type="number"
                              value={variant.cost_price || 0}
                              onChange={(e) => handleVariantChange(idx, "cost_price", Number(e.target.value))}
                              className="w-full border border-gray-300 rounded px-2 py-1 text-xs"
                              min="0"
                            />
                          </td>
                          <td className="border px-3 py-2">
                            <input
                              type="number"
                              value={variant.stock_quantity || 0}
                              onChange={(e) => handleVariantChange(idx, "stock_quantity", Number(e.target.value))}
                              className="w-full border border-gray-300 rounded px-2 py-1 text-xs"
                              min="0"
                            />
                          </td>
                          <td className="border px-3 py-2">
                            <div className="space-y-2">
                              <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={(e) => handleVariantImageChange(e, idx)}
                                className="text-xs"
                              />
                              {variant.images?.length > 0 && (
                                <div className="flex gap-1 flex-wrap">
                                  {variant.images.map((img, imgIdx) => (
                                    <div key={imgIdx} className="relative w-8 h-8">
                                      <img src={img} alt="" className="w-full h-full object-cover rounded" />
                                      <button
                                        type="button"
                                        onClick={() => handleRemoveVariantImage(idx, imgIdx)}
                                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs"
                                      >
                                        <X size={10} />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="border px-3 py-2">
                            <button
                              type="button"
                              onClick={() => removeVariant(idx)}
                              className="text-red-600 hover:text-red-800"
                              title="Xóa biến thể"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                  <p>Chưa có biến thể nào</p>
                  <p className="text-sm">Nhấn "Thêm biến thể" để bắt đầu</p>
                </div>
              )}
            </div>

            {/* Submit buttons */}
            <div className="flex justify-end gap-3 pt-6 border-t">
              <button
                type="button"
                onClick={() => navigate("/admin/products")}
                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Lưu thay đổi
                  </>
                  )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
