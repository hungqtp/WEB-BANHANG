import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminProductNew: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State lưu dữ liệu form
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    basePrice: '',
    stock: '',
    category: ''
  });

  // State xử lý ảnh
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  // Xử lý khi chọn ảnh
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setImages(prev => [...prev, ...filesArray]);

      const newPreviews = filesArray.map((file: File) => URL.createObjectURL(file));
      setPreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // CHUẨN BỊ DỮ LIỆU GỬI SANG SERVER
    const formData = new FormData();
    formData.append('name', productData.name);
    formData.append('description', productData.description);
    formData.append('price', productData.basePrice);
    formData.append('stock', productData.stock);
    formData.append('category', productData.category);
    
    // Đính kèm các file ảnh
    images.forEach((file) => {
      formData.append('images', file);
    });

    try {
      // Mày thay URL này bằng API thật của bên Server nhé
      const response = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('app_token')}`
        },
        body: formData // FormData tự động set Content-Type là multipart/form-data
      });

      if (response.ok) {
        alert("Thêm sản phẩm thành công!");
        navigate('/admin'); // Xong thì té về Dashboard
      }
    } catch (error) {
      console.error("Lỗi kết nối server:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900">Thêm sản phẩm mới</h1>
            <p className="text-gray-500">Điền thông tin để đăng bán gấu bông mới</p>
          </div>
          <button onClick={() => navigate(-1)} className="px-4 py-2 text-gray-500 hover:text-gray-800 font-bold"> Hủy bỏ </button>
        </header>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* CỘT TRÁI: NHẬP LIỆU */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-4">
              <h2 className="text-lg font-bold mb-4">Thông tin cơ bản</h2>
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-600">Tên sản phẩm</label>
                <input required type="text" placeholder="Gấu dâu Lotso size to..." 
                  className="w-full p-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-pink-500"
                  onChange={(e) => setProductData({...productData, name: e.target.value})} />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-600">Mô tả sản phẩm</label>
                <textarea rows={4} placeholder="Mô tả chất liệu, kích thước..." 
                  className="w-full p-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-pink-500"
                  onChange={(e) => setProductData({...productData, description: e.target.value})} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-600">Giá bán (đ)</label>
                  <input required type="number" placeholder="250.000" 
                    className="w-full p-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-pink-500"
                    onChange={(e) => setProductData({...productData, basePrice: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-600">Kho hàng</label>
                  <input required type="number" placeholder="100" 
                    className="w-full p-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-pink-500"
                    onChange={(e) => setProductData({...productData, stock: e.target.value})} />
                </div>
              </div>
            </div>

            {/* PHẦN UPLOAD ẢNH */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold mb-4">Hình ảnh sản phẩm</h2>
              <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center hover:border-pink-400 transition-colors cursor-pointer relative">
                <input type="file" multiple accept="image/*" onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer" />
                <div className="text-pink-500 text-4xl mb-2">📸</div>
                <p className="text-gray-500 font-medium">Kéo thả hoặc bấm để chọn ảnh</p>
                <p className="text-xs text-gray-400 mt-1">Hỗ trợ JPG, PNG, WEBP</p>
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: PREVIEW & SUBMIT */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold mb-4">Xem trước ảnh</h2>
              <div className="grid grid-cols-2 gap-2">
                {previews.map((url, i) => (
                  <img key={i} src={url} className="w-full h-24 object-cover rounded-xl border" alt="preview" />
                ))}
                {previews.length === 0 && <div className="col-span-2 py-10 text-center text-gray-300 italic text-sm border-2 border-dashed rounded-xl">Chưa có ảnh nào</div>}
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
               <h2 className="text-lg font-bold mb-4">Phân loại</h2>
               <select className="w-full p-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-pink-500"
                onChange={(e) => setProductData({...productData, category: e.target.value})}>
                 <option value="">Chọn danh mục</option>
                 <option value="gau-bong">Gấu bông</option>
                 <option value="phu-kien">Phụ kiện</option>
                 <option value="qua-tang">Quà tặng</option>
               </select>

               <button type="submit" disabled={isSubmitting}
                className={`w-full mt-6 py-4 rounded-2xl font-black text-white shadow-lg transition-all
                  ${isSubmitting ? 'bg-gray-400' : 'bg-pink-600 hover:bg-pink-700 active:scale-95'}`}>
                 {isSubmitting ? 'ĐANG LƯU...' : 'ĐĂNG SẢN PHẨM'}
               </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AdminProductNew;