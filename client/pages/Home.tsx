import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { PRODUCT_IMAGES } from '../constants/images';

const CATEGORIES = [
  { 
    name: "Gấu bông", 
    icon: "🧸", 
    img: PRODUCT_IMAGES.TEDDY_HONG, // Sửa từ GAU_BONG thành TEDDY_HONG
    color: "bg-orange-50" 
  },
  { 
    name: "Móc khóa", 
    icon: "🔑", 
    img: PRODUCT_IMAGES.TRA_SUA, // Đã khớp
    color: "bg-blue-50" 
  },
  { 
    name: "Postcard", 
    icon: "✉️", 
    img: PRODUCT_IMAGES.POSTCARD_DL, // Đã khớp
    color: "bg-purple-50" 
  },
  { 
    name: "Sticker", 
    icon: "🎨", 
    img: PRODUCT_IMAGES.STICKER_VINTAGE, // Đã khớp
    color: "bg-green-50" 
  },
  { 
    name: "Phụ kiện", 
    icon: "🎀", 
    img: PRODUCT_IMAGES.DEN_MEO, // Đã khớp
    color: "bg-pink-50" 
  }
];

const Home: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/products");
        setProducts(res.data.slice(0, 8)); // Lấy 8 sản phẩm mới nhất thôi cho đẹp
      } catch (err) {
        console.error("Lỗi lấy sản phẩm:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="bg-[#FCFCFD] min-h-screen font-sans selection:bg-pink-100 selection:text-pink-600">

      {/* 1. PREMIUM HERO SECTION */}
      <section className="relative h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1534127391941-e9457639c095?q=80&w=2070"
            className="w-full h-full object-cover scale-105 animate-slow-zoom"
            alt="Hero"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <div className="max-w-4xl space-y-8">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 text-white text-xs font-black tracking-[0.3em] uppercase">
              <span className="w-2 h-2 bg-pink-500 rounded-full animate-ping" />
              New Era of Gấu Bông
            </div>

            <h1 className="text-7xl md:text-[10rem] font-black text-white leading-[0.85] tracking-tighter">
              HUMI<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-600">SHOP</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 max-w-xl font-medium leading-relaxed opacity-90">
              Kiến tạo không gian sống với những phụ kiện Aesthetic & Gấu bông cao cấp bậc nhất.
            </p>

            <div className="flex flex-wrap gap-5">
              <Link to="/products" className="group relative px-10 py-5 bg-white text-black font-black text-lg rounded-2xl overflow-hidden transition-all hover:scale-105 active:scale-95">
                <span className="relative z-10">MUA SẮM NGAY</span>
                <div className="absolute inset-0 bg-pink-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </Link>
              <button
                onClick={() => {
                  const section = document.getElementById('collection-section');
                  section?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className="px-10 py-5 bg-transparent border-2 border-white/30 text-white font-black text-lg rounded-2xl hover:bg-white/10 transition-all active:scale-95"
              >
                XEM BỘ SƯU TẬP
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TRENDING CATEGORIES - Fixed Image Loading */}
      <section id="collection-section" className="max-w-7xl mx-auto px-6 -mt-24 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {CATEGORIES.map((cat, i) => (
            <Link key={i} to={`/products?category=${cat.name}`} className="group relative aspect-[3/4] rounded-[2.5rem] overflow-hidden shadow-2xl transition-all duration-500 hover:-translate-y-4">
              <img 
                src={cat.img} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                alt={cat.name} 
                onError={(e) => {
                  (e.target as HTMLImageElement).src = PRODUCT_IMAGES.PLACEHOLDER;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              <div className="absolute bottom-8 left-0 right-0 text-center">
                <div className="text-4xl mb-2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  {cat.icon}
                </div>
                <h3 className="text-white font-black text-lg uppercase tracking-widest">{cat.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. MODERN PRODUCT GRID */}
      <section className="max-w-7xl mx-auto px-6 py-32">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div className="space-y-4">
            <h2 className="text-6xl font-black text-gray-900 tracking-tighter leading-none">
              NEW <span className="text-pink-500">ARRIVALS</span>
            </h2>
            <p className="text-gray-400 font-bold uppercase tracking-[0.4em] text-sm">Hàng mới cập bến tuần này</p>
          </div>
          <Link to="/products" className="pb-2 border-b-4 border-pink-500 text-xl font-black text-gray-900 hover:text-pink-500 transition-colors uppercase italic">
            Xem tất cả &rarr;
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-96 bg-gray-100 animate-pulse rounded-[3rem]" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
            {products.map((product) => (
              <div key={product._id} className="group flex flex-col">
                <div className="relative aspect-[3/4] rounded-[3rem] overflow-hidden bg-gray-50 mb-6">
                  <img
                    src={product.image}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    alt={product.name}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = PRODUCT_IMAGES.PLACEHOLDER;
                    }}
                  />
                  {/* Quick Add Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-[2px]">
                    <Link to={`/product/${product._id}`} className="bg-white text-black px-6 py-3 rounded-2xl font-black scale-50 group-hover:scale-100 transition-transform duration-500 hover:bg-pink-500 hover:text-white">
                      XEM CHI TIẾT
                    </Link>
                  </div>
                </div>

                <div className="px-2 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[10px] font-black text-pink-500 uppercase tracking-widest">{product.category}</p>
                      <h3 className="text-xl font-bold text-gray-900 leading-tight truncate max-w-[150px] md:max-w-[200px]">
                        {product.name}
                      </h3>
                    </div>
                    <span className="text-lg font-black text-gray-900 whitespace-nowrap">
                      {product.price.toLocaleString()}đ
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 4. NEWSLETTER SECTION */}
      <section className="max-w-7xl mx-auto px-6 mb-20">
        <div className="bg-gray-900 rounded-[4rem] p-16 md:p-24 text-center overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/20 blur-[120px] rounded-full" />
          <h2 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter">Gia nhập cộng đồng <br /><span className="text-pink-500 underline underline-offset-8">HuMi Member</span></h2>
          <p className="text-gray-400 text-lg mb-12 max-w-xl mx-auto font-medium">Nhận ngay ưu đãi 10% cho đơn hàng đầu tiên và thông báo về các mẫu gấu Limited.</p>
          <div className="max-w-md mx-auto flex gap-4 p-2 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm">
            <input type="email" placeholder="Email của bạn..." className="flex-1 bg-transparent px-6 py-4 text-white outline-none font-medium" />
            <button className="bg-white text-black px-8 py-4 rounded-2xl font-black hover:bg-pink-500 hover:text-white transition-all">GỬI</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;