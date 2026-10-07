import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../../services/api.ts';
import { Product } from '../../types/bakery.ts';
import { ArrowLeft, Sparkles, CheckCircle2, ShieldCheck, Heart, Clock } from 'lucide-react';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadProduct() {
      if (!id) return;
      try {
        setLoading(true);
        const data = await api.getProductById(Number(id));
        setProduct(data);
      } catch (err: any) {
        setError(err.message || 'Product not found');
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] py-16 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-3 border-[#C85A32] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-medium text-[#735A4C]">Opening bakery cabinet...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] py-20 px-4 text-center">
        <div className="max-w-md mx-auto bg-[#FAF7F0] p-8 rounded-2xl border border-[#EAE3D9]">
          <h2 className="font-serif text-2xl font-bold text-[#2B1E16]">Treat Not Found</h2>
          <p className="text-sm text-[#735A4C] mt-2">
            The confection you are looking for may have rotated out of season.
          </p>
          <Link
            to="/menu"
            className="inline-block mt-6 px-5 py-2.5 bg-[#C85A32] text-white rounded-xl text-sm font-medium"
          >
            Back to Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-10 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb / Back link */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#735A4C] hover:text-[#2B1E16] mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Treats</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Large Product Image */}
          <div className="lg:col-span-7">
            <div className="relative rounded-3xl overflow-hidden shadow-lg border border-[#EAE3D9] aspect-[4/3] bg-stone-100">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 bg-[#FDFBF7]/90 backdrop-blur-md px-3.5 py-1.5 rounded-lg text-xs font-medium text-[#4A3528]">
                {product.category}
              </div>
              {!product.available && (
                <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-[2px] flex items-center justify-center">
                  <span className="text-white text-sm font-semibold uppercase tracking-wider bg-[#2B1E16] px-4 py-2 rounded-lg">
                    Currently Unavailable
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Product Details & Actions */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="flex items-center gap-3 text-xs text-[#735A4C]">
                <span>{product.category}</span>
                <span>·</span>
                <span className={product.available ? 'text-emerald-700 font-medium' : 'text-amber-800'}>
                  {product.available ? '● Available for order' : '○ Out of stock'}
                </span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#2B1E16] mt-2">
                {product.name}
              </h1>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-xs uppercase text-[#735A4C] tracking-wider">Base Price</span>
              <span className="font-serif text-3xl font-bold text-[#C85A32]">
                ₹{product.price}
              </span>
            </div>

            <div className="border-t border-b border-[#EAE3D9] py-5">
              <h4 className="text-xs uppercase tracking-wider font-semibold text-[#735A4C] mb-2">
                Baker's Description
              </h4>
              <p className="text-sm sm:text-base text-[#4A3528] leading-relaxed font-light">
                {product.description}
              </p>
            </div>

            {/* Quality assurances */}
            <div className="space-y-2.5 text-xs text-[#5A4537]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#557A60] flex-shrink-0" />
                <span>Baked to order on delivery day (never frozen)</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#557A60] flex-shrink-0" />
                <span>Pure dairy butter & single-origin Belgian cocoa</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-[#C85A32] flex-shrink-0" />
                <span>Custom eggless & message options available</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#735A4C] flex-shrink-0" />
                <span>Earliest delivery available starting tomorrow morning</span>
              </div>
            </div>

            {/* Primary Action Button */}
            <div className="pt-4">
              {product.available ? (
                <Link
                  to={`/customize/${product.id}`}
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#C85A32] hover:bg-[#B34B24] text-white py-4 px-6 rounded-xl font-medium text-base shadow-sm hover:shadow transition-all active:scale-95"
                >
                  <Sparkles className="w-4 h-4 text-amber-200" />
                  <span>Customize This Treat</span>
                </Link>
              ) : (
                <button
                  disabled
                  className="w-full bg-stone-300 text-stone-600 py-4 px-6 rounded-xl font-medium text-base cursor-not-allowed"
                >
                  Sold Out
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
