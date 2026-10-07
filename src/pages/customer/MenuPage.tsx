import React, { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../services/api.ts';
import { Product } from '../../types/bakery.ts';
import { Search, ChevronRight, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

const CATEGORIES = ['All', 'Cakes', 'Cupcakes', 'Brownies', 'Cookies', 'Custom Cakes'];

export default function MenuPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Search
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc'>('default');

  const navigate = useNavigate();

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        setError(null);
        const data = await api.getProducts();
        setProducts(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch bakery menu');
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        const matchesCategory =
          selectedCategory === 'All' ||
          product.category.toLowerCase() === selectedCategory.toLowerCase();

        const matchesSearch =
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        return a.id - b.id;
      });
  }, [products, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="max-w-3xl mb-10">
          <span className="font-script text-2xl text-[#C85A32]">our bakery cabinet</span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#2B1E16] mt-1">
            Artisanal Bakes & Desserts
          </h1>
          <p className="text-sm sm:text-base text-[#5A4537] mt-2 font-light">
            Every treat is handcrafted upon order with cultured dairy, single-origin chocolate,
            and real Madagascar vanilla. Select any bake to personalize size, flavor, and toppings.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-[#FAF7F0] p-4 sm:p-5 rounded-2xl border border-[#EAE3D9] mb-10 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#735A4C] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search cakes, brownies, flavors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#FDFBF7] border border-[#D9C8B5] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#2B1E16] placeholder-[#8A7566] focus:outline-none focus:ring-2 focus:ring-[#C85A32]/40"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-[#735A4C]" />
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="bg-[#FDFBF7] border border-[#D9C8B5] text-xs sm:text-sm font-medium text-[#2B1E16] rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#C85A32]/40 cursor-pointer"
              >
                <option value="default">Sort: Recommended</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Category Tabs (interactive buttons) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
            <SlidersHorizontal className="w-4 h-4 text-[#735A4C] hidden sm:block mr-1 flex-shrink-0" />
            {CATEGORIES.map((cat) => {
              const active = selectedCategory.toLowerCase() === cat.toLowerCase();
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-1.5 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-colors ${
                    active
                      ? 'bg-[#2B1E16] text-[#FDFBF7] shadow-sm'
                      : 'bg-[#FDFBF7] text-[#5A4537] hover:bg-[#F0EAE1] border border-[#EAE3D9]'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div key={n} className="animate-pulse bg-[#F2ECE1] h-96 rounded-2xl" />
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-16 bg-[#FFF8F5] rounded-2xl border border-red-200 p-6 max-w-lg mx-auto">
            <p className="font-serif text-lg font-bold text-red-900">Unable to load bakery menu</p>
            <p className="text-sm text-red-700 mt-1">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-[#C85A32] text-white text-xs font-semibold rounded-lg"
            >
              Retry
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredProducts.length === 0 && (
          <div className="text-center py-20 bg-[#FAF7F0] rounded-2xl border border-[#EAE3D9] p-8 max-w-lg mx-auto">
            <p className="font-serif text-xl font-bold text-[#2B1E16]">No treats found</p>
            <p className="text-sm text-[#735A4C] mt-1">
              We couldn't find any bakes matching "{searchQuery}" in category "{selectedCategory}".
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="mt-4 text-xs font-semibold text-[#C85A32] hover:underline"
            >
              Clear filters & view all treats
            </button>
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && filteredProducts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="group bg-[#FAF7F0] rounded-2xl border border-[#EAE3D9] overflow-hidden flex flex-col hover:border-[#D9C8B5] hover:shadow-xl transition-all duration-300"
              >
                {/* Image */}
                <div
                  className="relative aspect-square overflow-hidden bg-stone-100 cursor-pointer"
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-[#FDFBF7]/90 backdrop-blur-sm px-2.5 py-1 rounded-md text-xs font-medium text-[#4A3528]">
                    {product.category}
                  </div>
                  {!product.available && (
                    <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-[2px] flex items-center justify-center">
                      <span className="text-white text-xs font-semibold uppercase tracking-wider bg-[#2B1E16] px-3 py-1 rounded-md">
                        Sold Out Today
                      </span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3
                      onClick={() => navigate(`/product/${product.id}`)}
                      className="font-serif text-lg font-bold text-[#2B1E16] hover:text-[#C85A32] cursor-pointer transition-colors"
                    >
                      {product.name}
                    </h3>
                    <p className="text-xs text-[#5A4537] mt-1.5 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-[#EAE3D9] flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-[#735A4C] block uppercase tracking-wider">
                        Starting from
                      </span>
                      <span className="font-serif text-xl font-bold text-[#2B1E16]">
                        ₹{product.price}
                      </span>
                    </div>

                    {product.available ? (
                      <Link
                        to={`/customize/${product.id}`}
                        className="bg-[#2B1E16] hover:bg-[#C85A32] text-white text-xs font-semibold px-3.5 py-2.5 rounded-xl transition-colors flex items-center gap-1 shadow-sm"
                      >
                        <span>Customize</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    ) : (
                      <span className="text-xs text-stone-500 font-medium">Unavailable</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
