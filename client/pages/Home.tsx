
import React from 'react';
import { Link } from 'react-router-dom';
import { MOCK_PRODUCTS, CATEGORIES } from '../constants';

const Home: React.FC = () => {
  return (
    <div className="space-y-12 pb-12">
      {/* Hero Section */}
      <section className="relative bg-indigo-900 h-[500px] flex items-center overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <img src="https://picsum.photos/seed/shop/1200/600" alt="Hero" className="w-full h-full object-cover" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Thế giới phụ kiện<br/>đáng yêu</h1>
          <p className="text-xl text-indigo-100 mb-8 max-w-2xl">
            Khám phá bộ sưu tập gấu bông, móc khóa và postcard độc đáo nhất. Chất lượng cao, giao hàng nhanh chóng.
          </p>
          <Link to="/products" className="bg-pink-500 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-pink-600 transition-all inline-block">
            Mua sắm ngay
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold mb-8 text-center">Danh mục nổi bật</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {CATEGORIES.map((cat, i) => (
            <Link key={cat} to={`/products?category=${cat}`} className="group relative h-40 rounded-2xl overflow-hidden shadow-md">
              <img src={`https://picsum.photos/seed/cat${i}/400/400`} alt={cat} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <span className="text-white font-bold text-lg">{cat}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold">Sản phẩm mới nhất</h2>
            <p className="text-gray-500 mt-2">Đừng bỏ lỡ những món đồ hot nhất tuần này</p>
          </div>
          <Link to="/products" className="text-pink-500 font-semibold hover:underline">Xem tất cả &rarr;</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {MOCK_PRODUCTS.slice(0, 3).map((product) => (
            <div key={product.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow border border-gray-100 flex flex-col">
              <div className="relative aspect-square">
                <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                {product.isSale && <span className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">Sale</span>}
                {product.isNew && <span className="absolute top-4 left-4 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">Mới</span>}
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <p className="text-sm text-gray-400 mb-1">{product.category}</p>
                <h3 className="text-xl font-bold mb-2 group-hover:text-pink-500 transition-colors">{product.name}</h3>
                <div className="flex items-center space-x-2 mb-4">
                  <span className="text-2xl font-bold text-pink-600">{(product.basePrice).toLocaleString()}đ</span>
                  {product.originalPrice && (
                    <span className="text-sm text-gray-400 line-through">{(product.originalPrice).toLocaleString()}đ</span>
                  )}
                </div>
                <Link to={`/product/${product.id}`} className="mt-auto w-full py-3 bg-gray-50 text-gray-700 font-bold rounded-xl text-center hover:bg-pink-500 hover:text-white transition-all">
                  Chi tiết sản phẩm
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
