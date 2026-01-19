import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import { CATEGORIES } from '../constants';
import { Product } from '../types';
import { PRODUCT_IMAGES } from '../constants/images';

const ProductList: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [sortOrder, setSortOrder] = useState<'newest' | 'priceAsc' | 'priceDesc'>('newest');
  const [priceRange, setPriceRange] = useState<number>(2000000);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/products');
        setProducts(response.data);
      } catch (err) {
        console.error("Lỗi tải sản phẩm:", err);
      } finally {
        setTimeout(() => setLoading(false), 800); 
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    let result = products.filter(p => {
      const matchesCategory = selectedCategory ? p.category === selectedCategory : true;
      const currentPrice = p.price || p.basePrice || 0;
      return matchesCategory && currentPrice <= priceRange;
    });

    if (sortOrder === 'priceAsc') result.sort((a, b) => (a.price || 0) - (b.price || 0));
    else if (sortOrder === 'priceDesc') result.sort((a, b) => (b.price || 0) - (a.price || 0));
    else result.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());

    return result;
  }, [products, selectedCategory, sortOrder, priceRange]);

  return (
    <div className="bg-[#f8f8f8] min-h-screen pb-20 font-sans">
      {/* 1. HERO HEADER - PHONG CÁCH TẠP CHÍ */}
      <section className="bg-white pt-32 pb-16 px-6 border-b border-gray-100 mb-12">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="h-[1px] w-8 bg-pink-500"></span>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-pink-500">Bộ Sưu Tập Tuyển Chọn</span>
              </div>
              <h1 className="text-6xl md:text-8xl font-black text-gray-900 tracking-tight leading-none uppercase">
                PHONG<br />CÁCH.
              </h1>
            </div>
            <div className="flex flex-col items-start md:items-end gap-4">
               <p className="text-gray-400 font-medium max-w-[320px] md:text-right leading-relaxed text-sm">
                Khám phá thế giới gấu bông và phụ kiện Aesthetic được thiết kế riêng cho tâm hồn nghệ sĩ của bạn.
               </p>
               <div className="flex gap-2 p-1 bg-gray-100 rounded-full">
                  <button onClick={() => setViewMode('grid')} className={`px-5 py-2 rounded-full text-[10px] font-black transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-400'}`}>LƯỚI</button>
                  <button onClick={() => setViewMode('list')} className={`px-5 py-2 rounded-full text-[10px] font-black transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-400'}`}>DANH SÁCH</button>
               </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-[1400px] mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* 2. BỘ LỌC - SIDEBAR TRỰC QUAN */}
          <aside className="w-full lg:w-80 shrink-0">
            <div className="sticky top-32 space-y-12">
              {/* Phân loại */}
              <div className="space-y-6">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-gray-400 border-b border-gray-100 pb-4">Danh Mục</h3>
                <div className="flex flex-wrap lg:flex-col gap-2">
                  {['', ...CATEGORIES].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`group flex items-center gap-3 text-left transition-all duration-300 ${
                        selectedCategory === cat ? 'text-pink-500 transform translate-x-2' : 'text-gray-500 hover:text-gray-900'
                      }`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full bg-pink-500 transition-all duration-300 ${selectedCategory === cat ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`} />
                      <span className="text-sm font-black uppercase tracking-widest">{cat || 'Tất Cả Sản Phẩm'}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Khoảng giá */}
              <div className="space-y-6">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-gray-400 border-b border-gray-100 pb-4">Mức Giá Tối Đa</h3>
                <div className="space-y-4">
                    <input 
                      type="range" min="0" max="2000000" step="100000"
                      value={priceRange}
                      onChange={(e) => setPriceRange(parseInt(e.target.value))}
                      className="w-full h-[2px] bg-gray-200 appearance-none cursor-pointer accent-pink-500"
                    />
                    <div className="flex justify-between items-baseline">
                        <span className="text-[10px] font-black text-gray-300 uppercase">0đ</span>
                        <span className="text-2xl font-black italic text-gray-900">{priceRange.toLocaleString()}đ</span>
                    </div>
                </div>
              </div>

              {/* Thẻ thành viên ưu đãi */}
              <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group shadow-2xl shadow-gray-200">
                <div className="relative z-10">
                  <p className="text-[10px] font-black tracking-widest text-pink-500 mb-2">ƯU ĐÃI ĐỘC QUYỀN</p>
                  <h4 className="text-2xl font-black mb-4 tracking-tighter italic leading-tight uppercase">Gia nhập cộng đồng <br/>HuMi Member</h4>
                  <button className="text-[10px] font-black border-b border-white pb-1 group-hover:text-pink-500 transition-colors uppercase">Tham gia ngay</button>
                </div>
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-pink-500/20 blur-3xl rounded-full" />
              </div>
            </div>
          </aside>

          {/* 3. DANH SÁCH SẢN PHẨM */}
          <main className="flex-1">
            <div className="flex justify-between items-center mb-12 border-b border-gray-100 pb-6">
              <div className="text-[10px] font-black tracking-[0.3em] text-gray-400 uppercase">
                Cửa hàng / {selectedCategory || 'Tất cả'} / <span className="text-gray-900">{filteredProducts.length} Kết quả</span>
              </div>
              
              <div className="relative group">
                <select 
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as any)}
                  className="appearance-none bg-transparent font-black text-[10px] uppercase tracking-widest pr-8 py-2 cursor-pointer outline-none text-gray-900 hover:text-pink-500 transition-colors"
                >
                  <option value="newest">Mới nhất</option>
                  <option value="priceAsc">Giá: Thấp đến Cao</option>
                  <option value="priceDesc">Giá: Cao đến Thấp</option>
                </select>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-xs">↓</div>
              </div>
            </div>

            {loading ? (
              <div className={`grid gap-x-10 gap-y-20 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
                {[1, 2, 3, 4].map(i => <div key={i} className="animate-pulse bg-gray-200 rounded-[3rem] aspect-[3/4]" />)}
              </div>
            ) : filteredProducts.length === 0 ? (
                <div className="text-center py-40">
                    <p className="text-gray-400 font-bold text-xl mb-4">Không tìm thấy món đồ nào phù hợp 🧸</p>
                    <button onClick={() => {setSelectedCategory(''); setPriceRange(2000000);}} className="text-pink-500 font-black text-xs uppercase tracking-widest border-b border-pink-500 pb-1">Đặt lại bộ lọc</button>
                </div>
            ) : (
              <div className={`grid gap-x-10 gap-y-20 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
                {filteredProducts.map((p, idx) => (
                  <ProductCard key={p._id} product={p} index={idx} viewMode={viewMode} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

// --- COMPONENT CON: THẺ SẢN PHẨM ---
const ProductCard: React.FC<{ product: Product, index: number, viewMode: 'grid' | 'list' }> = ({ product, index, viewMode }) => {
  return (
    <div className={`group relative transition-all duration-700 ${viewMode === 'list' ? 'flex flex-row items-center gap-12 border-b border-gray-100 pb-12' : 'flex flex-col'}`}>
      
      {/* Container Hình ảnh */}
      <div className={`relative overflow-hidden rounded-[3rem] bg-white transition-all duration-700 group-hover:shadow-[0_40px_80px_rgba(0,0,0,0.1)] ${viewMode === 'list' ? 'w-1/3 aspect-square shadow-sm' : 'aspect-[3/4] shadow-sm'}`}>
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-[1.5s] cubic-bezier(0.2, 1, 0.3, 1) group-hover:scale-110" 
          onError={(e) => (e.target as HTMLImageElement).src = PRODUCT_IMAGES.PLACEHOLDER}
        />
        
        {/* Lớp phủ hành động nhanh */}
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Nhãn đặc biệt */}
        {index < 2 && (
          <div className="absolute top-8 left-8 bg-pink-500 text-white px-5 py-2 rounded-full text-[8px] font-black tracking-[0.3em] uppercase z-20 shadow-lg">
            Bán Chạy
          </div>
        )}

        <Link to={`/product/${product._id}`} className="absolute inset-0 z-10" />

        <div className="absolute bottom-8 left-8 right-8 flex gap-3 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 z-20">
            <button className="flex-1 bg-white text-gray-900 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-900 hover:text-white transition-all shadow-xl">Chi tiết</button>
            <button className="w-14 bg-white text-gray-900 rounded-2xl flex items-center justify-center hover:bg-pink-500 hover:text-white transition-all shadow-xl text-lg">＋</button>
        </div>
      </div>

      {/* Container Thông tin */}
      <div className={`mt-8 space-y-4 ${viewMode === 'list' ? 'flex-1 mt-0' : ''}`}>
        <div className="flex justify-between items-start gap-4">
          <div className="space-y-2">
            <p className="text-[10px] font-black text-pink-500 uppercase tracking-[0.4em]">{product.category}</p>
            <h3 className="text-2xl font-black text-gray-900 tracking-tight leading-none group-hover:text-pink-500 transition-colors uppercase">
              {product.name}
            </h3>
          </div>
          <div className="text-right">
            <p className="text-xl font-black italic text-gray-900">
              {(product.price || 0).toLocaleString()}đ
            </p>
            {product.stock === 0 && (
                <span className="text-[9px] font-black text-red-500 uppercase tracking-widest">Hết hàng</span>
            )}
          </div>
        </div>
        
        {viewMode === 'list' && (
          <p className="text-gray-400 text-sm font-medium max-w-lg leading-relaxed">
            Sản phẩm độc quyền từ HuMi, được gia công tỉ mỉ với chất liệu cao cấp nhất, mang lại cảm giác mềm mại và phong cách Aesthetic dẫn đầu xu hướng hiện nay.
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductList;