
import React, { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { MOCK_PRODUCTS, CATEGORIES } from '../constants';
import { Product } from '../types';

const ProductList: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const initialCategory = searchParams.get('category') || '';

  const [search, setSearch] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortOrder, setSortOrder] = useState<'newest' | 'priceAsc' | 'priceDesc'>('newest');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);

  const filteredProducts = useMemo(() => {
    let result = MOCK_PRODUCTS.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = selectedCategory ? p.category === selectedCategory : true;
      const matchesPrice = p.basePrice >= priceRange[0] && p.basePrice <= priceRange[1];
      return matchesSearch && matchesCategory && matchesPrice;
    });

    if (sortOrder === 'priceAsc') result.sort((a, b) => a.basePrice - b.basePrice);
    if (sortOrder === 'priceDesc') result.sort((a, b) => b.basePrice - a.basePrice);
    if (sortOrder === 'newest') result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return result;
  }, [search, selectedCategory, sortOrder, priceRange]);

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
            <h3 className="text-lg font-bold mb-4">Khoảng giá</h3>
            <input 
              type="range" 
              min="0" 
              max="1000000" 
              step="50000"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pink-500"
            />
            <div className="flex justify-between mt-2 text-sm text-gray-500">
              <span>0đ</span>
              <span>{(priceRange[1]).toLocaleString()}đ</span>
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
            <div className="text-center py-20">
              <p className="text-xl text-gray-500">Không tìm thấy sản phẩm nào khớp với tìm kiếm.</p>
              <button 
                onClick={() => {setSearch(''); setSelectedCategory(''); setPriceRange([0, 1000000]);}}
                className="mt-4 text-pink-500 font-bold underline"
              >
                Xóa tất cả bộ lọc
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  return (
    <div className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-gray-100">
      <Link to={`/product/${product.id}`} className="block relative aspect-square overflow-hidden">
        <img 
          src={product.images[0]} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
        />
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isSale && <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm uppercase">Sale</span>}
          {product.isNew && <span className="bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm uppercase">Mới</span>}
        </div>
      </Link>
      <div className="p-4">
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">{product.category}</p>
        <Link to={`/product/${product.id}`} className="block font-bold text-gray-900 group-hover:text-pink-600 transition-colors line-clamp-1">
          {product.name}
        </Link>
        <div className="flex items-center space-x-2 mt-2 mb-4">
          <span className="text-lg font-bold text-pink-600">{(product.basePrice).toLocaleString()}đ</span>
          {product.originalPrice && (
            <span className="text-xs text-gray-400 line-through">{(product.originalPrice).toLocaleString()}đ</span>
          )}
        </div>
        <Link 
          to={`/product/${product.id}`}
          className="w-full py-2 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-lg text-center block hover:bg-indigo-600 hover:text-white transition-all"
        >
          Chọn biến thể
        </Link>
      </div>
    </div>
  );
};

export default ProductList;
