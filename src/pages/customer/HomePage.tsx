import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../services/api.ts';
import { Product } from '../../types/bakery.ts';
import { Sparkles, ArrowRight, Clock, Heart, Award, ShieldCheck, ChevronRight } from 'lucide-react';

export default function HomePage() {
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = await api.getProducts();
        // Take top 4 favorite products
        setFavorites(data.slice(0, 4));
      } catch (err) {
        console.error('Failed to load featured products:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {/* 1. HERO SECTION - FRESHLY BAKED EDITORIAL */}
      <section className="relative overflow-hidden pt-8 pb-16 lg:pt-16 lg:pb-24 border-b border-[#EAE3D9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Editorial Copy */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2">
                <span className="font-script text-2xl text-[#C85A32]">artisanal micro-bakery</span>
                <span className="w-8 h-[1px] bg-[#C85A32]/40" />
                <span className="text-xs uppercase tracking-widest text-[#735A4C] font-semibold">
                  Handmade daily
                </span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#2B1E16] leading-[1.12]">
                Baked for your sweetest moments.
              </h1>

              <p className="text-lg sm:text-xl text-[#5A4537] leading-relaxed max-w-2xl font-light">
                Handcrafted cakes, brownies and treats made fresh for birthdays, celebrations and
                everything worth remembering.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <Link
                  to="/menu"
                  className="inline-flex items-center justify-center gap-2 bg-[#C85A32] hover:bg-[#B34B24] text-white px-7 py-3.5 rounded-xl font-medium text-base shadow-sm hover:shadow transition-all text-center"
                >
                  <span>Explore Menu</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/track"
                  className="inline-flex items-center justify-center gap-2 bg-transparent hover:bg-[#F2ECE1] border border-[#D9C8B5] text-[#2B1E16] px-6 py-3.5 rounded-xl font-medium text-base transition-colors text-center"
                >
                  <Clock className="w-4 h-4 text-[#735A4C]" />
                  <span>Track My Order</span>
                </Link>
              </div>

              {/* Editorial guarantee badge */}
              <div className="pt-4 flex items-center gap-6 text-xs text-[#735A4C]">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#557A60]" />
                  <span>No Artificial Preservatives</span>
                </div>
                <span className="text-stone-300">·</span>
                <div className="flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-[#C85A32]" />
                  <span>100% Real Butter & Chocolate</span>
                </div>
              </div>
            </div>

            {/* Right Asymmetric Image Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Decorative background shape */}
                <div className="absolute -top-4 -right-4 w-72 h-72 bg-[#F2ECE1] rounded-3xl -z-10 transform rotate-3" />
                <div className="relative rounded-3xl overflow-hidden shadow-xl border border-[#EAE3D9] aspect-[4/5] bg-stone-100">
                  <img
                    src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&q=85"
                    alt="Artisanal Chocolate Truffle Cake"
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                  />
                  {/* Subtle caption overlay */}
                  <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-white">
                    <span className="text-xs font-mono uppercase tracking-widest text-[#E07A5F]">
                      Signature Creation
                    </span>
                    <h3 className="font-serif text-xl font-bold mt-1 text-white">
                      Belgian Dark Truffle Cake
                    </h3>
                    <p className="text-xs text-stone-200 mt-0.5">Custom piped with gold dust</p>
                  </div>
                </div>

                {/* Floating sticker */}
                <div className="absolute -bottom-5 -left-5 bg-[#FAF5EE] border border-[#EAE3D9] p-3.5 rounded-2xl shadow-lg flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#557A60]/10 flex items-center justify-center text-[#557A60]">
                    <Heart className="w-5 h-5 fill-current" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#2B1E16]">Baked to Order</p>
                    <p className="text-[11px] text-[#735A4C]">Never pre-frozen</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THREE FEATURE CARDS: "MADE FRESH. MADE PERSONAL." */}
      <section className="py-16 sm:py-20 bg-[#FAF7F0] border-b border-[#EAE3D9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="font-script text-2xl text-[#C85A32]">our promise</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2B1E16] mt-1">
              Made Fresh. Made Personal.
            </h2>
            <p className="text-sm sm:text-base text-[#5A4537] mt-2">
              Every creation is individually baked from scratch in our boutique kitchen with precision and passion.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-[#FDFBF7] p-8 rounded-2xl border border-[#EAE3D9] shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-[#C85A32]/10 text-[#C85A32] flex items-center justify-center font-serif text-xl font-bold mb-5">
                01
              </div>
              <h3 className="font-serif text-xl font-bold text-[#2B1E16] mb-2">
                Freshly Baked
              </h3>
              <p className="text-sm text-[#5A4537] leading-relaxed">
                Made fresh for every order. We don't keep premade sponges on shelves. When you order, our ovens warm up specifically for you.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-[#FDFBF7] p-8 rounded-2xl border border-[#EAE3D9] shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-[#557A60]/10 text-[#557A60] flex items-center justify-center font-serif text-xl font-bold mb-5">
                02
              </div>
              <h3 className="font-serif text-xl font-bold text-[#2B1E16] mb-2">
                Made Your Way
              </h3>
              <p className="text-sm text-[#5A4537] leading-relaxed">
                Customize flavors, colors and messages. Choose eggless recipes, specific piping designs, custom text toppers, and tailored portion sizes.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-[#FDFBF7] p-8 rounded-2xl border border-[#EAE3D9] shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-[#D4A373]/20 text-[#735A4C] flex items-center justify-center font-serif text-xl font-bold mb-5">
                03
              </div>
              <h3 className="font-serif text-xl font-bold text-[#2B1E16] mb-2">
                Delivered With Care
              </h3>
              <p className="text-sm text-[#5A4537] leading-relaxed">
                Carefully prepared and delivered on time. Packaged in insulated luxury bakery boxes to preserve delicate frosting and intricate details.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS: "CUSTOMER FAVORITES" */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <span className="font-script text-2xl text-[#C85A32]">curated selection</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2B1E16]">
              Customer Favorites
            </h2>
            <p className="text-sm sm:text-base text-[#5A4537] mt-1">
              The signature bakes our community falls in love with again and again.
            </p>
          </div>
          <Link
            to="/menu"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#C85A32] hover:text-[#B34B24] transition-colors group"
          >
            <span>View All Bakes</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse bg-[#F2ECE1] h-80 rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {favorites.map((product) => (
              <div
                key={product.id}
                className="group bg-[#FAF7F0] rounded-2xl border border-[#EAE3D9] overflow-hidden flex flex-col hover:border-[#D9C8B5] hover:shadow-lg transition-all duration-300"
              >
                {/* Image Container */}
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
                </div>

                {/* Card Content */}
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
                      <span className="font-serif text-lg font-bold text-[#2B1E16]">
                        ₹{product.price}
                      </span>
                    </div>

                    <Link
                      to={`/customize/${product.id}`}
                      className="bg-[#2B1E16] hover:bg-[#C85A32] text-white text-xs font-semibold px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1 shadow-sm"
                    >
                      <span>Customize</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 4. BAKERY STORY: "A LITTLE BAKERY WITH A LOT OF HEART" */}
      <section className="py-20 bg-[#F5EFE6] border-y border-[#EAE3D9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Story Image */}
            <div className="lg:col-span-5 order-2 lg:order-1">
              <div className="relative rounded-3xl overflow-hidden shadow-lg border border-[#EAE3D9] aspect-[4/5] max-w-md mx-auto">
                <img
                  src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1000&q=80"
                  alt="Baker crafting artisanal cake"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 bg-[#FAF5EE]/95 p-4 rounded-xl border border-[#EAE3D9]">
                  <p className="font-script text-xl text-[#C85A32]">Chef Claire's Studio</p>
                  <p className="text-xs text-[#5A4537]">“Baking is how we share love in tangible sweetness.”</p>
                </div>
              </div>
            </div>

            {/* Editorial Story Text */}
            <div className="lg:col-span-7 order-1 lg:order-2 space-y-6">
              <span className="font-script text-2xl text-[#C85A32]">our heritage</span>
              <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#2B1E16] leading-tight">
                A little bakery with a lot of heart.
              </h2>
              <div className="space-y-4 text-sm sm:text-base text-[#4A3528] leading-relaxed font-light">
                <p>
                  Sweet Crumbs was born out of a genuine devotion to traditional, unhurried baking.
                  In a world of factory-produced sweets loaded with artificial emulsifiers, we believe
                  in honest, handcrafted indulgence.
                </p>
                <p>
                  We are a passionate boutique home bakery focused on handcrafted desserts and personalized
                  celebrations. Every cake, cupcake, and brownie is prepared in small batches using pure
                  cultured butter, Madagascar bourbon vanilla, and ethically sourced single-origin cocoa.
                </p>
                <p>
                  Whether it’s a milestone birthday, an anniversary, or a quiet Tuesday afternoon treat,
                  we take joy in turning your special dates into unforgettable memories.
                </p>
              </div>

              <div className="pt-2">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 font-semibold text-[#C85A32] hover:text-[#B34B24] transition-colors"
                >
                  <span>Read Our Full Story & Philosophy</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. ORDER PROCESS TIMELINE */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="font-script text-2xl text-[#C85A32]">how it works</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2B1E16] mt-1">
            Simple, Seamless Ordering
          </h2>
          <p className="text-sm sm:text-base text-[#5A4537] mt-1">
            From your creative vision to fresh oven warmth delivered to your door.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {[
            { step: '01', title: 'Choose your treat', desc: 'Browse our signature cakes, brownies, cookies & cupcakes.' },
            { step: '02', title: 'Make it yours', desc: 'Pick size, flavor profile, cake message, and custom decorations.' },
            { step: '03', title: 'Pick your date', desc: 'Select delivery time slot and celebration delivery address.' },
            { step: '04', title: 'We bake', desc: 'Our baker prepares your batch fresh on the morning of delivery.' },
            { step: '05', title: 'Delivered with love', desc: 'Carefully packaged and handed to your doorstep.' }
          ].map((item, idx) => (
            <div
              key={item.step}
              className="relative bg-[#FAF7F0] p-6 rounded-2xl border border-[#EAE3D9] flex flex-col justify-between"
            >
              <div>
                <span className="font-serif text-2xl font-bold text-[#C85A32]">
                  {item.step}
                </span>
                <h3 className="font-serif text-base font-bold text-[#2B1E16] mt-3">
                  {item.title}
                </h3>
                <p className="text-xs text-[#5A4537] mt-1.5 leading-relaxed">
                  {item.desc}
                </p>
              </div>
              {idx < 4 && (
                <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                  <div className="w-6 h-6 rounded-full bg-[#EAE3D9] flex items-center justify-center text-xs text-[#735A4C]">
                    →
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 6. FINAL CTA: "SOMETHING SWEET IS WAITING." */}
      <section className="bg-[#2B1E16] text-[#FDFBF7] py-20 border-t border-[#3E2C22] relative overflow-hidden">
        {/* Soft decorative background circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C85A32]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#D4A373]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          <span className="font-script text-3xl text-[#E07A5F]">treat yourself & loved ones</span>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-[#FDFBF7]">
            Something sweet is waiting.
          </h2>
          <p className="text-base sm:text-lg text-[#D9C8B5] max-w-xl mx-auto font-light leading-relaxed">
            Reserve your celebration cake or pick your favorite sweet box today. Fresh ingredients,
            heartfelt craft, and prompt delivery.
          </p>
          <div className="pt-2">
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 bg-[#C85A32] hover:bg-[#B34B24] text-white px-8 py-4 rounded-xl font-medium text-base shadow-lg hover:shadow-xl transition-all active:scale-95"
            >
              <Sparkles className="w-5 h-5 text-amber-200" />
              <span>Start Your Order</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
