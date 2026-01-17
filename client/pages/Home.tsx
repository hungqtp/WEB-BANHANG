import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

// Định nghĩa dữ liệu cứng cho danh mục (hoặc lấy từ Database nếu bạn có API riêng)
const CATEGORIES = [
  { name: "Gấu bông", icon: "🧸", img: "https://images.unsplash.com/photo-1559440666-37148e2ad63b?w=400" },
  { name: "Móc khóa", icon: "🔑", img: "https://images.unsplash.com/photo-1544281679-02687c94399e?w=400" },
  { name: "Postcard", icon: "✉️", img: "https://images.unsplash.com/photo-1579017331233-fc950c68974b?w=400" },
  { name: "Sticker", icon: "🎨", img: "https://images.unsplash.com/photo-1572375927902-1c09e4d5d5cc?w=400" },
  { name: "Phụ kiện", icon: "🎀", img: "https://images.unsplash.com/photo-1512168203104-3910bc2bcd54?w=400" }
];

const Home: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/products");
        setProducts(res.data.slice(0, 3));
      } catch (err) {
        console.error("Lỗi lấy sản phẩm trang chủ:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="space-y-20 pb-20 bg-white">
      {/* 1. Hero Section */}
      <section className="relative bg-[#1a1a1a] h-[550px] flex items-center overflow-hidden rounded-b-[50px] shadow-2xl">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=2070" 
            alt="Hero Background" 
            className="w-full h-full object-cover opacity-60"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <div className="max-w-3xl">
            <h1 className="text-6xl md:text-8xl font-black mb-6 leading-tight tracking-tighter">
              HuMi<span className="text-pink-500">Shop</span>
            </h1>
            <p className="text-2xl text-gray-300 mb-10 font-light">
              Phụ kiện cao cấp • Gấu bông cực xinh <br/>
              <span className="italic text-pink-400">"Tìm là thấy, thấy là mua! 💖"</span>
            </p>
            <Link to="/products" className="bg-pink-600 text-white px-12 py-5 rounded-full font-bold text-xl hover:bg-pink-700 hover:scale-105 transition-all shadow-xl shadow-pink-500/30 inline-block">
              MUA SẮM NGAY
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Danh mục nổi bật (Categories) - PHẦN MỚI THÊM */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-gray-900 uppercase">Khám phá danh mục</h2>
          <p className="text-gray-500 mt-2">Tìm kiếm theo phong cách riêng của bạn</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {CATEGORIES.map((cat) => (
            <Link 
              key={cat.name} 
              to={`/products?category=${cat.name}`}
              className="group relative flex flex-col items-center"
            >
              <div className="w-full aspect-square rounded-[30px] overflow-hidden shadow-md group-hover:shadow-pink-200 group-hover:shadow-2xl transition-all duration-300 border-4 border-transparent group-hover:border-pink-500">
                <img 
                  src={cat.img} 
                  alt={cat.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-pink-500/20 transition-colors"></div>
              </div>
              <div className="mt-4 text-center">
                <span className="text-2xl mb-1 block">{cat.icon}</span>
                <span className="font-bold text-gray-800 group-hover:text-pink-600 transition-colors text-lg uppercase tracking-wider">{cat.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-4xl font-black text-gray-900 uppercase tracking-widest">Sản phẩm mới</h2>
            <div className="h-2 w-24 bg-pink-500 mt-3 rounded-full"></div>
          </div>
          <Link to="/products" className="group text-pink-600 font-bold text-lg flex items-center gap-2">
            Xem tất cả <span className="group-hover:translate-x-2 transition-transform">&rarr;</span>
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-32">
             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
            {products.map((product) => (
              <div key={product._id} className="group bg-white rounded-[40px] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-50 flex flex-col">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                    onError={(e: any) => {
                      e.target.src = "https://placehold.co/600x800/fce7f3/db2777?text=HuMi+Shop";
                    }}
                  />
                  <div className="absolute top-6 right-6 bg-white/20 backdrop-blur-md text-white text-xs font-bold px-4 py-2 rounded-full border border-white/30">
                    {product.category}
                  </div>
                </div>
                
                <div className="p-8 flex-1 flex flex-col">
                  <h3 className="text-2xl font-bold mb-3 text-gray-800 group-hover:text-pink-600 transition-colors line-clamp-1">
                    {product.name}
                  </h3>
                  <div className="text-3xl font-black text-pink-600 mb-8">
                    {product.price.toLocaleString()}đ
                  </div>
                  
                  <Link 
                    to={`/product/${product._id}`} 
                    className="mt-auto w-full py-5 bg-gray-950 text-white font-bold rounded-2xl text-center hover:bg-pink-600 transition-all transform active:scale-95 shadow-lg shadow-gray-200"
                  >
                    XEM CHI TIẾT
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;