import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import { CATEGORIES } from '../constants';
import { Product } from '../types';

const ProductList: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const initialCategory = searchParams.get('category') || '';

  // --- QUẢN LÝ STATE ---
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortOrder, setSortOrder] = useState<'newest' | 'priceAsc' | 'priceDesc'>('newest');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000000]);

  // --- GỌI API LẤY DỮ LIỆU ---
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Lưu ý: Đảm bảo backend đang chạy tại port 5000
        const response = await axios.get('http://localhost:5000/api/products');
        console.log("Dữ liệu nhận được:", response.data);
        setProducts(response.data);
        setError(null);
      } catch (err) {
        console.error("Lỗi fetch dữ liệu:", err);
        setError("Không thể kết nối với máy chủ. Vui lòng kiểm tra Backend!");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // --- LOGIC LỌC VÀ SẮP XẾP ---
  const filteredProducts = useMemo(() => {
    let result = products.filter(p => {
      // Chuyển đổi về chữ thường để tìm kiếm chính xác
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = selectedCategory ? p.category === selectedCategory : true;
      
      // FIX: Sử dụng p.price (từ DB) hoặc p.basePrice (từ mock cũ) để tránh lỗi undefined
      const currentPrice = p.price || p.basePrice || 0;
      const matchesPrice = currentPrice >= priceRange[0] && currentPrice <= priceRange[1];
      
      return matchesSearch && matchesCategory && matchesPrice;
    });

    // Sắp xếp
    if (sortOrder === 'priceAsc') {
      result.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortOrder === 'priceDesc') {
      result.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sortOrder === 'newest') {
      result.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
    }

    return result;
  }, [products, search, selectedCategory, sortOrder, priceRange]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-pink-500 text-white rounded-lg"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-64 space-y-8">
          <div>
            <h3 className="text-lg font-bold mb-4">Danh mục</h3>
            <div className="space-y-2">
              <button 
                onClick={() => setSelectedCategory('')}
                className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${!selectedCategory ? 'bg-pink-500 text-white' : 'hover:bg-gray-100 text-gray-600'}`}
              >
                Tất cả
              </button>
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${selectedCategory === cat ? 'bg-pink-500 text-white' : 'hover:bg-gray-100 text-gray-600'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Giá tối đa: {(priceRange[1]).toLocaleString()}đ</h3>
            <input 
              type="range" 
              min="0" 
              max="2000000" 
              step="50000"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pink-500"
            />
            <div className="flex justify-between mt-2 text-sm text-gray-500">
              <span>0đ</span>
              <span>2.000.000đ</span>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
            <h1 className="text-2xl font-bold">
              {selectedCategory || 'Tất cả sản phẩm'} 
              <span className="text-gray-400 font-normal text-lg ml-2">({filteredProducts.length})</span>
            </h1>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">Sắp xếp:</span>
              <select 
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as any)}
                className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                <option value="newest">Mới nhất</option>
                <option value="priceAsc">Giá tăng dần</option>
                <option value="priceDesc">Giá giảm dần</option>
              </select>
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
              <p className="text-xl text-gray-500">Không tìm thấy sản phẩm nào khớp với bộ lọc.</p>
              <button 
                onClick={() => {setSearch(''); setSelectedCategory(''); setPriceRange([0, 2000000]);}}
                className="mt-4 text-pink-500 font-bold hover:underline"
              >
                Xóa tất cả bộ lọc
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

// --- COMPONENT CARD SẢN PHẨM ---
const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  return (
    <div className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-gray-100">
      <Link to={`/product/${product._id}`} className="block relative aspect-square overflow-hidden bg-gray-100">
        <img 
          src={product.image} 
          alt={product.name} 
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://placehold.co/400x400/png?text=Loi+Anh";
          }}
        />
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white text-black px-4 py-1 rounded-full font-bold text-sm">Hết hàng</span>
          </div>
        )}
      </Link>
      <div className="p-4">
        <p className="text-[10px] text-pink-500 font-bold uppercase tracking-wider mb-1">{product.category}</p>
        <Link to={`/product/${product._id}`} className="block font-bold text-gray-900 group-hover:text-pink-600 transition-colors line-clamp-1 h-6">
          {product.name}
        </Link>
        <div className="mt-2 mb-4">
          <span className="text-lg font-bold text-gray-900">
            {(product.price || product.basePrice || 0).toLocaleString()}đ
          </span>
        </div>
        <Link 
          to={`/product/${product._id}`}
          className="w-full py-2 bg-gray-900 text-white text-xs font-bold rounded-lg text-center block hover:bg-pink-600 transition-all"
        >
          CHI TIẾT
        </Link>
      </div>
    </div>
  );
};

export default ProductList;